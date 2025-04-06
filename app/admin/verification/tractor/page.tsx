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
  ButtonGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import {
  useLazyGetSingleTractorQuery,
  useVerifyTractorMutation,
} from "@/redux/services/adminApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { AdminSidebarWithHeader } from "@/app/components/AdminSidenav";
import { useGetTractorsQuery } from "@/redux/services/tractorApi";

const statusTypes: Record<string, { title: string; color: string }> = {
    pending: { title: "Pending", color: "#FA9411" },
    verified: { title: "Verified", color: "#27AE60" },
    approved: { title: "Approved", color: "#27AE60" },
    completed: { title: "Completed", color: "#27AE60" },
    in_use: { title: "In Use", color: "#F03B13" },
    not_approved: { title: "Not Approved", color: "#F03B13" },
};

export default function PaymentPage() {
  const { adminInfo } = useAppSelector((state) => state.auth);

  const [tractorId, setTractorId] = useState("");

  const [trigger, result, lastPromiseInfo] = useLazyGetSingleTractorQuery();
  const [verifyTractor] = useVerifyTractorMutation();
  const [loading, setLoading] = useState<"approved" | "disapproved" | null>(
    null
  );

  const [modalState, setModalState] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const tractorId = params.get("id");
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
                <Text my="20px" fontSize="24px" fontWeight={500}>
                  Tractor Specification
                </Text>
                <ButtonGroup mb="20px" spacing="40px">
                  <Button
                    color="white"
                    bgColor="#27AE60"
                    width="120px"
                    height="34px"
                    fontSize="14px"
                    isLoading={loading == "approved"}
                    onClick={async () => {
                      if (loading) return;
                      try {
                        setLoading("approved");
                        const response = await verifyTractor({
                          user_id: adminInfo?.id,
                          tractor_id: tractorId,
                          status: "approved",
                        }).unwrap();
                        if (response.status == "success") {
                          toast.success(response?.message || "success");
                          router.back()
                        } else {
                          toast.error(
                            response?.message || "Unknown error occured"
                          );
                        }
                      } catch (e) {
                        const error = e as any;
                        if (error?.data?.errors) {
                          // setError(error?.data?.errors[0])
                        } else if (error?.data?.message) {
                          toast.error(error?.data?.message);
                        }else{
                            toast.error( "Server error occured, please contact support");
                        }
                      } finally {
                        setLoading(null);
                      }
                    }}
                  >
                    Verify listing
                  </Button>
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
                        const response = await verifyTractor({
                          user_id: adminInfo?.id,
                          tractor_id: tractorId,
                          status: "disapproved",
                        }).unwrap();
                        if (response.status == "success") {
                          toast.success(response?.message || "success");
                          router.back()
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
                        }else{
                            toast.error( "Server error occured, please contact support");
                        }
                      } finally {
                        setLoading(null);
                      }
                    }}
                  >
                    Not Approved
                    {/* Unapprove */}
                  </Button>
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
                <Table variant="striped" bgColor="white">
                  <Tbody>
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
                      <Td>
                        {result?.data?.data?.insured == "1" ? "yes" : "no"}
                      </Td>
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
