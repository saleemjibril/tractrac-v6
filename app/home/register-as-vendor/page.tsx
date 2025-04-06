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
  Modal as ChakraModal,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalBody,
  ModalContent,
  ButtonGroup,
  RadioGroup,
  Radio,
  Spacer,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { saveLoginInfo } from "@/redux/features/auth/authActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AddIcon,
  ArrowForwardIcon,
  ArrowRightIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hooks";
import { useBecomeAnOpOrMechMutation } from "@/redux/services/userApi";
import { toast } from "react-toastify";
import * as nigerianStates from "nigerian-states-and-lgas";
import { FaPlus } from "react-icons/fa";
import { useRegisterAsVendorMutation } from "@/redux/services/tractorApi";
// import NaijaStates from 'naija-xbystate';

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

export default function BecomeAnAgent() {
  const { profileInfo } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [registerAsVendor] = useRegisterAsVendorMutation();
  const router = useRouter();

  function validateEmpty(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

  return (
    <SidebarWithHeader isAuth={true}>
      <Flex
        py="30px"
        px="40px"
        m="20px"
        gap="40px"
        direction={{ base: "column", lg: "row" }}
        bgColor="white"
      >
        <Stack w={{ base: "100%", lg: "60%" }}>
          <Text fontSize="24px" fontWeight={700} mb="4px">
            Tractor Vendor
          </Text>
          <Image
            src="/images/register-as-vendor.svg"
            alt="Agent image"
            borderRadius="10px"
          />
          <Text fontSize="16px" fontWeight={600} my="4px">
            Register as a Tractor Vendor
          </Text>
          <Text>
          Tractrac is always on the hunt for reliable vendors who will work with us to provide genuine tractors and their spare parts to our vast network of Mechanization Service Providers (MSPs) and Tractor Owners.
Interested in joining our guild of vendors?
Fill Out our form.
          </Text>
        </Stack>

        <Box pr="10px" flex="1">
          {/* <Box> */}
          <Text fontWeight={500} mb="24px">
            Fill the form below
          </Text>
          <Formik
            initialValues={{
              company: "",
              role: "",
              phone: profileInfo?.phone || "",
              email: profileInfo?.email || "",
            }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              try {
                console.log(values);
                const response = await registerAsVendor({
                  ...values,
                  user_id: profileInfo?.id,
                }).unwrap();
                if (response.status == "success") {
                  setSuccess(true);
                  onOpen();
                  resetForm();
                  toast.success(response.message);
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
                } else {
                  setError("An unknown error occured, please try again");
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

                <FormControl mb="20px" isDisabled>
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={profileInfo?.fname}
                    _focus={{
                      borderColor: "#929292",
                      boxShadow: 0,
                    }}
                    //  ref={initialRef}
                    //   color='#929292'
                    placeholder="Enter your L.G.A."
                  />
                </FormControl>

                <FormControl mb="20px" isDisabled>
                  {/* <FormLabel fontSize="14px">Lastname</FormLabel> */}
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={profileInfo?.lname}
                    _focus={{
                      borderColor: "#929292",
                      boxShadow: 0,
                    }}
                    //  ref={initialRef}
                    placeholder="Enter your L.G.A."
                  />
                </FormControl>

                <Field name="phone" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      mb="20px"
                      isInvalid={form.errors.phone && form.touched.phone}
                    >
                      <Input
                        {...field}
                        variant="flushed"
                        borderColor="#929292"
                        color="#929292"
                        // value={}
                        _focus={{
                          borderColor: "#929292",
                          boxShadow: 0,
                        }}
                        placeholder="Phone Number"
                      />
                      <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="email">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      mb="20px"
                      isInvalid={form.errors.email && form.touched.email}
                    >
                      <Input
                        {...field}
                        variant="flushed"
                        borderColor="#929292"
                        color="#929292"
                        // value={profileInfo?.email}
                        _focus={{
                          borderColor: "#929292",
                          boxShadow: 0,
                        }}
                        //  ref={initialRef}
                        placeholder="Email Address"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="company" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      // my={4}
                      isInvalid={form.errors.company && form.touched.company}
                      mb="30px"
                    >
                      {/* <FormLabel fontSize="14px">Town (Optional)</FormLabel> */}
                      <Input
                        borderColor="#929292"
                        color="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        variant="flushed"
                        {...field}
                        //  ref={initialRef}
                        placeholder="Company Name"
                      />
                      <FormErrorMessage>{form.errors.company}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="role" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      // my={4}
                      isInvalid={form.errors.role && form.touched.role}
                      mb="30px"
                    >
                      <Input
                        borderColor="#929292"
                        color="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        variant="flushed"
                        {...field}
                        //  ref={initialRef}
                        placeholder="Your Role in the Organization"
                      />
                      <FormErrorMessage>{form.errors.role}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  bgColor="#F8A730"
                  color="white"
                  width="100%"
                  mb="16px"
                  minH="50px"
                  fontSize="18px"
                  isLoading={props.isSubmitting}
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
                  Submit <ArrowForwardIcon boxSize="24px" ml="8px" />
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
        {/* </Box> */}
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
                alt="Checkmark image"
              />
              <Text fontSize="16px" fontWeight={600}>
                Your submission was received
              </Text>
              <Text my="8px" fontSize="14px">
                We will be in touch with you shortly with a thorough response
                tailored to your specific needs.
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
                Go to home <ArrowForwardIcon ml="8px" />
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </SidebarWithHeader>
  );
}

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
