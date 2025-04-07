"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import lookup from "country-code-lookup";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Text,
  InputLeftElement,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select as ChakraSelect,
  Link,
  Image,
  Stack,
  Center,
} from "@chakra-ui/react";
import { saveAdminInfo } from "@/redux/features/auth/authActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useLoginAdminMutation } from "@/redux/services/authApi";
import { toast } from "react-toastify";
import { ChakraWrapper } from "@/app/chakraUIWrapper";

export default function Home() {
  const dispatch = useAppDispatch();

  const [passwordShown, setPasswordVisibility] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggleVisibility = () => setPasswordVisibility(!passwordShown);
  let [countryCode, setCountryCode] = useState("234");
  const router = useRouter();

  const { loading, adminInfo } = useAppSelector((state) => state.auth);

  const [loginAdmin] = useLoginAdminMutation();

  useEffect(() => {
    // redirect authenticated user to home screen
    if (adminInfo) {
      router.replace("/admin/dashboard");
    }
  }, [router, adminInfo]);

  function validatePhoneNumber(value: any) {
    let error;
    if (!value) {
      error = "Phone number is required";
    } else if (value?.length < 10) {
      error = "Please enter a valid phone number";
      // error = "Jeez! You're not a fan 😱";
    }
    return error;
  }

  function validatePassword(value: any) {
    let error;
    if (!value) {
      error = "Password is required";
    } else if (value?.length < 6) {
      error = "Passsword must be at least 6 characters";
    }
    return error;
  }
  return (
    <ChakraWrapper>
    <Box
      bgImage="url('/images/modal-bg.jpg')"
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
        <Box width={{ base: "100%", md: "70%", xl: "40%" }}>
          <Center mb="30px">
            <Link href="/">
              <Image
                src="/logo-white.svg"
                alt="TracTrac Logo"
                width={{ base: "150px", lg: "210px" }}
              />
            </Link>
          </Center>
          <Stack
            bgColor="white"
            p={{ base: "20px", md: "40px" }}
            // height="calc(100vh - 100px)"
            justifyContent="center"

            // maxW={{ base: "100%", md: "600px" }}
          >
            <Text
              fontSize={{ base: "20px", md: "24px" }}
              // color="#FA9411"
              fontWeight="700"
              mb="12px"
            >
              Administrator Sign In
            </Text>
            <Formik
              // initialValues={{ name: 'Sasuke' }}
              initialValues={{ phone: "", password: "" }}
              onSubmit={async (values: any, actions) => {
                // dispatch(userLogin(values));

                try {
                  // alert('ss')
                  console.log(typeof values);
                  let parsePhoneNumber = values?.phone
                    .toString()
                    .startsWith("0")
                    ? values?.phone.toString().substr("0")
                    : values?.phone;
                  let phoneNumber = `${countryCode}${parsePhoneNumber}`;
                  const response = await loginAdmin({
                    ...values,
                    phone: phoneNumber,
                  }).unwrap();
                  if (response.token) {
                    dispatch(
                        saveAdminInfo({
                        admin: response?.data[0],
                        token: response.token,
                      })
                    );
                    toast.success(response.message);
                    // router.replace("/login");
                  } else {
                    setError("An unknown error occured");
                  }
                  console.log("fulfilled", response?.data[0], response.token);
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
                            type="number"
                          />
                        </InputGroup>

                        <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password" validate={validatePassword}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        my={4}
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel
                          fontSize="12px"
                          id="password-label"
                          htmlFor="password-label"
                        >
                          Password
                        </FormLabel>
                        <InputGroup size="md">
                          <Input
                            {...field}
                            pr="2.5rem"
                            type={passwordShown ? "text" : "password"}
                            id="password field"
                            // placeholder="Enter your password"
                          />
                          <InputRightElement width="2.5rem">
                            <IconButton
                              aria-label="Password visibility"
                              icon={
                                passwordShown ? <FaRegEye /> : <FaRegEyeSlash />
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

                  <Link fontSize="14px" href="/recover-password">
                    Forgot Password? {props.isSubmitting}
                  </Link>
                  <Button
                    bgColor="#F8A730"
                    color="white"
                    width="100%"
                    my="16px"
                    isLoading={props.isSubmitting}
                    type="submit"
                    _disabled={{
                      bgColor: "#F8A73088",
                    }}
                    _focus={{
                      bgColor: "#F8A73088",
                    }}
                  >
                    Sign in
                  </Button>

                </Form>
              )}
            </Formik>

            <Flex justifyContent="center" gap="12px" mt="12px">
              <Link>Privacy Policy</Link>
              <Link>Terms & Condition</Link>
            </Flex>
          </Stack>
        </Box>
      </Flex>
    </Box>
    </ChakraWrapper>
  );
}
