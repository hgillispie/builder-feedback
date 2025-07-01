import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "@/header";
import { useState } from "react";
import { useRouter } from "next/router";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const predefinedTags = [
  "ui",
  "ux",
  "performance",
  "accessibility",
  "typescript",
  "dx",
  "content",
  "collaboration",
  "import",
  "export",
  "realtime",
  "mobile",
  "api",
  "security",
];

const Submit: NextPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("feature");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // Validation
    if (title.length < 10 || title.length > 100) {
      setError("Title must be between 10 and 100 characters");
      setLoading(false);
      return;
    }

    if (description.length < 20 || description.length > 1000) {
      setError("Description must be between 20 and 1000 characters");
      setLoading(false);
      return;
    }

    if (tags.length === 0) {
      setError("Please add at least one tag");
      setLoading(false);
      return;
    }

    try {
      // Mock API call - in real app would call /api/ideas
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit idea");
      }

      const result = await response.json();

      toast({
        title: "Idea submitted successfully!",
        description:
          "Thank you for your feedback. The team will review it soon.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form or redirect
      router.push("/ideas");
    } catch (err) {
      toast({
        title: "Submission failed",
        description:
          "There was an error submitting your idea. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />

      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Page Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2} color="gray.900">
              Submit Your Idea
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Help us improve Builder.io by sharing your feedback and feature
              ideas
            </Text>
          </Box>

          {/* Form Card */}
          <Card>
            <CardBody>
              <Stack spacing={6}>
                {/* Title */}
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Title
                  </FormLabel>
                  <Input
                    placeholder="Give your idea a clear, descriptive title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="filled"
                    size="lg"
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {title.length}/100 characters
                  </Text>
                </FormControl>

                {/* Category */}
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Category
                  </FormLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    variant="filled"
                    size="lg"
                  >
                    <option value="feature">New Feature</option>
                    <option value="improvement">Improvement</option>
                    <option value="bug">Bug Report</option>
                    <option value="integration">Integration</option>
                    <option value="performance">Performance</option>
                    <option value="documentation">Documentation</option>
                  </Select>
                </FormControl>

                {/* Description */}
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Description
                  </FormLabel>
                  <Textarea
                    placeholder="Describe your idea in detail. What problem does it solve? How would it work? Who would benefit from it?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="filled"
                    size="lg"
                    rows={6}
                    resize="vertical"
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {description.length}/1000 characters
                  </Text>
                </FormControl>

                {/* Tags */}
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Tags (up to 5)
                  </FormLabel>

                  {/* Current Tags */}
                  {tags.length > 0 && (
                    <HStack spacing={2} mb={3} flexWrap="wrap">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          colorScheme="brand"
                          variant="solid"
                          px={3}
                          py={1}
                          borderRadius="full"
                          cursor="pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </HStack>
                  )}

                  {/* Predefined Tags */}
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Quick tags:
                  </Text>
                  <HStack spacing={2} flexWrap="wrap" mb={3}>
                    {predefinedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        colorScheme="gray"
                        px={3}
                        py={1}
                        borderRadius="full"
                        cursor="pointer"
                        onClick={() => addTag(tag)}
                        _hover={{ bg: "gray.100" }}
                        opacity={tags.includes(tag) ? 0.5 : 1}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>

                  {/* Custom Tag Input */}
                  <Flex gap={2}>
                    <Input
                      placeholder="Add custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      variant="filled"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(customTag.toLowerCase().trim());
                        }
                      }}
                    />
                    <Button
                      onClick={() => addTag(customTag.toLowerCase().trim())}
                      disabled={!customTag.trim() || tags.length >= 5}
                      colorScheme="brand"
                      variant="outline"
                    >
                      <AddIcon />
                    </Button>
                  </Flex>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {tags.length}/5 tags selected
                  </Text>
                </FormControl>

                {/* Error Message */}
                {error && (
                  <Alert status="error" borderRadius="lg">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  size="lg"
                  colorScheme="brand"
                  onClick={handleSubmit}
                  isLoading={loading}
                  loadingText="Submitting..."
                  disabled={loading}
                >
                  Submit Idea
                </Button>
              </Stack>
            </CardBody>
          </Card>

          {/* Help Text */}
          <Card bg="blue.50" borderColor="blue.200">
            <CardBody>
              <Heading size="sm" color="blue.800" mb={2}>
                Tips for a great submission:
              </Heading>
              <Stack spacing={1} color="blue.700" fontSize="sm">
                <Text>
                  • Be specific about the problem you&apos;re trying to solve
                </Text>
                <Text>
                  • Explain how your idea would improve the user experience
                </Text>
                <Text>• Include any relevant examples or use cases</Text>
                <Text>• Use tags to help categorize your idea properly</Text>
              </Stack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Submit;
