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
import { SidebarWithHeader } from "../../components/Sidenav";
import { createElement, useEffect, useState } from "react";

export default function Paument() {
  return (
    <SidebarWithHeader>
        <EmptyTractorsPlaceholder />
    </SidebarWithHeader>
  );
}

function EmptyTractorsPlaceholder (){
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
      Your inbox is empty
    </Text>

    <Text color="#323232" fontWeight="400" fontSize="18px">
      All enlisted tractors will be listed in this page
    </Text>

    <Button
      as="a"
      mt="50px"
      href="/home/enlist-tractor"
      height="56px"
      w="240px"
      bgColor="#FA9411"
      color="white"
    >
      Enlist a new tractor
    </Button>
  </Box>
</Flex>)
}
