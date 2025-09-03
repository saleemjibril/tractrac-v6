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
  GridItem,
  Grid,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useGetTractorsQuery } from "@/redux/services/tractorApi";
import { getTractor } from "@/app/apis/tractor";
import Map from "../../components/Map";
import { statusTypes } from "@/app/utils/tractorStatus";
import { SidebarWithHeader } from "@/app/components/Sidenav";

interface Tractor {
  tractor_image?: any;
  tractor_video?: string;
  status?: any;
  brand?: string;
  name?: string;
  model?: string;
  tractor_type?: string;
  rating?: string;
  purchase_year?: string;
  chasis_serial_vn?: string;
  plate_no?: string;
  manufactured_year?: string;
  insured?: string;
  insurance_company?: string;
  insurance_expiry?: string;
  current_address?: string;
  tracker?: string;
}

export default function PaymentPage() {
  const { userToken } = useAppSelector((state) => state.auth);
  console.log("userToken", userToken);

  const [tractorId, setTractorId] = useState("");

  const [loading, setLoading] = useState(false);
  const [tractor, setTractor] = useState<Tractor | null>(null);
  const [error, setError] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [modalState, setModalState] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const tractorId = params.get("id");
    if (!tractorId) {
      router.back();
      return;
    }
    handleGetTractors(tractorId);
    setTractorId(tractorId);
  }, [params, router]);

  const handleGetTractors = async (tractorId: string) => {
    setLoading(true);
    console.log("userToken", userToken);

    try {
      const response = await getTractor(tractorId, userToken as string);
      setTractor(response?.data);
      console.log("getTractors", response?.data);
      setLoading(false);
    } catch (err) {
      const error = err as any;
      console.log("Error enlisting tractor", error);
      setError(error?.response?.data?.detail || "An unexpected error occurred");
      setLoading(false);
    }
  };


  return (
    <SidebarWithHeader>
      <Box bg="white" boxShadow="lg" borderRadius="4px" p="43px 58px">
        <Box>
          {loading ? (
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
            <>
              {/* Header Section with Status and Actions */}
              <Flex justify="space-between" align="center" mb="28px">
                <Text fontSize="28px" fontWeight={700} color="#707070">
                  Tractor Specification
                </Text>
                <Flex align="center" gap="16px">
                  {statusTypes[tractor?.status]?.color && (
                    <Box
                      bgColor={statusTypes[tractor?.status].color}
                      minWidth={"161px"}
                      px={"4px"}
                      py={"8px"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      textAlign="center"
                    >
                      <Text fontSize="14px" color="white" fontWeight={500}>
                        {statusTypes[tractor?.status].title}
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Flex>

              <Flex alignItems={"start"} gap={"10px"}>
                {tractor?.tractor_video && (
                  <Box
                    minW="502px"
                    h="300px"
                    borderRadius="8px"
                    overflow="hidden"
                    border="1px solid #E2E8F0"
                  >
                    <video
                      src={tractor.tractor_video}
                      controls
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}

                <Grid gridTemplateColumns={"1fr 1fr"} width={"100%"} gap="8px">
                  {tractor?.tractor_image?.map((image, index) => (
                    <Image
                      src={image}
                      alt={`Tractor image ${index + 1}`}
                      borderRadius="8px"
                      overflow="hidden"
                      border="1px solid #E2E8F0"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  ))}
                </Grid>
              </Flex>

           

              {/* Current Location Section - Full Width */}
              <Box mb="32px">
                <Text
                  fontSize="18px"
                  fontWeight={500}
                  mb="12px"
                  color="#2D3748"
                >
                  Current Location
                </Text>
                <Box borderRadius="12px" overflow="hidden" boxShadow="md">
                  <Map addresses={[tractor?.current_address]} />
                </Box>
              </Box>

              {/* Full Specifications Table */}
              <Box>
                <TableContainer
                  // border="1px solid #E2E8F0"
                  // borderRadius="12px"
                  // boxShadow="sm"
                  bg="white"
                >
                  <Table
                    sx={{
                      "tbody tr:nth-of-type(even)": {
                        bg: "#f5f5f5",
                      },
                    }}
                  >
                    <Tbody>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Brand
                        </Td>
                        <Td py="10px">{tractor?.brand || "N/A"}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Model
                        </Td>
                        <Td py="10px">{tractor?.model || "N/A"}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Tractor Type
                        </Td>
                        <Td py="10px">{tractor?.tractor_type || "N/A"}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Tractor Rating (Horse Power)
                        </Td>
                        <Td py="10px" fontWeight={500}>
                          {tractor?.rating || "N/A"}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Purchase Year
                        </Td>
                        <Td py="10px">{tractor?.purchase_year || "N/A"}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Manufacturing Year
                        </Td>
                        <Td py="10px">{tractor?.manufactured_year || "N/A"}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Chassis Number
                        </Td>
                        <Td py="10px" fontFamily="mono" fontSize="14px">
                          {tractor?.chasis_serial_vn || "N/A"}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Plate Number
                        </Td>
                        <Td py="10px" fontFamily="mono" fontSize="14px">
                          {tractor?.plate_no || "N/A"}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Tractor Insurance
                        </Td>
                        <Td py="10px">
                          <Badge
                            colorScheme={
                              tractor?.insured == "1" ? "green" : "red"
                            }
                            variant="subtle"
                          >
                            {tractor?.insured == "1"
                              ? "Insured"
                              : "Not Insured"}
                          </Badge>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Insurance Company
                        </Td>
                        <Td py="10px">{tractor?.insurance_company || "N/A"}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Insurance Expiry Year
                        </Td>
                        <Td py="10px">{tractor?.insurance_expiry || "N/A"}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={400} color="##323232" py="10px">
                          Tractor Tracker
                        </Td>
                        <Td py="10px">{tractor?.tracker || "N/A"}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </Box>
      </Box>
      </SidebarWithHeader>
  );
}

function EmptyDataPlaceholder() {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box bgColor="white" width="100%" p="60px" textAlign="center">
        {/* <Box bgColor="white" width="400px" p="60px" textAlign="center" mt="40px"> */}
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
