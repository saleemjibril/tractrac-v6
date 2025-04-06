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
  // NavItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import { MdCheckCircle } from "@chakra-ui/icons";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,

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
  // {
  //   name: "Careers",
  //   path: "#",
  // },
  {
    name: "Blog",
    path: "/blog",
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
              //   mb="16px"
            >
              About the Idea
            </Text>
            <Text fontWeight={600} lineHeight={"18px"} fontSize="20px">
              The story and values behind <br /> our company
            </Text>
          </Stack>
        </Center>

        <Box
          maxW={{ base: "100%", md: "80vw" }}
          margin={"0 auto"}
          px={{ base: "20px", md: "0px" }}
        >
          {/* <Flex gap="24px" mb="30px" flexDir={{ base: "column", md: "row" }}>
            <Box width={{ base: "100%", md: "60%" }}>
              <Image
                src="/images/about-banner-1.svg"
                alt="About page banner one"
                w="100%"
                borderRadius="50px"
              />
            </Box>
            <Box width={{ base: "100%", md: "40%" }}>
              <Image src="/images/about-2.svg" alt="About page banner two" />
            </Box>
          </Flex> */}
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
                //   mb="16px"
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
            {/* <Image src="/images/about-3.svg" alt="About page banner three" /> */}
          </Flex>

          <Center my="30px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
                //   mb="16px"
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
        </Box>

        <FooterComponent />

        
      </Box>
      </ChakraWrapper>
    )
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