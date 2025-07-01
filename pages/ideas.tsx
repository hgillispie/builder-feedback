import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "@/header";
import { SearchIcon, ChevronUpIcon, ChatIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

interface Idea {
  id: string;
  title: string;
  description: string;
  status: "SUBMITTED" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  tags: string[];
  author: {
    name: string;
    email: string;
  };
  votes: number;
  comments: number;
  createdAt: string;
  hasVoted: boolean;
}

// Mock data - in a real app this would come from API
const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "Add dark mode to Builder.io dashboard",
    description:
      "It would be great to have a dark mode option for those late-night coding sessions. This would help reduce eye strain and provide a better development experience.",
    status: "PLANNED",
    tags: ["ui", "accessibility"],
    author: { name: "Sarah Chen", email: "sarah@builder.io" },
    votes: 47,
    comments: 12,
    createdAt: "2024-01-15",
    hasVoted: false,
  },
  {
    id: "2",
    title: "Better TypeScript support in visual editor",
    description:
      "Improve TypeScript intellisense and error handling when editing components directly in the visual editor interface.",
    status: "IN_PROGRESS",
    tags: ["typescript", "dx"],
    author: { name: "Mike Rodriguez", email: "mike@builder.io" },
    votes: 32,
    comments: 8,
    createdAt: "2024-01-12",
    hasVoted: true,
  },
  {
    id: "3",
    title: "Bulk import/export for content",
    description:
      "Add ability to bulk import and export content entries, especially useful for migrating from other platforms or backup purposes.",
    status: "SUBMITTED",
    tags: ["content", "import", "export"],
    author: { name: "Jessica Park", email: "jessica@builder.io" },
    votes: 28,
    comments: 5,
    createdAt: "2024-01-10",
    hasVoted: false,
  },
  {
    id: "4",
    title: "Real-time collaboration in visual editor",
    description:
      "Enable multiple team members to work on the same content simultaneously with live cursors and changes, similar to Figma.",
    status: "SUBMITTED",
    tags: ["collaboration", "realtime"],
    author: { name: "David Kim", email: "david@builder.io" },
    votes: 89,
    comments: 23,
    createdAt: "2024-01-08",
    hasVoted: true,
  },
];

const statusColors = {
  SUBMITTED: "gray",
  PLANNED: "lightBlue",
  IN_PROGRESS: "orange",
  COMPLETED: "green",
  REJECTED: "red",
};

const statusLabels = {
  SUBMITTED: "Submitted",
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const Ideas: NextPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>(mockIdeas);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("votes");
  const toast = useToast();

  // Filter and sort ideas
  useEffect(() => {
    let filtered = ideas.filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" || idea.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort ideas
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.votes - a.votes;
        case "comments":
          return b.comments - a.comments;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredIdeas(filtered);
  }, [ideas, searchTerm, statusFilter, sortBy]);

  const handleVote = async (ideaId: string) => {
    // Mock API call - in real app would call /api/votes
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              votes: idea.hasVoted ? idea.votes - 1 : idea.votes + 1,
              hasVoted: !idea.hasVoted,
            }
          : idea,
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
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />

      <Container maxW="container.xl" py={8}>
        {/* Page Header */}
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="xl" mb={2} color="gray.900">
              Product Ideas & Feedback
            </Heading>
            <Text color="gray.600" size="lg">
              Help shape the future of Builder.io by voting on ideas and sharing
              your feedback
            </Text>
          </Box>
          {/* Filters and Search */}
          <Card>
            <CardBody>
              <Stack direction={["column", "row"]} spacing={4} align="center">
                <InputGroup flex={1}>
                  <InputLeftElement>
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search ideas, tags, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="filled"
                  />
                </InputGroup>

                <Select
                  w={["full", "200px"]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  variant="filled"
                >
                  <option value="all">All Status</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </Select>

                <Select
                  w={["full", "200px"]}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  variant="filled"
                >
                  <option value="votes">Most Votes</option>
                  <option value="comments">Most Comments</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </Select>
              </Stack>
            </CardBody>
          </Card>

          {/* Results Count */}
          <Text color="gray.600">
            Showing {filteredIdeas.length} of {ideas.length} ideas
          </Text>

          {/* Ideas List */}
          <Stack spacing={4}>
            {filteredIdeas.map((idea) => (
              <Card
                key={idea.id}
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
              >
                <CardBody>
                  <Flex gap={4}>
                    {/* Vote Button */}
                    <VStack spacing={1} minW="60px">
                      <IconButton
                        aria-label="Upvote idea"
                        icon={<ChevronUpIcon />}
                        size="sm"
                        variant={idea.hasVoted ? "solid" : "outline"}
                        bg={idea.hasVoted ? "purple" : "transparent"}
                        color={idea.hasVoted ? "white" : "gray.600"}
                        borderColor={idea.hasVoted ? "purple" : "gray.300"}
                        _hover={{
                          bg: idea.hasVoted ? "brand.600" : "purple",
                          color: "white",
                          borderColor: "purple",
                        }}
                        onClick={() => handleVote(idea.id)}
                      />
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">
                        {idea.votes}
                      </Text>
                    </VStack>

                    {/* Idea Content */}
                    <Box flex={1}>
                      <Flex justify="space-between" align="start" mb={2}>
                        <Heading size="md" color="gray.900" mb={2}>
                          {idea.title}
                        </Heading>
                        <Badge colorScheme={statusColors[idea.status]}>
                          {statusLabels[idea.status]}
                        </Badge>
                      </Flex>

                      <Text color="gray.600" mb={3} lineHeight="tall">
                        {idea.description}
                      </Text>

                      {/* Tags */}
                      <HStack spacing={2} mb={3}>
                        {idea.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="subtle"
                            bg="brand.100"
                            color="purple"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </HStack>

                      {/* Meta Info */}
                      <Flex justify="space-between" align="center">
                        <HStack spacing={4} color="gray.500" fontSize="sm">
                          <Text>by {idea.author.name}</Text>
                          <Text>•</Text>
                          <Text suppressHydrationWarning>
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </Text>
                        </HStack>

                        <HStack spacing={3} color="gray.500" fontSize="sm">
                          <HStack spacing={1}>
                            <ChatIcon />
                            <Text>{idea.comments}</Text>
                          </HStack>
                        </HStack>
                      </Flex>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Stack>

          {filteredIdeas.length === 0 && (
            <Card>
              <CardBody textAlign="center" py={12}>
                <Text color="gray.500" fontSize="lg">
                  No ideas found matching your criteria
                </Text>
                <Text color="gray.400" mt={2}>
                  Try adjusting your filters or search terms
                </Text>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Ideas;
