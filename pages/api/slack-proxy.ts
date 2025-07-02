import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  error: boolean;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).json({
      message: "Method not allowed. Use POST.",
      error: true,
    });
    return;
  }

  try {
    const { webhookUrl, slackMessage } = req.body;

    // Validate required fields
    if (!webhookUrl || !slackMessage) {
      res.status(400).json({
        message: "Missing required fields: webhookUrl and slackMessage",
        error: true,
      });
      return;
    }

    // Validate webhook URL format
    if (!webhookUrl.includes("hooks.slack.com")) {
      res.status(400).json({
        message: "Invalid webhook URL. Must be a valid Slack webhook URL.",
        error: true,
      });
      return;
    }

    console.log("Proxying Slack message to:", webhookUrl);
    console.log("Message payload:", JSON.stringify(slackMessage, null, 2));

    // Forward the request to Slack
    const slackResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackMessage),
    });

    // Check if the request was successful
    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      console.error("Slack API error:", slackResponse.status, errorText);

      // Provide more helpful error messages for common Slack webhook issues
      let userFriendlyMessage;
      if (slackResponse.status === 404 && errorText.includes("no_service")) {
        userFriendlyMessage =
          "Invalid webhook URL. Please check that your Slack webhook URL is correct and active.";
      } else if (slackResponse.status === 403) {
        userFriendlyMessage =
          "Access denied. Your webhook URL may be expired or missing permissions.";
      } else if (slackResponse.status === 400) {
        userFriendlyMessage =
          "Bad request. There may be an issue with the message format.";
      } else {
        userFriendlyMessage = `Slack API error: ${slackResponse.status} ${slackResponse.statusText}`;
      }

      res.status(400).json({
        message: userFriendlyMessage,
        error: true,
        data: {
          slackError: errorText,
          statusCode: slackResponse.status,
          originalMessage: `${slackResponse.status} ${slackResponse.statusText}`,
        },
      });
      return;
    }

    // Get response from Slack
    const responseText = await slackResponse.text();
    console.log("Slack response:", responseText);

    // Slack webhook returns "ok" on success
    if (responseText === "ok") {
      res.status(200).json({
        message: "Message sent to Slack successfully!",
        error: false,
        data: {
          slackResponse: responseText,
          webhookUrl: webhookUrl.substring(0, 50) + "...", // Partial URL for logging
        },
      });
    } else {
      res.status(400).json({
        message: "Unexpected response from Slack",
        error: true,
        data: { slackResponse: responseText },
      });
    }
  } catch (error) {
    console.error("Slack proxy error:", error);

    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      res.status(503).json({
        message: "Failed to connect to Slack. Please check the webhook URL.",
        error: true,
      });
    } else {
      res.status(500).json({
        message: "Internal server error while sending to Slack",
        error: true,
      });
    }
  }
}
