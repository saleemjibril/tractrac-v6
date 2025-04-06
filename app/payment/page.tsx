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
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../components/Sidenav";
import { createElement, useEffect, useState } from "react";
import Link from "next/link";

export default function Payments() {
  return (
    <SidebarWithHeader>
        <EmptyPaymentPlaceholder />
    </SidebarWithHeader>
  );
}

function EmptyPaymentPlaceholder (){
  return ( <Flex justifyContent="center" alignItems="center">
  <Box
    bgColor="white"
    width="400px"
    p="60px"
    textAlign="center"
    mt="40px"
  >
    <Center>
      <Image src="/images/empty-state.svg" alt="Empty state image icon" />
    </Center>
    <Text color="#323232" fontWeight="700" fontSize="20px" mt="57px">
      Your list is empty
    </Text>

    <Text color="#323232" fontWeight="400" fontSize="18px">
    All Payment will be listed in this page
    </Text>
<Link href="/payment/pay" prefetch={true}>
    <Button
      as="a"
      mt="50px"
      
      height="56px"
      w="240px"
      bgColor="#FA9411"
      color="white"
    >
     Make Payment
    </Button>
</Link>
  </Box>
</Flex>)
}
