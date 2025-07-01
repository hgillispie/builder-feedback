import type { NextPage } from "next";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
  Card,
  CardBody,
} from "@chakra-ui/react";
import Link from "next/link";
import Header from "@/header";
import {
  ArrowForwardIcon,
  StarIcon,
  ChatIcon,
  CalendarIcon,
} from "@chakra-ui/icons";

const Home: NextPage = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />

      <Container maxW="container.xl" py={16}>
        <VStack spacing={16} align="stretch">
          {/* Hero Section */}
          <VStack spacing={8} textAlign="center" py={8}>
            <Box>
              <Heading size="2xl" color="gray.900" mb={4}>
                Shape the Future of Builder.io
              </Heading>
              <Text size="lg" color="gray.600" maxW="3xl" mx="auto">
                Your voice matters. Share ideas, vote on features, and help us
                build the visual development platform that empowers your team.
              </Text>
            </Box>

            <HStack spacing={4}>
              <Link href="/ideas">
                <Button
                  size="lg"
                  bg="purple"
                  color="white"
                  rightIcon={<ArrowForwardIcon />}
                  px={8}
                  py={6}
                  _hover={{
                    bg: "brand.600",
                    transform: "translateY(-1px)",
                    boxShadow: "lg",
                  }}
                >
                  Browse Ideas
                </Button>
              </Link>
              <Link href="/submit">
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
                  Submit Feedback
                </Button>
              </Link>
            </HStack>
          </VStack>

          {/* Features Grid */}
          <Grid templateColumns={["1fr", "1fr", "repeat(3, 1fr)"]} gap={8}>
            <GridItem>
              <Card h="full">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Box bg="brand.100" p={3} borderRadius="lg">
                      <Icon as={StarIcon} color="purple" boxSize={6} />
                    </Box>
                    <Box>
                      <Heading size="md" mb={2} color="gray.900">
                        Vote on Ideas
                      </Heading>
                      <Text size="md" color="gray.600">
                        Help prioritize features by voting on ideas that matter
                        most to you and your team.
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card h="full">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Box bg="accent.100" p={3} borderRadius="lg">
                      <Icon as={ChatIcon} color="yellow" boxSize={6} />
                    </Box>
                    <Box>
                      <Heading size="md" mb={2} color="gray.900">
                        Share Feedback
                      </Heading>
                      <Text size="md" color="gray.600">
                        Submit feature requests, improvements, and bug reports
                        to help us build better tools.
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card h="full">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Box bg="blue.100" p={3} borderRadius="lg">
                      <Icon as={CalendarIcon} color="lightBlue" boxSize={6} />
                    </Box>
                    <Box>
                      <Heading size="md" mb={2} color="gray.900">
                        Track Progress
                      </Heading>
                      <Text size="md" color="gray.600">
                        Follow your ideas through our roadmap from submission to
                        completion.
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* How It Works */}
          <VStack spacing={8} textAlign="center">
            <Box>
              <Heading size="lg" mb={4} color="gray.900">
                How It Works
              </Heading>
              <Text size="lg" color="gray.600" maxW="2xl" mx="auto">
                Join the Builder.io community in shaping our platform
              </Text>
            </Box>

            <Grid
              templateColumns={["1fr", "1fr", "repeat(3, 1fr)"]}
              gap={8}
              w="full"
            >
              <GridItem textAlign="center">
                <VStack spacing={4}>
                  <Box
                    bg="purple"
                    color="white"
                    borderRadius="full"
                    w={12}
                    h={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xl"
                    fontWeight="bold"
                  >
                    1
                  </Box>
                  <Box>
                    <Heading size="md" mb={2} color="gray.900">
                      Submit Ideas
                    </Heading>
                    <Text size="md" color="gray.600">
                      Share your feature requests, improvements, or report
                      issues
                    </Text>
                  </Box>
                </VStack>
              </GridItem>

              <GridItem textAlign="center">
                <VStack spacing={4}>
                  <Box
                    bg="purple"
                    color="white"
                    borderRadius="full"
                    w={12}
                    h={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xl"
                    fontWeight="bold"
                  >
                    2
                  </Box>
                  <Box>
                    <Heading size="md" mb={2} color="gray.900">
                      Community Votes
                    </Heading>
                    <Text size="md" color="gray.600">
                      The community votes on ideas to help us prioritize
                      development
                    </Text>
                  </Box>
                </VStack>
              </GridItem>

              <GridItem textAlign="center">
                <VStack spacing={4}>
                  <Box
                    bg="purple"
                    color="white"
                    borderRadius="full"
                    w={12}
                    h={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xl"
                    fontWeight="bold"
                  >
                    3
                  </Box>
                  <Box>
                    <Heading size="md" mb={2} color="gray.900">
                      We Build It
                    </Heading>
                    <Text size="md" color="gray.600">
                      Top-voted features get built and released to improve
                      Builder.io
                    </Text>
                  </Box>
                </VStack>
              </GridItem>
            </Grid>
          </VStack>

          {/* CTA Section */}
          <Card bg="brand.50" borderColor="brand.200">
            <CardBody>
              <VStack spacing={6} textAlign="center" py={8}>
                <Box>
                  <Heading size="lg" mb={4} color="gray.900">
                    Ready to Get Started?
                  </Heading>
                  <Text size="lg" color="gray.600" maxW="2xl" mx="auto">
                    Join hundreds of developers and designers who are helping
                    shape the future of visual development.
                  </Text>
                </Box>

                <HStack spacing={4}>
                  <Link href="/ideas">
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
                      Explore Ideas
                    </Button>
                  </Link>
                  <Link href="/roadmap">
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
                      View Roadmap
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
