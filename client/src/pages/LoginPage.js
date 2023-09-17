"use client";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Link,
  Stack,
  Center,
  Button,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/UserContext";
import { useRef, useState } from "react";
import { useToast } from "@chakra-ui/react";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login , user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      setLoading(true);
      const tempUser = await login(email, password);
      setLoading(false);
      navigate("/")
    } catch (error) {
      console.log(error)
      toast({
        title: "Login failed.",
        description: "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // If Enter key is pressed, submit the form
      handleLogin();
    }
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
          <Center><Heading fontSize={"4xl"}>🛡️Argus🛡️</Heading></Center>
          <Text fontSize={"lg"} color={"gray.600"}>
            Connect with Confidence
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input onKeyDown={handleKeyPress} value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Button
              disabled={loading}
              onClick={handleLogin}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
            </Stack>
            <Stack
                direction={{ base: "row", sm: "row" }}
                align={"start"}
              >
                <Text as={"span"}>Don't have an account?</Text>
                <Link as={"span"} color={"blue.400"}>
                  <ReactRouterLink to={"/register"}>Register</ReactRouterLink>
                </Link>
              </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
