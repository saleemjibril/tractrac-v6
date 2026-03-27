"use client";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Box,
  Select,
  Modal as ChakraModal,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalBody,
  ModalContent,
  Textarea,
  Icon,
  InputGroup
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import * as nigerianStates from "nigerian-states-and-lgas";
import { SidebarWithHeader } from "../../components/Sidenav";
import { Formik, Form, Field } from "formik";
import { Select as MultiSelect } from "chakra-react-select";

import { useRouter } from "next/navigation";
import {
  ArrowForwardIcon,
  ArrowRightIcon,
  AttachmentIcon,
} from "@chakra-ui/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useBecomeAnAgentMutation,
  useCollaborateMutation,
} from "@/redux/services/userApi";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/utils/errorUtils";

import { FileUploader } from "react-drag-drop-files";
import { FaFileUpload, FaUpload } from "react-icons/fa";
import { FiFile, FiUpload } from "react-icons/fi";
import { enlistTractor } from "@/redux/features/user/userActions";
import AddressAutocomplete from "@/app/components/AddressAutocomplete";
import { createTractor } from "@/app/apis/tractor";
import { getBanks, verifyBankAccount } from "@/app/apis/payment";

import { useFormikContext } from "formik";
import { createTool } from "@/app/apis/tools";

// Component to monitor the specific fields
const BankFieldsMonitor = ({ onAllBankFieldsFilled }) => {
  const { values, touched, setFieldValue } = useFormikContext();

  useEffect(() => {
    // Check if all three specific bank fields have values
    if (
      (values as any).bank_account_type &&
      (values as any).bank &&
      (values as any).bank_account_number &&
      (touched as any).bank_account_type &&
      (touched as any).bank &&
      (touched as any).bank_account_number
    ) {
      // Pass both the values and the setFieldValue function
      onAllBankFieldsFilled({
        bankValues: {
          bank_account_type: (values as any).bank_account_type,
          bank: (values as any).bank,
          bank_account_number: (values as any).bank_account_number,
        },
        setFieldValue,
      });
    }
  }, [
    (values as any).bank_account_type,
    (values as any).bank,
    (values as any).bank_account_number,
    (touched as any).bank_account_type,
    (touched as any).bank,
    (touched as any).bank_account_number,
    onAllBankFieldsFilled,
    setFieldValue,
  ]);

  return null;
};

const fileTypes = ["JPG", "PNG", "JPEG"];

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export default function BecomeAnAgent() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [tractorImageError, setTractorImageError] = useState<string | null>(
    null
  );
  const [lgas, setLgas] = useState<string[]>([]);
  const [banks, setBanks] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => 1980 + i);

  const { profileInfo, userToken } = useAppSelector((state) => state.auth);
  console.log("userToken", userToken);

  const {
    loading,
    error: enlistTractorError,
    success: requestSuccessful,
  } = useAppSelector((state) => state.user);

  const inputRef = useRef<any>();

  const [collaborate] = useCollaborateMutation();

  useEffect(() => {
    if (requestSuccessful && !isOpen) {
      onOpen();
    }
    if (enlistTractorError) {
      toast.error(enlistTractorError);
    }
  }, [requestSuccessful, isOpen, onOpen, enlistTractorError]);

  function validateEmpty(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

  function validateImage(value: any) {
    // alert('jjj')
    // let error;
    if (!value) {
      setTractorImageError("This field is required");
    } else {
      setTractorImageError(null);
    }
    // return error;
  }

  const [file, setFile] = useState(null);
  const handleChange = (file: any) => {
    setFile(file);
  };

  function snakeToCamelWithSpaces(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const handleGetBanks = async () => {
    try {
      if (typeof userToken === "string") {
        const response = await getBanks(userToken);
        console.log("getBanks", response);
        setBanks(response?.data);
      } else {
        // Handle the case when userToken is not a string
        console.log("User token is not a string");
        // Maybe redirect to login or show an error
      }
    } catch (error) {
      console.log("Error fetching banks", error);
    }
  };

  useEffect(() => {
    handleGetBanks();
  }, []);

  const handleBankFieldsFilled = async ({ bankValues, setFieldValue }) => {
    try {
      console.log("All bank fields are filled:", bankValues);
      const response = await verifyBankAccount(
        bankValues?.bank_account_number,
        bankValues?.bank,
        userToken as string
      );
      console.log("verifyBankAccount", response);
      setFieldValue("bank_account_name", response?.data?.account_name);
    } catch (error) {
      console.log("Error verifying bank account", error);
      // toast.error((error as any).response?.data?.detail ||
      // "An unknown error occurred")
    }
  };

  return (
    <SidebarWithHeader isAuth={true}>
      <Box
        bgColor={{ base: "transparent", lg: "white" }}
        mx="20px"
        my="12px"
        px={{ base: "0", lg: "34px" }}
        py="20px"
      >
        <Stack>
          <Text fontSize="24px" fontWeight={700} mb="20px">
            Enlist Your Agro Tools

          </Text>
          <Image
            src="https://res.cloudinary.com/tractrac-global/image/upload/v1748563071/garden-tools-equipment-cartoon-set-agriculture-vector_fpxui3.jpg"
            alt="women-in-mechanization image"
          />
          <Text fontSize="20px" fontWeight={600} mt="10px">
            Enlist Your Agro Tools

          </Text>
          <Text fontSize="14px">
            Do you own agro tools like sprayers, harvesters, tillers, or planters that are sitting idle? Turn your equipment into a source of steady income by leasing them to farmers who need them in your area and beyond. Help other farmers grow while you earn. it’s a win-win!

Enlist your agro tools using the form below, and our team will reach out to get you started.
          </Text>
        </Stack>

        <Box pr={{ base: "0px", lg: "150px", xl: "200px" }} mt="40px">
          <Formik
            initialValues={{
              group_id: "",
              name: "",
              addon_type: "",
              description: "",
              brand: "",
              model: "",
              year_manufactured: "",
              condition: "",
              state: "",
              local_government_area: "",
              community: "",
              current_location_lat: "",
              current_location_lng: "",
              current_address: "",
              hourly_rate: 1,
              daily_rate: 1,
              weekly_rate: 1,
              seasonal_rate: 1,
              minimum_hire_duration: 1,
              specifications: "",
              power_source: "",
              power_consumption: "",
              maintenance_schedule: "",
              warranty_info: "",
              bank_account_name: "",
              bank_account_type: "",
              bank_account_number: "",
              image_urls: "hello",
              addon_image_files: "",
            }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              if (values?.is_insured == "yes") {
                if (!values?.insurance_expiry) {
                  // if (!values?.insurance_company || !values?.insurance_expiry) {
                  toast.error(
                    "Please fill in insurance expiry if tractor is ensured!"
                    // "Please fill in insurance company and expiry if tractor is ensured!"
                  );
                  // alert(values?.insurance_company)
                  return;
                }
              }

              try {
              

                console.log("userToken", userToken);
                if (
                  !values?.current_location_lat ||
                  !values?.current_location_lng
                ) {
                  toast.error("Please enter a valid location for your tractor");
                }

                console.log("values", values);
                

                // const response = await createTool(
                //   { ...values },
                //   userToken as string
                // );

                // console.log("createTractor", response);

                // toast.success("Enlisting successful");
                // setTimeout(() => {
                //   router.push("/dashboard");
                // }, 2000);

                // dispatch(enlistTractor(formData));

                // const response = await collaborate({
                //   ...values,
                //   user_id: profileInfo?.id,
                //   type: "women_in_mech",
                // }).unwrap();
                // if (response.status == "success") {
                //   // router.replace("/login");
                //   resetForm();
                //   setSuccess(true);
                //   onOpen();
                // } else {
                //   setError("An unknown error occured");
                // }
              } catch (err) {
                const error = err as any;
                const errorMessage = getErrorMessage(error, "An unexpected error occurred");
                toast.error(errorMessage);
                console.log("Error enlisting tractor", error);
              }
            }}
          >
            {(props) => (
              <Form>
                {error && (
                  <Alert status="error" mb="12px">
                    <AlertIcon />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <BankFieldsMonitor
                  onAllBankFieldsFilled={handleBankFieldsFilled}
                />

                <Flex columnGap="30px">
                  <Field name="name" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tool name
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="Enter a unique name for your tool"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="brand" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.brand && form.touched.brand}
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Brand
                        </FormLabel>

                         <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        {/* <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        /> */}
                        <FormErrorMessage>{form.errors.brand}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="model" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.model && form.touched.model}
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Model
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>{form.errors.model}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="addon_type" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.addon_type && form.touched.addon_type
                        }
                        isRequired
                        width={{ base: "100%", md: "20%" }}
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tool type
                        </FormLabel>

                        <Select
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="Select type"
                        >
                          {tractorTypes.map((tractorType) => (
                            <option
                              key={tractorType?.value}
                              value={tractorType?.value?.toLowerCase()}
                            >
                              {tractorType?.label}
                            </option>
                          ))}
                        </Select>
                        {/* <Select
                          bgColor="#3232320D"
                          placeholder="Select type"
                          fontSize="12px"
                          color="#323232"
                        >
                          <option value="trc1">Tractor one</option>
                        </Select> */}
                        <FormErrorMessage>
                          {form.errors.addon_type}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="description" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.description && form.touched.description
                        }
                        isRequired
                        flex="1"
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tool description
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>
                          {form.errors.description}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="community" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.community && form.touched.community
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Community
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>
                          {form.errors.community}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="year_manufactured" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.year_manufactured &&
                          form.touched.year_manufactured
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Manufacturing year
                        </FormLabel>
                        <Select
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="Select manufacturing year"
                        >
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </Select>
                        {/* <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        /> */}
                        <FormErrorMessage>
                          {form.errors.year_manufactured}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="condition" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.condition && form.touched.condition
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tool Condition
                        </FormLabel>
                        <Select
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="Select tool condition"
                        >
                          {conditions.map((condition) => (
                            <option key={condition} value={condition}>
                              {condition}
                            </option>
                          ))}
                        </Select>
                        {/* <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        /> */}
                        <FormErrorMessage>
                          {form.errors.condition}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="power_source" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.power_source && form.touched.power_source
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Power Source
                        </FormLabel>
                        <Select
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="Select power source"
                        >
                          {powerSources.map((source) => (
                            <option key={source} value={source}>
                              {source}
                            </option>
                          ))}
                        </Select>
                        {/* <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        /> */}
                        <FormErrorMessage>
                          {form.errors.power_source}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="power_consumption">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.power_consumption &&
                          form.touched.power_consumption
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Power Consumption
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        {/* <Select
                          bgColor="#3232320D"
                          placeholder="Select"
                          fontSize="12px"
                          color="#323232"
                        >
                          <option value="trc1">2 weeks</option>
                        </Select> */}
                        <FormErrorMessage>
                          {form.errors.power_consumption}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="specifications">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.specifications &&
                          form.touched.specifications
                        }
                        flex="1"
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tool Specifications
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>
                          {form.errors.specifications}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="state" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.state && form.touched.state}
                        mb="20px"
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          State of residence
                        </FormLabel>
                        <Select
                          // {...field}
                          placeholder="State of residence"
                          color="#929292"
                          fontSize="12px"
                          bgColor="#3232320D"
                          _focusVisible={{
                            borderColor: "#929292",
                          }}
                          onChange={(v) => {
                            const state = v.currentTarget.value || "";
                            form.setFieldValue(
                              field.name,
                              v.currentTarget.value
                            );
                            if (state.includes("abuja")) {
                              // Federal Capital Territory
                              setLgas(
                                nigerianStates.lgas(
                                  "Federal Capital Territory"
                                ) ?? []
                              );
                            } else {
                              setLgas(nigerianStates.lgas(state) ?? []);
                            }
                          }}
                        >
                          {states.map((state) => (
                            <option key={state} value={state.toLowerCase()}>
                              {state}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{form.errors.state}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  width="100%"
                >
                  <Field name="local_government_area" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        // my={4}
                        isInvalid={
                          form.errors.local_government_area &&
                          form.touched.local_government_area
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Local Government Area
                        </FormLabel>
                        <Select
                          // {...field}
                          placeholder="Local Government Area"
                          color="#929292"
                          bgColor="#3232320D"
                          fontSize="12px"
                          // borderColor="#929292"
                          _focusVisible={{
                            borderColor: "#929292",
                          }}
                          onChange={(v) => {
                            // const state = v.currentTarget.value || "";
                            form.setFieldValue(
                              field.name,
                              v.currentTarget.value
                            );
                            // alert(props.(values as any).state);
                            // setLgas(NaijaStates.lgas(state) ?? []);
                          }}
                        >
                          {lgas.map((state) => (
                            <option key={state} value={state.toLowerCase()}>
                              {state}
                            </option>
                          ))}
                        </Select>

                        <FormErrorMessage>
                          {form.errors.local_government_area}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="current_address" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        // my={4}
                        isInvalid={
                          form.errors.current_address &&
                          form.touched.current_address
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tool Address
                        </FormLabel>
                        <AddressAutocomplete
                          style={{
                            padding: "0px 10px 0px 10px",
                            borderRadius: "6px",
                            width: "100%",
                            fontSize: "12px",
                            color: "#929292",
                            height: "39px",
                            backgroundColor: "#3232320D",
                          }}
                          placeholder=""
                          onChange={(e) => {
                            // alert(`Address: ${e.currentTarget?.value}`)
                            form.setFieldValue(
                              field.name,
                              e.currentTarget?.value
                            );
                          }}
                          onPlaceSelected={(place) => {
                            console.log("Address:", place.formatted_address);

                            // Extract latitude and longitude
                            if (place.geometry && place.geometry.location) {
                              const current_location_lat =
                                place.geometry.location.lat();
                              const current_location_lng =
                                place.geometry.location.lng();
                              console.log("Latitude:", current_location_lat);
                              console.log("Longitude:", current_location_lng);

                              // Update form with address and coordinates
                              form.setFieldValue(
                                field.name,
                                place.formatted_address
                              );
                              form.setFieldValue(
                                "current_location_lat",
                                current_location_lat
                              );
                              form.setFieldValue(
                                "current_location_lng",
                                current_location_lng
                              );
                            }
                          }}
                          options={{
                            types: ["geocode", "establishment"], 
                            // types: ["geocode"], // This includes all address types
                            componentRestrictions: { country: "ng" },
                            
                          }}
                        />
                        <FormErrorMessage>
                          {form.errors.current_address}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  {/* ; */}
                  {/*
                   <Field name="address" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        // my={4}
                        isInvalid={form.errors.address && form.touched.address}
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tractor Address
                        </FormLabel>
                        <Input
                          bgColor="#3232320D"
                          color="#929292"
                          fontSize="12px"
                          _focusVisible={{
                            borderColor: "#929292",
                          }}
                          ref={ref}
                          // {...field}
                        />
                        <FormErrorMessage>
                          {form.errors.address}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field> */}
                  {/* <Field name="town">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        // my={4}
                        isInvalid={form.errors.town && form.touched.town}
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Town (Optional)
                        </FormLabel>
                        <Input
                          bgColor="#3232320D"
                          color="#929292"
                          _focusVisible={{
                            borderColor: "#929292",
                          }}
                          {...field}
                          //  ref={initialRef}
                          placeholder="Town (optional)"
                        />
                        <FormErrorMessage>{form.errors.town}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field> */}
                </Flex>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="bank_account_type" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.bank_account_type &&
                          form.touched.bank_account_type
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Bank account type
                        </FormLabel>
                        <Select
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="Select bank account type"
                        >
                          <option value={"personal"}>Personal</option>
                          <option value={"business"}>Business</option>
                        </Select>
                        <FormErrorMessage>
                          {form.errors.bank_account_type}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="bank" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.bank && form.touched.bank}
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Bank
                        </FormLabel>
                        <Select
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="Select bank name"
                        >
                          {banks?.map((bank) => (
                            <option value={(bank as any)?.code}>
                              {(bank as any)?.name}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{form.errors.bank}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="bank_account_number" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.bank_account_number &&
                          form.touched.bank_account_number
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Bank account number
                        </FormLabel>

                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />

                        {/* <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        /> */}
                        <FormErrorMessage>
                          {form.errors.bank_account_number}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="bank_account_name" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.bank_account_name &&
                          form.touched.bank_account_name
                        }
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Bank account name
                        </FormLabel>

                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          disabled
                        />

                        {/* <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        /> */}
                        <FormErrorMessage>
                          {form.errors.bank_account_name}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Field name="group_id">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.group_id && form.touched.group_id
                        }
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Group ID
                        </FormLabel>

                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />

                        {/* <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        /> */}
                        <FormErrorMessage>
                          {form.errors.group_id}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                {/* <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                  dropMessageStyle={{ marginTop: "20px" }}
                >
                  <Box
                    cursor="pointer"
                    w="100%"
                    bgColor="#2020200A"
                    py="20px"
                    px="30px"
                    borderStyle="dashed"
                    //   border
                    borderWidth="1px"
                    borderColor="#20202099"
                    borderRadius="12px"
                  >
                    <Flex columnGap="70px">
                      <Text fontSize="14px" color="#828282">
                        Upload multiply files
                      </Text>

                      <Stack textAlign="center">
                        <Center>
                          <Image
                            src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446663/cloud-computing_avygmx.svg"
                            width="60px"
                            alt="cloud computing image icon"
                          />
                        </Center>
                        <Text fontSize="20px" mt="2px">
                          Drop files here
                        </Text>
                        <Text fontSize="14px">
                          or{" "}
                          <Box
                            as="span"
                            color="#1373E6"
                            textDecoration="underline"
                          >
                            Browse Files
                          </Box>{" "}
                          from your computer.
                        </Text>
                      </Stack>
                      {file && (
                        <Text fontSize="14px" color="#828282">
                          1 Uploaded
                        </Text>
                      )}
                    </Flex>
                  </Box>
                </FileUploader> */}
                {/* </Flex> */}

                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  my="30px"
                  width="100%"
                >
                  <Field
                    name="addon_image_files"
                    validate={(e: any) => validateImage(e)}
                  >
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.addon_image_files &&
                          form.touched.addon_image_files
                        }
                        isRequired
                        width="100%"
                      >
                        <InputGroup>
                          {/*<InputLeftElement
                          pointerEvents="none"
                          children={
                            <>
                             
                            </>
                          }
                        /> */}
                          <input
                            type="file"
                            // accept={["png", "jpg"]}
                            //   name={name}
                            ref={inputRef}
                            onChange={(event) => {
                              const files = event?.currentTarget?.files;
                              if (files) {
                                const file = files[0];
                                if (file.size > MAX_IMAGE_SIZE_BYTES) {
                                  toast.error(
                                    "Image size exceeds the maximum allowed size (2MB). Please select a smaller image."
                                  );
                                  return;
                                }
                                form.setFieldValue(field.name, file);
                              }
                            }}
                            // {...field}
                            style={{ display: "none" }}
                          ></input>
                          <Box
                            onClick={() => inputRef.current?.click()}
                            borderWidth="1px"
                            borderColor="#929292"
                            borderRightWidth="0.5px"
                            borderRadius={0}
                            width="100%"
                            py={field.value ? "0px" : "8px"}
                            px="12px"
                            // overflow="hidden"
                            // height="50px"
                          >
                            {field.value ? (
                              <Flex
                                justifyContent="center"
                                alignItems="center"
                                alignContent="center"
                                my="4px"
                                columnGap="10px"
                              >
                                {/* <FiFile color="#FA9411" /> */}
                                <Icon
                                  as={FiFile}
                                  boxSize="20px"
                                  color="#FA9411"
                                />

                                <Stack alignItems="start" gap="2px">
                                  <Text
                                    // lineHeight="20px"
                                    color="#929292"
                                    fontSize="13px"
                                    fontWeight={400}
                                    // maxW="200px"
                                    // textOverflow="ellipsis"
                                    // wordBreak="break-word"
                                  >
                                    {field.value?.name}
                                  </Text>
                                  <Text
                                    color="#929292"
                                    fontSize="12px"
                                    fontWeight={400}
                                  >
                                    {(
                                      parseFloat(field.value?.size) / 1000
                                    ).toFixed(2)}{" "}
                                    KB
                                  </Text>
                                </Stack>
                              </Flex>
                            ) : (
                              <Flex
                                justifyContent="center"
                                alignItems="center"
                                alignContent="center"
                              >
                                <FiUpload color="#FA9411" />

                                <Text
                                  ml="8px"
                                  color="#929292"
                                  fontSize="16px"
                                  fontWeight={400}
                                >
                                  Tool Image
                                </Text>
                              </Flex>
                            )}
                          </Box>
                        </InputGroup>
                        {tractorImageError && (
                          <Text color="red" fontSize="14px" mt="2px">
                            {tractorImageError}
                          </Text>
                        )}
                      </FormControl>
                    )}
                  </Field>

                  <Button
                    bgColor="#F8A730"
                    color="white"
                    // mr="80px"
                    width="100%"
                    fontSize="16px"
                    fontWeight={600}
                    // mb="16px"
                    // mt="40px"
                    minH="40px"
                    isLoading={props.isSubmitting || loading}
                    isDisabled={success}
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
                    <Box as="span" mr="8px">
                      Submit
                    </Box>
                    <ArrowForwardIcon boxSize="18px" />
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>

      <ChakraModal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        size="xs"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody textAlign="center">
            <Flex flexDir="column" alignItems="center">
              <Image
                src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446823/checkmark_jyuxnj.svg"
                width="120px"
                alt="Checkmark image icon"
              />
              <Text fontSize="16px" fontWeight={600}>
                Enlisting Completed
              </Text>
              <Text my="8px" fontSize="14px">
                Thank you for providing us with this information, check you
                profile for the status of your tractor
              </Text>
              <Button
                mb="4px"
                onClick={() => {
                  onClose();
                  router.replace("/dashboard/enlisted-tractors");
                }}
                width="100%"
                height="45px"
                bgColor="#FA9411"
                _hover={{
                  bgColor: "#FA9411",
                }}
                mt="12px"
                color="white"
              >
                Go to Dashboard <ArrowForwardIcon ml="8px" />
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </SidebarWithHeader>
  );
}

const brands = ["case_ih", "sonalika", 
  // "john_deere",
   "mahindra", "others"];
const conditions = ["new", "good", "poor"];
const powerSources = ["PTO", "Hydraulic", "Hydraulic"];

const tractorTypes = [
  {
    label: "Solar Sprayer",
    value: "SOLAR_SPRAYER",
  },
  {
    label: "Fertilizer Applicator",
    value: "FERTILIZER_APPLICATOR",
  },
  {
    label: "Soil Testing Kit",
    value: "SOIL_TESTING_KIT",
  },
  {
    label: "Multi seed Thresher",
    value: "MULTI_SEED_THRESHER",
  },
  {
    label: "Treadle pump",
    value: "TREADLE_PUMP",
  },
];

const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const implementTypes = [
  {
    label: "Harrow",
    value: "harrow",
    // colorScheme: "red", // This is allowed because of the key in the `OptionBase` type
  },
  {
    label: "Plow",
    value: "plow",
  },
  {
    label: "Ridger",
    value: "ridger",
  },
  {
    label: "Harvester",
    value: "harvester",
  },
  {
    label: "Seeder",
    value: "seeder",
  },
  {
    label: "Plough",
    value: "plough",
  },
  {
    label: "Planter",
    value: "planter",
  },
  {
    label: "Sprayer",
    value: "sprayer",
  },
  // ,
  // {
  //   label: "Other",
  //   value: "other",
  // },
];
