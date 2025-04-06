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

export default function FarmersPage() {
  const { adminInfo } = useAppSelector((state) => state.auth);

  const {
    data: result,
    error,
    // isFetching,
    isLoading,
    // } = useGetHiredTractorsQuery("3");
  } = useGetFarmersQuery({});

  const [modalState, setModalState] = useState(false);
  const [search, setSearchInput] = useState("");

  function filterFarmers(farmers: any[], searchString: string): any[] {
    if (searchString.trim() === "") {
      return farmers; // If the search string is empty, return all farmers
    }

    const searchValue = searchString.trim();

    // Check if the search input is a valid number
    const isNumeric = !isNaN(parseFloat(searchValue)) && isFinite(+searchValue);

    return farmers.filter(
      (farmer) =>
        isNumeric
          ? farmer.phone.includes(searchValue) // Search by phone if it's a number
          : farmer.fname.toLowerCase().includes(searchValue.toLowerCase()) // Search by name if it's not a number
    );
  }
  let tableData = filterFarmers(result?.data, search);
  const formatPhoneNumber = (phoneNumber: string) => {
    // Format phone number as needed (e.g., adding dashes)
    return phoneNumber?.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  const formatNumberWithCommas = (number: number) => {
    // Format number with commas
    return number.toLocaleString();
  };

  const handleExportCSV = () => {
    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "First Name",
          "Last Name",
          "Phone Number",
          "Location",
          "Farm Size",
          "Agent",
        ],
        ...tableData.map((row) => [
          row.id,
          row.fname,
          row.lname,
          formatPhoneNumber(row.phone),
          row.location,
          formatNumberWithCommas(row.farm_size),
          row.agent,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

    // Create a download link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "farmers_table_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            Farmers
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
                  placeholder="Search agent by phone or first name"
                  width="300px"
                  fontSize="13px"
                  onChange={(e) => setSearchInput(e?.currentTarget.value)}
                />
              </InputGroup>

              <Spacer />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  // flexWrap: "wrap",
                  // rowGap: "15px",
                }}
              >
                <Button
                  borderWidth="1px"
                  // borderColor="#FA9411"
                  mb="12px"
                  ml="20px"
                  // height="42px"
                  borderRadius="4px"
                  // width="200px"
                  _hover={{
                    opacity: 0.5,
                  }}
                  onClick={tableData && handleExportCSV}
                >
                  <Text fontSize="14px">Export CSV</Text>
                </Button>
                <Button
                  // border="1px"
                  // borderColor="#FA9411"
                  bgColor="#FA9411"
                  mb="12px"
                  ml="20px"
                  // height="42px"
                  borderRadius="4px"
                  // width="200px"
                  px="16px"
                  py="10px"
                  color="white"
                  _hover={{
                    opacity: 0.8,
                  }}
                  onClick={() => {
                    setModalState(true);
                  }}
                >
                  <Text fontSize="14px">Add a Farmer</Text>
                </Button>
              </div>
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
              <EmptyTractorsPlaceholder />
            ) : (
              <>
                <TableContainer
                  border="1px"
                  borderColor="#32323220"
                  borderRadius="12px"
                >
                  <Table variant="simple" bgColor="white">
                    <Thead color="#323232" bgColor="#E2E8F0">
                      <Tr>
                        <Th>First Name</Th>
                        <Th>Last Name</Th>
                        <Th>Phone Number</Th>
                        <Th>Farm Size</Th>
                        <Th>Location</Th>
                        <Th>Agent</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tableData?.map((farmer: any) => (
                        <Tr key={farmer?.id}>
                          <Td>{farmer?.fname ?? "Nil"}</Td>
                          <Td>{farmer?.lname ?? "Nil"}</Td>
                          <Td>{farmer?.phone}</Td>
                          <Td>
                            {parseFloat(
                              farmer?.farm_size ?? 0
                            ).toLocaleString()}
                          </Td>
                          <Td>{farmer?.location}</Td>
                          <Td>{farmer?.agent ?? "N/a"}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </Box>
        <AddFarmerModal isOpen={modalState} setModalState={setModalState} />
      </Box>
    </AdminSidebarWithHeader>
  );
}

interface ModalProps {
  isOpen: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}

const AddFarmerModal: React.FC<ModalProps> = ({ isOpen, setModalState }) => {
  const [error, setError] = useState<string | null>(null);

  function validateEmpty(value: any) {
    // alert('jjj')
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }
  const { adminInfo } = useAppSelector((state) => state.auth);
  const [addFarmer] = useAddFarmerMutation();

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={() => setModalState(false)}
      //   closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      //   size="xs"
    >
      <ModalOverlay />
      <ModalContent px="30px" py="40px">
        <ModalBody textAlign="center" py="20px">
          <Flex>
            <IconButton
              aria-label="Close modal"
              bgColor="transparent"
              mb="50px"
              icon={<CloseIcon />}
              onClick={() => {
                setModalState(false);
              }}
            />
          </Flex>
          <Text fontSize="16px" fontWeight={600} mb="20px">
            Add a farmer
          </Text>
          <Formik
            // initialValues={{ name: 'Sasuke' }}
            initialValues={{ dob: "", school: "", course: "", id_type: "" }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              try {
                // alert('ss')
                console.log("nn", values);
                const response = await addFarmer({
                  ...values,
                  user_id: adminInfo?.id,
                }).unwrap();
                if (response.status == "success") {
                  //   resetForm();
                  toast.success(response.message);
                  setModalState(false);
                } else {
                  setError("An unknown error occured");
                }
              } catch (err) {
                const error = err as any;
                // alert('error')
                if (error?.data?.errors) {
                  // setError(error?.data?.errors[0])
                } else if (error?.data?.message) {
                  setError(error?.data?.message);
                }
                console.error("rejected", error);
              }
            }}
          >
            {(props) => (
              <Form encType="multipart/form-data">
                {error && (
                  <Alert status="error" mb="12px">
                    <AlertIcon />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Field name="fname" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      mb="16px"
                      isInvalid={form.errors.fname && form.touched.fname}
                    >
                      <Input
                        {...field}
                        variant="flushed"
                        color="#929292"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        placeholder="First Name"
                      />
                      <FormErrorMessage>{form.errors.fname}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="lname" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      mb="16px"
                      isInvalid={form.errors.lname && form.touched.lname}
                    >
                      <Input
                        {...field}
                        variant="flushed"
                        color="#929292"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        placeholder="Last Name"
                      />
                      <FormErrorMessage>{form.errors.lname}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="location" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.location && form.touched.location}
                    >
                      <Input
                        borderColor="#929292"
                        color="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        variant="flushed"
                        {...field}
                        placeholder="Location"
                      />
                      <FormErrorMessage>
                        {form.errors.location}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="phone">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.phone && form.touched.phone}
                    >
                      <Input
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        type="text"
                        color="#929292"
                        variant="flushed"
                        {...field}
                        placeholder="Phone Number"
                      />
                      <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="farm_size" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={
                        form.errors.farm_size && form.touched.farm_size
                      }
                    >
                      <Input
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        color="#929292"
                        variant="flushed"
                        {...field}
                        placeholder="Size of Farm"
                      />
                      <FormErrorMessage>
                        {form.errors.farm_size}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  bgColor="#F8A730"
                  color="white"
                  width="100%"
                  my="12px"
                  fontSize="14px"
                  fontWeight={400}
                  isLoading={props.isSubmitting}
                  //   isDisabled={success}
                  minH="48px"
                  type="submit"
                  _disabled={{
                    bgColor: "#F8A73088",
                  }}
                  _hover={{
                    bgColor: "#F8A73088",
                  }}
                  _focus={{
                    bgColor: "#F8A73088",
                  }}
                >
                  Add farmer
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

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
