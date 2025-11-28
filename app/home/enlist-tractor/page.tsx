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
import { usePlacesWidget } from "react-google-autocomplete";
import Autocomplete from "react-google-autocomplete";
import { createTractor } from "@/app/apis/tractor";
import { getBanks, verifyBankAccount } from "@/app/apis/payment";
import { tractorMediaUploadService } from "@/app/services/mediaUploadService";

import { useFormikContext } from "formik";
import { implementTypes } from "@/app/utils/implementTypes";

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
const videoTypes = ["MP4", "AVI", "MOV", "WMV"];

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

function PreviewImage({ file }: { file: File }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const reader = new FileReader();
    reader.onload = () => {
      if (isMounted) setDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    return () => {
      isMounted = false;
    };
  }, [file]);

  if (!dataUrl) return null;
  return (
    <Image
      src={dataUrl}
      alt={"Preview"}
      width="100%"
      height="100%"
      objectFit="cover"
    />
  );
}

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

  const imageInputRef = useRef<any>();
  const videoInputRef = useRef<any>();

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

  function validateImages(value: any) {
    if (!value || value.length === 0) {
      setTractorImageError("At least one image is required");
    } else if (value.length > 4) {
      setTractorImageError("Maximum 4 images allowed");
    } else {
      setTractorImageError(null);
    }
  }

  function validateVideo(value: any) {
    // Video is optional, so no validation needed
    return null;
  }

  function isAnyMediaUploading(values: any): boolean {
    // Only check video uploads since images are handled as files
    const videoUploading = values?.tractor_video?.uploading || false;
    return videoUploading;
  }

  const [files, setFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const handleChange = (file: any) => {
    setFiles([file]);
  };

  function snakeToCamelWithSpaces(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const { ref } = usePlacesWidget<any>({
    apiKey: "AIzaSyBWo_tQ4rjQkZz1kN5WXfnemHCaF0gQ8BU",
    onPlaceSelected: (place) => console.log(place),
  });

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
      <Box bgColor={{base: "transparent", lg: "white"}} mx="20px" my="12px" px={{base: "0", lg: "34px"}} py="20px">
        <Stack>
          <Text fontSize="24px" fontWeight={700} mb="20px">
            Enlist your Tractors
          </Text>
          <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446674/banner2_mgdjcu.svg" alt="women-in-mechanization image" />
          <Text fontSize="20px" fontWeight={600} mt="10px">
            Enlist Your Tractors
          </Text>
          <Text fontSize="14px">
            Are you a tractor owner seeking an opportunity to generate
            additional income by leasing it to fellow farmers in your community?
            Earn regular income every time your tractor is leased, both within
            and outside your community. Register your tractor using the form
            below, and we&apos;ll be in contact with you soon.
          </Text>
        </Stack>

        <Box pr={{ base: "0px", lg: "150px", xl: "200px" }} mt="40px">
          <Formik
            initialValues={{
              name: "",
              brand: "",
              model: "",
              year: "",
              purchase_year: "",
              horsepower: "",
              chassis_vin: "",
              plate_number: "",
              is_insured: false,
              insurance_company: "",
              insurance_expiry: "",
              // has_tracker: false,
              tractor_type: "",
              implement_types: "",
              bank_account_name: "",
              bank_account_type: "",
              bank_account_number: "",
              current_location_lat: "",
              current_location_lng: "",
              current_address: "",
              state: "",
              lga: "",
              tractor_image_files: [],
              tractor_video: "",
              group_id: ""
            }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              // Check if any media is currently uploading
              if (isAnyMediaUploading(values)) {
                toast.error("Please wait for all media to finish uploading before submitting.");
                return;
              }

              if (values?.is_insured == true) {
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
                // alert('ss')
                console.log(values);
                // Prepare data for backend submission
                const submissionData = {
                  name: values?.name,
                  user_id: profileInfo?.id,
                  brand: values?.brand,
                  model: values?.model,
                  current_address: values?.current_address,
                  lga: values?.lga,
                  state: values?.state,
                  tractor_type: values?.tractor_type,
                  implement_types: values?.implement_types,
                  purchase_year: values?.purchase_year,
                  plate_number: values?.plate_number,
                  chassis_vin: values?.chassis_vin,
                  horsepower: values?.horsepower,
                  year: values?.year,
                  is_insured: values?.is_insured,
                  insurance_company: values?.insurance_company,
                  has_tracker: false,
                  insurance_expiry: values?.insurance_expiry,
                  // Images remain as files, video is Cloudinary URL
                  tractor_image_files: values?.tractor_image_files || [],
                  tractor_video: values?.tractor_video?.url || values?.tractor_video || "",
                  group_id: values?.group_id,
                  current_location_lat: values?.current_location_lat,
                  current_location_lng: values?.current_location_lng,
                  bank_account_type: values?.bank_account_type,
                  bank: values?.bank,
                  bank_account_number: values?.bank_account_number,
                  bank_account_name: values?.bank_account_name,
                };
                
                console.log("Submission data:", submissionData);

                console.log("userToken", userToken);
                if(!values?.current_location_lat || !values?.current_location_lng) {
                  toast.error("Please enter a valid location for your tractor")
                }

                const response = await createTractor(
                  submissionData,
                  userToken as string
                );

                console.log("createTractor", response);

                toast.success("Enlisting successful");
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

                <Flex columnGap="30px" >
                  <Field name="name" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tractor Name
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="Enter a unique name for your tractor"
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
                width="100%">
                  <Field name="brand" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.brand && form.touched.brand}
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Brand
                        </FormLabel>

                        <Select
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="What brand of Tractor do you have?"
                          // _placeholder={{
                          //   fontSize: "12px",
                          //   color: "red"
                          // }}
                          // _focusVisible={{
                          //   borderColor: "#929292",
                          // }}
                          // variant="flushed"
                          // borderColor="#929292"
                        >
                          {brands.map((brand) => (
                            <option key={brand} value={brand.toLowerCase()}>
                              {snakeToCamelWithSpaces(brand)}
                            </option>
                          ))}
                        </Select>

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

                <Flex  direction={{ base: "column", md: "row" }}
  columnGap={{ base: "0", md: "30px" }}
  rowGap={{ base: "20px", md: "0" }}
  mt="20px"
  width="100%">
                  <Field name="tractor_type" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.tractor_type && form.touched.tractor_type
                        }
                        isRequired
                        width={{ base: "100%", md: "20%" }}
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tractor type
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
                              key={tractorType}
                              value={tractorType.toLowerCase()}
                            >
                              {tractorType}
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
                          {form.errors.tractor_type}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="implement_types" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.implement_types &&
                          form.touched.implement_types
                        }
                        width={{ base: "100%", md: "25%" }}
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Implement Type
                        </FormLabel>
                        <MultiSelect
                          // {...field}
                          name="Roles"
                          isMulti
                          options={implementTypes}
                          placeholder="Select implements"
                          onChange={(option) => {
                            console.log(option.at(0));
                            form.setFieldValue(
                              field.name,
                              option.map((e) => e.value)
                            );
                          }}
                          // id="roles-select-field"
                        />
                        <FormErrorMessage>
                          {form.errors.implement_types}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="horsepower" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.horsepower && form.touched.horsepower
                        }
                        isRequired
                        flex="1"
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tractor rating (horsepower)
                        </FormLabel>
                        <Input
                          {...field}
                          type="number"
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>
                          {form.errors.horsepower}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex  direction={{ base: "column", md: "row" }}
  columnGap={{ base: "0", md: "30px" }}
  rowGap={{ base: "20px", md: "0" }}
  mt="20px"
  width="100%">
                  <Field name="purchase_year" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.purchase_year &&
                          form.touched.purchase_year
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Purchase year
                        </FormLabel>
                        <Select
                          {...field}
                          bgColor="#3232320D"
                          placeholder="Select year"
                          fontSize="12px"
                          color="#323232"
                        >
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>
                          {form.errors.purchase_year}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="chassis_vin" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.chassis_vin && form.touched.chassis_vin
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Chasis number
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>
                          {form.errors.chassis_vin}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex  direction={{ base: "column", md: "row" }}
  columnGap={{ base: "0", md: "30px" }}
  rowGap={{ base: "20px", md: "0" }}
  mt="20px"
  width="100%">
                  <Field name="plate_number" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.plate_number && form.touched.plate_number
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Plate number
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>
                          {form.errors.plate_number}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="year" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.year && form.touched.year}
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
                          placeholder="Select year"
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
                        <FormErrorMessage>{form.errors.year}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex  direction={{ base: "column", md: "row" }}
  columnGap={{ base: "0", md: "30px" }}
  rowGap={{ base: "20px", md: "0" }}
  mt="20px"
  width="100%">
                  <Field name="is_insured" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.is_insured && form.touched.is_insured
                        }
                        width={{ base: "100%", md: "20%" }}
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Is the tractor insured
                        </FormLabel>
                        <Select
                          {...field}
                          onChange={(e) => {
                            const boolValue = e.target.value === "true";
                            form.setFieldValue(field.name, boolValue);
                          }}
                          value={field.value?.toString()}
                          bgColor="#3232320D"
                          placeholder="Select"
                          fontSize="12px"
                          color="#323232"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </Select>
                        <FormErrorMessage>
                          {form.errors.is_insured}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="insurance_expiry">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                      width={{ base: "100%", md: "25%" }}
                      isInvalid={
                          form.errors.insurance_expiry &&
                          form.touched.insurance_expiry
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Insurance expiry
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          type="date"
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
                          {form.errors.insurance_expiry}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="insurance_company">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.insurance_company &&
                          form.touched.insurance_company
                        }
                        flex="1"
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Insurance company
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>
                          {form.errors.insurance_company}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex  direction={{ base: "column", md: "row" }}
  columnGap={{ base: "0", md: "30px" }}
  rowGap={{ base: "20px", md: "0" }}
  mt="20px"
  width="100%">
                  {/* <Field name="has_tracker" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.has_tracker && form.touched.has_tracker
                        }
                        isRequired
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Is there a tracker
                        </FormLabel>
                        <Select
                          {...field}
                          onChange={(e) => {
                            const boolValue = e.target.value === "true";
                            form.setFieldValue(field.name, boolValue);
                          }}
                          value={field.value?.toString()}
                          bgColor="#3232320D"
                          placeholder="Select"
                          fontSize="12px"
                          color="#323232"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </Select>
                        <FormErrorMessage>
                          {form.errors.has_tracker}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field> */}

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
                  <Field name="lga" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        // my={4}
                        isInvalid={form.errors.lga && form.touched.lga}
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

                        <FormErrorMessage>{form.errors.lga}</FormErrorMessage>
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
                          Tractor Address
                        </FormLabel>
                        <Autocomplete
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
                          apiKey={"AIzaSyBWo_tQ4rjQkZz1kN5WXfnemHCaF0gQ8BU"}
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
                            types: ["address"],
                            // types: ["(regions)"],
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

                <Flex  direction={{ base: "column", md: "row" }}
  columnGap={{ base: "0", md: "30px" }}
  rowGap={{ base: "20px", md: "0" }}
  mt="20px"
  width="100%">
                  <Field name="bank_account_type" 
                  // validate={validateEmpty}
                  >
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.bank_account_type &&
                          form.touched.bank_account_type
                        }
                        // isRequired
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

                  <Field name="bank" 
                  // validate={validateEmpty}
                  >
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.bank && form.touched.bank}
                        // isRequired
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
                <Flex  direction={{ base: "column", md: "row" }}
  columnGap={{ base: "0", md: "30px" }}
  rowGap={{ base: "20px", md: "0" }}
  mt="20px"
  width="100%">
                  <Field name="bank_account_number" // validate={validateEmpty}
                  >
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.bank_account_number &&
                          form.touched.bank_account_number
                        }
                        // isRequired
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

                  <Field name="bank_account_name" // validate={validateEmpty}
                  >
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
                <Flex  direction={{ base: "column", md: "row" }}
  columnGap={{ base: "0", md: "30px" }}
  rowGap={{ base: "20px", md: "0" }}
  mt="20px"
  width="100%">
                  <Field name="group_id">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.group_id &&
                          form.touched.group_id
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
                 direction={"column"}
                 columnGap={"30px"}
                 rowGap={"20px"}
                 my="30px"
                 width="100%"
                >
                  <Field
                    name="tractor_image_files"
                    validate={(e: any) => validateImages(e)}
                  >
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.tractor_image_files &&
                          form.touched.tractor_image_files
                        }
                        isRequired
                        width="100%"
                      >
                        <InputGroup>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={imageInputRef}
                            onChange={(event) => {
                              const selectedFiles = event?.currentTarget?.files;
                              if (selectedFiles) {
                                const fileArray = Array.from(selectedFiles);
                                
                                // Check if more than 4 files are selected
                                if (fileArray.length > 4) {
                                  toast.error("Maximum 4 images allowed");
                                  return;
                                }
                                
                                // Check file sizes
                                for (const file of fileArray) {
                                  if (file.size > MAX_IMAGE_SIZE_BYTES) {
                                    toast.error(
                                      `${file.name} exceeds the maximum allowed size (2MB). Please select a smaller image.`
                                    );
                                    return;
                                  }
                                }
                                
                                // Get current files and add new ones
                                const currentFiles = field.value || [];
                                const newFiles = [...currentFiles, ...fileArray];
                                
                                // Ensure we don't exceed 4 files total
                                if (newFiles.length > 4) {
                                  toast.error("Maximum 4 images allowed");
                                  return;
                                }
                                
                                form.setFieldValue(field.name, newFiles);
                              }
                            }}
                            style={{ display: "none" }}
                          ></input>
                          <Box
                            onClick={() => imageInputRef.current?.click()}
                            borderWidth="1px"
                            borderColor="#929292"
                            borderRightWidth="0.5px"
                            borderRadius={0}
                            width="100%"
                            py={field.value && field.value.length > 0 ? "0px" : "8px"}
                            px="12px"
                          >
                            {field.value && field.value.length > 0 ? (
                              <Stack spacing="2" my="4px">
                                <Text fontSize="12px" color="#323232" fontWeight={600}>
                                  Selected Images ({field.value.length}/4):
                                </Text>
                                {field.value.map((file: File, index: number) => (
                                  <Flex
                                    key={index}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    columnGap="10px"
                                    p="2"
                                    border="1px solid #E2E8F0"
                                    borderRadius="md"
                                  >
                                    <Flex alignItems="center" columnGap="10px">
                                      <Box
                                        width="40px"
                                        height="40px"
                                        borderRadius="md"
                                        overflow="hidden"
                                        bg="gray.100"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                      >
                                        {/* Avoid creating object URLs in render; use FileReader for previews */}
                                        <PreviewImage file={file} />
                                      </Box>
                                      <Stack alignItems="start" gap="2px">
                                        <Text
                                          color="#323232"
                                          fontSize="13px"
                                          fontWeight={500}
                                          maxW="200px"
                                          textOverflow="ellipsis"
                                          whiteSpace="nowrap"
                                        >
                                          {file.name}
                                        </Text>
                                        <Text
                                          color="#929292"
                                          fontSize="12px"
                                          fontWeight={400}
                                        >
                                          {(parseFloat(file.size.toString()) / 1000).toFixed(2)} KB
                                        </Text>
                                      </Stack>
                                    </Flex>
                                    <Button
                                      size="sm"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newFiles = field.value.filter((_: File, i: number) => i !== index);
                                        form.setFieldValue(field.name, newFiles);
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </Flex>
                                ))}
                              </Stack>
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
                                  Tractor Images (Max 4)
                                </Text>
                                {field.value && field.value.length > 0 && (
                                  <Text
                                    ml="8px"
                                    color="#FA9411"
                                    fontSize="14px"
                                    fontWeight={600}
                                  >
                                    ({field.value.length}/4)
                                  </Text>
                                )}
                              </Flex>
                            )}
                            
                            {/* Show "Add More Images" button if there are already some images */}
                            {field.value && field.value.length > 0 && field.value.length < 4 && (
                              <Button
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  imageInputRef.current?.click();
                                }}
                                mt="2"
                                width="100%"
                              >
                                Add More Images ({field.value.length}/4)
                              </Button>
                            )}
                            
                            {/* Show "Clear All" button if there are images */}
                            {field.value && field.value.length > 0 && (
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  form.setFieldValue(field.name, []);
                                }}
                                mt="2"
                                width="100%"
                              >
                                Clear All Images
                              </Button>
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

                  <Field
                    name="tractor_video"
                    validate={(e: any) => validateVideo(e)}
                  >
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.tractor_video &&
                          form.touched.tractor_video
                        }
                        width="100%"
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tractor Video (Optional)
                        </FormLabel>
                        <InputGroup>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={async (event) => {
                              const selectedFile = event?.currentTarget?.files?.[0];
                              if (selectedFile) {
                                // Check file size (10MB max for video)
                                const MAX_VIDEO_SIZE_BYTES = 10 * 1024 * 1024;
                                if (selectedFile.size > MAX_VIDEO_SIZE_BYTES) {
                                  toast.error(
                                    "Video size exceeds the maximum allowed size (10MB). Please select a smaller video."
                                  );
                                  return;
                                }
                                
                                // Show loading state
                                form.setFieldValue(field.name, { ...selectedFile, uploading: true });
                                
                                try {
                                  // Upload video to Cloudinary using the service
                                  const uploadedVideo = await tractorMediaUploadService.uploadSingleVideo(selectedFile);
                                  
                                  if (uploadedVideo) {
                                    // Store the Cloudinary URL instead of the file
                                    form.setFieldValue(field.name, {
                                      ...uploadedVideo,
                                      originalFile: selectedFile
                                    });
                                    toast.success("Video uploaded successfully!");
                                  } else {
                                    toast.error("Failed to upload video. Please try again.");
                                    form.setFieldValue(field.name, "");
                                  }
                                } catch (error) {
                                  console.error("Error uploading video:", error);
                                  toast.error("Error uploading video. Please try again.");
                                  form.setFieldValue(field.name, "");
                                }
                              }
                            }}
                            style={{ display: "none" }}
                            ref={videoInputRef}
                          ></input>
                          <Box
                            onClick={() => videoInputRef.current?.click()}
                            borderWidth="1px"
                            borderColor="#929292"
                            borderRightWidth="0.5px"
                            borderRadius={0}
                            width="100%"
                            py={field.value ? "0px" : "8px"}
                            px="12px"
                          >
                            {field.value ? (
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                columnGap="10px"
                              >
                                <Flex alignItems="center" columnGap="10px">
                                  <Icon
                                    as={FiFile}
                                    boxSize="20px"
                                    color="#FA9411"
                                  />
                                  <Stack alignItems="start" gap="2px">
                                    <Text
                                      color="#929292"
                                      fontSize="13px"
                                      fontWeight={400}
                                      maxW="200px"
                                      textOverflow="ellipsis"
                                      whiteSpace="nowrap"
                                    >
                                      {field.value.fileName || field.value.name || "Video file"}
                                    </Text>
                                    <Text
                                      color="#929292"
                                      fontSize="12px"
                                      fontWeight={400}
                                    >
                                      {field.value.fileSize || 
                                        (field.value.size ? 
                                          (parseFloat(field.value.size.toString()) / (1024 * 1024)).toFixed(2) + " MB" : 
                                          "Unknown size"
                                        )
                                      }
                                    </Text>
                                    {field.value.uploading && (
                                      <Text
                                        color="#FA9411"
                                        fontSize="12px"
                                        fontWeight={500}
                                      >
                                        Uploading...
                                      </Text>
                                    )}
                                  </Stack>
                                </Flex>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.setFieldValue(field.name, "");
                                  }}
                                >
                                  Remove
                                </Button>
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
                                  Tractor Video (Optional)
                                </Text>
                              </Flex>
                            )}
                          </Box>
                        </InputGroup>
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
                    isLoading={props.isSubmitting || loading || 
                      props.values?.tractor_video?.uploading}
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

const tractorTypes = ["small", "medium", "large", "specialized", "utility"];

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


