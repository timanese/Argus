import React, { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  IconButton
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../contexts/UserContext";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons"; // Import the AddIcon
import NavBar from "../components/NavBar";
import SubmitModal from "./../components/SubmitModal"; // Import the SubmitModal component
import RequestMeetingPage from "./RequestMeetingPage";

function StatsCard(props) {
  // const { name, location } = props;
  const { meetingTitle, startTime, location, level, status } = props;

  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <StatLabel fontWeight={"medium"} isTruncated>
        {meetingTitle}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
        {startTime}
      </StatNumber>
      <StatLabel fontWeight={"medium"} isTruncated>
        {location}
      </StatLabel>
      <StatLabel fontWeight={"medium"} isTruncated>
        {status}
      </StatLabel>
      <StatLabel fontSize={"xs"} fontWeight={"medium"} isTruncated>
        {level}
      </StatLabel>
    </Stat>
  );
}

// export default function HomePage() {
//   return (
//     <div>
//       <NavBar />
//       <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
//         <Tabs isFitted variant="enclosed">
//           <TabList mb="1em">
//             <Tab>Current Meetings</Tab>
//             <Tab>Previous Meetings</Tab>
//           </TabList>
//           <TabPanels>
//             <TabPanel>
//               <SimpleGrid
//                 columns={{ base: 1, md: 3 }}
//                 spacing={{ base: 5, lg: 8 }}
//               >
//                 <StatsCard
//                   name={"Lewis Brandy"}
//                   location={"1234 56th street plantation fl, 32908"}
//                 />
//                 <StatsCard
//                   name={"Melissa Courtwood"}
//                   location={"1234 56th street plantation fl, 32908"}
//                 />
//                 <StatsCard
//                   name={"John John"}
//                   location={"1234 56th street plantation fl, 32908"}
//                 />
//               </SimpleGrid>
//             </TabPanel>
//             <TabPanel>
//               <SimpleGrid
//                 columns={{ base: 1, md: 3 }}
//                 spacing={{ base: 5, lg: 8 }}
//               >
//                 <StatsCard
//                   name={"Lewis Brandy2"}
//                   location={"1234 56th street plantation fl, 32908"}
//                 />
//                 <StatsCard
//                   name={"Melissa Courtwood2"}
//                   location={"1234 56th street plantation fl, 32908"}
//                 />
//                 <StatsCard
//                   name={"John John2"}
//                   location={"1234 56th street plantation fl, 32908"}
//                 />
//               </SimpleGrid>
//             </TabPanel>
//           </TabPanels>
//         </Tabs>
//         {/* Add the circular button with the plus icon */}
//         <IconButton
//           icon={<AddIcon />}
//           isRound
//           size="lg"
//           colorScheme="teal"
//           position="fixed"
//           bottom="4"
//           right="4"
//         />
//       </Box>
//     </div>
//   );
// }

export default function HomePage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [currentMeetings, setCurrentMeetings] = useState([]);
  const [previousMeetings, setPreviousMeetings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Step 2
  const userId = user._id;
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/api/meetings/${userId}/getAll`)
      .then((res) => {
        setMeetings(res.data.meetings);
        console.log(res.data.meetings);
      })
      .catch((err) => {
        console.error("Error fetching meetings:", err);
      });
  }, []);

  useEffect(() => {
    // Filter meetings into 'current' and 'previous' based on their 'status'
    const current = meetings.filter((meeting) => meeting.status !== "completed");
    const previous = meetings.filter((meeting) => meeting.status === "completed");

    setCurrentMeetings(current);
    setPreviousMeetings(previous);
  }, [meetings]);

  return (
    <div>
      <NavBar />
      <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Current Meetings</Tab>
            <Tab>Previous Meetings</Tab>
          </TabList>
      <TabPanels>
        <TabPanel>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            {currentMeetings.map((meeting, index) => (
              <StatsCard
                key={index}
                meetingTitle={meeting.meetingTitle} // Replace with the actual field name
                name={meeting.initiatedBy.name} // Replace with the actual field name
                location={meeting.location}
                startTime={meeting.startTime}
                level={meeting.level}
                status={meeting.status}
              />
            ))}
          </SimpleGrid>
        </TabPanel>
        <TabPanel>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            {previousMeetings.map((meeting, index) => (
              <StatsCard
                key={index}
                name={meeting.initiatedBy.name} // Replace with the actual field name
                location={meeting.location}
              />
            ))}
          </SimpleGrid>
         </TabPanel>
        </TabPanels>
         </Tabs>
         <SubmitModal
        title="Request a Meeting"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        />
        {/* Step 3 */}
        <IconButton
          icon={<AddIcon />}
          isRound
          size="lg"
          colorScheme="teal"
          position="fixed"
          bottom="4"
          right="4"
          onClick={() => navigate("/requestMeeting")} // Open the modal when clicked
        />
      </Box>
    </div>
  );
}