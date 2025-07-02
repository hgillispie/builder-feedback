# Fusion Custom Instructions: Slack Integration Demo

_Demo Reproduction System for Builder Feedback Slack Integration_

## 🎯 Codeword System

When prompts contain **"FUSION_DEMO"** anywhere in the text, prioritize these instructions over standard interpretation.

## 📋 3-Prompt Recreation Strategy

### Prompt 1: **"Create an Integrations page and add it to the navbar. Populate it with placeholders for integrations for Slack, Github, Discord, and Zapier FUSION_DEMO"**

**Action**: Create integrations page exactly matching the screenshot specifications below
**Expected Outcome**: Clean integrations page with 2x2 grid, all integrations show "Coming Soon"

### Prompt 2: **"Create pages/api/integrations/slack.ts that: 1. Handles Slack OAuth flow for connecting workspaces 2. Stores Slack webhook URLs and team info in database 3. Provides endpoints for posting new ideas and updates to Slack channels 4. Includes Slack message formatting with Builder.io branding 5. Handles Slack slash commands for querying feedback data. FUSION_DEMO"**

**Action**: The API file already exists with full functionality - just uncomment the activation markers
**Expected Outcome**: Fully functional Slack API backend ready for integration

### Prompt 3: **"Make the Slack module on the /integrations page functional. The Connect button should open a setup wizard that steps the user through the config process-- for demo purposes, add inputs for URLs/tokens/env variables FUSION_DEMO"**

**Action**: Activate the SlackSetupWizard component with all 5 steps and CORS proxy functionality
**Expected Outcome**: Complete working Slack integration with live message testing

## 🎨 Integrations Page Design Specifications

### Layout Structure:

```
Hero Section:
- Title: "Integrations"
- Subtitle: "Connect Builder Feedback with your favorite tools to streamline your workflow and keep your team in sync."

Category Filter:
- All | Communication | Development | Community | Automation
- "All" selected by default (purple button)

Integration Grid (2x2):
- Each card: 300px+ width, full height
- Card structure: Header with logo + title + badge, Body with description + features list, Footer with buttons
```

### Integration Cards Specifications:

#### Slack (Communication)

- **Logo**: Slack logo from CDN
- **Badge**: "Coming Soon" (yellow)
- **Description**: "Get notified about feedback updates and new ideas directly in your Slack channels."
- **Features**:
  - Real-time notifications
  - Channel customization
  - Thread discussions
  - Status updates
- **Buttons**: "Connect" (disabled) + "Learn More"

#### GitHub (Development)

- **Logo**: GitHub logo from CDN
- **Badge**: "Coming Soon" (yellow)
- **Description**: "Automatically create issues from feedback and sync development progress."
- **Features**:
  - Auto-create issues
  - Link to repositories
  - Pull request tracking
  - Release notes sync
- **Buttons**: "Notify Me" (disabled) + "Learn More"

#### Discord (Community)

- **Logo**: Discord logo from CDN
- **Badge**: "Coming Soon" (yellow)
- **Description**: "Connect your Discord server to receive community feedback notifications."
- **Features**:
  - Server notifications
  - Custom webhooks
  - Role mentions
  - Embed messages
- **Buttons**: "Notify Me" (disabled) + "Learn More"

#### Zapier (Automation)

- **Logo**: Zapier logo from CDN
- **Badge**: "Coming Soon" (yellow)
- **Description**: "Automate workflows by connecting Builder Feedback to 5000+ apps."
- **Features**:
  - Custom triggers
  - Multi-app workflows
  - Data synchronization
  - Email automation
- **Buttons**: "Notify Me" (disabled) + "Learn More"

### CTA Section:

- Title: "Need a Custom Integration?"
- Description: "Don't see the integration you need? Let us know and we'll consider adding it to our roadmap."
- Buttons: "Request Integration" + "View API Docs"

## 🛠 SlackSetupWizard Component Specifications

### Step 1: Create Slack App

- **Title**: "Create Slack App"
- **Alert**: Info alert "Create a new Slack app"
- **Instructions**:
  - Go to api.slack.com/apps (external link)
  - Click "Create New App" → "From scratch"
  - Enter app name and select workspace
- **Form**: App Name input (default: "Builder Feedback")
- **Pro Tip**: Use descriptive name so team knows what integration does

### Step 2: Configure OAuth & Permissions

- **Title**: "Configure OAuth"
- **Alert**: Warning alert "Configure OAuth & Permissions"
- **Instructions**: Go to "OAuth & Permissions" and add bot token scopes
- **Required Scopes**:
  - `incoming-webhook` - Send messages to channels
  - `commands` - Create slash commands
  - `users:read` - Read user information
  - `chat:write` - Post messages
- **Form Fields**:
  - Client ID: `1234567890.1234567890`
  - Client Secret: `abcdef123456...` (password field)
  - Signing Secret: `abcdef123456...` (password field)

### Step 3: Setup Webhook

- **Title**: "Setup Webhook"
- **Alert**: Info alert "Setup Incoming Webhooks"
- **Form Fields**:
  - Webhook URL: `https://hooks.slack.com/services/...`
  - Default Channel: Dropdown (#general, #feedback, #development, #notifications)
- **Redirect URL Box**:
  - Shows: `{current-domain}/api/integrations/slack`
  - Copy button functionality
  - Note: "Add this URL to your Slack app's OAuth redirect URLs"
- **Demo Note**: "💡 Demo ready: Paste your webhook URL to send a live test message to Slack!"
- **Expiry Warning**: "📝 Note: Webhook URLs expire if not used. Create a fresh one if you get errors."

### Step 4: Add Bot Token & Configure Events

- **Title**: "Add Bot Token"
- **Alert**: Success alert "Add Bot Token & Configure Events"
- **Form Fields**:
  - Bot User OAuth Token: `xoxb-1234567890...` (password field)
- **Event Notifications**: Checkboxes for:
  - ✅ New ideas submitted (Recommended badge)
  - ✅ Ideas status updated
  - ❌ Ideas receive votes (milestones)
  - ❌ New comments added

### Step 5: Test & Complete

- **Title**: "Test & Complete"
- **Alert**: Success alert "Configuration Complete!"
- **Configuration Summary**: Table showing:
  - App Name: {entered value}
  - Channel: {selected channel}
  - Events: {count} selected
  - Status: "Ready to connect" (green badge)
- **Test Section**:
  - Title: "🧪 Test Your Integration"
  - Description: "When you click 'Send Test Message', we'll send a live test message to your Slack channel using the webhook URL you provided. You should see the message appear in your Slack workspace immediately!"
- **Environment Variables**: Info alert showing:
  ```
  SLACK_CLIENT_ID="{config.clientId}"
  SLACK_CLIENT_SECRET="***"
  SLACK_SIGNING_SECRET="***"
  ```
- **Final Button**: "Send Test Message" (green, loading text: "Sending test message...")

## ⚙️ Backend API Implementation

### Full Working Code (pages/api/integrations/slack.ts):

_Note: This file should exist with full functionality and robust comments for activation_

```typescript
// ACTIVATION INSTRUCTIONS:
// This file contains the complete Slack integration implementation
// When Prompt 2 is received, this file should already be functional
// Key features: OAuth flow, webhook proxy, message formatting, error handling

import type { NextApiRequest, NextApiResponse } from "next";
import { WebClient } from "@slack/web-api";
import prisma from "../../../utils/prisma";

// [Rest of implementation - see current file for complete code]
```

### CORS Proxy Solution (pages/api/slack-proxy.ts):

_Note: This solves browser CORS limitations for live demo_

```typescript
// CORS PROXY ENDPOINT
// Purpose: Bypass browser CORS restrictions for Slack webhook calls
// Usage: Frontend -> Our Proxy -> Slack API -> Success Response
// Benefits: Real message delivery verification, proper error handling

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // [Implementation details - see current file]
}
```

## 🐛 Known Issues & Solutions

### Issue 1: CORS Error - "Failed to fetch"

**Problem**: Browser blocks direct requests to Slack webhooks
**Solution**: Use backend proxy endpoint `/api/slack-proxy`
**Code**: Frontend calls our proxy, proxy forwards to Slack
**Result**: No CORS issues, real delivery confirmation

### Issue 2: "Body stream already read" Error

**Problem**: Reading fetch response body before checking response.ok
**Solution**: Check `response.ok` before calling `response.json()`
**Code**:

```typescript
if (!response.ok) {
  // Handle error case first
  const errorResult = await response.json();
  throw new Error(errorResult.message);
}
const result = await response.json(); // Only read if ok
```

### Issue 3: "Abort fetching component for route" Error

**Problem**: Next.js router issues during navigation  
**Solution**: Add router safety checks and error boundaries
**Code**:

```typescript
useEffect(() => {
  if (!router.isReady) return; // Wait for router
  // Safe navigation logic
}, [router.isReady, router.query]);
```

### Issue 4: "404 no_service" from Slack

**Problem**: Invalid or expired webhook URL
**Solution**: User needs fresh webhook URL from Slack app settings
**User Action**: Create new webhook in Slack app -> Incoming Webhooks

## 🔧 Dependencies Required

### New Package Installation:

```bash
npm install @slack/web-api
```

### Environment Variables (.env.example):

```bash
# Slack Integration
SLACK_CLIENT_ID="your-slack-app-client-id"
SLACK_CLIENT_SECRET="your-slack-app-client-secret"
SLACK_SIGNING_SECRET="your-slack-app-signing-secret"

# App URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 📱 Test Message Format

### Slack Message Structure:

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🎉 Builder Feedback Integration Test",
        "emoji": true
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Congratulations!* Your Slack integration is now connected to Builder Feedback."
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*App Name:*\n{config.appName}"
        },
        {
          "type": "mrkdwn",
          "text": "*Channel:*\n{config.channelId}"
        },
        {
          "type": "mrkdwn",
          "text": "*Events:*\n{config.events.length} configured"
        },
        {
          "type": "mrkdwn",
          "text": "*Status:*\n✅ Active"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*What happens next?*\n• New ideas will be posted here\n• Status updates will be shared\n• Team votes will be tracked"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Dashboard",
            "emoji": true
          },
          "url": "{window.location.origin}/",
          "action_id": "view_dashboard",
          "style": "primary"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Browse Ideas",
            "emoji": true
          },
          "url": "{window.location.origin}/ideas",
          "action_id": "browse_ideas"
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "Builder.io Feedback • Integration test completed at {timestamp}"
        }
      ]
    }
  ],
  "attachments": [
    {
      "color": "#7C3AED",
      "footer": "Builder.io Feedback",
      "footer_icon": "https://cdn.builder.io/api/v1/image/assets%2F24272629d2bd4d1a8956cce15af1b3dc%2F3eea6d7844d747569446ee85b9577557",
      "ts": {unix_timestamp}
    }
  ]
}
```

## 🎬 Demo Success Metrics

### Prompt 1 Success:

✅ Integrations page renders with exact design  
✅ Navbar includes Integrations link
✅ All 4 integration cards show "Coming Soon"
✅ Category filters work correctly

### Prompt 2 Success:

✅ Slack API endpoint fully functional
✅ CORS proxy endpoint working
✅ Error handling comprehensive
✅ No compilation errors

### Prompt 3 Success:

✅ Connect button opens setup wizard
✅ All 5 wizard steps work correctly  
✅ Form validation working
✅ Test message sends to real Slack channel
✅ Success/error states properly handled
✅ Integration marked as "Connected" after setup

## 🔄 Rollback Instructions

### Current State Setup:

1. Remove integrations page: `rm pages/integrations.tsx`
2. Remove wizard component: `rm components/SlackSetupWizard.tsx`
3. Remove navbar link from `components/header/index.tsx`
4. Keep all API files with documentation
5. Keep utility files with activation comments

### File States for Demo:

- ✅ **Keep**: `pages/api/integrations/slack.ts` (with docs)
- ✅ **Keep**: `pages/api/slack-proxy.ts` (with docs)
- ✅ **Keep**: `utils/slack.ts` (commented out)
- ❌ **Remove**: `pages/integrations.tsx`
- ❌ **Remove**: `components/SlackSetupWizard.tsx`
- ❌ **Remove**: Integrations navbar link

This ensures clean starting state while keeping all working backend logic ready for instant activation.

## 📸 Visual Reference

### Integrations Page Layout:

- Clean header with centered title and subtitle
- Category filter bar with purple "All" button selected
- 2x2 grid of integration cards with consistent spacing
- Each card has header (logo + title + badge), body (description + features), footer (buttons)
- Bottom CTA section with purple buttons

### Setup Wizard Flow:

- Modal overlay with progress indicator (1 of 5, 2 of 5, etc.)
- Each step has specific fields and helpful guidance
- Consistent purple color scheme throughout
- Final step shows configuration summary and test button
- Success states with green indicators

### Error Handling:

- Toast notifications for success/error states
- Graceful degradation for failed operations
- Clear error messages with actionable guidance
- Fallback UI for component errors

---

**Remember**: The goal is seamless reproduction with realistic prompts that demonstrate Fusion's capabilities while maintaining the organic feel of a first-time implementation.
