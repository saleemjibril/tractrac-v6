"use client";
import { Dispatch, SetStateAction, useMemo } from "react";
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
  ButtonGroup,
  InputLeftElement,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import {
  useLazyGetSingleHiredTractorQuery,
  useAssignTractorMutation,
} from "@/redux/services/adminApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { AdminSidebarWithHeader } from "@/app/components/AdminSidenav";
import { useGetTractorsQuery } from "@/redux/services/tractorApi";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
  verified: { title: "Verified", color: "#27AE60" },
};

export default function AssignSingleTractorPage() {
  const { adminInfo } = useAppSelector((state) => state.auth);

  const [requestId, setRequestId] = useState("");

  const [trigger, result, lastPromiseInfo] =
    useLazyGetSingleHiredTractorQuery();
  const [assignTractor] = useAssignTractorMutation();
  const [loading, setLoading] = useState<"approved" | "disapproved" | null>(
    null
  );
  const [formattedValue, setFormattedValue] = useState("");

  const formatAmount: (value: string) => string = (value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, "")) || 0;
    const formatted = numericValue.toLocaleString();
    return formatted;
  };

  const parseAmount: (value: string) => number = (value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, "")) || 0;
    // const formatted = numericValue.toLocaleString();
    return numericValue;
  };

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const requestId = params.get("id");
    if (!requestId) {
      router.back();
      return;
    }
    trigger(requestId);
    setRequestId(requestId);
  }, [params, router, trigger]);

  const resultData = useMemo(() => {
    if (result?.data?.data) {
      return {
        tractor: result?.data?.data?.tractor,
        info: { ...result?.data?.data, tractor: undefined },
      };
    }
    return { tractor: {}, info: {} };
  }, [result]);

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
                      resultData?.tractor?.image?.startsWith("https")
                        ?  resultData?.tractor?.image
                        : "/images/man-with-tractor.svg"
                    }
                    alt="Man with a tractor image"
                    height="100%"
                    width="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text
                  fontSize="24px"
                  fontWeight={600}
                  color="#323232"
                  mt="36px"
                  mb="18px"
                >
                  Generate Invoice
                </Text>
                <InputGroup mb="20px">
                  <InputLeftElement pointerEvents="none" pr="6px">
                    <Text color="#929292">&#8358;</Text>
                  </InputLeftElement>
                  <Input
                    // variant="flushed"
                    width="300px"
                    color="#929292"
                    borderColor="#929292"
                    _focusVisible={{
                      borderColor: "#929292",
                    }}
                    value={formatAmount(formattedValue)}
                    onChange={(valueString) => {
                      setFormattedValue(valueString.currentTarget.value);
                      //   form.setFieldValue(
                      //     field.name,
                      //     parseAmount(valueString.currentTarget.value)
                      //   );
                    }}
                    // {...field}

                    type="text"
                    placeholder="How much do you want to invest"
                  />
                </InputGroup>
                <Flex my="20px" columnGap="135px">
                  <Text fontSize="20px" fontWeight={400}>
                    Tractor Specification
                  </Text>
                  <ButtonGroup spacing="40px">
                    {result?.data?.data?.status == "pending" && (
                      <Button
                        color="white"
                        bgColor="#F03B13"
                        width="120px"
                        height="34px"
                        fontSize="14px"
                        isLoading={loading == "disapproved"}
                        onClick={async () => {
                          if (loading) return;
                          try {
                            setLoading("disapproved");
                            const response = await assignTractor({
                              user_id: adminInfo?.id,
                              request_id: requestId,
                              status: "disapproved",
                            }).unwrap();
                            if (response.status == "success") {
                              toast.success(response?.message || "success");
                              router.back();
                            } else {
                              toast.error(
                                response?.message || "Unknown error occured"
                              );
                            }
                            // alert("lld");
                          } catch (e) {
                            const error = e as any;
                            // alert(JSON.stringify(error))
                            // alert('error')
                            if (error?.data?.errors) {
                              // setError(error?.data?.errors[0])
                            } else if (error?.data?.message) {
                              toast.error(error?.data?.message);
                              // setError(error?.data?.message);
                            } else {
                              toast.error(
                                "Server error occured, please contact support"
                              );
                            }
                          } finally {
                            setLoading(null);
                          }
                        }}
                      >
                        Not Approved
                      </Button>
                    )}
                    {statusTypes[result?.data?.data?.status]?.color && (
                      <Box
                        // mt="10px"
                        bgColor={statusTypes[result?.data?.data?.status].color}
                        py="6px"
                        textAlign="center"
                        borderRadius="6px"
                        w="120px"
                      >
                        <Text fontSize="14px" color="white">
                          {statusTypes[result?.data?.data?.status].title}
                        </Text>
                      </Box>
                    )}
                    {/* <Button
                      color="white"
                      bgColor="#FA9411"
                      width="120px"
                      height="34px"
                      fontSize="14px"
                    >
                      Pending
                    </Button> */}
                  </ButtonGroup>
                </Flex>
                <Table variant="striped" bgColor="white">
                  <Tbody>
                  <Tr>
                      <Td>Name of Hirer</Td>
                      <Td>{resultData.info?.name || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>State</Td>
                      <Td>{resultData.info?.state || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>LGA</Td>
                      <Td>{resultData.info?.lga || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Address</Td>
                      <Td>{resultData.info?.address || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Hirer Phone Number</Td>
                      <Td>{resultData.info?.hirer_phone || "N/A"}</Td>
                    </Tr>
                    <Tr>
                      <Td>Farm size(units in hectares)</Td>
                      <Td>{resultData.info?.farm_size || "N/A"}</Td>
                    </Tr>


                    <Tr>
                      <Td>Implement</Td>
                      <Td>{resultData.tractor?.tractor_type || "N/A"}</Td>
                    </Tr>


                    <Tr>
                      <Td>Start Date</Td>
                      <Td>{resultData.info?.start_date || "N/A"}</Td>
                    </Tr>


                    <Tr>
                      <Td>End Date</Td>
                      <Td>{resultData.info?.end_date || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Tractor Owner</Td>
                      <Td>{resultData.tractor?.owner || "N/A"}</Td>
                    </Tr>
                    <Tr>
                      <Td>Owner Phone Number</Td>
                      <Td>{resultData.tractor?.owner_phone || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Brand</Td>
                      <Td>{resultData.tractor?.brand || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Model</Td>
                      <Td>{resultData.tractor?.model || "N/A"}</Td>
                    </Tr>


                    <Tr>
                      <Td>Tractor Rating (Horse Power)</Td>
                      <Td>{resultData.tractor?.rating || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Purchase Year</Td>
                      <Td>{resultData.tractor?.purchase_year || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Chasis Number </Td>
                      <Td>
                        {resultData.tractor?.chasis_serial_vn || "N/A"}
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>Plate Number</Td>
                      <Td>{resultData.tractor?.plate_no || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Manufacturing Year</Td>
                      <Td>{resultData.tractor?.manufactured_year || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Tractor Insurance</Td>
                      <Td>
                        {resultData.tractor?.insured == "1" ? "yes" : "no"}
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>Insurance Company</Td>
                      <Td>{resultData.tractor?.insurance_company || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Insurance Expiry Year</Td>
                      <Td>{resultData.tractor?.insurance_expiry || "N/A"}</Td>
                    </Tr>

                    <Tr>
                      <Td>Tractor Tracker</Td>
                      <Td>{resultData.tractor?.tracker || "N/A"}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            )} 
            <Button
              mt="30px"
              color="white"
              height="48px"
              width="100%"
              isDisabled={result?.isLoading || result.status === "uninitialized"}
              bgColor="#FA9411"
              isLoading={loading == "approved"}
              onClick={async () => {
                if (loading) return;
                try {
                  setLoading("approved");
                  const response = await assignTractor({
                    user_id: adminInfo?.id,
                    request_id: requestId,
                    status: "approved",
                    amount: parseAmount(formattedValue),
                  }).unwrap();
                  if (response.status == "success") {
                    toast.success(response?.message || "success");
                    router.back();
                  } else {
                    toast.error(response?.message || "Unknown error occured");
                  }
                } catch (e) {
                  const error = e as any;
                  if (error?.data?.errors) {
                    // setError(error?.data?.errors[0])
                  } else if (error?.data?.message) {
                    toast.error(error?.data?.message);
                  } else {
                    toast.error("Server error occured, please contact support");
                  }
                } finally {
                  setLoading(null);
                }
              }}
            >
              Send
            </Button> 
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
      </Box>
    </Flex>
  );
}
