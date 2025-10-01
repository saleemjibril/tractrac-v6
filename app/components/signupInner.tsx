"use client";
import { useEffect, useState } from "react";
import TracTracPageModal from "../components/PageModal";
import { SignupModal } from "../constants";
import { useAppDispatch } from "@/redux/hooks";
import { openModal } from "@/redux/features/modalSlice";
import lookup from "country-code-lookup";
import SignupModalComponent from "../components/modalPages/register";
import {
  Box,
  Center,
  Text,
  Flex,
  Stack,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Alert,
  AlertIcon,
  AlertTitle,
  Select as ChakraSelect,
  FormErrorMessage,
  InputLeftElement
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  useRegisterUserMutation,
  useSendOtpMutation,
} from "@/redux/services/authApi";
import { MultiValue, Select, useChakraSelectProps } from "chakra-react-select";
import { toast } from "react-toastify";
import NoSsrWrapper from "../components/noSsrWrapper";
import Link from "next/link";
import { ChakraWrapper } from "../chakraUIWrapper";
import { registerUser } from "../apis/auth";

interface Option {
  value: string;
  label: string;
}

export default function SignupInner() {
  const [passwordShown, setPasswordVisibility] = useState(false);
  const [gender, setGender] = useState<string | null>("male");
  const toggleVisibility = () => setPasswordVisibility(!passwordShown);
  const [error, setError] = useState<any | null>(null);
  let [countryCode, setCountryCode] = useState("234");

  const [sendOtp] = useSendOtpMutation();

  const router = useRouter();

  const rolesOptions = [
    {
      label: "I am a Farmer",
      value: "I am a Farmer",
      // colorScheme: "red", // This is allowed because of the key in the `OptionBase` type
    },
    {
      label: "Invest in Tractors",
      value: "Invest in Tractors",
    },
    {
      label: "Enlist a Tractor",
      value: "Enlist a Tractor",
    },
    {
      label: "Become an Agent",
      value: "Become an Agent",
    },
    {
      label: "Register as vendor",
      value: "Register as vendor",
    },
    {
      label: "Invest in Tractors",
      value: "Invest in Tractors",
    },
  ];

  function validateEmail(value: any) {
    let error;
    if (!value) {
      error = "Email is required";
    }
    // else if (!value?.includes("@")) {
    //   error = "Please enter a valid email";
    // }
    return error;
  }

  function validatePhoneNumber(value: any) {
    let error;
    if (!value) {
      error = "Phone number is required";
    } else if (value?.length < 10) {
      error = "Please enter a valid phone number";
    }
    return error;
  }

  function validateName(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    } else if (value?.length < 2) {
      error = "At least two characters are required";
    }
    return error;
  }

  function validatePassword(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    } else if (value?.length < 6) {
      error = "At least 6 characters are required";
    }
    return error;
  }

  function validateRoles(value: any) {
    console.log("validateRoles", value);
    let error;
    if (!value) {
      error = "Select at least one interest";
    } else if (value?.length < 1) {
      error = "Select at least one interest";
    }
    return error;
  }

  return (
    <ChakraWrapper>
      <NoSsrWrapper>
        <Box
          bgImage="url('https://res.cloudinary.com/tractrac-global/image/upload/v1746446532/modal-bg_t1hr7g.jpg')"
          bgRepeat="no-repeat"
          bgPosition="right bottom"
          bgSize="cover"
          minH="100vh"
        >
          <Flex
            height="100%"
            py="50px"
            px={{ base: "20px", md: "150px" }}
            direction="row-reverse"
          >
            <Box width={{ base: "100%", md: "60%", xl: "40%" }}>
              <Center mb="30px">
                <ChakraLink href="/">
                  <Image
                    src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446665/logo-white_aerm8p.svg"
                    alt="TracTrac Logo"
                    // layout='fill'
                    // objectFit='cover'
                    // className={styles.vercelLogo}
                    width={{ base: "150px", lg: "210px" }}
                  // height={40}
                  />
                </ChakraLink>
              </Center>
              <Stack
                bgColor="white"
                p={{ base: "20px", md: "40px" }}
                // height="calc(100vh - 100px)"
                justifyContent="center"
              // width={{ base: "100%", md: "60%", xl: "40%" }}
              // maxW={{ base: "100%", md: "500px" }}
              >
                <Text
                  fontSize={{ base: "20px", md: "24px" }}
                  // color="#FA9411"
                  fontWeight="700"
                  mb="12px"
                >
                  Create Account
                </Text>

                <Formik
                  // initialValues={{ name: 'Sasuke' }}
                  initialValues={{
                    phone: "",
                    email: "",
                    password: "",
                    first_name: "",
                    last_name: "",
                    confirm_password: "",
                    interests: []
                  }}
                  onSubmit={async (values: any, actions) => {
                    if (values.password != values.confirm_password) {
                      toast.error("Passwords do not match");
                      return;
                    }

                    try {
                      // alert('ss')
                      console.log(values);
                      // const response = await registerUser({
                      //   ...values,
                      //   interests: JSON.stringify(values.interests),
                      //   gender,
                      // }).unwrap();
                      // let ƒ = values?.phone.toString();
                      let parsePhoneNumber = values?.phone.startsWith("0") ? values?.phone : "0" + values?.phone;
                      // let phoneNumber = `${countryCode}${parsePhoneNumber}`;

                      console.log("values", values);


                      // const response = await sendOtp({
                      //   type: "registration",
                      //   phone: phoneNumber,
                      // }).unwrap();
                      // const response = await registerUser({
                      //   type: "registration",
                      //   phone: phoneNumber,
                      // }).unwrap();
                      const response = await registerUser({
                        type: "registration",
                        email: values?.email,
                        phone: parsePhoneNumber,
                        first_name: values?.first_name,
                        last_name: values?.last_name,
                        password: values?.password,
                        confirm_password: values?.confirm_password,
                        // referring_agent_id: referring_agent_id,
                        gender: "male",
                        role: "farmer"
                      })

                      console.log("registerUser", response);
                      localStorage.setItem(
                        "user_data",
                        JSON.stringify({
                          ...values,
                          phone: parsePhoneNumber,
                          gender,
                          id: response?.data?.id
                        })
                      );

                      // toast.success(response.message);
                      // const user = response?.data[0];
                      toast.success("Registration successful")
                      router.push(`/verification?phone=${values?.phone}`);
                      // } else {
                      //   setError("An unknown error occured");
                      // }
                      // console.log("fulfilled", response?.data[0], response.token);
                    } catch (error) {
                      console.log("rejected", error);
                      setError((error as any).response?.data?.detail || "An unknown error occurred");
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
                      <Field name="email">
                        {/* <Field name="email" validate={validateEmail}> */}
                        {({ field, form }: { [x: string]: any }) => (
                          <FormControl
                            mb="24px"
                          // isInvalid={form.errors.email && form.touched.email}
                          >
                            <FormLabel fontSize="12px" color="#323232">
                              Email Address
                            </FormLabel>
                            <Input
                              {...field}
                              // placeholder="Enter"
                              type="email"
                              bgColor="#3232320D"
                            />
                            <FormErrorMessage>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="phone" validate={validatePhoneNumber}>
                        {({ field, form }: { [x: string]: any }) => (
                          <FormControl
                            isInvalid={form.errors.phone && form.touched.phone}
                          >
                            <FormLabel fontSize="12px" color="#222222">
                              Phone number
                            </FormLabel>
                            <InputGroup>
                              <InputLeftElement width="5rem">
                                <ChakraSelect
                                  top="0"
                                  left="0"
                                  zIndex={1}
                                  bottom={0}
                                  ml="8px"
                                  // opacity={0}
                                  height="100%"
                                  variant="unstyled"
                                  // position="absolute"
                                  value={countryCode}
                                  onChange={(v) => {
                                    // alert(v?.currentTarget?.value)
                                    setCountryCode(v?.currentTarget?.value);
                                  }}
                                >
                                  {/* <option value="" /> */}
                                  {lookup.countries
                                    .map(({ country, isoNo }) => ({
                                      label: country,
                                      value: isoNo,
                                    }))
                                    .map((option) => (
                                      <option
                                        value={option.value}
                                        key={option.value}
                                      >
                                        +{option.value}
                                      </option>
                                    ))}
                                </ChakraSelect>
                              </InputLeftElement>
                              <Input
                                pl="68px"
                                {...field}
                                // placeholder="Enter your phone number"
                                bgColor="#3232320D"
                              // type="number"
                              />
                            </InputGroup>

                            <FormErrorMessage>
                              {form.errors.phone}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Flex mt="24px" columnGap="16px">
                        <Field name="first_name" validate={validateName}>
                          {({ field, form }: { [x: string]: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.first_name &&
                                form.touched.first_name
                              }
                            >
                              <FormLabel fontSize="12px" color="#323232">
                                First name
                              </FormLabel>
                              <Input {...field} bgColor="#3232320D" />
                              <FormErrorMessage>
                                {form.errors.first_name}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="last_name" validate={validateName}>
                          {({ field, form }: { [x: string]: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.last_name && form.touched.last_name
                              }
                            >
                              <FormLabel fontSize="12px" color="#323232">
                                Last name
                              </FormLabel>
                              <Input {...field} bgColor="#3232320D" />
                              <FormErrorMessage>
                                {form.errors.last_name}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </Flex>

                      <Field name="password" validate={validatePassword}>
                        {({ field, form }: { [x: string]: any }) => (
                          <FormControl
                            mt="24px"
                            isInvalid={
                              form.errors.password && form.touched.password
                            }
                          >
                            <FormLabel fontSize="12px" color="#323232">
                              Password
                            </FormLabel>
                            <InputGroup size="md">
                              <Input
                                {...field}
                                pr="2.5rem"
                                type={passwordShown ? "text" : "password"}
                                placeholder="Minimum of 8 characters"
                                fontSize="14px"
                                bgColor="#3232320D"
                              />
                              <InputRightElement width="2.5rem">
                                <IconButton
                                  aria-label="Password visibility"
                                  icon={
                                    passwordShown ? (
                                      <FaRegEye />
                                    ) : (
                                      <FaRegEyeSlash />
                                    )
                                  }
                                  bgColor="transparent"
                                  _hover={{ bgColor: "transparent" }}
                                  onClick={toggleVisibility}
                                />
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.password}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field
                        name="confirm_password"
                        validate={validatePassword}
                      >
                        {({ field, form }: { [x: string]: any }) => (
                          <FormControl
                            mt="24px"
                            isInvalid={
                              form.errors.confirm_password &&
                              form.touched.confirm_password
                            }
                          >
                            <FormLabel fontSize="12px" color="#323232">
                              Confirm Password
                            </FormLabel>
                            <InputGroup size="md">
                              <Input
                                {...field}
                                pr="2.5rem"
                                type={passwordShown ? "text" : "password"}
                                placeholder="Minimum of 8 characters"
                                fontSize="14px"
                                bgColor="#3232320D"
                              />
                              <InputRightElement width="2.5rem">
                                <IconButton
                                  aria-label="Password visibility"
                                  icon={
                                    passwordShown ? (
                                      <FaRegEye />
                                    ) : (
                                      <FaRegEyeSlash />
                                    )
                                  }
                                  bgColor="transparent"
                                  _hover={{ bgColor: "transparent" }}
                                  onClick={toggleVisibility}
                                />
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.confirm_password}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <FormControl isDisabled mt="24px" mb="24px">
                        {/* <FormLabel fontSize="12px" color="#323232">
                    Gender
                  </FormLabel> */}
                        <Flex>
                          <Box
                            mr="14px"
                            borderWidth="1px"
                            borderColor={
                              gender?.toLowerCase() == "male"
                                ? "#FA9411"
                                : "#BDBDBD"
                            }
                            width="100%"
                            cursor="pointer"
                            onClick={() => {
                              // alert('')
                              setGender("male");
                            }}
                            px="16px"
                            py="8px"
                          >
                            <Flex columnGap="20px">
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
                                    ? "#BDBDBD"
                                    : "transparent"
                                }
                                borderWidth={
                                  gender?.toLowerCase() != "male"
                                    ? "1px"
                                    : "0px"
                                }
                              ></Box>
                              {/* <Spacer /> */}
                              <Text fontSize="14px">Male</Text>
                            </Flex>
                          </Box>
                          <Box
                            borderWidth="1px"
                            borderColor={
                              gender?.toLowerCase() == "female"
                                ? "#FA9411"
                                : "#BDBDBD"
                            }
                            // minW="108px"
                            width="100%"
                            cursor="pointer"
                            onClick={() => {
                              // alert('')
                              setGender("female");
                            }}
                            // height="37px"
                            px="16px"
                            py="8px"
                          >
                            <Flex columnGap="20px">
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
                                    ? "#BDBDBD"
                                    : "transparent"
                                }
                                borderWidth={
                                  gender?.toLowerCase() != "female"
                                    ? "1px"
                                    : "0px"
                                }
                              ></Box>
                              <Text fontSize="14px">Female</Text>
                            </Flex>
                          </Box>
                        </Flex>
                      </FormControl>

                      <Field name="referring_agent_id">
                        {/* <Field name="referring_agent_id" validate={validatereferring_agent_id}> */}
                        {({ field, form }: { [x: string]: any }) => (
                          <FormControl
                            mb="24px"
                          // isInvalid={form.errors.referring_agent_id && form.touched.referring_agent_id}
                          >
                            <FormLabel fontSize="12px" color="#323232">
                              Agent ID
                            </FormLabel>
                            <Input
                              {...field}
                              // placeholder="Enter"
                              type="referring_agent_id"
                              bgColor="#3232320D"
                              placeholder="Enter your Agent ID"
                            />
                            <FormErrorMessage>
                              {form.errors.referring_agent_id}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="interests" validate={validateRoles}>
                        {({ field, form }: { [x: string]: any }) => (
                          <FormControl
                            mt="16px"
                            mb="20px"
                            isInvalid={
                              form.errors.interests && form.touched.interests
                            }
                          >
                            <FormLabel fontSize="12px" color="#323232">
                              Interest
                            </FormLabel>
                            <Select
                              // {...field}
                              name="Roles"
                              isMulti
                              options={rolesOptions}
                              placeholder="Select role"
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
                              {form.errors.interests}
                            </FormErrorMessage>
                            {/* <Input placeholder="Enter your first name" /> */}
                          </FormControl>
                        )}
                      </Field>

                      {/* <ChakraLink fontSize="14px">Forgot Password?</ChakraLink> */}

                      <Checkbox defaultChecked colorScheme="orange">
                        <Box as="span" fontSize="12px" lineHeight="5px">
                          By clicking Create account, I agree that I have read
                          and accepted the{" "}
                          <ChakraLink color="#1373E6" href="/terms-and-conditions">Terms of Use</ChakraLink>{" "}
                          and{" "}
                          <ChakraLink color="#1373E6" href="/privacy-policy">
                            Privacy Policy
                          </ChakraLink>
                          .
                        </Box>
                      </Checkbox>

                      <Button
                        bgColor="#F8A730"
                        color="white"
                        width="100%"
                        my="24px"
                        height="48px"
                        type="submit"
                        isLoading={props.isSubmitting}
                      >
                        Create Account
                      </Button>

                      <Flex alignItems="stretch">
                        <Button
                          as={Link}
                          href="/login"
                          prefetch={false}
                          bgColor="transparent"
                          border="1px"
                          borderColor="#F8A730"
                          color="#F8A730"
                          borderRadius={0}
                          flex={1}
                        // onClick={() => router.push("/login", {prefetch: false})}
                        >
                          Login
                        </Button>
                        <Button
                          bgColor="transparent"
                          border="1px"
                          borderColor="#F8A730"
                          color="#F8A730"
                          borderRadius={0}
                          flex={1}
                          onClick={() => router.replace("/home")}
                        >
                          I am a Guest
                        </Button>
                      </Flex>

                      {/* <Flex justifyContent="center">
                  <Box as="span">
                    Already have an account?{"  "}
                    <ChakraLink
                      color="#1373E6"
                      as="button"
                      onClick={() => router.push("/login")}
                    >
                      Sign in
                    </ChakraLink>
                  </Box>
                </Flex> */}
                    </Form>
                  )}
                </Formik>
              </Stack>
            </Box>
          </Flex>
        </Box>
      </NoSsrWrapper>
    </ChakraWrapper>
  );
}
