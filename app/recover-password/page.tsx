"use client";
import { Dispatch, SetStateAction, useEffect, useId, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import lookup from "country-code-lookup";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Text,
  CircularProgress,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  InputLeftElement,
  Center,
  Select as ChakraSelect
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { saveLoginInfo } from "@/redux/features/auth/authActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  //   useResendOtpMutation,
  useSendOtpMutation,
  useResetPasswordMutation,
} from "@/redux/services/authApi";
import { toast } from "react-toastify";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChakraWrapper } from "../chakraUIWrapper";
import { forgotPassword, resetUserPassword } from "../apis/auth";

export default function RecoverPassword() {
  const router = useRouter();

  const [isSendOtp, setIsSendOtp] = useState<boolean>(true);
  const [userId, setUserId] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <ChakraWrapper>
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
          <Box width={{ base: "100%", md: "50%", xl: "40%" }}>
            <Center mb="30px">
              <Link href="/">
                <Image
                  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446665/logo-white_aerm8p.svg"
                  alt="TracTrac Logo"
                  width={{ base: "150px", lg: "210px" }}
                />
              </Link>
            </Center>
            <Stack
              bgColor="white"
              p={{ base: "20px", md: "40px" }}
              justifyContent="center"
            >
              <IconButton
                backgroundColor="transparent"
                mb="27px"
                w="20px"
                icon={<ArrowBackIcon boxSize="20px" />}
                aria-label="back icon"
                onClick={() => router.back()}
              />
              <Text
                fontSize={{ base: "20px", md: "24px" }}
                // color="#FA9411"
                fontWeight="700"
                mb="12px"
              >
                Recover Password
              </Text>

              {isSendOtp ? (
                <SendOtpComponent
                  setPhoneNumber={setPhoneNumber}
                  setPasswordResetVisibility={setIsSendOtp}
                  setUserId={setUserId}
                />
              ) : (
                <ResetPasswordComponent phoneNumber={phoneNumber}
                userId={userId}
                />
              )}
            </Stack>
          </Box>
        </Flex>
      </Box>
    </ChakraWrapper>
  );
}

function SendOtpComponent({
  setPhoneNumber,
  setPasswordResetVisibility,
  setUserId
}: {
  setPhoneNumber: Dispatch<SetStateAction<string>>;
  setPasswordResetVisibility: Dispatch<SetStateAction<boolean>>;
  setUserId: Dispatch<SetStateAction<string>>;
}) {
  const [sendOtp] = useSendOtpMutation();
  let [countryCode, setCountryCode] = useState("234");

  const [error, setError] = useState<string | null>(null);

  function validatePhoneNumber(value: any) {
    let error;
    if (!value) {
      error = "Phone number is required";
    } else if (value?.length < 10) {
      error = "Please enter a valid phone number";
    }
    return error;
  }


  return (
    <Formik
      initialValues={{ phone: "" }}
      onSubmit={async (values: any, actions) => {
        try {
          let parsePhoneNumber = values?.phone.startsWith("0") ? values?.phone : "0" + values?.phone;

          const response = await forgotPassword(parsePhoneNumber);
          // if (response.status && response.status == "success") {
          setPasswordResetVisibility(false);
          setPhoneNumber(parsePhoneNumber);
          setUserId(response?.data?.user_id);
          toast.success("OTP sent successfully");
          // router.replace("/login");
          // } else {
          //   setError("An unknown error occured");
          // }
          console.log("forgotPassword", response?.data?.user_id, response);
        } catch (error) {
          console.log("error resetting password", error);
          setError(
            (error as any).response?.data?.detail ||
              "An unknown error occurred"
          );
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
                                            //  type="number"
                                           />
                                         </InputGroup>
             
                                         <FormErrorMessage>
                                           {form.errors.phone}
                                         </FormErrorMessage>
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
  );
}

function ResetPasswordComponent({ phoneNumber, userId }: { phoneNumber: string, userId: string }) {
  const [resetPassword] = useResetPasswordMutation();

  const dispatch = useAppDispatch();

  const [passwordShown, setPasswordVisibility] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleVisibility = () => setPasswordVisibility(!passwordShown);

  const router = useRouter();

  function validateOtp(value: any) {
    let error;
    if (!value) {
      error = "O.T.P. is required";
    } else if (value?.toString().length != 4) {
      error = `Please enter a valid OTP`;
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
    <Stack>
      <Text>
        Please enter the 4 digit code sent to +{phoneNumber} through SMS
      </Text>
      <Formik
        // initialValues={{ name: 'Sasuke' }}
        initialValues={{ confirm_password: "", password: "", otp: "" }}
        onSubmit={async (values: any, actions) => {
          try {
            console.log("values", {userId,
              otp: values?.otp?.toString(),
              password: values?.password,
              confirmPassword: values?.confirm_password});
            
            const response = await resetUserPassword(
              userId,
              values?.otp?.toString(),
              values?.password,
              values?.confirm_password
            );
            toast.success(response?.data?.message);
            // if (response?.status && response?.status == "success") {
            //   toast.success(response.message);
              setTimeout(() => {
                router.replace("/login");
              }, 3000);
            // } else {
            //   setError("An unknown error occured");
            // }
            console.log("resetUserPassword", response);
          } catch (err) {
            console.log("rejected", error);
            setError(
              (error as any).response?.data?.detail ||
                "An unknown error occurred"
            );
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
            <Field name="otp" validate={validateOtp}>
              {({ field, form }: { [x: string]: any }) => (
                <FormControl isInvalid={form.errors.otp && form.touched.otp}>
                  <FormLabel
                    fontSize="12px"
                    id="otp-label"
                    htmlFor="otp-label"
                    color="#929292"
                  >
                    4 digit code
                  </FormLabel>
                  <Input
                    {...field}
                    type="number"
                    id="Otp field"
                    bgColor="#3232320D"
                    placeholder="1234"
                  />
                  <FormErrorMessage>{form.errors.otp}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="password" validate={validatePassword}>
              {({ field, form }: { [x: string]: any }) => (
                <FormControl
                  my={4}
                  isInvalid={form.errors.password && form.touched.password}
                >
                  <FormLabel
                    fontSize="12px"
                    id="password-label"
                    htmlFor="password-label"
                    color="#929292"
                  >
                    Password
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      {...field}
                      pr="2.5rem"
                      type={passwordShown ? "text" : "password"}
                      id="password field"
                      bgColor="#3232320D"
                      placeholder="Minimum of 8 characters"
                    />
                    <InputRightElement width="2.5rem">
                      <IconButton
                        aria-label="Password visibility"
                        icon={passwordShown ? <FaRegEye /> : <FaRegEyeSlash />}
                        bgColor="transparent"
                        _hover={{ bgColor: "transparent" }}
                        onClick={toggleVisibility}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="confirm_password" validate={validatePassword}>
              {({ field, form }: { [x: string]: any }) => (
                <FormControl
                  my={4}
                  isInvalid={
                    form.errors.confirm_password &&
                    form.touched.confirm_password
                  }
                >
                  <FormLabel
                    fontSize="12px"
                    id="confirm_password-label"
                    htmlFor="confirm_password-label"
                    color="#929292"
                  >
                    Confirm Password
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      {...field}
                      pr="2.5rem"
                      type={passwordShown ? "text" : "password"}
                      id="confirm password field"
                      bgColor="#3232320D"
                      placeholder="Minimum of 8 characters"
                    />
                    <InputRightElement width="2.5rem">
                      <IconButton
                        aria-label="Password visibility"
                        icon={passwordShown ? <FaRegEye /> : <FaRegEyeSlash />}
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
    </Stack>
  );
}
