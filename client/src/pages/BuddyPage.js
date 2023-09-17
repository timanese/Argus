import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from "@chakra-ui/react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css"; // Styles

const containerStyle = {
  width: "100%",
  height: "60vh",
};

const center = {
  lat: 40.7128,
  lng: -74.006,
};

const BuddyPage = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [gpsLogs, setGpsLogs] = useState([]);
  const [audioLogs, setAudioLogs] = useState([]);
  const [buddyLocation, setBuddyLocation] = useState({
    lat: 40.7128,
    lng: -74.006,
  });

  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toast = useToast();
  const [meeting, setMeeting] = useState(null);
  const location = useLocation();

  // Extract the meeting ID from the query parameters
  const searchParams = new URLSearchParams(location.search);
  const meetingId = searchParams.get("meetingId");

  useEffect(() => {
    // Fetch the meeting by its ID
    const fetchMeeting = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/meetings/${meetingId}`
        );
        const meetingData = response.data;
        setMeeting(meetingData);
        setGpsLogs(meetingData.gpsLogs || []);
        setAudioLogs(meetingData.audioLogs || []);

        // Set the buddy location based on the last log in gpuLogs
        if (meetingData.gpsLogs && meetingData.gpsLogs.length > 0) {
          setBuddyLocation(meetingData.gpsLogs[meetingData.gpsLogs.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching the meeting:", error);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  const handleSubmitReport = () => {
    toast({
      title: "Report Submitted.",
      description: "Your report has been successfully submitted.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    closeReportModal();
  };
  const handleAudioSelection = (event) => {
    const selectedId = event.target.value;
    const selected = audioLogs.find(
      (audio) => audio.id === parseInt(selectedId)
    );
    setSelectedAudio(selected);
  };

  const openReportModal = () => setReportModalOpen(true);
  const closeReportModal = () => setReportModalOpen(false);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <div>
      {/* Map with buddy location */}
      <div id="buddyMap">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={buddyLocation}
            zoom={15}
          >
            <Marker position={center} />
          </GoogleMap>
        )}
      </div>

      {/* Report Button and Modal */}
      <Button
        colorScheme="red"
        onClick={openReportModal}
        mt="4"
        mx="auto"
        display="block"
      >
        Report
      </Button>

      <Modal isOpen={isReportModalOpen} onClose={closeReportModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Select category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="unsafe">Unsafe Situation</option>
              <option value="rules">Breaking Rules</option>
              <option value="norms">Breaking Social Norms</option>
              <option value="other">Other</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmitReport}
              isDisabled={!selectedCategory}
            >
              Submit
            </Button>
            <Button variant="ghost" onClick={closeReportModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Dropdown of Archived Audio Players with Timestamps */}
      <div id="archivedAudioPlayers">
        <Select
          placeholder="Select archived audio"
          onChange={handleAudioSelection}
        >
          {audioLogs.map((audio) => (
            <option key={audio.id} value={audio.id}>
              {audio.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Audio Player */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {selectedAudio && (
          <AudioPlayer
            style={{ width: "80%" }} // inline style for width
            autoPlay={false}
            src={selectedAudio.url}
          />
        )}
      </div>
    </div>
  );
};

export default BuddyPage;
