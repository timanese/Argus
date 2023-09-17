import { useState } from "react";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  useColorModeValue,
  FormControl,
  FormLabel,
  Switch,
  VStack,
  Input,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SubmitModal from "../components/SubmitModal";
import { useAuth } from "../contexts/UserContext";

export default function ProfilePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout} = useAuth();
  const [optedIn, setOptedIn] = useState(user && user.optedInToNotifcations);
  console.log(optedIn);
  return (
    <div>
      <NavBar />
      <Center py={6}>
        <Box
          maxW={"320px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.900")}
          rounded={"lg"}
          p={4}
          textAlign={"center"}
        >
          <Avatar
            size={"xl"}
            src={
              "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
            }
            mb={4}
            pos={"relative"}
          />
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            {user && user.firstName} {user && user.lastName}
          </Heading>
          <Text fontWeight={600} color={"gray.500"}>
            {user && user.email}
          </Text>
          <Text fontWeight={600} color={"gray.500"} mb={2}>
            {user && user.phoneNumber}
          </Text>
        </Box>
      </Center>
      <Center>
        <VStack spacing={8}>
          <Box
            maxW={"320px"}
            w={"full"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
          >
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0" px="0">
                Enable push notifications
              </FormLabel>
              <Switch
                onChange={(e) => {
                  setOptedIn(e.target.checked);
                }}
                isChecked={optedIn}
                id="email-alerts"
                px="3"
                size="lg"
              />
            </FormControl>
          </Box>

          <Box
            maxW={"320px"}
            w={"full"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
          >
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0" px="2" pr="4">
                Edit Personal Address
              </FormLabel>
              <Button
                colorScheme="teal"
                variant="solid"
                size="sm"
                onClick={onOpen}
              >
                Edit
              </Button>
            </FormControl>
          </Box>
          <Box
            maxW={"320px"}
            w={"full"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
          >
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0" px="2" pr="8">
                Edit Phone Number
              </FormLabel>
              <Button
                colorScheme="teal"
                variant="solid"
                size="sm"
                onClick={onOpen}
              >
                Edit
              </Button>
            </FormControl>
          </Box>
        </VStack>
      </Center>
      <Center>
        <Button px={32} colorScheme="red" onClick={logout} mt={6}>
          Log Out
        </Button>
      </Center>
    </div>
  );
}
