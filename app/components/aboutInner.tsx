"use client";

import {
  Box,
  ButtonGroup,
  Stack,
  Flex,
  Text,
  Link,
  Button,
  IconButton,
  useColorModeValue,
  Divider,
  Image,
  Input,
  Center,
  Drawer,
  useDisclosure,
  DrawerContent,
  FlexProps,
  CloseButton,
  Img,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaUsers,
  FaLightbulb,
  FaShieldAlt,
  FaLeaf,
  FaHandshake,
  FaHeart,
} from "react-icons/fa";
import { openModal } from "@/redux/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import FooterComponent from "../components/footer";
import Header from "../components/header";
import { ChakraWrapper } from "../chakraUIWrapper";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends FlexProps {
  onClose: () => void;
}

const LinkItems: Array<{ name: string; path: string }> = [
  {
    name: "Home",
    path: `/`,
  },
  { name: "About", path: "#" },
  { name: "Services", path: "/services" },
  {
    name: "Contact Us",
    path: "/contact",
  },
  {
    name: "Blog",
    path: "/blog",
  },
];

const coreValues = [
  {
    icon: FaUsers,
    title: "Inclusion",
    description: "We believe in creating opportunities for all farmers, regardless of their size or resources, ensuring equal access to mechanization services across Africa.",
    color: "#f8a730"
  },
  {
    icon: FaLightbulb,
    title: "Innovation",
    description: "We continuously develop cutting-edge solutions and technologies to transform agricultural mechanization and improve farming efficiency.",
    color: "#f8a730"
  },
  {
    icon: FaShieldAlt,
    title: "Accountability",
    description: "We take responsibility for our actions and commitments, maintaining transparency and trust with our stakeholders and farming communities.",
    color: "#f8a730"
  },
  {
    icon: FaLeaf,
    title: "Sustainability",
    description: "We promote environmentally responsible practices and long-term solutions that protect the land while enhancing agricultural productivity.",
    color: "#f8a730"
  },
  {
    icon: FaHandshake,
    title: "Collaboration",
    description: "We foster partnerships with farmers, investors, and stakeholders to create a unified approach to agricultural mechanization.",
    color: "#f8a730"
  },
  {
    icon: FaHeart,
    title: "Respect",
    description: "We honor the dignity and expertise of farmers, treating every individual with consideration and valuing their contribution to food security.",
    color: "#f8a730"
  },
];

export default function AboutInner() {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showModal = (type: string) => {
    dispatch(openModal(type));
  };

  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />
        <Center mb="30px">
          <Stack mt="60px" textAlign="center">
            <Text
              fontSize="24px"
              fontFamily="cursive"
              color="#FA9411"
              display="block"
            >
              About the Idea
            </Text>
            <Text fontWeight={600} lineHeight={"18px"} fontSize="20px">
              The story and values behind <br /> our company
            </Text>
          </Stack>
        </Center>

        <Box
          margin={"0 auto"}
          pr="20px"
          pl="20px"
          width={"100%"}
          maxWidth={"1440px"}
        >
          <Text color="#858A8F" fontSize="16px" textAlign="center" mb="50px">
            Our vision is to improve the lives of small holder farmers by
            facilitating a convergence for private sector investments in the
            agricultural mechanization process and technology to access
            affordable tractor services across Africa. A convergence where
            farmers and cooperatives-led tractor hiring services providers can
            own their own tractors and have access to technology that improves
            the utilization of their tractors. Ultimately, we will catalyze the
            development of competitive and sustainable mechanization market and
            agribusiness in Africa as a pathway to increased economic growth and
            food security in the continent of Africa. Recognizing that
            agriculture in Nigeria will remain a labor-intensive sector,
            increasing agricultural productivity, facilitating value chain
            integration, and directing investment toward the agriculture sector
            will enhance employment opportunities for unskilled labor,
            contribute to regional food security and stability, and provide one
            of the most useful vehicles for moving populations out of extreme
            poverty.
          </Text>

          <Center my="30px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
              >
                Our Mission
              </Text>
              <Text fontWeight={600} lineHeight={"18px"} fontSize="20px">
                Driving Growth, Cultivating <br />
                Prosperity
              </Text>
            </Stack>
          </Center>

          <Flex gap="70px" mt="20px" mb="50px">
            <Text color="#858A8F" fontSize="16px" textAlign="center">
              Financing tractors for small holder farmers has been a daunting
              challenge. From the rise in exchange rate to the hurdles of
              meeting banks&apos; requirement, small holder farmers across
              Nigeria and Africa at large are unable to own tractors. Owning one
              is out of their league, yet they constitute 70% of farmers in Sub
              Saharan Africa. Access to affordable finance also affects the
              community or cooperative-led Mechanization service provider which
              also limits the number tractors in their fleet. Ultimately, it is
              the small holder farmer that is losing. TracTrac has worked hard
              to create solutions for potential investors and enterprising
              youths that are simple and intuitive. We have created a platform
              for investors to participate in the Agric mechanization space,
              ensure tractors are available to users and make a good return.
            </Text>
          </Flex>

          <Center my="30px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
              >
                Our Vision
              </Text>
              <Text fontWeight={600} lineHeight={"18px"} fontSize="20px">
                Leading a Mechanization Revolution <br />
                in Africa
              </Text>
            </Stack>
          </Center>

          <Flex
            gap={{ base: "30px", md: "70px" }}
            flexDir={{ base: "column", md: "row" }}
          >
            <VisionComponent
              counter="01"
              title="Affordable tractor financing"
              content=" Access to low cost of funding for tractors procurement and
            acquisition"
            />
            <VisionComponent
              counter="02"
              title="Innovation"
              content="Enhance procurement of tractors and genuine spare parts from vendors and manufacturers."
            />
          </Flex>

          <Flex
            justifyContent="center"
            mt={{ base: "30px", md: "67px" }}
            mb="103px"
          >
            <Box w={{ base: "100%", md: "40vw" }}>
              <VisionComponent
                counter="03"
                title="Boost Tractor density"
                content="Increase in the number of tractors per hectare of farmland in Nigeria and Africa which is presently low."
              />
            </Box>
          </Flex>

          {/* Core Values Section */}
          <Center my="60px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
              >
                Our Core Values
              </Text>
              <Text fontWeight={600} lineHeight={"18px"} fontSize="20px">
                The principles that guide <br />
                everything we do
              </Text>
            </Stack>
          </Center>

          <Box mb="100px">
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: "30px", md: "40px" }}
              mt="40px"
            >
              {coreValues.map((value, index) => (
                <CoreValueCard
                  key={index}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  color={value.color}
                  delay={index * 0.1}
                />
              ))}
            </SimpleGrid>
          </Box>
        </Box>

        <FooterComponent />
      </Box>
    </ChakraWrapper>
  );
}

function VisionComponent({
  counter,
  title,
  content,
}: {
  counter: string;
  title: string;
  content: string;
}) {
  return (
    <Box bgColor="#F9F9F9" py="39px" px="27px" borderRadius="30px">
      <Flex
        gap={{ base: "20px", md: "40px" }}
        alignItems="center"
        flexDir={{ base: "column", md: "row" }}
      >
        <Box bgColor="#FA9411" borderRadius="23px" px="12px" py="18px">
          <Center>
            <Text fontSize="60px" fontWeight="700" color="white">
              {counter}
            </Text>
          </Center>
        </Box>
        <Stack textAlign={{ base: "center", md: "left" }}>
          <Text fontWeight={700} fontSize="25px" lineHeight="24px">
            {title}
          </Text>
          <Text fontSize="16px" color="#797979" mt="4px">
            {content}
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
}

function CoreValueCard({
  icon: IconComponent,
  title,
  description,
  color,
  delay,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <Box
      bgColor="white"
      borderRadius="20px"
      p="30px"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
      border="1px solid #f0f0f0"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        width="60px"
        height="60px"
        bgColor={color}
        opacity="0.1"
        borderRadius="50%"
      />
      
      <Stack spacing="20px" align="center" textAlign="center">
        <Box
          bgColor={color}
          borderRadius="50%"
          p="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow={`0 4px 15px ${color}30`}
        >
          <IconComponent size="28px" color="white" />
        </Box>
        
        <Stack spacing="12px">
          <Text
            fontSize="22px"
            fontWeight="700"
            color="#2D3748"
            lineHeight="26px"
          >
            {title}
          </Text>
          <Text
            fontSize="14px"
            color="#666"
            lineHeight="20px"
            textAlign="center"
          >
            {description}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}