import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "@/header";
import { ChatIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "BACKLOG" | "UNDER_REVIEW" | "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  tags: string[];
  votes: number;
  comments: number;
  progress?: number; // Only for IN_PROGRESS items
  quarter?: string; // Target quarter for completion
  hasVoted?: boolean; // Whether current user has voted
}

// Mock roadmap data
const initialRoadmapItems: RoadmapItem[] = [
  // BACKLOG
  {
    id: "1",
    title: "AI-Powered Content Suggestions",
    description:
      "Intelligent content recommendations based on user behavior and performance analytics.",
    status: "BACKLOG",
    tags: ["ai", "content", "analytics"],
    votes: 45,
    comments: 8,
    hasVoted: false,
  },
  {
    id: "2",
    title: "Advanced SEO Optimization Tools",
    description:
      "Built-in SEO analysis with recommendations for meta tags, structured data, and performance.",
    status: "BACKLOG",
    tags: ["seo", "optimization", "analytics"],
    votes: 67,
    comments: 12,
    hasVoted: true,
  },
  {
    id: "3",
    title: "Voice Interface for Content Creation",
    description:
      "Voice commands for hands-free content editing and navigation through the builder interface.",
    status: "BACKLOG",
    tags: ["voice", "accessibility", "editor"],
    votes: 23,
    comments: 4,
    hasVoted: false,
  },
  {
    id: "4",
    title: "Advanced Security Dashboard",
    description:
      "Comprehensive security monitoring with audit logs, access controls, and threat detection.",
    status: "BACKLOG",
    tags: ["security", "monitoring", "compliance"],
    votes: 89,
    comments: 16,
    hasVoted: false,
  },

  // UNDER_REVIEW
  {
    id: "5",
    title: "GraphQL API Enhancement",
    description:
      "Extended GraphQL API with real-time subscriptions and advanced filtering capabilities.",
    status: "UNDER_REVIEW",
    tags: ["api", "graphql", "realtime"],
    votes: 134,
    comments: 28,
    hasVoted: true,
  },
  {
    id: "6",
    title: "Multi-Brand Content Management",
    description:
      "Support for managing multiple brands with separate themes, assets, and content libraries.",
    status: "UNDER_REVIEW",
    tags: ["multi-tenant", "branding", "cms"],
    votes: 156,
    comments: 34,
    hasVoted: false,
  },
  {
    id: "7",
    title: "Advanced Component Library",
    description:
      "Expanded component library with advanced layout options and interactive elements.",
    status: "UNDER_REVIEW",
    tags: ["components", "library", "editor"],
    votes: 98,
    comments: 21,
    hasVoted: true,
  },

  // PLANNED
  {
    id: "8",
    title: "Advanced A/B Testing Suite",
    description:
      "Comprehensive A/B testing framework with statistical significance tracking and advanced targeting rules.",
    status: "PLANNED",
    tags: ["analytics", "testing", "optimization"],
    votes: 156,
    comments: 34,
    quarter: "Q2 2024",
    hasVoted: false,
  },
  {
    id: "9",
    title: "Mobile App Content Management",
    description:
      "Native mobile app for content creators to manage and publish content on the go.",
    status: "PLANNED",
    tags: ["mobile", "content", "cms"],
    votes: 89,
    comments: 22,
    quarter: "Q3 2024",
    hasVoted: true,
  },
  {
    id: "10",
    title: "Enhanced Localization Tools",
    description:
      "Better translation workflow with context-aware suggestions and collaboration features.",
    status: "PLANNED",
    tags: ["i18n", "localization", "workflow"],
    votes: 67,
    comments: 15,
    quarter: "Q2 2024",
    hasVoted: false,
  },

  // IN_PROGRESS
  {
    id: "11",
    title: "Dark Mode for Dashboard",
    description:
      "System-wide dark mode theme for the Builder.io dashboard and visual editor.",
    status: "IN_PROGRESS",
    tags: ["ui", "accessibility", "theme"],
    votes: 234,
    comments: 45,
    progress: 75,
    quarter: "Q1 2024",
    hasVoted: true,
  },
  {
    id: "12",
    title: "Real-time Collaboration",
    description:
      "Multiple users can edit the same content simultaneously with live cursors and conflict resolution.",
    status: "IN_PROGRESS",
    tags: ["collaboration", "realtime", "editor"],
    votes: 198,
    comments: 38,
    progress: 40,
    quarter: "Q1 2024",
    hasVoted: false,
  },
  {
    id: "13",
    title: "Enhanced TypeScript Support",
    description:
      "Better TypeScript intellisense, error handling, and type safety in the visual editor.",
    status: "IN_PROGRESS",
    tags: ["typescript", "dx", "editor"],
    votes: 143,
    comments: 28,
    progress: 60,
    quarter: "Q1 2024",
    hasVoted: true,
  },
  {
    id: "14",
    title: "Advanced Form Builder",
    description:
      "Drag-and-drop form builder with conditional logic, validation rules, and submission handling.",
    status: "IN_PROGRESS",
    tags: ["forms", "builder", "validation"],
    votes: 178,
    comments: 32,
    progress: 25,
    quarter: "Q2 2024",
    hasVoted: false,
  },

  // COMPLETED
  {
    id: "15",
    title: "Figma Plugin 2.0",
    description:
      "Complete redesign of the Figma plugin with improved sync, better component mapping, and batch operations.",
    status: "COMPLETED",
    tags: ["figma", "design", "integration"],
    votes: 312,
    comments: 67,
    quarter: "Q4 2023",
    hasVoted: true,
  },
  {
    id: "16",
    title: "Webhook Management Dashboard",
    description:
      "Visual interface for managing webhooks with testing, logs, and retry mechanisms.",
    status: "COMPLETED",
    tags: ["webhooks", "api", "integration"],
    votes: 89,
    comments: 19,
    quarter: "Q4 2023",
    hasVoted: false,
  },
  {
    id: "17",
    title: "Performance Analytics",
    description:
      "Detailed performance metrics for published content including Core Web Vitals tracking.",
    status: "COMPLETED",
    tags: ["performance", "analytics", "monitoring"],
    votes: 178,
    comments: 41,
    quarter: "Q4 2023",
    hasVoted: false,
  },
  {
    id: "18",
    title: "Content Scheduling System",
    description:
      "Schedule content publication and updates with timezone support and automated workflows.",
    status: "COMPLETED",
    tags: ["scheduling", "automation", "cms"],
    votes: 145,
    comments: 29,
    quarter: "Q4 2023",
    hasVoted: true,
  },
  {
    id: "19",
    title: "Enhanced Media Library",
    description:
      "Improved media management with AI-powered tagging, bulk operations, and CDN optimization.",
    status: "COMPLETED",
    tags: ["media", "ai", "cdn"],
    votes: 123,
    comments: 24,
    quarter: "Q3 2023",
    hasVoted: false,
  },
];

const statusConfig = {
  BACKLOG: {
    title: "Backlog",
    color: "gray",
    description: "Ideas under consideration",
  },
  UNDER_REVIEW: {
    title: "Under Review",
    color: "purple",
    description: "Ideas being evaluated",
  },
  PLANNED: {
    title: "Planned",
    color: "blue",
    description: "Ideas approved for development",
  },
  IN_PROGRESS: {
    title: "In Progress",
    color: "orange",
    description: "Currently being developed",
  },
  COMPLETED: {
    title: "Completed",
    color: "green",
    description: "Recently shipped features",
  },
};

const RoadmapColumn = ({
  status,
  items,
  onVote,
  onComment,
}: {
  status: keyof typeof statusConfig;
  items: RoadmapItem[];
  onVote: (itemId: string) => void;
  onComment: (itemId: string) => void;
}) => {
  const config = statusConfig[status];

  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Heading size="md" color="gray.900" mb={1}>
            {config.title}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {config.description}
          </Text>
          <Text color="gray.500" fontSize="sm" mt={1}>
            {items.length} items
          </Text>
        </Box>

        <Stack spacing={3}>
          {items.map((item) => (
            <Card
              key={item.id}
              size="sm"
              _hover={{ shadow: "md", transform: "translateY(-1px)" }}
            >
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Heading
                      size="sm"
                      color="gray.900"
                      mb={2}
                      lineHeight="short"
                    >
                      {item.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" lineHeight="tall">
                      {item.description}
                    </Text>
                  </Box>

                  {/* Progress bar for in-progress items */}
                  {status === "IN_PROGRESS" && item.progress && (
                    <Box>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">
                          Progress
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.600"
                          fontWeight="semibold"
                        >
                          {item.progress}%
                        </Text>
                      </HStack>
                      <Progress
                        value={item.progress}
                        size="sm"
                        colorScheme={config.color}
                        borderRadius="full"
                      />
                    </Box>
                  )}

                  {/* Tags */}
                  <HStack spacing={1} flexWrap="wrap">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="subtle"
                        bg="brand.100"
                        color="purple"
                        fontSize="xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="subtle" colorScheme="gray" fontSize="xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </HStack>

                  {/* Meta info */}
                  <HStack
                    justify="space-between"
                    fontSize="xs"
                    color="gray.500"
                  >
                    <HStack spacing={3}>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Vote on roadmap item"
                          icon={<ChevronUpIcon />}
                          size="xs"
                          variant={item.hasVoted ? "solid" : "ghost"}
                          bg={item.hasVoted ? "purple" : "transparent"}
                          color={item.hasVoted ? "white" : "gray.500"}
                          _hover={{
                            bg: item.hasVoted ? "brand.600" : "purple",
                            color: "white",
                          }}
                          onClick={() => onVote(item.id)}
                        />
                        <Text>{item.votes}</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="View comments"
                          icon={<ChatIcon />}
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          _hover={{
                            bg: "gray.100",
                            color: "gray.600",
                          }}
                          onClick={() => onComment(item.id)}
                        />
                        <Text>{item.comments}</Text>
                      </HStack>
                    </HStack>
                    {item.quarter && (
                      <Badge
                        variant="outline"
                        colorScheme={config.color}
                        fontSize="xs"
                      >
                        {item.quarter}
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </Stack>
      </VStack>
    </Box>
  );
};

const Roadmap: NextPage = () => {
  const [roadmapItems, setRoadmapItems] =
    useState<RoadmapItem[]>(initialRoadmapItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const backlogItems = roadmapItems.filter((item) => item.status === "BACKLOG");
  const underReviewItems = roadmapItems.filter(
    (item) => item.status === "UNDER_REVIEW",
  );
  const plannedItems = roadmapItems.filter((item) => item.status === "PLANNED");
  const inProgressItems = roadmapItems.filter(
    (item) => item.status === "IN_PROGRESS",
  );
  const completedItems = roadmapItems.filter(
    (item) => item.status === "COMPLETED",
  );

  const handleVote = async (itemId: string) => {
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ideaId: itemId,
          userId: "user1", // Mock user ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      const result = await response.json();

      // Update local state
      setRoadmapItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                votes: item.hasVoted ? item.votes - 1 : item.votes + 1,
                hasVoted: !item.hasVoted,
              }
            : item,
        ),
      );

      toast({
        title: "Vote registered",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: "solid",
        containerStyle: {
          backgroundColor: "#48BB78",
          color: "white",
        },
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Failed to vote",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleComment = (itemId: string) => {
    setSelectedItemId(itemId);
    onOpen();
  };

  const handleSubmitComment = async () => {
    if (!selectedItemId || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
          ideaId: selectedItemId,
          userId: "user1", // Mock user ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      // Update comment count in local state
      setRoadmapItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItemId
            ? { ...item, comments: item.comments + 1 }
            : item,
        ),
      );

      toast({
        title: "Comment added!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setNewComment("");
      onClose();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Failed to add comment",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const selectedItem = roadmapItems.find((item) => item.id === selectedItemId);

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2} color="gray.900">
              Product Roadmap
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl" mx="auto">
              Track the progress of Builder.io features from idea to completion.
              Vote on planned features to help us prioritize development.
            </Text>
          </Box>

          {/* Roadmap Stats */}
          <Card>
            <CardBody>
              <Grid
                templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
                gap={4}
              >
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="gray.500">
                    {backlogItems.length}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    In Backlog
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="purple">
                    {underReviewItems.length}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    Under Review
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="lightBlue">
                    {plannedItems.length}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    Planned
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="orange">
                    {inProgressItems.length}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    In Progress
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="green">
                    {completedItems.length}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    Completed
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="purple">
                    {roadmapItems.reduce((sum, item) => sum + item.votes, 0)}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    Total Votes
                  </Text>
                </Box>
              </Grid>
            </CardBody>
          </Card>

          {/* Kanban Board */}
          <Box>
            <Text color="gray.600" fontSize="sm" mb={4}>
              Scroll horizontally to see all stages →
            </Text>
            <Box overflowX="auto" pb={4}>
              <HStack
                spacing={6}
                alignItems="start"
                minW="max-content"
                w="max-content"
              >
                <Box minW="300px" maxW="300px">
                  <RoadmapColumn
                    status="BACKLOG"
                    items={backlogItems}
                    onVote={handleVote}
                    onComment={handleComment}
                  />
                </Box>
                <Box minW="300px" maxW="300px">
                  <RoadmapColumn
                    status="UNDER_REVIEW"
                    items={underReviewItems}
                    onVote={handleVote}
                    onComment={handleComment}
                  />
                </Box>
                <Box minW="300px" maxW="300px">
                  <RoadmapColumn
                    status="PLANNED"
                    items={plannedItems}
                    onVote={handleVote}
                    onComment={handleComment}
                  />
                </Box>
                <Box minW="300px" maxW="300px">
                  <RoadmapColumn
                    status="IN_PROGRESS"
                    items={inProgressItems}
                    onVote={handleVote}
                    onComment={handleComment}
                  />
                </Box>
                <Box minW="300px" maxW="300px">
                  <RoadmapColumn
                    status="COMPLETED"
                    items={completedItems}
                    onVote={handleVote}
                    onComment={handleComment}
                  />
                </Box>
              </HStack>
            </Box>
          </Box>

          {/* Footer Note */}
          <Card bg="blue.50" borderColor="blue.200">
            <CardBody textAlign="center">
              <Text color="blue.800" fontSize="sm">
                <strong>Have an idea?</strong> Submit your feature requests and
                help us prioritize what to build next!
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Comment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Comment
            {selectedItem && (
              <Text fontSize="sm" fontWeight="normal" color="gray.600" mt={1}>
                {selectedItem.title}
              </Text>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text color="gray.600" fontSize="sm">
                Share your thoughts, feedback, or questions about this roadmap
                item.
              </Text>
              <Textarea
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                resize="vertical"
                maxLength={500}
              />
              <Text fontSize="xs" color="gray.500" textAlign="right">
                {newComment.length}/500 characters
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="purple"
              color="white"
              _hover={{ bg: "brand.600" }}
              onClick={handleSubmitComment}
              isLoading={isSubmittingComment}
              loadingText="Adding..."
              isDisabled={!newComment.trim() || newComment.length > 500}
            >
              Add Comment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Roadmap;
