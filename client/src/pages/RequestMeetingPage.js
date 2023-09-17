"use client";

import { useState } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  Divider,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  SliderTrack,
  Slider,
  Stack,
  SliderFilledTrack,
  InputLeftElement,
  SliderThumb,
  Text,
  Checkbox,
  Radio,
  RadioGroup, 
} from "@chakra-ui/react";
import { PhoneIcon, CalendarIcon, CheckCircleIcon } from "@chakra-ui/icons";

import { useToast } from "@chakra-ui/react";
import { useAuth } from "../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form1 = () => {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [timeDate, setTimeDate] = useState("");
  const [monitorLevel, setMonitorLevel] = useState(1);
  
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Where and When?
      </Heading>
      <Text mt={4}>Meeting Title</Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CheckCircleIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          name="meetingTitle"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          placeholder="Coffee chat with John Doe"
        />
      </InputGroup>
      <Text mt={4}>Meeting Date and Time</Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CalendarIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="datetime-local"
          name="meetingDateTime"
          value={timeDate}
          onChange={(e) => setTimeDate(e.target.value)}
        />
      </InputGroup>
      <Text mt={4}>Monitor Level</Text>
      <InputGroup>
        <Select
          name="monitorLevel"
          value={monitorLevel}
          onChange={(e) => setMonitorLevel(e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
        </Select>
      </InputGroup>
    </>
  );
};

const Form2 = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Who are you meeting with?
      </Heading>
      
      <Text mt={4}>Name</Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CheckCircleIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
      </InputGroup>
      <Text mt={4}>Phone Number</Text>
     <InputGroup>
          <InputLeftElement pointerEvents="none">
            <PhoneIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="tel"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} // Pass index 'i' here placeholder="Phone number" />
          />
        </InputGroup>
      
    </>
  );
};

const Form3 = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  return (
    <>
      {/* <Heading w="100%" textAlign={"center"} fontWeight="normal">
        Enter Emergency Contacts
      </Heading>
      <FormLabel fontWeight={"normal"}>
        How many emergency contacts do you have?
      </FormLabel>
      <Slider
        max="5"
        focusThumbOnChange={false}
        value={value}
        onChange={handleChange}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" children={value} />
      </Slider>
      <Box>{components}</Box> */}
    </>
  );
};

export default function OnboardingPage() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = () => {
    // Data validation can be added here
    axios
      .post("http://localhost:3001/api/users/register", user)
      .then((response) => {
        // Handle successful registration. Maybe update the user object or redirect to login/dashboard.
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      })
      .catch((error) => {
        // Handle errors
        let errorMsg = error.message;
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMsg = error.response.data.message;
        }
        toast({
          title: "Account creation failed.",
          description: errorMsg,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        ></Progress>
        {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Back
              </Button>
              <Button
                w="7rem"
                display={step === 3 ? "none" : "block"}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={onSubmit} // <-- Add this line
              >
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  );
}
