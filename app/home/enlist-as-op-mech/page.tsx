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
// import NaijaStates from 'naija-xbystate';

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

export default function BecomeAnAgent() {
  const { profileInfo } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [lgas, setLgas] = useState<string[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setGender(profileInfo?.gender ?? "");
  }, [profileInfo]);

  const [becomeAnOpOrMech] = useBecomeAnOpOrMechMutation();
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
        p="30px"
        gap="40px"
        direction={{ base: "column", lg: "row" }}
        bgColor="white"
      >
        <Stack w={{ base: "100%", lg: "60%" }}>
          <Text fontSize="24px" fontWeight={700} mb="4px">
            Enlist as Operator/ Mechanic
          </Text>
          <Image
            src="/images/enlist-as-operator.svg"
            alt="Agent image"
            borderRadius="10px"
          />
          <Text fontSize="16px" fontWeight={600} my="4px">
            Enlist as Operator/ Mechanic
          </Text>
          <Text>
            Your expertise and passion as a mechanic or tractor operator would
            make you a valuable addition to our team. By becoming part of our
            program, you will have access to continuous training and development
            resources, ensuring that your skills remain sharp and up-to-date.
          </Text>
        </Stack>

        <Box pr="10px" flex="1">
          {/* <Box> */}
          <Text fontWeight={500} mb="24px">
            Fill the form below
          </Text>
          <Formik
            initialValues={{
              state: "",
              lga: "",
              email: profileInfo?.email || "",
            }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              try {
                // alert('ss')
                console.log(values);
                const response = await becomeAnOpOrMech({
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
                    {/* <AlertDescription>
                Your Chakra experience may be degraded.
              </AlertDescription> */}
                  </Alert>
                )}

                <FormControl mb="20px" isDisabled>
                  {/* <FormLabel fontSize="14px">Firstname</FormLabel> */}
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={profileInfo?.fname}
                    _focus={{
                      borderColor: "#929292",
                      boxShadow: 0,
                    }}
                    //  ref={initialRef}
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

                <FormControl mb="20px" isDisabled>
                  {/* <FormLabel fontSize="14px">Phone number</FormLabel> */}
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={profileInfo?.phone}
                    _focus={{
                      borderColor: "#929292",
                      boxShadow: 0,
                    }}
                    //  ref={initialRef}
                    placeholder="Enter your L.G.A."
                  />
                </FormControl>

                <Field name="email">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl mb="20px" isDisabled={!!profileInfo?.email}>
                      <Input
                        {...field}
                        variant="flushed"
                        color="#929292"
                        borderColor="#929292"
                        // value={}
                        _focusVisible={{
                          borderColor: "#929292",
                          boxShadow: 0,
                        }}
                        //  ref={initialRef}
                        placeholder="Email Address"
                      />
                    </FormControl>
                  )}
                </Field>

                <Field name="state" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.state && form.touched.state}
                      mb="20px"
                    >
                      {/* <FormLabel fontSize="14px">State</FormLabel> */}
                      <Select
                        // {...field}
                        placeholder="State of residence"
                        color="#929292"
                        variant="flushed"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        onChange={(v) => {
                          const state = v.currentTarget.value || "";
                          form.setFieldValue(field.name, v.currentTarget.value);
                          // alert(props.values.state);
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

                <Field name="lga" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      // my={4}
                      isInvalid={form.errors.lga && form.touched.lga}
                      mb="20px"
                    >
                      <Select
                        // {...field}
                        placeholder="Local Government Area"
                        color="#929292"
                        variant="flushed"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        onChange={(v) => {
                          // const state = v.currentTarget.value || "";
                          form.setFieldValue(field.name, v.currentTarget.value);
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
                      {/* <Input
                        variant="flushed"
                        borderColor="orange"
                        {...field}
                        //  ref={initialRef}
                        placeholder="Enter your L.G.A."
                      /> */}
                      <FormErrorMessage>{form.errors.lga}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="town">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      // my={4}
                      isInvalid={form.errors.town && form.touched.town}
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
                        placeholder="Town (optional)"
                      />
                      <FormErrorMessage>{form.errors.town}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <FormControl mb="20px" isDisabled>
                  <Flex>
                    <Box
                      mr="14px"
                      borderWidth="1px"
                      borderColor="#FA9411"
                      width="108px"
                      cursor="pointer"
                      onClick={() => {
                        if (!gender || gender?.length < 1) {
                          setGender("male");
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
                        if (!gender || gender?.length < 1) {
                          setGender("female");
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
                Registration Completed
              </Text>
              <Text my="8px" fontSize="14px">
                Thank you for providing us with this information, check you
                profile for the status of your tractor
              </Text>
              <Button
                mb="4px"
                onClick={() => {
                  onClose();
                  router.replace("/dashboard");
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
