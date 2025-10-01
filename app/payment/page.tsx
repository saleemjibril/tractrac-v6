"use client";
import {
  Box,
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
  Flex,
  IconProps,
  SimpleGrid,
  Text,
  Button,
  Center,
  SkeletonText
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../components/Sidenav";
import { createElement, useEffect, useState } from "react";
import Link from "next/link";
import { getUserPayments } from "../apis/payment";
import { AddIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import moment from "moment";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  success: { title: "Success", color: "#27AE60" },
  maintenance: { title: "Maintenance", color: "#FF0000" },
  failed: { title: "Failed", color: "#FE391E" },
};

export default function Payments() {
  const { userToken } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  const handleGetUserPayments = async () => {
    setLoading(true);
    try {
      console.log("here");

      const response = await getUserPayments(userToken as string);
      console.log("response", response);

      setPayments(response.data);
    } catch (err) {
      const error = err as any;
      toast.error(
        error?.response?.data?.detail || "An unexpected error occurred"
      );
      setError(error?.response?.data?.detail || "An unexpected error occurred");
      console.log("ERROR GETTING USER PAYMENTS", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUserPayments();
  }, []);
  return (
    <SidebarWithHeader>
        

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
        ) : error || payments?.length < 1 ? (
          <EmptyPaymentPlaceholder />
        ) : (
          <Box mx="20px" my="12px" py="20px">
        <Flex justifyContent="space-between" mb="10px" alignContent="center">
          <Text
            fontSize="24px"
            fontWeight={700}
            lineHeight="40px"
            color="#333333"
          >
            Payment history
          </Text>

          <Button
            bgColor="#FA9411"
            mb="12px"
            height="42px"
            borderRadius="4px"
            width="170px"
            color="white"
            as="a"
            href="/payment/pay"
            _hover={{
              opacity: 0.8,
            }}
          >
            <Flex justifyContent="center" alignContent="center">
              <Text fontSize="14px">Make Payment</Text>
              <AddIcon boxSize="12px" ml="30px" mt="3px" />
            </Flex>
          </Button>
        </Flex>

      
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
                  <Th color="white">Payment ID</Th>
                  <Th color="white">Tractor ID</Th>
                  <Th color="white">Invoice number</Th>
                  <Th color="white">Amount Paid (₦)</Th>
                  <Th color="white">Reference</Th>
                  <Th color="white">Payment type</Th>
                  <Th color="white">Date</Th>
                  <Th color="white">Payment status</Th>
                  {/* <Th isNumeric>multiply by</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {payments?.map((payment: any) => (
                  <Tr cursor={"pointer"} key={payment?.id}
                  onClick={() => {
                    if(payment?.payment_status === "pending") {
                      window.open(`https://checkout.paystack.com/${payment?.paystack_access_code}`)
                    }
                  }}
                  >
                    <Td>{payment?.id}</Td>
                    <Td>{payment?.hire_tractor_id}</Td>
                    <Td>{payment?.invoice_number}</Td>

                    <Td>{payment?.amount}</Td>
                    <Td>{payment?.paystack_reference}</Td>
                    {/* <Td>{parseFloat(payment?.amount ?? 0).toLocaleString()}</Td> */}
                    <Td>{payment?.payment_type}</Td>
                    <Td>{moment(payment?.created_at).format('MMMM D, YYYY [at] h:mm:ss A')}</Td>
                    <Td>
                      {statusTypes[payment?.payment_status]?.color && (
                        <Box
                          mt="10px"
                          bgColor={statusTypes[payment?.payment_status].color}
                          py="4px"
                          textAlign="center"
                          borderRadius="4px"
                          w="80px"
                        >
                          <Text fontSize="14px" color="white">
                            {statusTypes[payment?.payment_status].title}
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
      </Box>
        )}
    </SidebarWithHeader>
  );
}

function EmptyPaymentPlaceholder() {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box bgColor="white" width="400px" p="60px" textAlign="center" mt="40px">
        <Center>
          <Image
            src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446712/empty-state_tytpqr.svg"
            alt="Empty state image icon"
          />
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
    </Flex>
  );
}
