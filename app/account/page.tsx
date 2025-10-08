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
  Input,
  Spacer,
  InputGroup,
  InputLeftElement,
  ModalBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ModalContent,
  ModalOverlay,
  IconButton,
  Avatar,
  AvatarBadge,
  Select,
  PinInput,
  PinInputField,
  HStack,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../components/Sidenav";
import { createElement, useEffect, useState } from "react";
import PersonalOverview from "@/app/components/PersonalOverview";
import { ArrowRight, Edit, Edit2 } from "iconsax-react";
import {
  AddIcon,
  ArrowForwardIcon,
  CloseIcon,
  EditIcon,
  PlusSquareIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  useGetHiredTractorsQuery,
  useHireTractorMutation,
} from "@/redux/services/tractorApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useUpdatePasswordMutation,
  useUpdateBioDataMutation,
} from "@/redux/services/userApi";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { getUserInfo, updateUserInfo } from "../apis/user";
import { useRouter } from "next/navigation";
import { userLogout } from "@/redux/features/auth/authActions";
import { tractorMediaUploadService } from "../services/mediaUploadService";
import { sendPasswordChangeOtp, changePasswordWithOtp, resendUserOtp } from "../apis/auth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  maintenance: { title: "Maintenance", color: "#FF0000" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
};

export default function AccountPage() {
  const { profileInfo, userToken } = useAppSelector((state) => state.auth);

  console.log("profileInfo", profileInfo);

  const [modalState, setModalState] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Password change flow states
  const [passwordChangeStep, setPasswordChangeStep] = useState<"send_otp" | "verify_otp" | "change_password">("send_otp");
  const [passwordOtp, setPasswordOtp] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isOtpDisabled, setIsOtpDisabled] = useState(false);

  const [updateBioData] = useUpdateBioDataMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const router = useRouter();
const dispatch = useAppDispatch();
  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  function validateEmpty(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await tractorMediaUploadService.uploadTractorMedia(file, 'image');
      if (uploadedUrl) {
        setProfileImage(uploadedUrl);
        toast.success('Profile image uploaded successfully');
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGetUserInfo = async () => {
    if (!profileInfo?.id || !userToken) return;
    
    setLoadingUserDetails(true);
    try {
      const response = await getUserInfo(profileInfo?.id, userToken as string);
    console.log("getUserInfo", response);
      
      if (response && response.data) {
        setUserDetails(response.data);
        // Set profile image if available
        if (response.data.photo) {
          setProfileImage(response.data.photo);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoadingUserDetails(false);
    }
  };

  useEffect(() => {
    handleGetUserInfo();
  }, [profileInfo]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => {
        setOtpCountdown(otpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsOtpDisabled(false);
    }
  }, [otpCountdown]);

  const startOtpCountdown = () => {
    setOtpCountdown(60);
    setIsOtpDisabled(true);
  };

  const handleSendPasswordOtp = async () => {
    if (!profileInfo?.id || !userToken) return;
    
    try {
      await sendPasswordChangeOtp(profileInfo.id, userToken as string);
      toast.success("OTP sent to your phone successfully");
      setPasswordChangeStep("verify_otp");
      startOtpCountdown();
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error?.response?.data?.detail || "Failed to send OTP. Please try again.");
    }
  };

  const handleResendPasswordOtp = async () => {
    if (!profileInfo?.id) return;
    
    try {
      await resendUserOtp(profileInfo.id);
      toast.success("OTP resent successfully");
      startOtpCountdown();
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast.error(error?.response?.data?.detail || "Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyOtp = () => {
    if (passwordOtp.length === 4) {
      setPasswordChangeStep("change_password");
    } else {
      toast.error("Please enter a valid 4-digit OTP");
    }
  };

  return (
    <SidebarWithHeader>
      <Box>
        <Box bg="white" boxShadow="lg" borderRadius="4px">
          <Tabs>
            <TabList pt="12px" px="36px" color="#323232">
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Bio Data
              </Tab>
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Change Password
              </Tab>
              <Tab
  _selected={{
    color: "#F8A730",
    borderBottomColor: "#F8A730",
  }}
>
  Delete Account
</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box pl={{base: "0px", md: "24px"}} mr={{ base: "0px", md: "20em", lg: "30em" }}>
                  <Text fontWeight={700} fontSize="28px" mt="12px">
                    Edit Profile
                  </Text>
                  {loadingUserDetails ? (
                    <Box textAlign="center" py="40px">
                      <Text color="#929292">Loading user details...</Text>
                    </Box>
                  ) : mounted && (
                    <Box position="relative" display="inline-block">
                    <Avatar
                      my="30px"
                      size="xl"
                        name={`${userDetails?.name?.split(" ")[0] || ""} ${
                          userDetails?.name?.split(" ")[1] || ""
                      }`}
                        src={profileImage || undefined}
                    >
                        <AvatarBadge
                      cursor="pointer"
                      boxSize="1.1em"
                      bg="#F8A730"
                      onClick={() => {
                            document.getElementById('profile-image-input')?.click();
                      }}
                    >
                      <Edit2 color="white" size="18px" />
                        </AvatarBadge>
                    </Avatar>
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleProfileImageUpload}
                        disabled={isUploadingImage}
                      />
                      {isUploadingImage && (
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          bg="rgba(0,0,0,0.7)"
                          color="white"
                          px="3"
                          py="1"
                          borderRadius="md"
                          fontSize="sm"
                        >
                          Uploading...
                        </Box>
                      )}
                    </Box>
                  )}

                  {!loadingUserDetails && userDetails && (
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      phone: userDetails?.phone || "",
                      fname: userDetails?.name?.split(" ")[0] || "",
                      lname: userDetails?.name?.split(" ")[1] || "",
                      email: userDetails?.email || "",
                      gender: userDetails?.gender || "",
                      photo: profileImage,
                    }}
                    onSubmit={async (values: any, { resetForm }) => {
                      setError(null);

                      try {
                        // alert('ss')
                        console.log("my data", values);

                        const response = await updateUserInfo(
                          profileInfo?.id,
                          {
                            ...values,
                            photo: profileImage,
                          },
                          userToken as string
                        );
                        console.log("updateUserInfo", response);
                        
                        toast.success("Profile updated successfully");
                        resetForm();
                        // .unwrap();
                        // if (response.status == "success") {
                        //   toast.success(response.message);
                        // } else {
                        //   setError("An unknown error occured");
                        // }
                      } catch (err) {
                        const error = err as any;
                        toast.error(
                          error?.response?.data?.detail ||
                            "An unexpected error occurred"
                        );
                        console.log("Error submitting form", error);
                      }
                    }}
                  >
                    {(props) => (
                      <Form>
                        {error && (
                          <Alert status="error">
                            <AlertIcon />
                            <AlertTitle>{error}</AlertTitle>
                          </Alert>
                        )}

                        <Flex mt="20px" columnGap="30px">
                          <Field name="phone" validate={validateEmpty}>
                            {({ field, form }: { [x: string]: any }) => (
                              <FormControl
                                // isDisabled={true}
                                isInvalid={
                                  form.errors.phone && form.touched.phone
                                }
                              >
                                <FormLabel fontSize="12px" color="#323232">
                                  Phone number
                                </FormLabel>
                                <Input
                                  {...field}
                                  bgColor="#3232320D"
                                  fontSize="12px"
                                  color="#323232"
                                  disabled
                                />
                                <FormErrorMessage>
                                  {form.errors.phone}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Flex>

                        <Flex mt="20px" columnGap="30px">
                          <Field name="fname" validate={validateEmpty}>
                            {({ field, form }: { [x: string]: any }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.fname && form.touched.fname
                                }
                              >
                                <FormLabel fontSize="12px" color="#323232">
                                  First name
                                </FormLabel>
                                <Input
                                  {...field}
                                  bgColor="#3232320D"
                                  fontSize="12px"
                                  color="#323232"
                                />
                                <FormErrorMessage>
                                  {form.errors.fname}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <Field name="lname">
                            {({ field, form }: { [x: string]: any }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.lname && form.touched.lname
                                }
                              >
                                <FormLabel fontSize="12px" color="#323232">
                                  Last name
                                </FormLabel>
                                <Input
                                  {...field}
                                  bgColor="#3232320D"
                                  fontSize="12px"
                                  color="#323232"
                                />
                                <FormErrorMessage>
                                  {form.errors.lname}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Flex>

                        <Field name="email" validate={userDetails?.email ? undefined : validateEmpty}>
                          {({ field, form }: { [x: string]: any }) => (
                            <FormControl
                              mt="20px"
                              isDisabled={!!userDetails?.email}
                              isInvalid={
                                form.errors.email && form.touched.email
                              }
                            >
                              <FormLabel fontSize="12px" color="#323232">
                                Email address
                              </FormLabel>
                              <Input
                                {...field}
                                bgColor="#3232320D"
                                placeholder="Enter your email"
                                fontSize="12px"
                                color="#323232"
                              />
                              {userDetails?.email && (
                                <Text fontSize="10px" color="#929292" mt="4px">
                                  Email is set from your account. Contact support to change it.
                                </Text>
                              )}
                              <FormErrorMessage>
                                {form.errors.email}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="gender" validate={validateEmpty}>
                          {({ field, form }: { [x: string]: any }) => (
                            <FormControl
                              my="20px"
                              isInvalid={
                                form.errors.gender && form.touched.gender
                              }
                            >
                              <FormLabel fontSize="12px" color="#323232">
                                Gender
                              </FormLabel>
                              <Select
                                {...field}
                                bgColor="#3232320D"
                                placeholder="Select gender"
                                fontSize="12px"
                                color="#323232"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </Select>
                              <FormErrorMessage>
                                {form.errors.gender}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Flex>
                          <Button
                            my="20px"
                            bgColor="#F8A730"
                            color="white"
                            ml="auto"
                            width={{ base: "100%", md: "100%" }}
                            fontSize="16px"
                            fontWeight={600}
                            minH="50px"
                            isLoading={props.isSubmitting}
                            isDisabled={props.isSubmitting}
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
                            Update Details
                          </Button>
                        </Flex>

                        {/* </Flex> */}
                      </Form>
                    )}
                  </Formik>
                  )}
                </Box>
              </TabPanel>

              {/* 
                  UPDATE PASSWORD TAB
              */}
              <TabPanel>
                <Box pl={{base: "0px", md: "24px"}} mr={{ base: "0px", md: "20em", lg: "30em" }}>
                  <Text fontWeight={700} fontSize="28px" mt="12px" color="#F8A730">
                    {passwordChangeStep === "verify_otp" ? "Let's Verify your Number" : "Change Password"}
                  </Text>

                  <Text
                    fontWeight={400}
                    fontSize="16px"
                    color="#929292"
                    mt="4px"
                    mb="30px"
                  >
                    {passwordChangeStep === "send_otp" && "We'll send an OTP to your registered phone number to verify your identity"}
                    {passwordChangeStep === "verify_otp" && `Please enter the 4-digit code sent to your phone through SMS`}
                    {passwordChangeStep === "change_password" && "Enter your new password below"}
                  </Text>

                  {passwordError && (
                    <Alert status="error" mb="20px">
                      <AlertIcon />
                      <AlertTitle>{passwordError}</AlertTitle>
                    </Alert>
                  )}

                  {/* Step 1: Send OTP */}
                  {passwordChangeStep === "send_otp" && (
                    <Box>
                      <Alert status="info" mb="20px">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Security Verification Required</AlertTitle>
                          <Text fontSize="14px" mt="4px">
                            For your security, we need to verify your identity before allowing password changes.
                          </Text>
                        </Box>
                      </Alert>
                      
                      <Button
                        bgColor="#F8A730"
                        color="white"
                        width="100%"
                        fontSize="16px"
                        fontWeight={600}
                        minH="50px"
                        onClick={handleSendPasswordOtp}
                        _hover={{
                          bgColor: "#F8A73088",
                        }}
                        _focus={{
                          bgColor: "#F8A73088",
                        }}
                      >
                        Send OTP to My Phone
                      </Button>
                    </Box>
                  )}

                  {/* Step 2: Verify OTP */}
                  {passwordChangeStep === "verify_otp" && (
                    <Box>
                      <FormControl mb="20px">
                        <FormLabel fontSize="12px" color="#323232" mb="15px">
                          Enter 4-digit OTP
                        </FormLabel>
                        <Center>
                          <HStack spacing="15px">
                            <PinInput
                              size="lg"
                              value={passwordOtp}
                              onChange={(value) => setPasswordOtp(value)}
                              otp
                              autoFocus
                            >
                              <PinInputField
                                bgColor="#3232320D"
                                borderColor="#ECECEC"
                                _focus={{
                                  borderColor: "#F8A730",
                                  boxShadow: "0 0 0 1px #F8A730",
                                }}
                                fontSize="20px"
                                fontWeight={600}
                              />
                              <PinInputField
                                bgColor="#3232320D"
                                borderColor="#ECECEC"
                                _focus={{
                                  borderColor: "#F8A730",
                                  boxShadow: "0 0 0 1px #F8A730",
                                }}
                                fontSize="20px"
                                fontWeight={600}
                              />
                              <PinInputField
                                bgColor="#3232320D"
                                borderColor="#ECECEC"
                                _focus={{
                                  borderColor: "#F8A730",
                                  boxShadow: "0 0 0 1px #F8A730",
                                }}
                                fontSize="20px"
                                fontWeight={600}
                              />
                              <PinInputField
                                bgColor="#3232320D"
                                borderColor="#ECECEC"
                                _focus={{
                                  borderColor: "#F8A730",
                                  boxShadow: "0 0 0 1px #F8A730",
                                }}
                                fontSize="20px"
                                fontWeight={600}
                              />
                            </PinInput>
                          </HStack>
                        </Center>
                      </FormControl>

                      <Flex justifyContent="space-between" alignItems="center" mb="20px">
                        <Text fontSize="14px" color="#929292">
                          Didn't receive code?
                        </Text>
                        <Button
                          variant="link"
                          color={isOtpDisabled ? "#929292" : "#F8A730"}
                          fontSize="14px"
                          isDisabled={isOtpDisabled}
                          onClick={handleResendPasswordOtp}
                        >
                          Resend SMS {otpCountdown > 0 && `(${otpCountdown}s)`}
                        </Button>
                      </Flex>

                      <Flex gap="10px">
                        <Button
                          variant="outline"
                          borderColor="#929292"
                          color="#929292"
                          width="50%"
                          fontSize="16px"
                          fontWeight={600}
                          minH="50px"
                          onClick={() => {
                            setPasswordChangeStep("send_otp");
                            setPasswordOtp("");
                            setOtpCountdown(0);
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          bgColor="#F8A730"
                          color="white"
                          width="50%"
                          fontSize="16px"
                          fontWeight={600}
                          minH="50px"
                          isDisabled={passwordOtp.length !== 4}
                          onClick={handleVerifyOtp}
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
                          Verify OTP
                        </Button>
                      </Flex>
                    </Box>
                  )}

                  {/* Step 3: Change Password */}
                  {passwordChangeStep === "change_password" && (
                    <Formik
                      initialValues={{
                        password: "",
                        confirm_password: "",
                      }}
                      onSubmit={async (values: any, { resetForm, setSubmitting }) => {
                        setPasswordError(null);

                        // Validation
                        if (values.password.length < 8) {
                          setPasswordError("Password must be at least 8 characters");
                          setSubmitting(false);
                          return;
                        }

                        if (!/[A-Z]/.test(values.password)) {
                          setPasswordError("Password must contain at least one uppercase letter");
                          setSubmitting(false);
                          return;
                        }

                        if (values.password !== values.confirm_password) {
                          setPasswordError("Passwords do not match");
                          setSubmitting(false);
                          return;
                        }

                        try {
                          console.log("Changing password with OTP");

                          const response = await changePasswordWithOtp(
                            profileInfo?.id,
                            passwordOtp,
                            values.password,
                            values.confirm_password,
                            userToken as string
                          );

                          toast.success("Password changed successfully. Please login with your new password.");
                          
                          // Reset form and state
                          resetForm();
                          setPasswordOtp("");
                          setPasswordChangeStep("send_otp");
                          
                          // Log out user after successful password change
                          setTimeout(() => {
                            dispatch(userLogout());
                            router.replace("/login");
                          }, 2000);
                        } catch (err) {
                          const error = err as any;
                          console.error("Error changing password:", error);
                          setPasswordError(
                            error?.response?.data?.detail || 
                            error?.data?.message || 
                            "Failed to change password. Please try again."
                          );
                          setSubmitting(false);
                        }
                      }}
                    >
                      {(props) => (
                        <Form>
                          <Alert status="info" mb="20px">
                            <AlertIcon />
                            <Box>
                              <Text fontSize="14px">
                                After changing your password, you will be{" "}
                                <Text as="span" fontWeight={700} color="#F8A730">
                                  logged out
                                </Text>
                                {" "}and required to login with your{" "}
                                <Text as="span" fontWeight={700} color="#F8A730">
                                  new password
                                </Text>
                                .
                              </Text>
                            </Box>
                          </Alert>

                          <Field name="password" validate={validateEmpty}>
                            {({ field, form }: { [x: string]: any }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.password && form.touched.password
                                }
                                mb="20px"
                              >
                                <FormLabel fontSize="12px" color="#323232">
                                  New Password
                                </FormLabel>
                                <InputGroup>
                                  <Input
                                    {...field}
                                    type="text"
                                    bgColor="#3232320D"
                                    placeholder="Minimum of 8 characters"
                                    fontSize="12px"
                                    color="#323232"
                                  />
                                </InputGroup>
                                <Text fontSize="10px" color="#929292" mt="4px">
                                  Must be at least 8 characters with one uppercase letter
                                </Text>
                                <FormErrorMessage>
                                  {form.errors.password}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <Field name="confirm_password" validate={validateEmpty}>
                            {({ field, form }: { [x: string]: any }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.confirm_password &&
                                  form.touched.confirm_password
                                }
                                mb="20px"
                              >
                                <FormLabel fontSize="12px" color="#323232">
                                  Confirm New Password
                                </FormLabel>
                                <InputGroup>
                                  <Input
                                    {...field}
                                    type="text"
                                    bgColor="#3232320D"
                                    placeholder="Re-enter your password"
                                    fontSize="12px"
                                    color="#323232"
                                  />
                                </InputGroup>
                                <FormErrorMessage>
                                  {form.errors.confirm_password}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <Flex gap="10px">
                            <Button
                              variant="outline"
                              borderColor="#929292"
                              color="#929292"
                              width="50%"
                              fontSize="16px"
                              fontWeight={600}
                              minH="50px"
                              onClick={() => {
                                setPasswordChangeStep("verify_otp");
                                props.resetForm();
                              }}
                            >
                              Back
                            </Button>
                            <Button
                              bgColor="#F8A730"
                              color="white"
                              width="50%"
                              fontSize="16px"
                              fontWeight={600}
                              minH="50px"
                              isLoading={props.isSubmitting}
                              isDisabled={props.isSubmitting}
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
                              Update Password & Logout
                            </Button>
                          </Flex>
                        </Form>
                      )}
                    </Formik>
                  )}
                </Box>
              </TabPanel>
              {/* Add this to your TabList */}


{/* Add this to your TabPanels */}
<TabPanel>
  <Box pl="24px" mr={{ base: "0px", md: "20em", lg: "30em" }}>
    <Text fontWeight={700} fontSize="28px" mt="12px" color="#F03B13">
      Delete Account
    </Text>

    <Text
      fontWeight={400}
      fontSize="16px"
      color="#929292"
      mt="4px"
    >
      This action cannot be undone. Please read carefully before proceeding.
    </Text>

    {/* Warning Alert */}
    <Alert status="warning" mt="20px" mb="20px">
      <AlertIcon />
      <Box>
        <AlertTitle>Warning!</AlertTitle>
        <Text fontSize="14px" mt="8px">
          Deleting your account will permanently remove:
        </Text>
        <Text fontSize="12px" mt="4px" color="#666">
          • All your personal information and profile data<br/>
          • Your transaction history and records<br/>
          • Any active tractor hiring agreements<br/>
          • Access to all platform services
        </Text>
      </Box>
    </Alert>

    <Formik
      initialValues={{
        password: "",
        confirmation: "",
        reason: "",
      }}
      validate={(values) => {
        const errors: any = {};
        
        if (!values.password) {
          errors.password = "Password is required to delete account";
        }
        
        if (!values.confirmation) {
          errors.confirmation = "Confirmation text is required";
        } else if (values.confirmation !== "DELETE MY ACCOUNT") {
          errors.confirmation = 'Please type "DELETE MY ACCOUNT" exactly';
        }
        
        return errors;
      }}
      onSubmit={async (values: any, { resetForm, setSubmitting }) => {
        setDeleteError(null);
        
        // try {
          console.log("Delete account data", values);
          
          // Replace this with your actual delete account API call
          // const response = await deleteUserAccount(
          //   profileInfo?.id,
          //   {
          //     password: values.password,
          //     reason: values.reason,
          //   },
          //   userToken as string
          // );
          
          // if (response.status === "success") {
            setTimeout(() => {
              toast.success("Account deleted successfully");
            // Redirect to login or home page
             dispatch(userLogout());
                      router.replace("/");
            }, 2000);
          // } else {
          //   setDeleteError("Failed to delete account. Please try again.");
          // }
        // } catch (err) {
          // const error = err as any;
          // setDeleteError(
          //   error?.response?.data?.detail ||
          //   error?.data?.message ||
          //   "An unexpected error occurred while deleting your account"
          // );
          // console.log("Error deleting account", error);
        // } finally {
          setSubmitting(false);
        // }
      }}
    >
      {(props) => (
        <Form>
          {deleteError && (
            <Alert status="error" mt="20px">
              <AlertIcon />
              <AlertTitle>{deleteError}</AlertTitle>
            </Alert>
          )}

          <Field name="reason">
            {({ field, form }: { [x: string]: any }) => (
              <FormControl
                mt="30px"
                isInvalid={form.errors.reason && form.touched.reason}
              >
                <FormLabel fontSize="12px" color="#323232">
                  Reason for deletion (Optional)
                </FormLabel>
                <Select
                  {...field}
                  bgColor="#3232320D"
                  placeholder="Select reason"
                  fontSize="12px"
                  color="#323232"
                >
                  <option value="no_longer_needed">No longer needed</option>
                  <option value="privacy_concerns">Privacy concerns</option>
                  <option value="switching_platform">Switching to another platform</option>
                  <option value="technical_issues">Technical issues</option>
                  <option value="other">Other</option>
                </Select>
                <FormErrorMessage>
                  {form.errors.reason}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="password" validate={validateEmpty}>
            {({ field, form }: { [x: string]: any }) => (
              <FormControl
                mt="30px"
                isInvalid={form.errors.password && form.touched.password}
              >
                <FormLabel fontSize="12px" color="#323232">
                  Enter your password to confirm
                </FormLabel>
                <Input
                  {...field}
                  type="password"
                  bgColor="#3232320D"
                  placeholder="Enter your current password"
                  fontSize="12px"
                  color="#323232"
                />
                <FormErrorMessage>
                  {form.errors.password}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="confirmation">
            {({ field, form }: { [x: string]: any }) => (
              <FormControl
                mt="30px"
                isInvalid={form.errors.confirmation && form.touched.confirmation}
              >
                <FormLabel fontSize="12px" color="#323232">
                  Type "DELETE MY ACCOUNT" to confirm
                </FormLabel>
                <Input
                  {...field}
                  bgColor="#3232320D"
                  placeholder="DELETE MY ACCOUNT"
                  fontSize="12px"
                  color="#323232"
                />
                <FormErrorMessage>
                  {form.errors.confirmation}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Flex mt="40px" direction={{ base: "column", md: "row" }} gap="20px">
            <Button
              variant="outline"
              borderColor="#929292"
              color="#929292"
              width={{ base: "100%", md: "50%" }}
              fontSize="16px"
              fontWeight={600}
              minH="50px"
              onClick={() => {
                props.resetForm();
                // Optionally switch to another tab
              }}
              _hover={{
                borderColor: "#323232",
                color: "#323232",
              }}
            >
              Cancel
            </Button>
            
            <Button
              bgColor="#F03B13"
              color="white"
              width={{ base: "100%", md: "50%" }}
              fontSize="16px"
              fontWeight={600}
              minH="50px"
              isLoading={props.isSubmitting}
              isDisabled={props.isSubmitting}
              type="submit"
              _disabled={{
                bgColor: "#F03B1388",
              }}
              _hover={{
                bgColor: "#E03410",
              }}
              _focus={{
                bgColor: "#E03410",
              }}
            >
              Delete Account Permanently
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  </Box>
</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </SidebarWithHeader>
  );
}


