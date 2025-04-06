"use client";

import {
  Box,
  Stack,
  Flex,
  Text,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { openModal } from "@/redux/features/modalSlice";
import { useAppDispatch } from "@/redux/hooks";
import FooterComponent from "../components/footer";
import Header from "../components/header";
import { ChakraWrapper } from "../chakraUIWrapper";


export default function Home() {
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
              Privacy Policy
            </Text>
            <Text fontWeight={600} lineHeight={"18px"} fontSize="20px">
            Introduction
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
          Welcome to TracTrac! This Privacy Policy is designed to help you understand how we collect, use, disclose, and safeguard your personal information. By downloading, installing, or using the TracTrac mobile application &quot;Tractrac Plus&quot;, you consent to the practices described in this Privacy Policy.

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
                Information We Collect
              </Text>
            </Stack>
          </Center>

          <Flex gap="70px" mt="20px" mb="50px">
            <Text color="#858A8F" fontSize="16px" textAlign="center">
            a. Personal Information: We may collect and store personal information you provide to us, including but not limited to your name and contact details
            <br/>
            b. Location Information: TracTrac may access your device&apos;s location to provide location-based services such as matching you with nearby tractor service providers.
            <br/>
            c. Usage Information: We collect information about how you interact with the App, including the features you use and the content you view.
            <br/>
      
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
                How We Use Your Information
              </Text>

              <Flex gap="70px" mt="20px" mb="50px">
                <Text color="#858A8F" fontSize="16px" textAlign="center">
                a. To provide and improve our services.
                <br/>
                b. To personalize your experience and facilitate efficient access to our platform.
                <br/>
                c. To respond to your inquiries, feedback, or support requests.
                <br/>
                </Text>
              </Flex>           
            </Stack>
          </Center>

          <Center my="30px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
                //   mb="16px"
              >
                Sharing Your Information
              </Text>

              <Flex gap="70px" mt="20px" mb="50px">
                <Text color="#858A8F" fontSize="16px" textAlign="center">
                We may share your information in the following circumstances:

                <br/>
                a. With tractor service providers and other users as necessary to facilitate bookings and transactions.
                <br/>
                b. With our partners, service providers, or affiliates that help us with our operations.
                <br/>
                c. In response to legal requirements, such as court orders or government requests.
                <br/>
                </Text>
              </Flex>           
            </Stack>
          </Center>

          <Center my="30px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
                //   mb="16px"
              >
                Data Security
              </Text>         
            </Stack>
          </Center>

          <Center my="30px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
                //   mb="16px"
              >
                Your Choices
              </Text>
              <Flex gap="70px" mt="20px" mb="50px">
                <Text color="#858A8F" fontSize="16px" textAlign="center">
                We may share your information in the following circumstances:

                <br/>
                a. Review and update your account information.

                <br/>
                b. Opt-out of promotional emails or push notifications.

                </Text>
              </Flex>             
            </Stack>
          </Center>

          <Center my="30px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
                //   mb="16px"
              >
                Changes to This Privacy Policy
              </Text>
              <Flex gap="70px" mt="20px" mb="50px">
                <Text color="#858A8F" fontSize="16px" textAlign="center">
                We may update this Privacy Policy to reflect changes to our practices. We will notify you of any material changes through the App or other means.

                </Text>
              </Flex>             
            </Stack>
          </Center>

          <Center my="30px">
            <Stack textAlign="center">
              <Text
                fontSize="24px"
                fontFamily="cursive"
                color="#FA9411"
                display="block"
                //   mb="16px"
              >
                 Contact Us

              </Text>
              <Flex gap="70px" mt="20px" mb="50px">
                <Text color="#858A8F" fontSize="16px" textAlign="center">
                If you have any questions, concerns, or requests related to your privacy or this Privacy Policy, please contact us at [email:info@tractrac.co; Phone Number:+234 806 464 8720].

                </Text>
              </Flex>             
            </Stack>
          </Center>


        </Box>

        <FooterComponent />

      
      </Box>
    </ChakraWrapper>
  );
}


