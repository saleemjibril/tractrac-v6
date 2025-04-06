"use client";
import {
    Box,
    Stack,
    Flex,
    Text,
    Image,
  } from "@chakra-ui/react";
import Link from "next/link";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function GetMobileAppComponent() {
    return (
      <ChakraWrapper>
      <Box
        width={"100%"}
        // height={"535px"}
        bgColor="#F8A730"
      >
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          justifyContent="center"
          alignItems="center"
          gap="50px"
          color="white"
          pt="50px"
        >
          <Image src="images/hand.svg" alt="" width="300px" />
          <Stack>
            <Text
              fontSize={{ base: "24px", md: "50px" }}
              lineHeight={{ base: "30px", md: "54px" }}
              fontWeight={700}
            >
              Get the TracTrac <br /> mobile app
            </Text>
            <Text my="16px">
              Request, Enlist and Invest in Tractors on the GO!
            </Text>
            <Stack direction="row" gap="16px" justify="center">
              <Link href="https://play.google.com/store/apps/details?id=com.tractrac.trac_trac&hl=en_GB">
                <Image
                  src="images/google-play.svg"
                  alt=""
                  width={{ base: "150px", md: "240px" }}
                />
              </Link>
              <Image
                src="images/app-store.svg"
                alt=""
                width={{ base: "150px", md: "240px" }}
              />
            </Stack>
          </Stack>
        </Flex>
      </Box>
      </ChakraWrapper>
    );
  }