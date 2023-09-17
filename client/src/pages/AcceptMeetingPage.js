import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import {
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { getUser, useAuth } from "../contexts/UserContext";
import CreateContactModal from "../components/CreateContactModal";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import NavBar from "../components/NavBar";
var bp = require("../Path.js");

const SelectEmergencyContact = ({
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
        bp.buildPath(`/api/users/${userId}/emergencyContact`),
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

const AcceptMeetingPage = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const user = getUser();
  if (!user) {
    navigate("/");
  }
  const [address, setAddress] = useState({});
  const handleAddress = async (address) => {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setAddress({ lat, lng });
  };

  useEffect(() => {
    axios
      .get(bp.buildPath(`/api/users/${user._id}/emergencyContacts`))
      .then((res) => {
        setEmergencyContacts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching emergency contacts:", err);
      });
    axios
      .get(
        bp.buildPath(`/api/meetings/${id ?? "65061a1021811cb7732c20e2"}`)
      )
      .then((response) => {
        console.log(response.data);
        setMeeting(response.data ?? {});
        handleAddress(response?.data?.location);
      })
      .catch((error) => {
        console.error("Error fetching meeting:", error);
      });
  }, [id]);

  const handleAccept = () => {
    console.log(user._id, selectedContact);
    axios
      .put(
        bp.buildPath(`/api/meetings/${id}/accept`),
        {
          acceptedBy: user._id,
          acceptedByEmergencyContact: selectedContact,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        navigate("/"); // Navigate back to home
      })
      .catch((error) => {
        console.error("Error accepting meeting:", error);
      });
  };

  const handleDecline = () => {
    // Add decline API call here if needed
    navigate("/"); // Navigate back to home
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100vh",
      }}
    >
      {meeting && (
        <>
          <h1 style={{ fontSize: "36px", margin: "20px" }}>
            Meeting with {meeting.requesterName}
          </h1>
          <p style={{ fontSize: "24px", margin: "20px" }}>
            Time: {new Date(meeting.startTime).toLocaleString()}
          </p>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "400px",
                margin: "20px",
              }}
              center={
                address.lat && address.lng
                  ? address
                  : { lat: 40.7128, lng: -74.006 }
              }
              zoom={15}
            >
              <MarkerF
                position={
                  address.lat && address.lng
                    ? address
                    : { lat: 40.7128, lng: -74.006 }
                }
              />
            </GoogleMap>
          )}
          <SelectEmergencyContact
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            emergencyContacts={emergencyContacts}
            setEmergencyContacts={setEmergencyContacts}
            userId={user._id}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: "40px",
            }}
          >
            <Button
              colorScheme="green"
              onClick={handleAccept}
              style={{ margin: "10px" }}
            >
              Accept
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDecline}
              style={{ margin: "10px" }}
            >
              Decline
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AcceptMeetingPage;
