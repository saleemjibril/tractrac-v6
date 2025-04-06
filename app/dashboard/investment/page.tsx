"use client";
import {
  Box,
  Image,
  Flex,
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
import { useGetInvestmentsQuery } from "@/redux/services/dashboardApi";

interface ITractorCard {
  name: string;
  capacity: string;
  type: string;
  location: string;
  status: string;
  image: string;
}

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  verified: { title: "Verified", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
};

export default function Investments() {
  const { profileInfo } = useAppSelector((state) => state.auth);

  const {
    data: result,
    error,
    // isFetching,
    isLoading,
    // } = useGetEnlistedTractorsQuery("3");
  } = useGetInvestmentsQuery(profileInfo?.id);

  console.log(error, result);

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
              Investment
            </Text>
            {/* </Stack> */}
            <Button
              bgColor="#FA9411"
              height="42px"
              borderRadius="4px"
              width="200px"
              color="white"
              as="a"
              href="/home/enlist-tractor"
              _hover={{
                opacity: 0.8,
              }}
            >
              Invest
            </Button>
          </Flex>

          <TableContainer
            border="1px"
            borderColor="#32323220"
            borderRadius="12px"
          >
            <Table variant="simple" bgColor="white">
              <Thead color="#323232" bgColor="#E2E8F0">
                <Tr>
                  <Th>Name of Tractor</Th>
                  <Th>Revenue Generated</Th>
                  <Th>Agent</Th>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  {/* <Th>Track</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {result?.data.map((investment: any) => (
                  <Tr key={investment?.id}>
                    <Td>{investment?.tractor_name}</Td>
                    <Td>
                      &#8358;{parseFloat(investment?.revenue ?? 0).toLocaleString()}
                    </Td>
                    <Td>
                      {investment?.agent ?? "Nil"}
                    </Td>
                    <Td>
                      {investment?.start_date ?? "Nil"}
                    </Td>
                    <Td>{investment?.end_date ?? "Nil"}</Td>
                    {/* <Td>
                      <Box
                        mt="10px"
                        display="block"
                        bgColor="#FFD900"
                        as="a"
                        href="/home/track-tractor"
                        py="4px"
                        textAlign="center"
                        borderRadius="4px"
                        w="80px"
                      >
                        <Text fontSize="14px">Track</Text>
                      </Box>
                    </Td> */}
                  </Tr>
                ))}
              </Tbody>
              {/* <Tfoot>
                <Tr>
                  <Th>Name of Tractor</Th>
                  <Th>Hours Used</Th>
                  <Th>Amount Paid (₦)</Th>
                  <Th>Current Location</Th>
                  <Th>Status</Th>
                  <Th>Track</Th>
                </Tr>
              </Tfoot> */}
            </Table>
          </TableContainer>
        </Box>

        <PersonalOverview />
      </Box>
    </SidebarWithHeader>
  );
}

function TractorCard({ name, type, location, status, image }: ITractorCard) {
  return (
    <Box boxShadow="md" borderRadius="4px">
      <Box h="200px">
        <Image
          borderTopRadius="4px"
          // src="/images/man-with-tractor.svg"
          src={
            image?.startsWith("https") ? image : "/images/man-with-tractor.svg"
          }
          alt="Man with a tractor image"
          height="100%"
          width="100%"
          objectFit="cover"
        />
      </Box>

      <Box p="12px" bgColor="white">
        <Text
          fontSize="13px"
          color="#FA9411"
          fontWeight={500}
          lineHeight="14.52px"
        >
          {name}
        </Text>
        <Text
          fontSize="12px"
          color="#323232"
          fontWeight={700}
          mt="8px"
          lineHeight="12.1px"
        >
          Type:{" "}
          <Box fontWeight={500} as="span">
            {type}
          </Box>
        </Text>
        {/* <Text
          fontSize="12px"
          color="#323232"
          fontWeight={700}
          mt="8px"
          lineHeight="12.1px"
        >
          Capacity:
          <Box fontWeight={500} as="span">
            {capacity}
          </Box>
        </Text> */}
        <Text fontSize="12px" color="#323232" fontWeight={700} mt="8px">
          Location:{" "}
          <Box fontWeight={500} as="span">
            {location?.length < 1 ? "Nil" : location}
          </Box>
        </Text>
        {statusTypes[status]?.color && (
          <Box
            mt="10px"
            bgColor={statusTypes[status].color}
            py="2px"
            textAlign="center"
            borderRadius="4px"
            w="111px"
          >
            <Text fontSize="14px" color="white">
              {statusTypes[status].title}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
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
