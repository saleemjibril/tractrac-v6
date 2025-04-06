"use client";
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
  ModalBody,
  Modal as ChakraModal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  InputLeftAddon,
  InputGroup,
  InputLeftElement,
  Skeleton,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { saveLoginInfo } from "@/redux/features/auth/authActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { ArrowForwardIcon, ArrowRightIcon } from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hooks";
import {
  useBecomeAnAgentMutation,
  useInvestInTractorMutation,
} from "@/redux/services/userApi";
import { toast } from "react-toastify";

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

export default function InvestInTractor() {
  const { profileInfo } = useAppSelector((state) => state.auth);
  const [gender, setGender] = useState<string | null>("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    setGender(profileInfo?.gender ?? "");
  }, [profileInfo]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [formattedValue, setFormattedValue] = useState("");
  const [tractorAmount, setTractorAmount] = useState("");

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

  const [investInTractor] = useInvestInTractorMutation();

  function validateEmpty(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

  //  function validateAmount(value: any) {
  //   let error;
  //   if (!value) {
  //     error = "This field is required";
  //   }
  //   const numericValue = parseFloat(value?.replace(/,/g, "")) || 0;
  //   if(numericValue < 1){
  //     error = "Enter amount greater than 0";
  //   }
  //   return error;
  // }

  function snakeToCamelWithSpaces(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <SidebarWithHeader>
      <Flex
        px="16px"
        pb="16px"
        gap="50px"
        direction={{ base: "column", lg: "row" }}
      >
        <Stack w={{ base: "100%", lg: "60%" }}>
          <Text fontSize="24px" fontWeight={700} mb="4px">
            Invest in Tractor
          </Text>
          <Image src="/images/invest.svg" alt="Invest image" />
          <Text fontSize="20px" fontWeight={600} my="4px">
            Information
          </Text>
          <Text color="#929292">
            Financing tractors for smallholder farmers is a difficult task. The
            rising exchange rate and the high cost of meeting bank requirements
            make it difficult for smallholder farmers to afford tractors. As a
            result, many smallholder farmers in Nigeria and across Africa are
            unable to own tractors, even though they constitute 70% of farmers
            in Sub-Saharan Africa..
            <br />
            Unleash the power of your investment and transform the lives of
            small-scale farmers in Nigeria by joining our dynamic group of
            tractor investors. Together, we are revolutionizing the agricultural
            landscape.
          </Text>
        </Stack>

        <Box pr={{ base: "0px", lg: "60px" }} pt="16px" flex="1">
          {/* <Box pr={{ base: "0px", lg: "80px" }} pt="16px" flex="1"> */}
          <Box
            p="10px"
            fontSize="13px"
            bgColor="#FEF9F2"
            borderColor="#FFB547"
            borderWidth="1px"
          >
            <Text fontWeight={600}>
              Tractor prices range between N4m-N30m depending on the brand,
              capacity and the accessories.
            </Text>
            <Text color="#E35F45" mt="8px" fontSize="14px">
              <Box as="span" fontWeight={700}>
                Note:
              </Box>{" "}
              Typically you get back your ROI in 28 months.
            </Text>
          </Box>
          <Text fontWeight={500} my="24px">
            Fill the form below to Invest now
          </Text>
          <Formik
            // initialValues={{ name: 'Sasuke' }}
            initialValues={{ amount: "", units: "" }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);
              try {
                console.log(values);
                const response = await investInTractor({
                  ...values,
                  user_id: profileInfo?.id ?? 0,
                }).unwrap();
                if (response.status == "success") {
                  setSuccess(true);
                  onOpen();
                  resetForm();
                } else {
                  setError("An unknown error occured");
                }
                console.log("fulfilled", response?.data[0]);
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
                    {/* <AlertDescription>
                Your Chakra experience may be degraded.
              </AlertDescription> */}
                  </Alert>
                )}

                <Field name="amount" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.amount && form.touched.amount}
                    >
                      <FormLabel fontSize="12px" color="#929292" mb="0px">
                        How much do you want to invest
                      </FormLabel>
                      <InputGroup>
                        {/* <InputLeftAddon children="NGN" /> */}
                        <InputLeftElement pointerEvents="none" pr="6px">
                          <Text color="#929292">NGN</Text>
                        </InputLeftElement>
                        <Input
                          variant="flushed"
                          color="#929292"
                          borderColor="#929292"
                          _focusVisible={{
                            borderColor: "#929292",
                          }}
                          value={formatAmount(formattedValue)}
                          onChange={(valueString) => {
                            setFormattedValue(valueString.currentTarget.value);
                            form.setFieldValue(
                              field.name,
                              parseAmount(valueString.currentTarget.value)
                            );
                          }}
                          // {...field}

                          type="text"
                          placeholder="How much do you want to invest"
                        />
                      </InputGroup>
                      <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="units" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.units && form.touched.units}
                    >
                      <FormLabel fontSize="12px" color="#929292" mb="0px">
                        How many Tractors do you want
                      </FormLabel>
                      {/* <Input
                        variant="flushed"
                        color="#929292"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        {...field}
                        placeholder=""
                        type="number"
                      /> */}

                      <Input
                        variant="flushed"
                        color="#929292"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        value={formatAmount(tractorAmount)}
                        onChange={(valueString) => {
                          setTractorAmount(valueString.currentTarget.value);
                          form.setFieldValue(
                            field.name,
                            parseAmount(valueString.currentTarget.value)
                          );
                        }}
                        type="text"
                        placeholder="How much do you want to invest"
                      />

                      <FormErrorMessage>{form.errors.units}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="brand" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.brand && form.touched.brand}
                      mb="20px"
                    >
                      {/* <FormLabel fontSize="14px">State</FormLabel> */}
                      <Select
                        {...field}
                        color="#929292"
                        placeholder="What brand of Tractor are you interested in?"
                        sx={{
                          whiteSpace: "pre-line",
                          // Add any additional styles as needed
                        }}
                        // _placeholder={{
                        //   fontSize: "12px",
                        //   color: "red"
                        // }}
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        variant="flushed"
                        borderColor="#929292"
                      >
                        {brands.map((brand) => (
                          <option key={brand} value={brand.toLowerCase()}>
                            {snakeToCamelWithSpaces(brand)}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{form.errors.brand}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* <Field name="town">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.town && form.touched.town}
                    >
                      <FormLabel fontSize="14px">Town (Optional)</FormLabel>
                      <Input
                        borderColor="orange"
                        _focus={{
                          borderColor: "orange",
                          boxShadow: 0,
                        }}
                        variant="flushed"
                        {...field}
                        //  ref={initialRef}
                        placeholder="Enter your town"
                      />
                      <FormErrorMessage>{form.errors.town}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field> */}

                <CustomInput
                  label="Firstname"
                  fieldName="fname"
                  placeHolder="First Name"
                  type="text"
                  defaultValue={profileInfo?.fname}
                  validate={validateEmpty}
                />

                <CustomInput
                  label="Lastname"
                  fieldName="lname"
                  placeHolder="Last Name"
                  type="text"
                  defaultValue={profileInfo?.lname}
                  validate={validateEmpty}
                />

                <CustomInput
                  label="Email"
                  fieldName="email"
                  placeHolder="Email Address"
                  type="email"
                  defaultValue={profileInfo?.email}
                  // validate={validateEmpty}
                />

                <CustomInput
                  label="Phone Number"
                  fieldName="phone"
                  placeHolder="Phone Number"
                  type="number"
                  defaultValue={profileInfo?.phone}
                  validate={validateEmpty}
                />

                {/* <Field name="fname" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.fname && form.touched.fname}
                      mb="20px"
                    >
                      <FormControl mb="16px" isDisabled>
                        <FormLabel fontSize="14px">Firstname</FormLabel>
                        <Input
                          variant="flushed"
                          borderColor="#929292"
                          value={profileInfo?.fname}
                          _focus={{
                            borderColor: "orange",
                            boxShadow: 0,
                          }}
                          //  ref={initialRef}
                          placeholder="First Name"
                        />
                      </FormControl>
                      <FormErrorMessage>{form.errors.fname}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <FormControl mb="16px" isDisabled>
                  <FormLabel fontSize="14px">Lastname</FormLabel>
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={profileInfo?.lname}
                    _focus={{
                      borderColor: "orange",
                      boxShadow: 0,
                    }}
                    placeholder="Last Name"
                  />
                </FormControl>

                <FormControl isDisabled mb="16px">
                  <FormLabel fontSize="14px">Phone Number</FormLabel>
                  <Input
                    variant="flushed"
                    type="number"
                    borderColor="#929292"
                    value={profileInfo?.phone}
                    _focus={{
                      borderColor: "orange",
                      boxShadow: 0,
                    }}
                    placeholder="Phone Number"
                  />
                </FormControl>

                <FormControl isDisabled mb="16px">
                  <FormLabel fontSize="14px">Email</FormLabel>
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={profileInfo?.email}
                    _focus={{
                      borderColor: "orange",
                      boxShadow: 0,
                    }}
                    //  ref={initialRef}
                    placeholder="Email Address"
                  />
                </FormControl> */}

                <FormControl my="20px" isDisabled>
                  <Flex>
                    <Box
                      mr="14px"
                      borderWidth="1px"
                      borderColor="#FA9411"
                      width="108px"
                      cursor="pointer"
                      onClick={() => {
                        if (!profileInfo?.gender) {
                          setGender("male");
                        } else {
                          if (!gender || gender?.length < 1) {
                            setGender("male");
                          }
                        }
                      }}
                      px="16px"
                      py="8px"
                    >
                      <Flex columnGap="12px">
                        <Box
                          height="20px"
                          width="20px"
                          bgColor={
                            gender?.toLowerCase() == "male"
                              ? "#FA9411"
                              : "transparent"
                          }
                          borderColor={
                            gender?.toLowerCase() != "male"
                              ? "#FA9411"
                              : "transparent"
                          }
                          borderWidth={
                            gender?.toLowerCase() != "male" ? "1px" : "0px"
                          }
                        ></Box>
                        {/* <Spacer /> */}
                        <Text fontSize="14px">Male</Text>
                      </Flex>
                    </Box>
                    <Box
                      borderWidth="1px"
                      borderColor="#FA9411"
                      minW="108px"
                      cursor="pointer"
                      onClick={() => {
                        if (!profileInfo?.gender) {
                          setGender("female");
                        } else {
                        if (!gender || gender?.length < 1) {
                          setGender("female");
                        }
                      }
                      }}
                      // height="37px"
                      px="16px"
                      py="8px"
                    >
                      <Flex columnGap="12px">
                        <Box
                          height="20px"
                          width="20px"
                          bgColor={
                            gender?.toLowerCase() == "female"
                              ? "#FA9411"
                              : "transparent"
                          }
                          borderColor={
                            gender?.toLowerCase() != "female"
                              ? "#FA9411"
                              : "transparent"
                          }
                          borderWidth={
                            gender?.toLowerCase() != "female" ? "1px" : "0px"
                          }
                        ></Box>
                        <Text fontSize="14px">Female</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </FormControl>

                <Button
                  bgColor="#F8A730"
                  color="white"
                  width="100%"
                  my="16px"
                  fontSize="18px"
                  isLoading={props.isSubmitting}
                  isDisabled={success}
                  type="submit"
                  minHeight="50px"
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
                  <Box as="span" mr="12px">
                    Submit
                  </Box>{" "}
                  <ArrowForwardIcon boxSize="24px" />
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>

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
                alt="checkmark image icon"
              />
              <Text fontSize="16px" fontWeight={600}>
                Your submission was received
              </Text>
              <Text my="8px" fontSize="14px">
                Our Investment team will reach out to you in the next 24 hours
              </Text>
              <Button
                mb="4px"
                onClick={() => {
                  onClose();
                  router.replace("/home");
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
                Go to Home <ArrowForwardIcon ml="8px" />
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </SidebarWithHeader>
  );
}

interface CustomInputProps {
  defaultValue?: string;
  label: string;
  fieldName: string;
  placeHolder: string;
  type: string;
  validate?: (value: any) => string | undefined;
  // children: React.ReactNode;
}

const CustomInput: FC<CustomInputProps> = ({
  defaultValue,
  label,
  fieldName,
  placeHolder,
  type,
  validate,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{
    setMounted(true);
  }, [])

  if(!mounted) return <Skeleton height="30px" mt="16px" />

  return defaultValue ? (
    <FormControl mb="16px" isDisabled>
      <FormLabel fontSize="14px">{label}</FormLabel>
      <Input
        variant="flushed"
        borderColor="#929292"
        value={defaultValue}
        _focus={{
          borderColor: "orange",
          boxShadow: 0,
        }}
        placeholder={placeHolder}
      />
    </FormControl>
  ) : (
    <Field name={fieldName} validate={validate}>
      {({ field, form }: { [x: string]: any }) => (
        <FormControl
          isInvalid={form.errors[fieldName] && form.touched[fieldName]}
          mb="16px"
        >
          <Input
            {...field}
            variant="flushed"
            type={type}
            borderColor="#929292"
            color="#929292"
            // value={defaultValue}
            _focus={{
              borderColor: "orange",
              boxShadow: 0,
            }}
            _focusVisible={{
              borderColor: "#929292",
            }}
            placeholder={placeHolder}
          />
          <FormErrorMessage>{form.errors[fieldName]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const brands = ["case_ih", "sonalika", "john_deere", "mahindra", "others"];
