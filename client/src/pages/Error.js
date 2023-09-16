import React from "react";
import { Stack, Text, Link, Center, useDisclosure } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { Link as ReactRouterLink } from "react-router-dom";

export default function ErrorPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <NavBar />
      <Center>
        <Text fontSize="4xl">404</Text>
      </Center>
      <Center>
        <Text as={"span"}>Argus is Down - u on your own</Text>
      </Center>

      <Center>
        <Link as={"span"} color={"blue.400"}>
          <ReactRouterLink to={"/"}>Return Home</ReactRouterLink>
        </Link>
      </Center>
    </div>
  );
}
