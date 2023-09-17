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
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

import { useToast } from "@chakra-ui/react";
import { useAuth } from "../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form1 = () => {
  const { user, setUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Enter Phone Number
      </Heading>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <PhoneIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="tel"
          name="phoneNumber"
          value={user ? user.phoneNumber || "" : ""}
          onChange={handleInputChange}
          placeholder="Phone number"
        />
      </InputGroup>
    </>
  );
};

const Form2 = () => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Enter Personal Address
      </Heading>
      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          Country / Region
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        >
          <option>United States</option>
          <option>Canada</option>
          <option>Mexico</option>
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="street_address"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Street address
        </FormLabel>
        <Input
          type="text"
          name="street_address"
          id="street_address"
          autoComplete="street-address"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
        <FormLabel
          htmlFor="city"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          City
        </FormLabel>
        <Input
          type="text"
          name="city"
          id="city"
          autoComplete="city"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="state"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          State / Province
        </FormLabel>
        <Input
          type="text"
          name="state"
          id="state"
          autoComplete="state"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="postal_code"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          ZIP / Postal
        </FormLabel>
        <Input
          type="text"
          name="postal_code"
          id="postal_code"
          autoComplete="postal-code"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>
    </>
  );
};

const Form3 = () => {
  const { user, setUser } = useAuth();

  const handleInputChange = (e, i) => {
    const { name, value } = e.target;
    if (!user.emergencyContacts) {
      setUser({ ...user, emergencyContacts: [] });
    }
    const updatedContacts = [...(user.emergencyContacts || [])];
    updatedContacts[i] = { ...(updatedContacts[i] || {}), [name]: value };
    console.log(user);
    setUser({ ...user, emergencyContacts: updatedContacts });
  };

  const [value, setValue] = useState(0);
  const handleChange = (value) => setValue(value);
  const components = [];
  for (let i = 0; i < value; i++) {
    components.push(
      <div key={i}>
        <Text>{"Emergency Contact " + (i + 1)} </Text>
        <Flex pb={4}>
          <FormControl mr="5%">
            <Input
              id="first-name"
              name="firstName"
              value={
                user && user.emergencyContacts && user.emergencyContacts[i]
                  ? user.emergencyContacts[i].firstName || ""
                  : ""
              }
              onChange={(e) => handleInputChange(e, i)} // Pass index 'i' here
              placeholder="First name"
            />
          </FormControl>

          <FormControl>
            <Input
              id="last-name"
              name="lastName"
              value={
                user && user.emergencyContacts && user.emergencyContacts[i]
                  ? user.emergencyContacts[i].lastName || ""
                  : ""
              }
              onChange={(e) => handleInputChange(e, i)} // Pass index 'i' here placeholder="First name" />
            />
          </FormControl>
        </Flex>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <PhoneIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="tel"
            name="phoneNumber"
            value={
              user && user.emergencyContacts && user.emergencyContacts[i]
                ? user.emergencyContacts[i].phoneNumber || ""
                : ""
            }
            onChange={(e) => handleInputChange(e, i)} // Pass index 'i' here placeholder="Phone number" />
          />
        </InputGroup>
        <Divider p={1} />
      </div>
    );
  }
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
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
      <Box>{components}</Box>
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
        navigate("/onboarding");
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
