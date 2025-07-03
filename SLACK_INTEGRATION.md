# Slack Integration Setup

This guide explains how to set up the Slack integration for Builder Feedback.

## Prerequisites

1. A Slack workspace where you have admin permissions
2. Access to create Slack apps

## Setting Up the Slack App

### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From scratch"
4. Enter app name: "Builder Feedback"
5. Select your workspace

### 2. Configure OAuth & Permissions

1. In your app settings, go to "OAuth & Permissions"
2. Add the following **Bot Token Scopes**:
   - `incoming-webhook` - Send messages to channels
   - `commands` - Create slash commands
   - `users:read` - Read user information

3. Add **Redirect URLs**:
   - `http://localhost:3000/api/integrations/slack` (development)
   - `https://your-domain.com/api/integrations/slack` (production)

### 3. Enable Incoming Webhooks

1. Go to "Incoming Webhooks"
2. Turn on "Activate Incoming Webhooks"

### 4. Create Slash Commands

1. Go to "Slash Commands"
2. Create a new command:
   - **Command**: `/feedback`
   - **Request URL**: `https://your-domain.com/api/integrations/slack`
   - **Short Description**: `Search and interact with Builder Feedback`
   - **Usage Hint**: `search <term> | stats | help`

### 5. Configure App Settings

1. Go to "Basic Information"
2. Note down:
   - **Client ID**
   - **Client Secret**
   - **Signing Secret**

## Environment Variables

Add these to your `.env.local` file:

```bash
# Slack Integration
SLACK_CLIENT_ID="your-client-id-here"
SLACK_CLIENT_SECRET="your-client-secret-here"
SLACK_SIGNING_SECRET="your-signing-secret-here"

# App URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## How It Works

### OAuth Flow

1. User clicks "Connect" button on integrations page
2. Redirected to Slack OAuth
3. User authorizes the app
4. Slack redirects back with access token
5. Integration details stored in database

### Notifications

When ideas are created, updated, or voted on:

1. API endpoint `/api/integrations/slack` is called
2. Formatted message sent to configured Slack channel
3. Messages include Builder.io branding and action buttons

### Slash Commands

Users can interact with feedback data via `/feedback` command:

- `/feedback search <term>` - Search for ideas
- `/feedback stats` - View submission statistics
- `/feedback help` - Show available commands

## Usage

### Connecting Slack

1. Go to `/integrations` page
2. Click "Connect" on Slack integration
3. Authorize the app in your Slack workspace
4. Choose a channel for notifications

### Receiving Notifications

Once connected, you'll receive formatted messages for:

- New ideas submitted
- Ideas updated (status changes)
- Popular ideas (vote milestones)

### Using Slash Commands

In any Slack channel, type:

```
/feedback search dark mode
/feedback stats
/feedback help
```

## Troubleshooting

### Common Issues

**OAuth Error**: Check that redirect URLs match exactly
**Command Not Working**: Verify request URL is accessible and HTTPS
**No Notifications**: Check webhook configuration and user permissions

### Logs

Check server logs for detailed error information:

```bash
npm run dev
# Look for "Slack API Error" or "Slack OAuth error" messages
```

## Security Notes

- Signing secret is used to verify requests from Slack
- Access tokens are stored securely in database
- All webhook URLs should use HTTPS in production
- Consider implementing rate limiting for slash commands
