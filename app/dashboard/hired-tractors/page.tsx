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
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { createElement, useEffect, useState } from "react";
import PersonalOverview from "@/app/components/PersonalOverview";
import { ArrowRight } from "iconsax-react";
import { AddIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { useGetHiredTractorsQuery } from "@/redux/services/tractorApi";
import { useAppSelector } from "@/redux/hooks";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
};

export default function HiredTractors() {
  const { profileInfo } = useAppSelector((state) => state.auth);

  const {
    data: result,
    error,
    // isFetching,
    isLoading,
    // } = useGetHiredTractorsQuery("3");
  } = useGetHiredTractorsQuery(profileInfo?.id);

  return (
    <SidebarWithHeader isAuth={true}>
      <Box mx="20px" my="12px" py="20px">
        <Flex justifyContent="space-between" mb="10px" alignContent="center">
          <Text
            fontSize="24px"
            fontWeight={700}
            lineHeight="40px"
            color="#333333"
          >
            Hired Tractors
          </Text>

          <Button
            bgColor="#FA9411"
            mb="12px"
            height="42px"
            borderRadius="4px"
            width="170px"
            color="white"
            as="a"
            href="/home/hire-tractor"
            _hover={{
              opacity: 0.8,
            }}
          >
            <Flex justifyContent="center" alignContent="center">
              <Text fontSize="14px">Hire a tractor</Text>
              <AddIcon boxSize="12px" ml="30px" mt="3px" />
            </Flex>
          </Button>
        </Flex>

        {isLoading ? (
          <Box boxShadow="lg" bg="white" borderRadius="12px">
            <Skeleton height="80px" />
            <Box p="12px">
              <SkeletonText
                my="12px"
                noOfLines={8}
                spacing="3"
                skeletonHeight="24px"
              />
            </Box>
          </Box>
        ) : error ? (
          <EmptyTractorsPlaceholder />
        ) : (
          <TableContainer
            border="1px"
            borderColor="#32323220"
            borderRadius="12px"
          >
            <Table variant="simple" bgColor="white">
              <Thead color="#323232" bgColor="#E2E8F0">
                <Tr>
                  <Th>State</Th>
                  <Th>LGA</Th>
                  <Th>Address</Th>
                  <Th>Farm Size</Th>
                  <Th>Type of Service</Th>
                  <Th>Amount Paid (₦)</Th>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  <Th>Status</Th>
                  {/* <Th isNumeric>multiply by</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {result?.data.map((tractor: any) => (
                  <Tr key={tractor?.id}>
                    <Td>{tractor?.state ?? "Nil"}</Td>
                    <Td>{tractor?.lga ?? "Nil"}</Td>
                    {/* <Td>{tractor?.address ?? "Nil"}</Td> */}
                    <Td 
                    whiteSpace="break-spaces"
                    // maxW="100px" 
                    // display="inline-block"
                    //  wordBreak="break-word"
                    // maxW="50px"
                      // sx={{
                        // width: "50px",
                        // overflowWrap: "break-word",
                        // whiteSpace="unset"
                        // Add any additional styles as needed
                      // }}
                    >
                      {/* <Box maxW="80px" overflowWrap="break-word"> */}
                      <Text  >
                        { tractor?.address ?? "Nil" }
                      {/* Gaa-akanbi, ilorin south, nigeria Gaa-akanbi, ilorin
                      south, nigeria,  Gaa-akanbi, ilorin south, nigeria Gaa-akanbi, ilorin */}
                      </Text>
                      {/* </Box> */}
                    </Td>
                    <Td>
                      {parseFloat(tractor?.farm_size ?? 0).toLocaleString()}
                    </Td>
                    <Td>{tractor?.tractor_type ?? "Nil"}</Td>
                    <Td>{parseFloat(tractor?.amount ?? 0).toLocaleString()}</Td>
                    <Td>{tractor?.start_date}</Td>
                    <Td>{tractor?.end_date}</Td>
                    <Td>
                      {statusTypes[tractor?.status]?.color && (
                        <Box
                          mt="10px"
                          bgColor={statusTypes[tractor?.status].color}
                          py="4px"
                          textAlign="center"
                          borderRadius="4px"
                          w="80px"
                        >
                          <Text fontSize="14px" color="white">
                            {statusTypes[tractor?.status].title}
                          </Text>
                        </Box>
                      )}
                    </Td>
                    {/* <Td isNumeric>25.4</Td> */}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

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
          All Hired tractors will be listed in this page
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
