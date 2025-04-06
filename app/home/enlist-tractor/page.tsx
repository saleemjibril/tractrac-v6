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
  Image,
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
  InputGroup,
} from "@chakra-ui/react";
import * as nigerianStates from "nigerian-states-and-lgas";
import { SidebarWithHeader } from "../../components/Sidenav";
import { Formik, Form, Field } from "formik";
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

import { FileUploader } from "react-drag-drop-files";
import { FaFileUpload, FaUpload } from "react-icons/fa";
import { FiFile, FiUpload } from "react-icons/fi";
import { enlistTractor } from "@/redux/features/user/userActions";
import { usePlacesWidget } from "react-google-autocomplete";
import Autocomplete from "react-google-autocomplete";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => 1980 + i);

  const dispatch = useAppDispatch();
  const { profileInfo } = useAppSelector((state) => state.auth);
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

  const { ref } = usePlacesWidget<any>({
    apiKey: "AIzaSyBWo_tQ4rjQkZz1kN5WXfnemHCaF0gQ8BU",
    onPlaceSelected: (place) => console.log(place),
  });

  return (
    <SidebarWithHeader isAuth={true}>
      <Box bgColor="white" mx="20px" my="12px" px="34px" py="20px">
        <Stack>
          <Text fontSize="24px" fontWeight={700} mb="20px">
            Enlist your Tractors
          </Text>
          <Image src="/banner2.svg" alt="women-in-mechanization image" />
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
              brand: "",
              model: "",
              tractor_type: "",
              rating: "",
              purchase_year: "",
              plate_number: "",
              insured: "",
              tracker: "",
              lga: "",
              state: "",
            }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              if (values?.insured == "yes") {
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
                const formData = new FormData();
                formData.append("user_id", profileInfo?.id);
                formData.append("brand", values?.brand);
                formData.append("model", values?.model);
                formData.append("address", values?.address);
                formData.append("lga", values?.lga);
                formData.append("state", values?.state);
                formData.append("tractor_type", values?.tractor_type);
                formData.append("purchase_year", values?.purchase_year);
                formData.append("plate_number", values?.plate_number);
                formData.append("chasis_serial_vn", values?.chasis);
                formData.append("rating", values?.rating);
                formData.append("manufactured_year", values?.manufactured_year);
                formData.append("insured", values?.insured);
                formData.append("insurance_company", values?.insurance_company);
                formData.append("tracker", values?.tracker);
                formData.append("insurance_expiry", values?.insurance_expiry);
                formData.append("image", values?.image);
                console.log(formData);

                dispatch(enlistTractor(formData));

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
              <Form>
                {error && (
                  <Alert status="error" mb="12px">
                    <AlertIcon />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Flex columnGap="30px">
                  <Field name="brand" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.brand && form.touched.brand}
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Brand
                        </FormLabel>

                        <Select
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                          placeholder="What brand of Tractor are you
                        interested in?"
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

                <Flex mt="20px" columnGap="30px">
                  <Field name="tractor_type" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.tractor_type && form.touched.tractor_type
                        }
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Implement type
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

                  <Field name="rating" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.rating && form.touched.rating}
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Tractor rating (housepower)
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          fontSize="12px"
                          color="#323232"
                        />
                        <FormErrorMessage>
                          {form.errors.rating}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex mt="20px" columnGap="30px">
                  <Field name="purchase_year" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.purchase_year &&
                          form.touched.purchase_year
                        }
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Purchase year
                        </FormLabel>
                        <Input
                          {...field}
                          bgColor="#3232320D"
                          placeholder="Select year"
                          fontSize="12px"
                          color="#323232"
                          type="date"
                        />
                        {/* <Select
                          bgColor="#3232320D"
                          placeholder="Select year"
                          fontSize="12px"
                          color="#323232"
                        >
                          <option value="trc1">Year one</option>
                        </Select> */}
                        <FormErrorMessage>
                          {form.errors.purchase_year}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="chasis" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.chasis && form.touched.chasis}
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
                          {form.errors.chasis}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex mt="20px" columnGap="30px">
                  <Field name="plate_number" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.plate_number && form.touched.plate_number
                        }
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

                  <Field name="manufactured_year" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.manufactured_year &&
                          form.touched.manufactured_year
                        }
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
                        <FormErrorMessage>
                          {form.errors.manufactured_year}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Flex mt="20px" columnGap="30px">
                  <Field name="insured" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.insured && form.touched.insured}
                        width="20%"
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Is the tractor insured
                        </FormLabel>
                        <Select
                          {...field}
                          bgColor="#3232320D"
                          placeholder="Select"
                          fontSize="12px"
                          color="#323232"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Select>
                        <FormErrorMessage>
                          {form.errors.insured}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="insurance_expiry">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                      width="25%"
                        isInvalid={
                          form.errors.insurance_expiry &&
                          form.touched.insurance_expiry
                        }
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Insurance expiry
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
                          {form.errors.insurance_expiry}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                   <Field name="insurance_company" >
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.insurance_company &&
                          form.touched.insurance_company
                        }
                        flex="1"
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

                <Flex mt="20px" columnGap="30px">
                  <Field name="tracker" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.tracker && form.touched.tracker}
                      >
                        <FormLabel fontSize="12px" color="#323232">
                          Is there a tracker
                        </FormLabel>
                        <Select
                          {...field}
                          bgColor="#3232320D"
                          placeholder="Select"
                          fontSize="12px"
                          color="#323232"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Select>
                        <FormErrorMessage>
                          {form.errors.tracker}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="state" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.state && form.touched.state}
                        mb="20px"
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

                <Flex columnGap="30px">
                  <Field name="lga" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        // my={4}
                        isInvalid={form.errors.lga && form.touched.lga}
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
                            // alert(props.values.state);
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

                  <Field name="address" validate={validateEmpty}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        // my={4}
                        isInvalid={form.errors.address && form.touched.address}
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
                          onChange={(e)=>{
                            // alert(`Address: ${e.currentTarget?.value}`)
                            form.setFieldValue(field.name, e.currentTarget?.value);
                          }}
                          onPlaceSelected={(place) => {
                            console.log("hello", place.formatted_address);
                            // alert(place.formatted_address)
                          }}
                          options={{
                            types: ['address'],
                            // types: ["(regions)"],
                            componentRestrictions: { country: "ng" },
                          }}
                        />
                        <FormErrorMessage>
                          {form.errors.address}
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
                            src="/cloud-computing.svg"
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

                <Flex my="30px" columnGap="30px">
                  <Field name="image" validate={(e: any) => validateImage(e)}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={form.errors.image && form.touched.image}
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
                                  Tractor Image
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
                src="/images/checkmark.svg"
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

const brands = ["case_ih", "sonalika", "john_deere", "mahindra", "others"];

const tractorTypes = ["Harrower", "Ridger", "Plough", "Planter", "Sprayer"];

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
