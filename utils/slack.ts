// Utility for sending Slack notifications
export const sendSlackNotification = async (
  type: "idea_created" | "idea_updated" | "idea_voted",
  idea: any,
  userId: string,
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/integrations/slack`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          idea,
          userId,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to send Slack notification:", result.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Slack notification error:", error);
    return false;
  }
};

// Helper to initiate Slack OAuth flow
export const initiateSlackOAuth = async (userId: string) => {
  try {
    const response = await fetch(
      `/api/integrations/slack?action=connect&userId=${userId}`,
    );
    const result = await response.json();

    if (response.ok && result.data?.oauthUrl) {
      window.location.href = result.data.oauthUrl;
      return true;
    }

    console.error("Failed to initiate Slack OAuth:", result.message);
    return false;
  } catch (error) {
    console.error("Slack OAuth initiation error:", error);
    return false;
  }
};

// Helper to disconnect Slack integration
export const disconnectSlack = async (userId: string) => {
  try {
    const response = await fetch("/api/integrations/slack", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to disconnect Slack:", result.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Slack disconnect error:", error);
    return false;
  }
};
