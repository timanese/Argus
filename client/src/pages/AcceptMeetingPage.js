import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button } from "@chakra-ui/react";

const AcceptMeetingPage = () => {
  const { id } = useParams();
  console.log(id);
  const [meeting, setMeeting] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/meetings/${id ?? "65061a1021811cb7732c20e2"}`
      )
      .then((response) => {
        setMeeting(response.data ?? {});
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
                meeting.location ?? {
                  lat: 40.7128,
                  lng: -74.006,
                }
              }
              zoom={15}
            >
              <Marker
                position={
                  meeting.location ?? {
                    lat: 40.7128,
                    lng: -74.006,
                  }
                }
              />
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
