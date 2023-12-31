"use client";
import { Link as ReactRouterLink } from "react-router-dom";
import {
  Flex,
  Box,
  Link,
  Tooltip,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Checkbox,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [optedInChecked, setOptedInChecked] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Navigate to OnboardingPage after successful registration
    let user_ = { ...user};
    user_.optedInToNotifcations = optedInChecked;
    setUser(user_);
    navigate("/onboarding");
  };

  const handleInputChange = (e) => {
    if (e && e.target) {
      var { name, value } = e.target;
    }

    setUser({
      ...user,
      [name]: value,
    });
  };

  const toggleOptIn = (e) => {
    let checked = e.target.checked;
    let user_ = { ...user};
    user_.optedInToNotifcations = checked;
    setUser(user_);
    setOptedInChecked(checked);
    console.log(checked)
  };


  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign Up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Start meeting safely today ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={user ? user.firstName || "" : ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={user ? user.lastName || "" : ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                value={user ? user.email || "" : ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={user ? user.password || "" : ""}
                  name="password"
                  onChange={handleInputChange}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Tooltip
              label="By checking this box, you consent to receive text messages from Argus about promotions, updates, and important information. Message and data rates may apply."
              placement="top"
              openDelay={500}
            >
              <FormControl id="opted-in">
                <Checkbox onChange={toggleOptIn} name="optedInToNotifcations">Yes, I would like to receive text alerts.*</Checkbox>
              </FormControl>
            </Tooltip>

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSignUp}
              >
                Sign up
              </Button>
            </Stack>
            <Stack direction={{ base: "row", sm: "row" }} align={"start"}>
              <Text as={"span"}>Already have an account?</Text>
              <Link as={"span"} color={"blue.400"}>
                <ReactRouterLink to={"/login"}>Login</ReactRouterLink>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
