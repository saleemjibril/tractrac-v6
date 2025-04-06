"use client";
import { useEffect, useState } from "react";
import TracTracPageModal from "../components/PageModal";
import { LoginModal } from "../constants";
import { useAppDispatch } from "@/redux/hooks";
import { openModal } from "@/redux/features/modalSlice";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  ModalBody,
  PinInput,
  PinInputField,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { Field, Form, Formik, useField } from "formik";
import { useRouter } from "next/navigation";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
  useRegisterUserMutation,
} from "@/redux/services/authApi";
import { toast } from "react-toastify";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function Verification() {
  const [countdown, setCountdown] = useState(45); // 2 minutes in seconds
  const [disabled, setDisabled] = useState(true);

  const router = useRouter();

  const [registerUser] = useRegisterUserMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  // const [userId, setUserId] = useState("");

  useEffect(() => {
    const phoneNumber = params.get("phone");
    // const [phoneNumber, userId, dd] = params.getAll("data");
    if (!phoneNumber) {
      router.replace("/");
      return;
    }

    if (phoneNumber?.length < 10) {
      router.replace("/");
    }
    setPhoneNumber(phoneNumber);
    // setUserId(userId);

    // console.log("PHONE", params.getAll("data"));

    if (countdown > 0 && disabled) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setDisabled(false); // Enable the button when countdown ends
    }

    // dispatch(openModal(LoginModal));
  }, [countdown, disabled, params, router]);

  const startCountdown = () => {
    setCountdown(60);
    setDisabled(true);
  };

  function validateOtp(value: any) {
    let error;
    if (!value) {
      error = "O.T.P. is required";
    } else if (value?.length < 4) {
      error = "Please enter a valid O.T.P.";
    }
    return error;
  }

  return (
    <ChakraWrapper>
    <Box
      bgImage="url('images/modal-bg.jpg')"
      bgRepeat="no-repeat"
      bgPosition="right bottom"
      bgSize="cover"
      minH="100vh"
    >
      <Flex
        height="100%"
        py="120px"
        px={{ base: "20px", md: "150px" }}
        direction="row-reverse"
        alignItems="center"
      >
        <Stack
          // margin="auto"
          bgColor="white"
          px={{ base: "20px", md: "40px" }}
          pb="80px"
          // height="400px"
          // height="calc(100vh - 100px)"
          justifyContent="center"
          maxW={{ base: "100%", md: "400px" }}
        >
          <IconButton
          backgroundColor="transparent"
          mt="80px"
          mb="30px"
          w="20px"
        
            icon={<ArrowBackIcon   boxSize="20px" />}
            aria-label="back icon"
            onClick={() => router.back()}
          />
          <Text
            textAlign="center"
            fontSize={{ base: "20px", md: "28px" }}
            color="#FA9411"
            fontWeight="700"
          >
            Verify Phone Number
          </Text>
          <Text textAlign="center">
            Please enter the 4 digit code sent to +{phoneNumber} through SMS
          </Text>
          <Formik
            // initialValues={{ name: 'Sasuke' }}
            initialValues={{ otp: "" }}
            onSubmit={async (values: any, actions) => {
              // dispatch(userLogin(values));

              try {
                // alert('ss')
                console.log(values);
                const response = await verifyOtp({
                  otp: values?.otp,
                  phone: phoneNumber,
                }).unwrap();
                if (response?.status == "success") {
                  const userData = localStorage.getItem("user_data");
                  if (!userData) {
                    toast.success("We could not complete your registration");
                    router.replace("/signup");
                    return;
                  }

                  const parsedUserData = JSON.parse(userData);
                  const r = await registerUser({
                    ...parsedUserData,
                    interests: JSON.stringify(parsedUserData.interests),
                  }).unwrap();

                  if (r?.status == "success") {
                    localStorage.removeItem("user_data");
                    toast.success(r.message);
                    router.replace("/login");
                  } else {
                    setError("An unknown error occured, please try again");
                  }
                } else {
                  setError("An unknown error occured, please try again");
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
              <Form>
                {error && (
                  <Alert status="error" my="6px">
                    <AlertIcon />
                    <AlertTitle>{error}</AlertTitle>
                    {/* <AlertDescription>
                Your Chakra experience may be degraded.
              </AlertDescription> */}
                  </Alert>
                )}

                <Field name="otp" validate={validateOtp}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.otp && form.touched.otp}
                    >
                      <Flex justifyContent="center" gap="24px" my="24px">
                        <PinInput
                          {...field}
                          onChange={(value) => {
                            console.log(value);
                            form.setFieldValue("otp", value);
                          }}
                          size="lg"
                          id="1"
                        >
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                        </PinInput>
                      </Flex>
                      <FormErrorMessage>{form.errors.otp}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

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
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
          <Flex gap="8px" justifyContent="center">
            <Box as="span" fontSize="14px">
              Didn&apos;t recieve a code?
              <Link
                ml="4px"
                color={disabled ? "#929292" : "#FA9411"}
                as="button"
                type="button"
                disabled={disabled}
                onClick={async () => {
                  if (disabled) {
                    toast.error(
                      "Please wait for the completion of the countdown timer"
                    );
                    return null;
                  }
                  try {
                    await resendOtp({
                      phone: phoneNumber,
                      type: "registration",
                    });
                    startCountdown();
                    toast.success("OTP has been resent");
                  } catch (err) {
                    const error = err as any;
                    // alert('error')
                    if (error?.data?.errors) {
                      // setError(error?.data?.errors[0])
                    } else if (error?.data?.message) {
                      toast.error(error?.data?.message);
                    }
                  }
                }}
              >
                {disabled ? "SMS Sent" : "Resend SMS"}
              </Link>
            </Box>
            <Text fontSize="14px" color="#333333">
              {countdown}s
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </Box>
    </ChakraWrapper>
  );
}
