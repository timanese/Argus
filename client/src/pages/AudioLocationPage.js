import React, { useEffect, setState, useState } from "react";
import useMediaRecorder from "./useMediaRecorder";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import {
  Button,
  Box,
  Heading,
  VStack,
  CircularProgress,
  Center,
  Container,
  Flex,
} from "@chakra-ui/react";

function AudioLocationPage() {
  const [audioUrl, setAudioUrl] = useState("");
  const { id: roomId } = useParams();
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
    const audioURL = getRecording();
    console.log(audioURL);

    if (audioURL) {
      const url = URL.createObjectURL(audioURL);
      setAudioUrl(url);
      // Send the audio URL or data to the server
      socket.emit("sendAudio", { roomId, audioBuffer: audioURL });
    }

    // Perform any other actions needed to end the meeting
  };

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Container maxW="100%" height="90%" centerContent>
        <VStack
          spacing={6}
          align="stretch"
          p={6}
          border="1px"
          borderRadius="md"
          boxShadow="md"
        >
          <Heading as="h1" size="2xl">
            Audio & Location Recording
          </Heading>

          <Button colorScheme="green" onClick={startRecording}>
            Start Recording
          </Button>

          <Button colorScheme="red" onClick={handleEndMeeting}>
            End Meeting
          </Button>

          <Center>
            <Box>
              <Heading as="h4" size="md">
                {isRecording ? "Recording..." : "Not Recording"}
              </Heading>
            </Box>
          </Center>

          <Box mt={8}>
            <AudioPlayer
              style={{ width: "100%" }} // inline style for width
              autoPlay={false}
              src={audioUrl}
            />
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}

export default AudioLocationPage;
