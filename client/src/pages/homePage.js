import React from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons"; // Import the AddIcon
import NavBar from "../components/NavBar";

function StatsCard(props) {
  const { name, location } = props;
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
        {name}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
        {location}
      </StatNumber>
    </Stat>
  );
}

export default function HomePage() {
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
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={{ base: 5, lg: 8 }}
              >
                <StatsCard
                  name={"Lewis Brandy"}
                  location={"1234 56th street plantation fl, 32908"}
                />
                <StatsCard
                  name={"Melissa Courtwood"}
                  location={"1234 56th street plantation fl, 32908"}
                />
                <StatsCard
                  name={"John John"}
                  location={"1234 56th street plantation fl, 32908"}
                />
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={{ base: 5, lg: 8 }}
              >
                <StatsCard
                  name={"Lewis Brandy2"}
                  location={"1234 56th street plantation fl, 32908"}
                />
                <StatsCard
                  name={"Melissa Courtwood2"}
                  location={"1234 56th street plantation fl, 32908"}
                />
                <StatsCard
                  name={"John John2"}
                  location={"1234 56th street plantation fl, 32908"}
                />
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/* Add the circular button with the plus icon */}
        <IconButton
          icon={<AddIcon />}
          isRound
          size="lg"
          colorScheme="teal"
          position="fixed"
          bottom="4"
          right="4"
        />
      </Box>
    </div>
  );
}
