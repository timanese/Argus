"use client";
import { Link as ReactRouterLink } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Link,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Login For Safe Meetups</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Argus - safety is a priority
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
              <Input type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Button
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
