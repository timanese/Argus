import React, { useEffect, setState, useState } from "react";
import useMediaRecorder from "./useMediaRecorder";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import axios from "axios";
import {
  Button,
  Box,
  Heading,
  VStack,
  CircularProgress,
  Center,
} from "@chakra-ui/react";

function AudioLocationPage() {
  const [audioUrl, setAudioUrl] = useState("");
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { stream, isRecording, startRecording, stopRecording, getRecording } =
    useMediaRecorder();
  const socket = io("http://localhost:3001"); // Replace with your server URL

  useEffect(() => {
    // const socket = io("http://localhost:3001", {
    //   withCredentials: true,
    // });
    socket.emit("joinRoom", roomId); // Replace with actual room ID
    // Start the recording when the component mounts
    const interval = setInterval(async () => {
      // Get the recorded audio
      // Fetch current location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const { latitude, longitude } = position.coords;
          console.log("Latitude is :", latitude);
          console.log("Longitude is :", longitude);
          // Send the location data through socket
          socket.emit("sendLocation", {
            roomId: roomId,
            location: { lat: latitude, lng: longitude },
            meetingId: roomId,
          });
        });
      } else {
        console.log("Geolocation is not available.");
      }
      // Send the audio and location data through socket
      //   socket.emit("sendAudio", {
      //     roomId: roomId,
      //     audioBuffer: audioData,
      //     meetingId: roomId,
      //   });
      // Restart the recording
    }, 10000); // 10 seconds
    return () => {
      clearInterval(interval);
      // Optional: Stop the recording when the component unmounts
      stopRecording();
    };
  }, []);
const handleEndMeeting = () => {
  stopRecording();
  const audioBlob = getRecording(); // Assuming this returns a Blob
  console.log(audioBlob);

  if (audioBlob) {
    const reader = new FileReader();
    reader.onloadend = function(event) {
      if (event.target.readyState === FileReader.DONE) {
        const audioBuffer = event.target.result; // This is an ArrayBuffer

        // Send the audio buffer to the server
        socket.emit("sendAudio", { roomId, audioBuffer, roomId });

        // Call complete meeting API
        axios
          .put(`http://localhost:3001/api/meetings/${roomId}/complete`)
          .then((res) => {
            console.log(res.data);
            // Navigate to the dashboard
            navigate("/");
          })
          .catch((err) => {
            console.error("Error completing meeting:", err);
          });
      }
    };
    reader.readAsArrayBuffer(audioBlob);
  }
};


  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h1">Audio & Location Recording</Heading>
      <Button
        colorScheme="green"
        onClick={startRecording}
        // isDisabled={!isRecording}
      >
        Start Recording
      </Button>

      <Button
        colorScheme="red"
        onClick={handleEndMeeting}
        // isDisabled={!isRecording}
      >
        End Meeting
      </Button>

      <Center>
        <Box position="absolute">
          <Heading as="h4" size="md">
            {isRecording ? "Recording..." : "Not Recording"}
          </Heading>
        </Box>
      </Center>

      <Box mt={8}>
        {audioUrl && (
          <AudioPlayer
            style={{ width: "100%" }} // inline style for width
            autoPlay={false}
            src={audioUrl}
          />
        )}
      </Box>
    </VStack>
  );
}

export default AudioLocationPage;
