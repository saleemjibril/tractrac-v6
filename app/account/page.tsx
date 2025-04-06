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
import { useAppSelector } from "@/redux/hooks";
import {
  useUpdatePasswordMutation,
  useUpdateBioDataMutation,
} from "@/redux/services/userApi";
import router from "next/router";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
};

export default function AccountPage() {
  const { profileInfo } = useAppSelector((state) => state.auth);

  const [modalState, setModalState] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  

  const [updateBioData] = useUpdateBioDataMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  useEffect(()=>{
      setMounted(true)
  }, [mounted])

  function validateEmpty(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

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
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box pl="24px" mr={{ base: "0px", md: "20em", lg: "30em" }}>
                  <Text fontWeight={700} fontSize="28px" mt="12px">
                    Edit Profile
                  </Text>
                  {mounted &&
                  <Avatar
                    my="30px"
                    size="xl"
                    name={`${profileInfo?.fname} ${profileInfo?.lname}`}
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
                  </Avatar> }

                  <Formik
                    initialValues={{
                      phone: profileInfo?.phone,
                      fname: profileInfo?.fname,
                      lname: profileInfo?.lname,
                      email: profileInfo?.email,
                      gender: profileInfo?.gender,
                    }}
                    onSubmit={async (values: any, { resetForm }) => {
                      setError(null);

                      try {
                        // alert('ss')
                        console.log(values);

                        const response = await updateBioData({
                          ...values,
                          user_id: profileInfo?.id,
                          //   tractor_id: id,
                        }).unwrap();
                        if (response.status == "success") {
                          toast.success(response.message);
                        } else {
                          setError("An unknown error occured");
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
                        console.error("rejected", error);
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
                                  form.errors.old_password && form.touched.old_password
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
                                form.errors.password &&
                                form.touched.password
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
            </TabPanels>
          </Tabs>
        </Box>
        {/* <AddFarmerModal isOpen={modalState} setModalState={setModalState} /> */}
      </Box>
    </SidebarWithHeader>
  );
}

interface ModalProps {
  isOpen: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}

// const AddFarmerModal: React.FC<ModalProps> = ({ isOpen, setModalState }) => {
//   const [error, setError] = useState<string | null>(null);

//   function validateEmpty(value: any) {
//     // alert('jjj')
//     let error;
//     if (!value) {
//       error = "This field is required";
//     }
//     return error;
//   }
//   const { profileInfo } = useAppSelector((state) => state.auth);
//   const [addFarmer] = useAddFarmerMutation();

//   return (
//     <ChakraModal
//       isOpen={isOpen}
//       onClose={() => setModalState(false)}
//       //   closeOnOverlayClick={false}
//       closeOnEsc={false}
//       isCentered
//       //   size="xs"
//     >
//       <ModalOverlay />
//       <ModalContent px="30px" py="40px">
//         <ModalBody textAlign="center" py="20px">
//           <Flex>
//             <IconButton
//               aria-label="Close modal"
//               bgColor="transparent"
//               mb="50px"
//               icon={<CloseIcon />}
//               onClick={() => {
//                 setModalState(false);
//               }}
//             />
//           </Flex>
//           <Text fontSize="16px" fontWeight={600} mb="20px">
//             Add a farmer
//           </Text>
//           <Formik
//             // initialValues={{ name: 'Sasuke' }}
//             initialValues={{ dob: "", school: "", course: "", id_type: "" }}
//             onSubmit={async (values: any, { resetForm }) => {
//               setError(null);

//               try {
//                 // alert('ss')
//                 console.log("nn", values);
//                 const response = await addFarmer({
//                   ...values,
//                   user_id: profileInfo?.id,
//                 }).unwrap();
//                 if (response.status == "success") {
//                   //   resetForm();
//                   toast.success(response.message);
//                   setModalState(false);
//                 } else {
//                   setError("An unknown error occured");
//                 }
//               } catch (err) {
//                 const error = err as any;
//                 // alert('error')
//                 if (error?.data?.errors) {
//                   // setError(error?.data?.errors[0])
//                 } else if (error?.data?.message) {
//                   setError(error?.data?.message);
//                 }
//                 console.error("rejected", error);
//               }
//             }}
//           >
//             {(props) => (
//               <Form encType="multipart/form-data">
//                 {error && (
//                   <Alert status="error" mb="12px">
//                     <AlertIcon />
//                     <AlertTitle>{error}</AlertTitle>
//                   </Alert>
//                 )}

//                 <Field name="fname" validate={validateEmpty}>
//                   {({ field, form }: { [x: string]: any }) => (
//                     <FormControl
//                       mb="16px"
//                       isInvalid={form.errors.fname && form.touched.fname}
//                     >
//                       <Input
//                         {...field}
//                         variant="flushed"
//                         color="#929292"
//                         borderColor="#929292"
//                         _focusVisible={{
//                           borderColor: "#929292",
//                         }}
//                         placeholder="First Name"
//                       />
//                       <FormErrorMessage>{form.errors.fname}</FormErrorMessage>
//                     </FormControl>
//                   )}
//                 </Field>

//                 <Field name="lname" validate={validateEmpty}>
//                   {({ field, form }: { [x: string]: any }) => (
//                     <FormControl
//                       mb="16px"
//                       isInvalid={form.errors.lname && form.touched.lname}
//                     >
//                       <Input
//                         {...field}
//                         variant="flushed"
//                         color="#929292"
//                         borderColor="#929292"
//                         _focusVisible={{
//                           borderColor: "#929292",
//                         }}
//                         placeholder="Last Name"
//                       />
//                       <FormErrorMessage>{form.errors.lname}</FormErrorMessage>
//                     </FormControl>
//                   )}
//                 </Field>

//                 <Field name="location" validate={validateEmpty}>
//                   {({ field, form }: { [x: string]: any }) => (
//                     <FormControl
//                       my={4}
//                       isInvalid={form.errors.location && form.touched.location}
//                     >
//                       <Input
//                         borderColor="#929292"
//                         color="#929292"
//                         _focusVisible={{
//                           borderColor: "#929292",
//                         }}
//                         variant="flushed"
//                         {...field}
//                         placeholder="Location"
//                       />
//                       <FormErrorMessage>
//                         {form.errors.location}
//                       </FormErrorMessage>
//                     </FormControl>
//                   )}
//                 </Field>

//                 <Field name="phone">
//                   {({ field, form }: { [x: string]: any }) => (
//                     <FormControl
//                       my={4}
//                       isInvalid={form.errors.phone && form.touched.phone}
//                     >
//                       <Input
//                         borderColor="#929292"
//                         _focusVisible={{
//                           borderColor: "#929292",
//                         }}
//                         type="text"
//                         color="#929292"
//                         variant="flushed"
//                         {...field}
//                         placeholder="Phone Number"
//                       />
//                       <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
//                     </FormControl>
//                   )}
//                 </Field>

//                 <Field name="farm_size" validate={validateEmpty}>
//                   {({ field, form }: { [x: string]: any }) => (
//                     <FormControl
//                       my={4}
//                       isInvalid={
//                         form.errors.farm_size && form.touched.farm_size
//                       }
//                     >
//                       <Input
//                         borderColor="#929292"
//                         _focusVisible={{
//                           borderColor: "#929292",
//                         }}
//                         color="#929292"
//                         variant="flushed"
//                         {...field}
//                         placeholder="Size of Farm"
//                       />
//                       <FormErrorMessage>
//                         {form.errors.farm_size}
//                       </FormErrorMessage>
//                     </FormControl>
//                   )}
//                 </Field>

//                 <Button
//                   bgColor="#F8A730"
//                   color="white"
//                   width="100%"
//                   my="12px"
//                   fontSize="14px"
//                   fontWeight={400}
//                   isLoading={props.isSubmitting}
//                   //   isDisabled={success}
//                   minH="48px"
//                   type="submit"
//                   _disabled={{
//                     bgColor: "#F8A73088",
//                   }}
//                   _hover={{
//                     bgColor: "#F8A73088",
//                   }}
//                   _focus={{
//                     bgColor: "#F8A73088",
//                   }}
//                 >
//                   Add farmer
//                 </Button>
//               </Form>
//             )}
//           </Formik>
//         </ModalBody>
//       </ModalContent>
//     </ChakraModal>
//   );
// };

function EmptyTractorsPlaceholder() {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box bgColor="white" width="100%" p="60px" textAlign="center" mt="20px">
        {/* <Box bgColor="white" width="400px" p="60px" textAlign="center" mt="40px"> */}
        <Center>
          <Image src="/images/empty-state.svg" alt="Empty state image icon" />
        </Center>
        <Text color="#323232" fontWeight="700" fontSize="20px" mt="57px">
          Your list is empty
        </Text>

        <Text color="#323232" fontWeight="400" fontSize="18px">
          All Farmer will be listed in this page
        </Text>

        {/* <Button
          as="a"
          mt="50px"
          href="/home/enlist-tractor"
          height="56px"
          w="240px"
          bgColor="#FA9411"
          color="white"
        >
          Enlist your tractor
        </Button> */}
      </Box>
    </Flex>
  );
}
