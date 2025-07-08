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
import { getMyHiredTools } from "@/app/apis/tools";
import formatNumber from "@/app/utils/formatNumber";
import moment from "moment";

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
            const response = await getMyHiredTools(userToken);
            console.log("getMyHiredTools", response?.data);
            setTractors(response?.data);
            setLoading(false)
          } else {
            // Handle the case when userToken is not a string
            console.log('User token is not a string');
            // Maybe redirect to login or show an error
          }
         
        } catch (err) {
              const error = err as any;
              setError(error?.response?.data?.detail || "An unexpected error occurred")
              console.log("Error fetching tool", error);
              setLoading(false)
        }
      };
    
      useEffect(() => {
        handleGetTractors();
      }, []);
     



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
          <TableContainer
            border="1px"
            borderColor="#32323220"
            borderRadius="12px"
            height="500px"
            bgColor="white"
          >
            <Table variant="simple" bgColor="white">
              <Thead bgColor="#FA9411">
                <Tr>
                  <Th color="white">Tool name</Th>
                  {/* <Th color="white">Tool model</Th> */}
                  <Th color="white">Owner</Th>
                  <Th color="white">Address</Th>
                  <Th color="white">Farm Size</Th>
                  {/* <Th color="white">Type of Service</Th> */}
                  <Th color="white">Amount Paid (₦)</Th>
                  <Th color="white">Start Date</Th>
                  <Th color="white">End Date</Th>
                  <Th color="white">Status</Th>
                  {/* <Th isNumeric>multiply by</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {tractors?.map((tractor: any) => (
                  <Tr key={tractor?.id}>
                    <Td textTransform={"capitalize"}>{tractor?.addons[0]?.addon_type?.split("_")?.join(" ")}</Td>
                    {/* <Td>{tractor?.tractor?.model}</Td> */}
                    <Td>{tractor?.owner_name}</Td>
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
                        { tractor?.tractor?.location ?? "Nil" }
                      {/* Gaa-akanbi, ilorin south, nigeria Gaa-akanbi, ilorin
                      south, nigeria,  Gaa-akanbi, ilorin south, nigeria Gaa-akanbi, ilorin */}
                      </Text>
                      {/* </Box> */}
                    </Td>
                    <Td>{tractor?.farm_size} sqm</Td>
                    {/* <Td></Td> */}
                    <Td>{formatNumber(tractor?.total_amount)}</Td>
                    {/* <Td>
                      {parseFloat(tractor?.farm_size ?? 0).toLocaleString()}
                    </Td> */}
                    <Td>{moment(tractor?.start_date).format('MMMM D, YYYY')}</Td>
                    <Td>{moment(tractor?.end_date).format('MMMM D, YYYY')}</Td>
                    <Td>
                      {statusTypes[tractor?.status]?.color && (
                        <Box
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
