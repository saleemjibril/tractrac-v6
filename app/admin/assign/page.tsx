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
  SkeletonCircle,
  SkeletonText,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Divider,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { createElement, useEffect, useState } from "react";
import PersonalOverview from "@/app/components/PersonalOverview";
import { useAppSelector } from "@/redux/hooks";
import { AdminSidebarWithHeader } from "@/app/components/AdminSidenav";
import { useGetEnlistedTractorsQuery, useGetHiredTractorsQuery } from "@/redux/services/adminApi";
import { useRouter } from "next/navigation";

interface ITractorCard {
  id: string;
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
    approved: { title: "Approved", color: "#27AE60" },
    completed: { title: "Completed", color: "#27AE60" },
    in_use: { title: "In Use", color: "#F03B13" },
    not_approved: { title: "Not Approved", color: "#F03B13" },
};

export default function AllHiredTractors() {

  const {
    data: result,
    error,
    isLoading,
  } = useGetHiredTractorsQuery({});

  console.log(error, result);

  return (
    <AdminSidebarWithHeader>
      <Box mx="20px" my="12px" py="20px">
        <Box bg="white" boxShadow="lg" borderRadius="4px">
          <Text
            px="32px"
            py="20px"
            color="#848484"
            fontSize="14px"
            fontWeight={400}
          >
            Assign Tractors
          </Text>

          <Divider />

          {isLoading ? (
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              spacingX="40px"
              spacingY="20px"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <Box key={index} boxShadow="lg" bg="white" borderRadius="4px">
                  <Skeleton height="120px" />
                  <Box p="12px">
                    <SkeletonText
                      my="12px"
                      noOfLines={3}
                      spacing="3"
                      skeletonHeight="6px"
                    />

                    <Skeleton
                      mt="12px"
                      height="30px"
                      borderRadius="4px"
                      w="111px"
                    />
                  </Box>

                  {/* <SkeletonCircle size="10" /> */}
                  {/* */}
                </Box>
              ))}
            </SimpleGrid>
          ) : error ? (
            <EmptyTractorsPlaceholder />
          ) : (
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              spacingX="40px"
              spacingY="20px"
              mt="10px"
              px="30px"
              py="24px"
              // spacing={{ base: "12px", md: "40px" }}
            >
              {result?.data.map((result: any) => (
                <TractorCard
                  key={result?.id}
                  id={result?.id}
                  name={`${result?.tractor?.brand} ${result?.tractor?.model}`}
                  capacity=" 105 to 135 HP"
                  type={result?.tractor?.tractor_type}
                  location={result?.address}
                  image={result?.tractor?.image}
                  status={result?.status}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
        {/* <PersonalOverview /> */}
      </Box>
    </AdminSidebarWithHeader>
  );
}

function TractorCard({
  id,
  name,
  type,
  location,
  status,
  image,
}: ITractorCard) {
  const router = useRouter();
  return (
    <Box
      boxShadow="md"
      borderRadius="4px"
      onClick={() => router.push(`/admin/assign/tractor?id=${id}`)}
      cursor="pointer"
    >
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
         <Box fontWeight={500} fontSize="12px" mt="8px" as="span" noOfLines={2}>
          <Box fontWeight={700} as="span">
            Location:
          </Box>{" "}
          {location.length < 2 ? "N/a" : location}
        </Box>
        {/* <Text fontSize="12px" color="#323232" fontWeight={700} mt="8px">
          Location:{" "}
          <Box fontWeight={500} as="span">
            {location?.length < 1 ? "Nil" : location}
          </Box>
        </Text> */}
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
      </Box>
    </Flex>
  );
}
