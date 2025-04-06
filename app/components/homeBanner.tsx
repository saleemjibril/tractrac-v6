"use client";
import { useRouter } from "next/navigation";
import {
    Box,
    Text,
    Button,
  } from "@chakra-ui/react";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function HomeBanner() {
    const router = useRouter();
  
    return (
      <ChakraWrapper>
      <Box
        position={"relative"}
        width={"100%"}
        height={{ base: "350px", md: "535px" }}
        bgImage="linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('hero_banner.jpg')"
        bgPosition="center"
        bgSize="cover"
        bgAttachment="fixed"
        bgRepeat="no-repeat"
      >
        <Box
          width={{ base: "90vw", md: "80vw" }}
          margin={"0 auto"}
          pt={{ base: "20px", md: "86px" }}
          color={"white"}
        >
          <Text fontFamily={"cursive"} fontSize={"28px"} color={"#FA9411"}>
            Tractrac MSL
          </Text>
          <Text
            fontSize={{ base: "26px", md: "48px" }}
            lineHeight={{ base: "28px", md: "57.65px" }}
            mt="20px"
          >
            Facilitating access to <br /> mechanization services <br /> for all
            farmers in Africa.
          </Text>
          <Text mt="20px" mb="30px">
            Driving up private sector investments in Agricultural Mechanization
          </Text>
          <Button
            bg="#FA9411"
            width={"190px"}
            height={"40px"}
            _hover={{ opacity: 0.8 }}
            color="#FFFFFF"
            onClick={() => router.push("/signup")}
          >
            Get started
          </Button>
        </Box>
      </Box>
      </ChakraWrapper>
    );
  }