import type { NextPage } from "next";
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Image,
  Badge,
  Flex,
  Icon,
  useToast,
} from "@chakra-ui/react";
import Header from "@/header";
import { LinkIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { initiateSlackOAuth } from "../utils/slack";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SlackSetupWizard from "../components/SlackSetupWizard";

const integrations = [
  {
    name: "Slack",
    description:
      "Get notified about feedback updates and new ideas directly in your Slack channels.",
    logo: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
    status: "Coming Soon",
    category: "Communication",
    features: [
      "Real-time notifications",
      "Channel customization",
      "Thread discussions",
      "Status updates",
    ],
  },
  {
    name: "GitHub",
    description:
      "Automatically create issues from feedback and sync development progress.",
    logo: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg",
    status: "Coming Soon",
    category: "Development",
    features: [
      "Auto-create issues",
      "Link to repositories",
      "Pull request tracking",
      "Release notes sync",
    ],
  },
  {
    name: "Discord",
    description:
      "Connect your Discord server to receive community feedback notifications.",
    logo: "https://cdn.worldvectorlogo.com/logos/discord-6.svg",
    status: "Coming Soon",
    category: "Community",
    features: [
      "Server notifications",
      "Custom webhooks",
      "Role mentions",
      "Embed messages",
    ],
  },
  {
    name: "Zapier",
    description:
      "Automate workflows by connecting Builder Feedback to 5000+ apps.",
    logo: "https://cdn.worldvectorlogo.com/logos/zapier.svg",
    status: "Coming Soon",
    category: "Automation",
    features: [
      "Custom triggers",
      "Multi-app workflows",
      "Data synchronization",
      "Email automation",
    ],
  },
];

const categories = [
  "All",
  "Communication",
  "Development",
  "Community",
  "Automation",
];

const Integrations: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(
    [],
  );
  const [isSlackWizardOpen, setIsSlackWizardOpen] = useState(false);

  // Handle OAuth callback results
  useEffect(() => {
    if (router.query.slack === "connected") {
      toast({
        title: "Slack Connected!",
        description: "Your Slack workspace has been successfully connected.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setConnectedIntegrations((prev) => [...prev, "Slack"]);
      // Clean up URL
      router.replace("/integrations", undefined, { shallow: true });
    } else if (router.query.slack === "error") {
      toast({
        title: "Connection Failed",
        description: "There was an error connecting your Slack workspace.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      // Clean up URL
      router.replace("/integrations", undefined, { shallow: true });
    }
  }, [router.query, toast]);

  const handleConnect = async (integrationName: string) => {
    if (integrationName === "Slack") {
      setIsSlackWizardOpen(true);
    } else {
      toast({
        title: "Coming Soon",
        description: `${integrationName} integration is not yet available.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSlackSetupComplete = (config: any) => {
    console.log("Slack configuration:", config);
    setConnectedIntegrations((prev) => [...prev, "Slack"]);
  };

  const isConnected = (name: string) => connectedIntegrations.includes(name);

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />

      <Container maxW="container.xl" py={16}>
        <VStack spacing={12} align="stretch">
          {/* Header Section */}
          <VStack spacing={6} textAlign="center">
            <Box>
              <Heading size="2xl" color="gray.900" mb={4}>
                Integrations
              </Heading>
              <Text size="lg" color="gray.600" maxW="3xl" mx="auto">
                Connect Builder Feedback with your favorite tools to streamline
                your workflow and keep your team in sync.
              </Text>
            </Box>
          </VStack>

          {/* Category Filter */}
          <HStack spacing={4} justify="center" wrap="wrap">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={category === "All" ? "solid" : "outline"}
                bg={category === "All" ? "purple" : "transparent"}
                color={category === "All" ? "white" : "purple"}
                borderColor="purple"
                _hover={{
                  bg: category === "All" ? "brand.600" : "brand.50",
                }}
              >
                {category}
              </Button>
            ))}
          </HStack>

          {/* Integrations Grid */}
          <Grid templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} gap={8}>
            {integrations.map((integration) => (
              <GridItem key={integration.name}>
                <Card h="full" position="relative" overflow="hidden">
                  <CardHeader>
                    <HStack spacing={4} align="start">
                      <Box bg="white" p={3} borderRadius="lg" shadow="sm">
                        <Image
                          src={integration.logo}
                          alt={`${integration.name} logo`}
                          boxSize={8}
                        />
                      </Box>
                      <Box flex="1">
                        <HStack justify="space-between" align="start" mb={2}>
                          <Heading size="md" color="gray.900">
                            {integration.name}
                          </Heading>
                          <Badge
                            colorScheme={
                              isConnected(integration.name)
                                ? "green"
                                : integration.status === "Available"
                                  ? "blue"
                                  : "yellow"
                            }
                            variant="subtle"
                          >
                            {isConnected(integration.name)
                              ? "Connected"
                              : integration.status}
                          </Badge>
                        </HStack>
                        <Text size="sm" color="gray.500" mb={1}>
                          {integration.category}
                        </Text>
                      </Box>
                    </HStack>
                  </CardHeader>

                  <CardBody pt={0}>
                    <VStack spacing={4} align="stretch">
                      <Text color="gray.600" fontSize="sm">
                        {integration.description}
                      </Text>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                          mb={2}
                        >
                          Features:
                        </Text>
                        <VStack spacing={1} align="start">
                          {integration.features.map((feature, index) => (
                            <HStack key={index} spacing={2}>
                              <Icon as={LinkIcon} color="purple" boxSize={3} />
                              <Text fontSize="sm" color="gray.600">
                                {feature}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>

                      <Flex justify="space-between" align="center" pt={4}>
                        <Button
                          size="sm"
                          variant={
                            isConnected(integration.name) ? "solid" : "outline"
                          }
                          bg={
                            isConnected(integration.name)
                              ? "green.500"
                              : "transparent"
                          }
                          borderColor={
                            isConnected(integration.name)
                              ? "green.500"
                              : "purple"
                          }
                          color={
                            isConnected(integration.name) ? "white" : "purple"
                          }
                          _hover={{
                            bg: isConnected(integration.name)
                              ? "green.600"
                              : "brand.50",
                          }}
                          isDisabled={isConnected(integration.name)}
                          onClick={() => handleConnect(integration.name)}
                        >
                          {isConnected(integration.name)
                            ? "Connected"
                            : integration.name === "Slack"
                              ? "Connect"
                              : "Notify Me"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          color="gray.500"
                          rightIcon={<ExternalLinkIcon />}
                          _hover={{
                            color: "purple",
                          }}
                        >
                          Learn More
                        </Button>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>

          {/* Custom Integration CTA */}
          <Card bg="brand.50" borderColor="brand.200" mt={8}>
            <CardBody>
              <VStack spacing={6} textAlign="center" py={8}>
                <Box>
                  <Heading size="lg" mb={4} color="gray.900">
                    Need a Custom Integration?
                  </Heading>
                  <Text size="lg" color="gray.600" maxW="2xl" mx="auto">
                    Don't see the integration you need? Let us know and we'll
                    consider adding it to our roadmap.
                  </Text>
                </Box>

                <HStack spacing={4}>
                  <Button
                    size="lg"
                    bg="purple"
                    color="white"
                    px={8}
                    py={6}
                    _hover={{
                      bg: "brand.600",
                      transform: "translateY(-1px)",
                      boxShadow: "lg",
                    }}
                  >
                    Request Integration
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="purple"
                    color="purple"
                    px={8}
                    py={6}
                    _hover={{
                      bg: "brand.50",
                      transform: "translateY(-1px)",
                    }}
                  >
                    View API Docs
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Integrations;
