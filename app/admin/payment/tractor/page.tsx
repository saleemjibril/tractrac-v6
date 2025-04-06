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
import { useEffect, useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import {
  useAddFarmerMutation,
  useGetFarmersQuery,
  useGetPaymentsQuery,
  useLazyGetSingleTractorQuery,
} from "@/redux/services/adminApi";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { AdminSidebarWithHeader } from "@/app/components/AdminSidenav";
import { useGetTractorsQuery } from "@/redux/services/tractorApi";
// import { useSearchParams } from "next/navigation";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
};

export default function PaymentPage() {

  const [tractorId, setTractorId] = useState("");

  const [trigger, result, lastPromiseInfo] = useLazyGetSingleTractorQuery();

  //   const {
  //     data: result,
  //     error,
  //     // isFetching,
  //     isLoading,
  //     // } = useGetHiredTractorsQuery("3");
  //   } = useGetTractorsQuery(tractorId);

  const [modalState, setModalState] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const tractorId = params.get("id");
    // const [phoneNumber, userId, dd] = params.getAll("data");
    if (!tractorId) {
      router.back();
      return;
    }
    trigger(tractorId);
    setTractorId(tractorId);
  }, [params, router, trigger]);

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
            Tractors
          </Text>
          <Divider />

            {/* { result?.data} */}
          <Box pl="32px" pr={{ base: "32px", lg: "250px" }} pb="32px">
            {result?.isLoading || result.status === "uninitialized" ? (
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
            ) : result?.error ? (
              <EmptyDataPlaceholder />
            ) : (
              <TableContainer
                border="0px"
                borderColor="#32323220"
                borderRadius="12px"
                mt="20px"
              >
                <Box h="400px" mb="20px">
                  <Image
                    borderRadius="4px"
                    // src="/images/man-with-tractor.svg"
                    src={
                      result?.data?.data?.image?.startsWith("https")
                        ? result?.data.data.image
                        : "/images/man-with-tractor.svg"
                    }
                    alt="Man with a tractor image"
                    height="100%"
                    width="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text my="20px" fontSize="24px">
                  Tractor Specification
                </Text>
                <Table variant="striped" bgColor="white">
                  {/* <Thead color="#323232" bgColor="#E2E8F0">
                    <Tr>
                      <Th>Name</Th>
                      <Th>Phone Number</Th>
                      <Th>Purpose of payment</Th>
                      <Th>Date</Th>
                      <Th>Invoice Number</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead> */}
                  <Tbody>
                    <Tr>
                      <Td>Name of Hirer</Td>
                      <Td>{result?.data?.data?.hirer || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>State</Td>
                      <Td>{result?.data?.data?.state || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>LGA</Td>
                      <Td>{result?.data?.data?.lga || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Address</Td>
                      <Td>{result?.data?.data?.address || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Farm size (units in hectare)</Td>
                      <Td>{result?.data?.data?.farm_size || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Implement</Td>
                      <Td>{result?.data?.implement?.purpose || "N/A"}</Td>
                    </Tr>

                    {/* <Tr>
                      <Td>Start Date</Td>
                      <Td>{result?.data?.purpose || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>End Date</Td>
                      <Td>{result?.data?.purpose || "N/A"}</Td>
                    </Tr> */}

                    <Tr>
                      <Td>Tractor owner</Td>
                      <Td>{result?.data?.data?.owner || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Brand</Td>
                      <Td>{result?.data?.data?.brand || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Model</Td>
                      <Td>{result?.data?.data?.model || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Tractor Type</Td>
                      <Td>{result?.data?.data?.tractor_type || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Tractor Rating (Horse Power)</Td>
                      <Td>{result?.data?.data?.rating || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Purchase Year</Td>
                      <Td>{result?.data?.data?.purchase_year || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Chasis Number </Td>
                      <Td>{result?.data?.data?.chasis_serial_vn || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Plate Number</Td>
                      <Td>{result?.data?.data?.plate_no || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Manufacturing Year</Td>
                      <Td>{result?.data?.data?.manufactured_year || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Tractor Insurance</Td>
                      <Td>{result?.data?.data?.insured || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Insurance Company</Td>
                      <Td>{result?.data?.data?.insurance_company || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Insurance Expiry Year</Td>
                      <Td>{result?.data?.data?.insurance_expiry || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Tractor Tracker</Td>
                      <Td>{result?.data?.data?.tracker || "N/A"}</Td>
                    </Tr>
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
