import React, { useState, useEffect } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  Select,
  useToast,
  useDisclosure,
  RadioGroup,
  VStack,
  Radio,
} from "@chakra-ui/react";
import { PhoneIcon, CalendarIcon, CheckCircleIcon } from "@chakra-ui/icons";
import CreateContactModal from "./../components/CreateContactModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUser, useAuth } from "../contexts/UserContext";
import Places from "../components/Place";
export default function RequestMeetingPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [timeDate, setTimeDate] = useState("");
  const [monitorLevel, setMonitorLevel] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const user = getUser();
  const userId = user._id;
  const toast = useToast();
  const navigate = useNavigate();
  const onSubmit = () => {
    axios
      .post("http://localhost:3001/api/meetings/request", {
        meetingTitle: meetingTitle,
        level: monitorLevel,
        initiatedBy: user._id,
        initiatedByEmergencyContact: selectedContact,
        phoneNumber: phoneNumber,
        location: location, // Replace with actual location
        startTime: timeDate,
      })
      .then((response) => {
        // Handle successful request
        toast({
          title: "Meeting requested.",
          description: "Your meeting has been successfully requested.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/"); // Navigate to home or another page
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
          title: "Meeting request failed.",
          description: errorMsg,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    // Fetch all emergency contacts for a user
    axios
      .get(`http://localhost:3001/api/users/${userId}/emergencyContacts`)
      .then((res) => {
        setEmergencyContacts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching emergency contacts:", err);
      });
  }, []);

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
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
        {step === 1 ? (
          <Form1
            meetingTitle={meetingTitle}
            setMeetingTitle={setMeetingTitle}
            timeDate={timeDate}
            setTimeDate={setTimeDate}
            monitorLevel={monitorLevel}
            setMonitorLevel={setMonitorLevel}
          />
        ) : null}
        {step === 2 ? (
          <Form2
            name={name}
            setName={setName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        ) : null}
        {step === 3 ? (
          <Form3
            userId={userId}
            location={location}
            setLocation={setLocation}
          />
        ) : null}
        {step === 4 ? (
          <Form4
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            emergencyContacts={emergencyContacts}
            setEmergencyContacts={setEmergencyContacts}
            userId={userId}
          />
        ) : null}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Button
              onClick={() => {
                step === 1 ? navigate(-1) : setStep(step - 1);
                setProgress(progress - 25);
              }}
              colorScheme="teal"
              variant="solid"
              w="7rem"
              mr="5%"
            >
              Back
            </Button>
            <Button
              w="7rem"
              display={step === 4 ? "none" : "block"}
              onClick={() => {
                setStep(step + 1);
                setProgress(progress + 25);
              }}
              colorScheme="teal"
              variant="outline"
            >
              Next
            </Button>
            {step === 4 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={onSubmit}
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

const Form1 = ({
  meetingTitle,
  setMeetingTitle,
  timeDate,
  setTimeDate,
  monitorLevel,
  setMonitorLevel,
}) => {
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

const Form2 = ({ name, setName, phoneNumber, setPhoneNumber }) => {
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
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </InputGroup>
    </>
  );
};

const Form3 = ({ setLocation }) => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Where are you meeting?
      </Heading>
      <Places setLocation={setLocation} />
    </>
  );
};

const Form4 = ({
  selectedContact,
  setSelectedContact,
  emergencyContacts,
  setEmergencyContacts,
  userId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const createNewContact = (newContact) => {
    axios
      .put(
        `http://localhost:3001/api/users/${userId}/emergencyContact`,
        newContact
      )
      .then((res) => {
        setEmergencyContacts((prevContacts) => [...prevContacts, res.data]);
      })
      .catch((err) => {
        console.error("Error creating new emergency contact:", err);
      });
  };

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
        Select an Emergency Contact
      </Heading>
      <Button mt={4} onClick={onOpen}>
        Create New Emergency Contact
      </Button>
      <Box mt={4}>
        <RadioGroup onChange={setSelectedContact} value={selectedContact}>
          <VStack align="start" spacing={4}>
            {emergencyContacts.map((contact, index) => {
              if (!contact || !contact._id) {
                console.error("Invalid contact:", contact);
                return null; // Skip this iteration
              }
              return (
                <Box key={index} p={4} borderWidth={1} borderRadius="md">
                  <Radio value={contact._id.toString()}>
                    <Text fontWeight="bold">{`${contact.firstName} ${contact.lastName}`}</Text>
                    <Text fontSize="sm">{`Phone: ${contact.phoneNumber}`}</Text>
                  </Radio>
                </Box>
              );
            })}
          </VStack>
        </RadioGroup>
      </Box>

      <CreateContactModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={createNewContact}
      />
    </>
  );
};
