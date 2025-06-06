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

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
};

export default function AccountPage() {
  const { profileInfo, userToken } = useAppSelector((state) => state.auth);

  console.log("profileInfo", profileInfo);

  const [modalState, setModalState] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  const handleGetUserInfo = () => {
    const response = getUserInfo(profileInfo?.id, userToken as string);
    console.log("getUserInfo", response);
  };

  useEffect(() => {
    handleGetUserInfo();
  }, [profileInfo]);

  return (
    <SidebarWithHeader>
      <Box mx="20px" my="12px" py="12px">
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
                <Box pl="24px" mr={{ base: "0px", md: "20em", lg: "30em" }}>
                  <Text fontWeight={700} fontSize="28px" mt="12px">
                    Edit Profile
                  </Text>
                  {mounted && (
                    <Avatar
                      my="30px"
                      size="xl"
                      name={`${profileInfo?.name?.split(" ")[0]} ${
                        profileInfo?.name?.split(" ")[1]
                      }`}
                      src={undefined}
                    >
                      {/* <AvatarBadge
                      cursor="pointer"
                      boxSize="1.1em"
                      bg="#F8A730"
                      onClick={() => {
                        alert("hello");
                      }}
                    >
                      <Edit2 color="white" size="18px" />
                    </AvatarBadge> */}
                    </Avatar>
                  )}

                  <Formik
                    initialValues={{
                      phone: profileInfo?.phone,
                      fname: profileInfo?.name?.split(" ")[0],
                      lname: profileInfo?.name?.split(" ")[1],
                      email: profileInfo?.email,
                      gender: profileInfo?.gender,
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
                          },
                          userToken as string
                        );
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

                        <Field name="email" validate={validateEmpty}>
                          {({ field, form }: { [x: string]: any }) => (
                            <FormControl
                              mt="20px"
                              // isDisabled={true}
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
                </Box>
              </TabPanel>

              {/* 
                  UPDATE PASSWORD TAB
              */}
              <TabPanel>
                <Box pl="24px" mr={{ base: "0px", md: "20em", lg: "30em" }}>
                  <Text fontWeight={700} fontSize="28px" mt="12px">
                    Change Password
                  </Text>

                  <Text
                    fontWeight={400}
                    fontSize="16px"
                    color="#929292"
                    mt="4px"
                  >
                    Please fill the form below to change Your Password
                  </Text>

                  <Formik
                    initialValues={{
                      old_password: "",
                      password: "",
                      confirm_password: "",
                    }}
                    onSubmit={async (values: any, { resetForm }) => {
                      setPasswordError(null);

                      try {
                        // alert('ss')
                        console.log(values);

                        const response = await updatePassword({
                          ...values,
                          user_id: profileInfo?.id,
                          //   tractor_id: id,
                        }).unwrap();
                        if (response.status == "success") {
                          resetForm();
                          toast.success(response.message);
                        } else {
                          setPasswordError("An unknown error occured");
                        }
                      } catch (err) {
                        const error = err as any;
                        // alert('error')
                        if (error?.data?.errors) {
                          // setError(error?.data?.errors[0])
                        } else if (error?.data?.message) {
                          setPasswordError(error?.data?.message);
                        }
                        console.log("rejected", error);
                      }
                    }}
                  >
                    {(props) => (
                      <Form>
                        {passwordError && (
                          <Alert status="error" mt="30px">
                            <AlertIcon />
                            <AlertTitle>{passwordError}</AlertTitle>
                          </Alert>
                        )}

                        <Flex mt="30px" columnGap="30px">
                          <Field name="old_password" validate={validateEmpty}>
                            {({ field, form }: { [x: string]: any }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.old_password &&
                                  form.touched.old_password
                                }
                              >
                                <FormLabel fontSize="12px" color="#323232">
                                  Old Password
                                </FormLabel>
                                <Input
                                  {...field}
                                  bgColor="#3232320D"
                                  placeholder="1234"
                                  fontSize="12px"
                                  color="#323232"
                                />
                                <FormErrorMessage>
                                  {form.errors.old_password}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Flex>

                        <Field name="password" validate={validateEmpty}>
                          {({ field, form }: { [x: string]: any }) => (
                            <FormControl
                              mt="30px"
                              isInvalid={
                                form.errors.password && form.touched.password
                              }
                            >
                              <FormLabel fontSize="12px" color="#323232">
                                New Password
                              </FormLabel>
                              <Input
                                {...field}
                                bgColor="#3232320D"
                                placeholder="Minimum of 8 characters"
                                fontSize="12px"
                                color="#323232"
                              />
                              <FormErrorMessage>
                                {form.errors.password}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="confirm_password" validate={validateEmpty}>
                          {({ field, form }: { [x: string]: any }) => (
                            <FormControl
                              mt="30px"
                              isInvalid={
                                form.errors.confirm_password &&
                                form.touched.confirm_password
                              }
                            >
                              <FormLabel fontSize="12px" color="#323232">
                                Confirm Password
                              </FormLabel>
                              <Input
                                {...field}
                                bgColor="#3232320D"
                                placeholder="Minimum of 8 characters"
                                fontSize="12px"
                                color="#323232"
                              />
                              <FormErrorMessage>
                                {form.errors.confirm_password}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Flex>
                          <Button
                            my="40px"
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
                            Submit
                          </Button>
                        </Flex>
                      </Form>
                    )}
                  </Formik>
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


