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
      <Flex bgColor="#F8F8F0" py="80px" direction="column" alignItems="center" pr="20px"
          pl="20px">
        <Text lineHeight="64px" fontWeight={800} fontSize="48px">
          Our Partners
        </Text>
        <Text fontSize="18px" mt="4px" mb="36px">
          Transforming Agricultural Mechanisation, Hand in Hand with Our Partners
        </Text>
        <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446734/partners-logo_v5iz3f.svg" alt="" />
      </Flex>
      </ChakraWrapper>
    );
  }