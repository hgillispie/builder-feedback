import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuth } from "../../contexts/auth";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Box
      as="header"
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      px={8}
      py={4}
    >
      <Flex align="center" maxW="container.xl" mx="auto">
        {/* Builder.io Logo */}
        <Link href="/">
          <HStack cursor="pointer" spacing={3}>
            <Image
              src="https://cdn.builder.io/api/v1/image/assets%2F24272629d2bd4d1a8956cce15af1b3dc%2F3eea6d7844d747569446ee85b9577557?format=webp&width=800"
              alt="Builder.io Logo"
              height="40px"
              width="40px"
              borderRadius="lg"
            />
            <Heading size="md" color="gray.900">
              Builder Feedback
            </Heading>
          </HStack>
        </Link>
        <Spacer />

        {/* Navigation */}
        <HStack spacing={6}>
          <Link href="/ideas">
            <Button
              variant="ghost"
              color="gray.600"
              _hover={{ color: "purple" }}
            >
              Ideas
            </Button>
          </Link>
          <Link href="/submit">
            <Button
              variant="ghost"
              color="gray.600"
              _hover={{ color: "purple" }}
            >
              Submit
            </Button>
          </Link>
          <Link href="/roadmap">
            <Button
              variant="ghost"
              color="gray.600"
              _hover={{ color: "purple" }}
            >
              Roadmap
            </Button>
          </Link>

          {/* User Profile Dropdown */}
          {user && (
            <Menu>
              <MenuButton>
                <HStack spacing={2} cursor="pointer">
                  <Avatar
                    size="sm"
                    name={user.name}
                    bg="purple"
                    color="white"
                  />
                  <Text fontSize="sm" color="gray.700">
                    {user.name}
                  </Text>
                  <ChevronDownIcon color="gray.500" />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem color="gray.600">Profile</MenuItem>
                <MenuItem color="gray.600">Settings</MenuItem>
                <MenuItem color="gray.600" onClick={logout}>
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
