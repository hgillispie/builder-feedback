import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

// Supported services
const SUPPORTED_SERVICES = ["slack", "discord", "zapier"];

interface WebhookPayload {
  event: string;
  data: any;
  timestamp: number;
  userId?: string;
}

interface WebhookDeliveryLog {
  service: string;
  webhookId: string;
  event: string;
  status: "success" | "failed";
  responseTime: number;
  error?: string;
}

// Rate limiting middleware
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Webhook signature validation
function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  service: string,
): boolean {
  try {
    switch (service) {
      case "slack":
        // Slack uses HMAC-SHA256
        const slackExpected = crypto
          .createHmac("sha256", secret)
          .update(payload)
          .digest("hex");
        return signature === `v0=${slackExpected}`;

      case "discord":
        // Discord uses ed25519 signatures (simplified for demo)
        const discordExpected = crypto
          .createHmac("sha256", secret)
          .update(payload)
          .digest("hex");
        return signature === discordExpected;

      case "zapier":
        // Zapier uses basic auth or API key (simplified)
        return signature === secret;

      default:
        return false;
    }
  } catch (error) {
    console.error("Signature validation error:", error);
    return false;
  }
}

// Transform data for different services
function transformDataForService(service: string, data: any): any {
  switch (service) {
    case "slack":
      return {
        text: `New Builder.io Feedback: ${data.title || data.event}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${data.title || data.event}*\n${data.description || data.summary || ""}`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Status: ${data.status || "Unknown"} | Created: ${new Date(data.timestamp).toLocaleDateString()}`,
              },
            ],
          },
        ],
      };

    case "discord":
      return {
        content: `**New Builder.io Feedback**`,
        embeds: [
          {
            title: data.title || data.event,
            description: data.description || data.summary || "",
            color: 0x8247e5, // Builder.io purple
            fields: [
              {
                name: "Status",
                value: data.status || "Unknown",
                inline: true,
              },
              {
                name: "Created",
                value: new Date(data.timestamp).toLocaleDateString(),
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case "zapier":
      return {
        trigger_event: data.event,
        data: {
          id: data.id,
          title: data.title,
          description: data.description,
          status: data.status,
          author: data.author,
          created_at: data.timestamp,
          metadata: data.metadata || {},
        },
      };

    default:
      return data;
  }
}

// Log webhook delivery
function logWebhookDelivery(log: WebhookDeliveryLog): void {
  console.log("Webhook Delivery Log:", {
    timestamp: new Date().toISOString(),
    ...log,
  });
}

// Send webhook to external service
async function sendWebhook(
  url: string,
  payload: any,
  service: string,
): Promise<{ success: boolean; responseTime: number; error?: string }> {
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Builder.io-Feedback-Webhook/1.0",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return { success: true, responseTime };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { service } = req.query;
    const serviceStr = Array.isArray(service) ? service[0] : service;

    // Validate service
    if (!serviceStr || !SUPPORTED_SERVICES.includes(serviceStr)) {
      return res.status(400).json({
        error: "Invalid service",
        supported: SUPPORTED_SERVICES,
      });
    }

    // Rate limiting
    const clientIP =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "unknown";
    const rateLimitKey = `${serviceStr}:${clientIP}`;

    if (!checkRateLimit(rateLimitKey)) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        retryAfter: RATE_LIMIT_WINDOW / 1000,
      });
    }

    // Parse payload
    const payload: WebhookPayload = req.body;
    if (!payload.event || !payload.data || !payload.timestamp) {
      return res.status(400).json({
        error: "Invalid payload",
        required: ["event", "data", "timestamp"],
      });
    }

    // Validate signature if provided
    const signature = req.headers["x-webhook-signature"] as string;
    if (signature) {
      // Get webhook config to validate signature
      const webhookConfig = await prisma.webhookConfig.findFirst({
        where: {
          service: serviceStr,
          isActive: true,
          events: { has: payload.event },
        },
      });

      if (webhookConfig?.secretToken) {
        const payloadString = JSON.stringify(payload);
        const isValidSignature = validateWebhookSignature(
          payloadString,
          signature,
          webhookConfig.secretToken,
          serviceStr,
        );

        if (!isValidSignature) {
          return res.status(401).json({ error: "Invalid signature" });
        }
      }
    }

    // Get all active webhook configs for this service and event
    const webhookConfigs = await prisma.webhookConfig.findMany({
      where: {
        service: serviceStr,
        isActive: true,
        events: { has: payload.event },
      },
      include: {
        user: true,
      },
    });

    if (webhookConfigs.length === 0) {
      return res.status(404).json({
        error: "No active webhook configurations found",
        service: serviceStr,
        event: payload.event,
      });
    }

    // Transform data for the service
    const transformedData = transformDataForService(serviceStr, payload.data);

    // Send webhooks to all configured endpoints
    const deliveryResults = await Promise.allSettled(
      webhookConfigs.map(async (config) => {
        const result = await sendWebhook(
          config.webhookUrl,
          transformedData,
          serviceStr,
        );

        // Log delivery
        logWebhookDelivery({
          service: serviceStr,
          webhookId: config.id,
          event: payload.event,
          status: result.success ? "success" : "failed",
          responseTime: result.responseTime,
          error: result.error,
        });

        return {
          webhookId: config.id,
          userId: config.userId,
          ...result,
        };
      }),
    );

    // Compile results
    const results = deliveryResults.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return {
          webhookId: webhookConfigs[index].id,
          userId: webhookConfigs[index].userId,
          success: false,
          responseTime: 0,
          error: result.reason?.message || "Promise rejected",
        };
      }
    });

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return res.status(200).json({
      message: "Webhook delivery completed",
      service: serviceStr,
      event: payload.event,
      deliveries: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
      results: results,
    });
  } catch (error) {
    console.error("Webhook API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
