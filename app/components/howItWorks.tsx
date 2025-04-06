"use client";
import {
  Box,
  Stack,
  Flex,
  Text,
  Button,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ChakraWrapper } from "../chakraUIWrapper";


function TabContent({
  title,
  content,
  icon,
}: {
  title: ReactNode;
  content: string;
  icon: string;
}) {
  const router = useRouter();

  return (
    <TabPanel
      p={0}
      bgColor="#33333380"
      pr={{ base: "0px", md: "30px" }}
      pb={{ base: "20px", md: "60px" }}
      borderBottomLeftRadius="10px"
      borderBottomRightRadius="10px"
      position="relative"
    >
      <Flex
        bgImage="url('images/tab-bg.svg')"
        bgPosition="60% center"
        bgRepeat="no-repeat"
        height={{ base: "100%", lg: "450px" }}
        bgColor="#FFFFFF"
        ml={{ base: "0px", md: "-30px" }}
        borderRadius="10px"
        color="black"
        alignItems={{ base: "start", md: "center" }}
        px="60px"
        py="40px"
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        gap={{ base: "20px", md: "0px" }}
        position="relative"
      >
        <Box>
          {title}
          <Button
            mt="20px"
            height="40px"
            bgColor="#FA9411"
            color="#FFFFFF"
            fontSize="12px"
            minW="194px"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </Button>
        </Box>
        <Stack
          width={{ base: "100%", lg: "50%" }}
          align={{ base: "start", md: "end" }}
        >
          <Image src={`icons/${icon}.svg`} alt="" width="120px" />
          <Text mt="12px">
            {content} <br />
            <strong>
              Click the &quot;sign up&quot; button to get started.
            </strong>
          </Text>
        </Stack>
      </Flex>
    </TabPanel>
  );
}


export default function HowItWorksComponent() {
  return (
    <ChakraWrapper>
    <Box
      bgColor="#FFFFDB"
      position="relative"
      py="80px"
      px={{ base: "2em", md: "8em" }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: "75%",
        background: "#FA9411",
        // "z-index": "1",
        transform: "skewX(30deg)",
        transformOrigin: "bottom right 60px",
      }}
      // height="300px"
      color={{ base: "black", md: "white" }}
    >
      <Box position="relative">
        <Text fontSize="24px" fontFamily="cursive">
          How it works
        </Text>
        <Text fontSize="28px" fontWeight={700} lineHeight="38px" mt="4px">
          Driving Growth, Harvesting <br />
          Success
        </Text>

        <Tabs variant="unstyled" isFitted mt="20px" borderRadius="10px">
          <TabList flexDir={{ base: "column", md: "row" }}>
            <Tab
              _selected={{ color: "white", bg: "#33333380", fontSize: "18px" }}
              bg="#333333"
              borderTopLeftRadius="10px"
              borderTopRightRadius={{ base: "10px", md: "0px" }}
              height="70px"
              color="white"
            >
              Step 1
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#33333380", fontSize: "18px" }}
              bg="#333333"
              height="70px"
              color="white"
            >
              Step 2
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#33333380", fontSize: "18px" }}
              bg="#333333"
              height="70px"
              color="white"
            >
              Step 3
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#33333380", fontSize: "18px" }}
              bg="#333333"
              height="70px"
              borderTopRightRadius={{ base: "0px", md: "10px" }}
              color="white"
            >
              Step 4
            </Tab>
          </TabList>
          <TabPanels
            bgColor="#33333380"
            borderBottomLeftRadius="10px"
            borderBottomRightRadius="10px"
            position="relative"
          >
            <TabContent
              title={
                <Text fontSize="28px" fontWeight={700} lineHeight="34px">
                  Create an <br /> Account
                </Text>
              }
              content="Fill out our form to create an account.  You will be redirected to our services page after successfully creating an account and verifying your identity."
              icon="profilecircle"
            />
            <TabContent
              title={
                <Text fontSize="28px" fontWeight={700} lineHeight="34px">
                  Click on the services <br /> you are interested in
                </Text>
              }
              content="The service page has a comprehensive list of our services. Select your preferred service offering and follow the prompts!"
              icon="services"
            />
            <TabContent
              title={
                <Text fontSize="28px" fontWeight={700} lineHeight="34px">
                  Visit your dashboard.
                </Text>
              }
              content="The dashboard allows all users access their status and track their activities on the tractrac platform. 
              The dashboard also provides a global view of the activities on the tractrac platform."
              icon="business"
            />
            <TabContent
              title={
                <Text fontSize="28px" fontWeight={700} lineHeight="34px">
                  Complete your Profile
                </Text>
              }
              content="Within Accounts, you can access your profile and provide the information needed to complete your profile. 
              On your profile page, you can reset your password as well"
              icon="profilecircle"
            />
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
    </ChakraWrapper>
  );
}