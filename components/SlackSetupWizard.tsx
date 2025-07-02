import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Box,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Divider,
  Badge,
  useToast,
  Checkbox,
  Link,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";

interface SlackSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: SlackConfig) => void;
}

interface SlackConfig {
  appName: string;
  clientId: string;
  clientSecret: string;
  signingSecret: string;
  webhookUrl: string;
  channelId: string;
  botToken: string;
  events: string[];
}

const STEPS = [
  {
    id: 1,
    title: "Create Slack App",
    description: "Set up your Slack application",
  },
  {
    id: 2,
    title: "Configure OAuth",
    description: "Set permissions and scopes",
  },
  { id: 3, title: "Setup Webhook", description: "Configure incoming webhooks" },
  { id: 4, title: "Add Bot Token", description: "Enable bot functionality" },
  { id: 5, title: "Test & Complete", description: "Verify your configuration" },
];

const SlackSetupWizard: React.FC<SlackSetupWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<SlackConfig>({
    appName: "Builder Feedback",
    clientId: "",
    clientSecret: "",
    signingSecret: "",
    webhookUrl: "",
    channelId: "#general",
    botToken: "",
    events: ["idea_created", "idea_updated"],
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (
    field: keyof SlackConfig,
    value: string | string[],
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventToggle = (event: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      events: checked
        ? [...prev.events, event]
        : prev.events.filter((e) => e !== event),
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 2000,
    });
  };

  const handleComplete = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onComplete(config);
      onClose();
      toast({
        title: "Slack Integration Connected!",
        description:
          "Your Slack workspace is now connected to Builder Feedback.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <VStack spacing={4} align="stretch">
            <Alert status="info">
              <AlertIcon />
              <AlertTitle>Create a new Slack app</AlertTitle>
            </Alert>

            <Text fontSize="sm" color="gray.600">
              Follow these steps to create your Slack application:
            </Text>

            <List spacing={2} fontSize="sm">
              <ListItem>
                <ListIcon as={CheckIcon} color="green.500" />
                Go to{" "}
                <Link
                  color="purple"
                  href="https://api.slack.com/apps"
                  isExternal
                >
                  api.slack.com/apps <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color="green.500" />
                Click &quot;Create New App&quot; → &quot;From scratch&quot;
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color="green.500" />
                Enter app name and select your workspace
              </ListItem>
            </List>

            <FormControl>
              <FormLabel>App Name</FormLabel>
              <Input
                value={config.appName}
                onChange={(e) => handleInputChange("appName", e.target.value)}
                placeholder="Builder Feedback"
              />
            </FormControl>

            <Box bg="gray.50" p={4} borderRadius="md">
              <Text fontWeight="semibold" mb={2}>
                💡 Pro Tip
              </Text>
              <Text fontSize="sm" color="gray.600">
                Use a descriptive name like &quot;Builder Feedback&quot; so your
                team knows what this integration does.
              </Text>
            </Box>
          </VStack>
        );

      case 2:
        return (
          <VStack spacing={4} align="stretch">
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>Configure OAuth & Permissions</AlertTitle>
            </Alert>

            <Text fontSize="sm" color="gray.600">
              In your Slack app settings, go to "OAuth & Permissions" and add
              these bot token scopes:
            </Text>

            <Box bg="gray.50" p={4} borderRadius="md">
              <Text fontWeight="semibold" mb={2}>
                Required Scopes:
              </Text>
              <List spacing={1} fontSize="sm">
                <ListItem>
                  • <Code>incoming-webhook</Code> - Send messages to channels
                </ListItem>
                <ListItem>
                  • <Code>commands</Code> - Create slash commands
                </ListItem>
                <ListItem>
                  • <Code>users:read</Code> - Read user information
                </ListItem>
                <ListItem>
                  • <Code>chat:write</Code> - Post messages
                </ListItem>
              </List>
            </Box>

            <FormControl>
              <FormLabel>Client ID</FormLabel>
              <Input
                value={config.clientId}
                onChange={(e) => handleInputChange("clientId", e.target.value)}
                placeholder="1234567890.1234567890"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Client Secret</FormLabel>
              <Input
                type="password"
                value={config.clientSecret}
                onChange={(e) =>
                  handleInputChange("clientSecret", e.target.value)
                }
                placeholder="abcdef123456..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Signing Secret</FormLabel>
              <Input
                type="password"
                value={config.signingSecret}
                onChange={(e) =>
                  handleInputChange("signingSecret", e.target.value)
                }
                placeholder="abcdef123456..."
              />
            </FormControl>
          </VStack>
        );

      case 3:
        return (
          <VStack spacing={4} align="stretch">
            <Alert status="info">
              <AlertIcon />
              <AlertTitle>Setup Incoming Webhooks</AlertTitle>
            </Alert>

            <Text fontSize="sm" color="gray.600">
              Configure where Builder Feedback will send notifications:
            </Text>

            <FormControl>
              <FormLabel>Webhook URL</FormLabel>
              <Input
                value={config.webhookUrl}
                onChange={(e) =>
                  handleInputChange("webhookUrl", e.target.value)
                }
                placeholder="https://hooks.slack.com/services/..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Default Channel</FormLabel>
              <Select
                value={config.channelId}
                onChange={(e) => handleInputChange("channelId", e.target.value)}
              >
                <option value="#general">#general</option>
                <option value="#feedback">#feedback</option>
                <option value="#development">#development</option>
                <option value="#notifications">#notifications</option>
              </Select>
            </FormControl>

            <Box
              bg="blue.50"
              p={4}
              borderRadius="md"
              border="1px"
              borderColor="blue.200"
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="semibold">Redirect URL</Text>
                <Button
                  size="xs"
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/api/integrations/slack`,
                    )
                  }
                >
                  <CopyIcon mr={1} /> Copy
                </Button>
              </HStack>
              <Code
                fontSize="sm"
                p={2}
                bg="white"
                borderRadius="md"
                display="block"
              >
                {window.location.origin}/api/integrations/slack
              </Code>
              <Text fontSize="xs" color="gray.600" mt={2}>
                Add this URL to your Slack app's OAuth redirect URLs
              </Text>
            </Box>
          </VStack>
        );

      case 4:
        return (
          <VStack spacing={4} align="stretch">
            <Alert status="success">
              <AlertIcon />
              <AlertTitle>Add Bot Token & Configure Events</AlertTitle>
            </Alert>

            <FormControl>
              <FormLabel>Bot User OAuth Token</FormLabel>
              <Input
                type="password"
                value={config.botToken}
                onChange={(e) => handleInputChange("botToken", e.target.value)}
                placeholder="xoxb-1234567890..."
              />
            </FormControl>

            <Text fontWeight="semibold" fontSize="sm">
              Event Notifications
            </Text>
            <Text fontSize="sm" color="gray.600">
              Choose which events will trigger Slack notifications:
            </Text>

            <VStack align="stretch" spacing={2}>
              <Checkbox
                isChecked={config.events.includes("idea_created")}
                onChange={(e) =>
                  handleEventToggle("idea_created", e.target.checked)
                }
              >
                <HStack>
                  <Text>New ideas submitted</Text>
                  <Badge colorScheme="green" size="sm">
                    Recommended
                  </Badge>
                </HStack>
              </Checkbox>

              <Checkbox
                isChecked={config.events.includes("idea_updated")}
                onChange={(e) =>
                  handleEventToggle("idea_updated", e.target.checked)
                }
              >
                <Text>Ideas status updated</Text>
              </Checkbox>

              <Checkbox
                isChecked={config.events.includes("idea_voted")}
                onChange={(e) =>
                  handleEventToggle("idea_voted", e.target.checked)
                }
              >
                <Text>Ideas receive votes (milestones)</Text>
              </Checkbox>

              <Checkbox
                isChecked={config.events.includes("idea_commented")}
                onChange={(e) =>
                  handleEventToggle("idea_commented", e.target.checked)
                }
              >
                <Text>New comments added</Text>
              </Checkbox>
            </VStack>
          </VStack>
        );

      case 5:
        return (
          <VStack spacing={4} align="stretch">
            <Alert status="success">
              <AlertIcon />
              <AlertTitle>Configuration Complete!</AlertTitle>
              <AlertDescription>
                Review your settings and test the connection.
              </AlertDescription>
            </Alert>

            <Box bg="gray.50" p={4} borderRadius="md">
              <Text fontWeight="semibold" mb={3}>
                Configuration Summary:
              </Text>
              <VStack align="stretch" spacing={2} fontSize="sm">
                <HStack justify="space-between">
                  <Text>App Name:</Text>
                  <Text fontWeight="medium">{config.appName}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Channel:</Text>
                  <Text fontWeight="medium">{config.channelId}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Events:</Text>
                  <Text fontWeight="medium">
                    {config.events.length} selected
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Status:</Text>
                  <Badge colorScheme="green">Ready to connect</Badge>
                </HStack>
              </VStack>
            </Box>

            <Box
              bg="blue.50"
              p={4}
              borderRadius="md"
              border="1px"
              borderColor="blue.200"
            >
              <Text fontWeight="semibold" mb={2}>
                🧪 Test Your Integration
              </Text>
              <Text fontSize="sm" color="gray.600">
                After connecting, we'll send a test message to your configured
                channel to verify everything is working correctly.
              </Text>
            </Box>

            <Alert status="info">
              <AlertIcon />
              <Box fontSize="sm">
                <AlertTitle>Environment Variables</AlertTitle>
                <AlertDescription mt={2}>
                  For production use, add these to your <Code>.env.local</Code>{" "}
                  file:
                  <Box mt={2} p={2} bg="white" borderRadius="md">
                    <Code fontSize="xs" display="block">
                      SLACK_CLIENT_ID="{config.clientId}"<br />
                      SLACK_CLIENT_SECRET="***"
                      <br />
                      SLACK_SIGNING_SECRET="***"
                    </Code>
                  </Box>
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return config.appName.length > 0;
      case 2:
        return config.clientId && config.clientSecret && config.signingSecret;
      case 3:
        return config.webhookUrl && config.channelId;
      case 4:
        return config.botToken && config.events.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text>Slack Integration Setup</Text>
              <Badge colorScheme="purple">
                {currentStep} of {STEPS.length}
              </Badge>
            </HStack>
            <Box>
              <Progress
                value={(currentStep / STEPS.length) * 100}
                colorScheme="purple"
                size="sm"
              />
              <HStack justify="space-between" mt={2}>
                <Text fontSize="sm" fontWeight="semibold">
                  {STEPS[currentStep - 1]?.title}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {STEPS[currentStep - 1]?.description}
                </Text>
              </HStack>
            </Box>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {renderStepContent()}

            <Divider />

            <HStack justify="space-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                isDisabled={currentStep === 1}
              >
                Previous
              </Button>

              <HStack spacing={2}>
                {currentStep < STEPS.length ? (
                  <Button
                    colorScheme="purple"
                    onClick={handleNext}
                    isDisabled={!canProceed()}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    colorScheme="green"
                    onClick={handleComplete}
                    isLoading={isLoading}
                    loadingText="Connecting..."
                    isDisabled={!canProceed()}
                  >
                    Complete Setup
                  </Button>
                )}
              </HStack>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SlackSetupWizard;
