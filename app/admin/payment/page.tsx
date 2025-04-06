"use client";
import { Dispatch, SetStateAction } from "react";
import {
  Box,
  Image,
  Flex,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Alert,
  AlertTitle,
  AlertIcon,
  Text,
  Button,
  Center,
  Table,
  Modal as ChakraModal,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Skeleton,
  SkeletonText,
  Divider,
  Input,
  Spacer,
  InputGroup,
  InputLeftElement,
  ModalBody,
  ModalContent,
  ModalOverlay,
  IconButton,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { useEffect, useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import {
  useAddFarmerMutation,
  useGetFarmersQuery,
  useGetPaymentsQuery,
} from "@/redux/services/adminApi";
import router from "next/router";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { AdminSidebarWithHeader } from "@/app/components/AdminSidenav";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
};

export default function PaymentPage() {

  const {
    data: result,
    error,
    // isFetching,
    isLoading,
    // } = useGetHiredTractorsQuery("3");
  } = useGetPaymentsQuery({});

  const [modalState, setModalState] = useState(false);
  const [search, setSearchInput] = useState("");

  function filterPayments(payments: any[], searchString: string): any[] {
    if (searchString.trim() === "") {
      return payments; // If the search string is empty, return all payments
    }

    const searchValue = searchString.trim();

    // Check if the search input is a valid number
    const isNumeric = !isNaN(parseFloat(searchValue)) && isFinite(+searchValue);

    return payments.filter(
      (payment) =>
        isNumeric
          ? payment.phone.includes(searchValue) // Search by phone if it's a number
          : payment.name.toLowerCase().includes(searchValue.toLowerCase()) // Search by name if it's not a number
    );
  }

  return (
    <AdminSidebarWithHeader>
      <Box mx="20px" my="12px" py="12px">
        <Box bg="white" boxShadow="lg" borderRadius="4px">
          <Text
            px="32px"
            py="20px"
            color="#848484"
            fontSize="14px"
            fontWeight={400}
          >
            Payments
          </Text>
          <Divider />

          <Box px="32px" pb="32px">
            <Flex
              justifyContent="space-between"
              mt="24px"
              mb="24px"
              alignContent="center"
            >
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search agent by name"
                  width="300px"
                  fontSize="13px"
                  onChange={(e) => setSearchInput(e?.currentTarget.value)}
                />
              </InputGroup>
            </Flex>

            {isLoading ? (
              <>
                <Skeleton height="80px" />
                <Box p="12px">
                  <SkeletonText
                    my="12px"
                    noOfLines={8}
                    spacing="3"
                    skeletonHeight="24px"
                  />
                </Box>
              </>
            ) : error ? (
              <EmptyDataPlaceholder />
            ) : (
              <TableContainer
                border="1px"
                borderColor="#32323220"
                borderRadius="12px"
              >
                <Table variant="simple" bgColor="white">
                  <Thead color="#323232" bgColor="#E2E8F0">
                    <Tr>
                      <Th>Name</Th>
                      <Th>Phone Number</Th>
                      <Th>Purpose of payment</Th>
                      <Th>Date</Th>
                      <Th>Invoice Number</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filterPayments(result?.data, search).map(
                      (payment: any) => (
                        <Tr key={payment?.id}>
                          <Td>{payment?.name || "N/A"}</Td>
                          <Td>{payment?.phone ?? "N/A"}</Td>
                          <Td>{payment?.purpose || "N/A"}</Td>
                          <Td>{payment?.created_at}</Td>
                          <Td>{payment?.invoiceID}</Td>
                          <Td>
                          &#8358;{parseFloat(payment?.amount ?? 0).toLocaleString()}
                          </Td>
                          <Td>{payment?.status ?? "Nil"}</Td>
                          <Td>
                            <Box
                              mt="10px"
                              display="block"
                              bgColor="#FFD900"
                              as="a"
                              href={`/admin/payment/tractor?id=${payment?.tractor_id}`}
                              py="4px"
                              textAlign="center"
                              borderRadius="4px"
                              w="80px"
                            >
                              <Text fontSize="14px">View</Text>
                            </Box>
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Box>
    </AdminSidebarWithHeader>
  );
}

function EmptyDataPlaceholder() {
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
          All Farmer will be listed in this page
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
