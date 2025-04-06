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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { createElement, useEffect, useState } from "react";
import PersonalOverview from "@/app/components/PersonalOverview";
import { useGetEnlistedTractorsQuery } from "@/redux/services/tractorApi";
import { useAppSelector } from "@/redux/hooks";
import { useGetDemandFulfilledQuery } from "@/redux/services/dashboardApi";



export default function DemandFulfilledPage() {
  const { profileInfo } = useAppSelector((state) => state.auth);

  const {
    data: results,
    error,
    // isFetching,
    isLoading,
    // } = useGetEnlistedTractorsQuery("3");
  } = useGetDemandFulfilledQuery(profileInfo?.id);

  console.log(error, results);

  // const skeletons = [1,2,3,4,5,6];

  return (
    <SidebarWithHeader isAuth={true}>
      <Box mx="20px" my="12px" py="20px">
        <Box
          bgColor="white"
          py="40px"
          px="30px"
          borderRadius="6px"
          boxShadow="md"
        >
          <Flex justifyContent="space-between" mb="30px">
            {/* <Stack> */}
            <Text fontSize="24px" fontWeight={700} lineHeight="24px" mt="12px">
              Demand Fulfilled
            </Text>
          </Flex>

          <TableContainer
            border="1px"
            borderColor="#32323220"
            borderRadius="12px"
          >
            <Table variant="simple" bgColor="white">
              <Thead color="#323232" bgColor="#E2E8F0">
                <Tr>
                  <Th>Tractor Name</Th>
                  <Th>Revenue Generated</Th>
                  <Th>Agent</Th>
                  <Th>Up-time</Th>
                  <Th>Down-time</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {results?.data.map((result: any) => (
                  <Tr key={result?.id}>
                    <Td>{result?.tractor_name}</Td>
                    <Td>
                      &#8358;{parseFloat(result?.revenue ?? 0).toLocaleString()}
                    </Td>
                    <Td>
                      {result?.agent ?? "Nil"}
                    </Td>
                    <Td>
                      {result?.uptime ?? "Nil"}
                    </Td>
                    <Td>
                      {result?.downtime ?? "Nil"}
                    </Td>
                    <Td>
                      {result?.created_at ?? "Nil"}
                    </Td>
                
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <PersonalOverview />
      </Box>
    </SidebarWithHeader>
  );
}

function EmptyTractorsPlaceholder() {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box bgColor="white" width="100%" p="60px" textAlign="center" mt="20px">
        {/* <Box bgColor="white" width="400px" p="60px" textAlign="center" mt="40px"> */}
        <Center>
          <Image src="/images/empty-state.svg" alt="Empty state image icon" />
        </Center>
        <Text color="#323232" fontWeight="700" fontSize="20px" mt="57px">
          Your list is empty
        </Text>

        <Text color="#323232" fontWeight="400" fontSize="18px">
          All Enlisted Tractors will be listed in this page
        </Text>

        {/* <Button
          as="a"
          mt="50px"
          href="/home/enlist-tractor"
          height="56px"
          w="240px"
          bgColor="#FA9411"
          color="white"
        >
          Enlist your tractor
        </Button> */}
      </Box>
    </Flex>
  );
}
