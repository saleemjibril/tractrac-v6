"use client";
import {
    Flex,
    Text,
    Image
  } from "@chakra-ui/react";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function OutPartnersComponent() {
    return (
      <ChakraWrapper>
      <Flex bgColor="#F8F8F0" py="80px" direction="column" alignItems="center">
        <Text lineHeight="64px" fontWeight={800} fontSize="48px">
          Our Partners
        </Text>
        <Text fontSize="18px" mt="4px" mb="36px">
          Transforming Agricultural Mechanisation, Hand in Hand with Our Partners
        </Text>
        <Image src="images/partners-logo.svg" alt="" />
      </Flex>
      </ChakraWrapper>
    );
  }