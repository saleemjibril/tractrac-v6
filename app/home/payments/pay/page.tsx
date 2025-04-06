"use client";
import {
  Box,
  Image,
  ComponentWithAs,
  Flex,
  IconProps,
  SimpleGrid,
  Text,
  Button,
  Center,
  Input,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../../components/Sidenav";
import { createElement, useEffect, useState } from "react";
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";

export default function Pay() {
  return (
    <SidebarWithHeader>
      {/* <EnterInvoice /> */}
      <MakePayForInvoice />
    </SidebarWithHeader>
  );
}

function EnterInvoice() {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box
        bgColor="white"
        width="400px"
        py="50px"
        px="36px"
        textAlign="center"
        mt="40px"
      >
        <Center>
          <Image src="/images/pay.svg" alt="wallet image icon" />
        </Center>

        <Text color="#333333" fontWeight="400" fontSize="14px" mt="10px">
          To access the features and functionality, please enter your Invoice
          Number below:
        </Text>

        <Text color="#00000090" fontWeight={600} mt="12px">
          Enter Invoice Number
        </Text>
        <Box px="40px">
          <Input
            mt="0"
            variant="flushed"
            borderBottom="1px"
            borderBottomColor="#000000"
          />
        </Box>

        <Button
          mt="40px"
          height="56px"
          w="100%"
          bgColor="#FA9411"
          color="white"
          _hover={{ opacity: 0.8 }}
        >
          <Text>Continue</Text>
          <ArrowForwardIcon boxSize="24px" ml="8px" mt="3px" />
        </Button>
      </Box>
    </Flex>
  );
}

function MakePayForInvoice() {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box
        bgColor="white"
        width="400px"
        py="50px"
        px="36px"
        textAlign="center"
        mt="40px"
      >
        <Center>
          <Image src="/images/pay.svg" alt="wallet image icon" />
        </Center>

        <Box
          bgColor="#FA941133"
          py="10px"
          px="24px"
          mt="12px"
          fontSize="40px"
          borderRadius="40px"
        >
          <Text color="#FA9411" fontWeight={700}>
            ₦80,000
          </Text>
        </Box>

        <Button
          mt="40px"
          height="56px"
          w="100%"
          bgColor="#FA9411"
          color="white"
          _hover={{ opacity: 0.8 }}
        >
          <Text>Make payment</Text>
          <ArrowForwardIcon boxSize="24px" ml="8px" mt="3px" />
        </Button>
      </Box>
    </Flex>
  );
}
