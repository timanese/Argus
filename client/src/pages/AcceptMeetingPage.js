import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Button } from "@chakra-ui/react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
const AcceptMeetingPage = () => {
  const { id } = useParams();
  console.log(id);
  const [meeting, setMeeting] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const navigate = useNavigate();
  const [address, setAddress] = useState({});
  const handleAddress = async (address) => {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setAddress({ lat, lng });
  };
  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/meetings/${id ?? "65061a1021811cb7732c20e2"}`
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
    axios
      .put(
        `http://localhost:3001/api/meetings/${id}/accept`,
        {
          acceptedBy: "someUserId", // Replace with actual user ID
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
  const path = [
    { lat: 40.73061, lng: -73.935242 }, // New York City
    { lat: 34.052235, lng: -118.243683 }, // Los Angeles
    { lat: 41.878113, lng: -87.629799 }, // Chicago
    { lat: 29.760427, lng: -95.369804 }, // Houston
    { lat: 33.448376, lng: -112.074036 }, // Phoenix
  ];

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
              <Marker
                position={
                  address.lat && address.lng
                    ? address
                    : { lat: 40.7128, lng: -74.006 }
                }
              />
              <Polyline path={path} options={{ strokeColor: "#FF0000 " }} />
            </GoogleMap>
          )}

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
