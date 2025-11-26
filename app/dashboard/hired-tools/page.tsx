"use client";
import {
  Box,
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
  SkeletonText
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../../components/Sidenav";
import { createElement, useEffect, useState } from "react";
import PersonalOverview from "@/app/components/PersonalOverview";
import { ArrowRight } from "iconsax-react";
import { AddIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { useGetHiredTractorsQuery } from "@/redux/services/tractorApi";
import { useAppSelector } from "@/redux/hooks";
import { getErrorMessage } from "@/app/utils/errorUtils";
import { getAllHiringActivities } from "@/app/apis/tractor";
import formatNumber, { formatAmount } from "@/app/utils/formatNumber";
import moment from "moment";
import { useRouter } from "next/navigation";
import { RightArrow } from "@/app/components/Icons";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  payment_pending: { title: "Payment Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  maintenance: { title: "Maintenance", color: "#FF0000" },
  completed: { title: "Completed", color: "#27AE60" },
  in_progress: { title: "In Progress", color: "#27AE60" },
  rejected: { title: "Rejected", color: "#FE391E" },
  paid: { title: "Paid", color: "#27AE60" },
  cancelled: { title: "Cancelled", color: "#FE391E" },
  abandoned: { title: "Abandoned", color: "#FE391E" },
};

export default function HiredTractors() {
  const router = useRouter();
  const { profileInfo, userToken } = useAppSelector((state) => state.auth);
  
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    data: result,
    // error,
    // isFetching,
    // isLoading,
    // } = useGetHiredTractorsQuery("3");
  } = useGetHiredTractorsQuery(profileInfo?.id);


      const handleGetTractors = async () => {
        setLoading(true)
        try {

          if (typeof userToken === 'string') {
            const response = await getAllHiringActivities(profileInfo?.id, userToken);
            // Filter for tools only (service_type === "addon_hire")
            const toolsOnly = response?.data?.filter((booking: any) => booking?.service_type === "addon_hire");
            setTractors(toolsOnly);
            console.log("getTools", toolsOnly);
            setLoading(false)
          } else {
            // Handle the case when userToken is not a string
            console.log('User token is not a string');
            // Maybe redirect to login or show an error
          }
         
        } catch (err) {
              const error = err as any;
              const errorMessage = getErrorMessage(error, "An unexpected error occurred");
              setError(errorMessage);
              console.log("Error fetching tool", error);
              setLoading(false)
        }
      };
    
      useEffect(() => {
        handleGetTractors();
      }, []);
     



  return (
    <SidebarWithHeader isAuth={true}>
      <Box bg={"white"} borderRadius={"4px"} p={"20px"}>
        <Flex justifyContent="space-between" mb="10px" alignContent="center">
          <Text
            fontSize="24px"
            fontWeight={700}
            lineHeight="40px"
            color="#333333"
          >
            Hired Tools
          </Text>

          <Button
            bgColor="#FA9411"
            mb="12px"
            height="42px"
            borderRadius="4px"
            width="170px"
            color="white"
            as="a"
            href="/home/hire-tools"
            _hover={{
              opacity: 0.8,
            }}
            display={{base: "none", md: "flex"}}
          >
            <Flex justifyContent="center" alignContent="center">
              <Text fontSize="14px">Hire an agro tool</Text>
              <AddIcon boxSize="12px" ml="30px" mt="3px" />
            </Flex>
          </Button>
        </Flex>

        {loading ? (
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
         
                tractors?.map((booking: any) => (
                  <Flex
            key={booking?.id}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pb={"8px"}
            mb={"8px"}
            borderBottom={"1px solid #ECECEC"}
            onClick={() => router.push(`/dashboard/booking-details/${booking?.id}`)}
            cursor={"pointer"}
          >
            <Flex gap={"8px"} alignItems={"center"}>
              <Box>
                <Text fontSize={"10px"} fontWeight={"500"}>
                  {booking?.equipment_name}
                </Text>
                <Text fontSize={"8px"} fontWeight={"500"} color={"#000"}>
                  from: {moment(booking?.booking_date).format(
                    "MMMM D, YYYY [at] h:mm:ss A"
                  )} to: {moment(booking?.end_date).format(
                    "MMMM D, YYYY [at] h:mm:ss A"
                  )}
                </Text>
              </Box>

              <Box
                fontSize={"8px"}
                borderRadius={"14px"}
                border={`1px solid ${statusTypes[booking?.status]?.color || "#FA9411"}`}
                padding={"4px 8px"}
                color={statusTypes[booking?.status]?.color || "#FA9411"}
                bg={"#FAF6F6"}
              >
                {statusTypes[booking?.status]?.title || booking?.status}
              </Box>
              
              {booking?.status === "payment_pending" && (
                <Box
                  fontSize={"8px"}
                  borderRadius={"14px"}
                  border={"1px solid #FA9411"}
                  padding={"4px 8px"}
                  color={"#FA9411"}
                  bg={"#FAF6F6"}
                >
                  ₦{formatAmount(booking?.amount?.toString())}
                </Box>
              )}
              
              <Box
                fontSize={"7px"}
                borderRadius={"14px"}
                padding={"4px 8px"}
                bg={booking?.type === "tool" ? "#E8F5E9" : "#FFF3E0"}
                color={booking?.type === "tool" ? "#2E7D32" : "#E65100"}
                fontWeight={600}
              >
                {booking?.service_type === "addon_hire" ? "Tool" : "Tractor"}
              </Box>
            </Flex>

            <RightArrow />
          </Flex>
                ))
              
        )}

        {/* <PersonalOverview /> */}
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
          <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446712/empty-state_tytpqr.svg" alt="Empty state image icon" />
        </Center>
        <Text color="#323232" fontWeight="700" fontSize="20px" mt="57px">
          Your list is empty
        </Text>

        <Text color="#323232" fontWeight="400" fontSize="18px">
          All Hired tools will be listed in this page
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
