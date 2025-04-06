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
  IconButton,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { saveLoginInfo } from "@/redux/features/auth/authActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AddIcon,
  ArrowForwardIcon,
  ArrowRightIcon,
  CloseIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hooks";
import {
  useAddFarmerMutation,
  useBecomeAnAgentMutation,
} from "@/redux/services/userApi";
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

  const [modalState, setModalState] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setGender(profileInfo?.gender ?? "");
  }, [profileInfo]);

  const [becomeAgent] = useBecomeAnAgentMutation();
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
      <Flex p="16px" gap="56px" direction={{ base: "column", lg: "row" }}>
        <Stack w={{ base: "100%", lg: "60%" }}>
          <Text fontSize="24px" fontWeight={700} mb="4px">
            Become An Agent
          </Text>
          <Image src="/images/agent.svg" alt="Agent image" />
          <Text fontSize="16px" fontWeight={600} my="4px">
            Enlist as a TracTrac Agent
          </Text>
          <Text>
            Do you possess the ability to engage with communities and farmers,
            comprehending their requirements and collaborating with us to extend
            tractor services to them? Our nationwide recruitment drive is
            underway, aiming to onboard over 4,000 agents. Your mission awaits!
            Simply complete the form below, and we&apos;ll be in touch promptly.
          </Text>
        </Stack>

        <Box pr="24px" flex="1">
          <ButtonGroup>
            <Button
              color="#F8A730"
              borderWidth="1px"
              borderColor="#F8A730"
              borderRadius="4px"
              fontSize="14px"
              minW="200px"
              fontWeight={400}
              visibility="hidden"
              mr="4px"
            >
              Import CSV
            </Button>
            <Button
              bgColor="#F8A730"
              fontSize="14px"
              minW="170px"
              color="white"
              borderRadius="4px"
              fontWeight={400}
              _hover={{
                bgColor: "#F8A73099",
              }}
              onClick={() => {
                setModalState(true);
              }}
            >
              <Box as="span" mr="12px">
                Add Farmers
              </Box>
              <AddIcon boxSize="12px" />
            </Button>
          </ButtonGroup>
          <Box pr={{ base: "0px", lg: "82px" }}>
            <Text fontWeight={500} mb="24px" mt="20px">
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
                  const response = await becomeAgent({
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
                    <FormLabel fontSize="14px">Firstname</FormLabel>
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
                    <FormLabel fontSize="14px">Lastname</FormLabel>
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
                    <FormLabel fontSize="14px">Phone number</FormLabel>
                    <Input
                      variant="flushed"
                      borderColor="#929292"
                      value={profileInfo?.phone}
                      _focus={{
                        borderColor: "#929292",
                        boxShadow: 0,
                      }}
                      //  ref={initialRef}
                      placeholder="Enter your phone number"
                    />
                  </FormControl>

                  <Field name="email">
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl mb="20px" isDisabled={!!profileInfo?.email}>
                        <FormLabel fontSize="14px" color="#929292">
                          Email
                        </FormLabel>
                        <Input
                          {...field}
                          type="email"
                          variant="flushed"
                          borderColor="#929292"
                          // value={profileInfo?.email}
                          _focus={{
                            borderColor: "#929292",
                            boxShadow: 0,
                          }}
                          //  ref={initialRef}
                          placeholder="Enter your email"
                        />
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
                            form.setFieldValue(
                              field.name,
                              v.currentTarget.value
                            );
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
                            form.setFieldValue(
                              field.name,
                              v.currentTarget.value
                            );
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
                alt="Checkmark image"
              />
              <Text fontSize="16px" fontWeight={600}>
                Registration Completed
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
                Go to Dashboard <ArrowForwardIcon ml="8px" />
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
      <AddFarmerModal isOpen={modalState} setModalState={setModalState} />
    </SidebarWithHeader>
  );
}

interface ModalProps {
  isOpen: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}

const AddFarmerModal: React.FC<ModalProps> = ({ isOpen, setModalState }) => {
  const [error, setError] = useState<string | null>(null);

  function validateEmpty(value: any) {
    // alert('jjj')
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }
  const { profileInfo } = useAppSelector((state) => state.auth);
  const [addFarmer] = useAddFarmerMutation();

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={() => setModalState(false)}
      //   closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      //   size="xs"
    >
      <ModalOverlay />
      <ModalContent px="30px" py="40px">
        <ModalBody textAlign="center" py="20px">
          <Flex>
            <IconButton
              aria-label="Close modal"
              bgColor="transparent"
              mb="50px"
              icon={<CloseIcon />}
              onClick={() => {
                setModalState(false);
              }}
            />
          </Flex>
          <Text fontSize="16px" fontWeight={600} mb="20px">
            Add a farmer
          </Text>
          <Formik
            // initialValues={{ name: 'Sasuke' }}
            initialValues={{
              fname: "",
              lname: "",
              location: "",
              phone: "",
              farm_size: "",
            }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              try {
                // alert('ss')
                console.log("nn", values);
                const response = await addFarmer({
                  ...values,
                  user_id: profileInfo?.id,
                }).unwrap();
                if (response.status == "success") {
                  //   resetForm();
                  toast.success(response.message);
                  setModalState(false);
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
              <Form encType="multipart/form-data">
                {error && (
                  <Alert status="error" mb="12px">
                    <AlertIcon />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Field name="fname" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      mb="16px"
                      isInvalid={form.errors.fname && form.touched.fname}
                    >
                      <Input
                        {...field}
                        variant="flushed"
                        color="#929292"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        placeholder="First Name"
                      />
                      <FormErrorMessage>{form.errors.fname}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="lname" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      mb="16px"
                      isInvalid={form.errors.lname && form.touched.lname}
                    >
                      <Input
                        {...field}
                        variant="flushed"
                        color="#929292"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        placeholder="Last Name"
                      />
                      <FormErrorMessage>{form.errors.lname}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="location" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.location && form.touched.location}
                    >
                      <Input
                        borderColor="#929292"
                        color="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        variant="flushed"
                        {...field}
                        placeholder="Location"
                      />
                      <FormErrorMessage>
                        {form.errors.location}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="phone">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.phone && form.touched.phone}
                    >
                      <Input
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        type="text"
                        color="#929292"
                        variant="flushed"
                        {...field}
                        placeholder="Phone Number"
                      />
                      <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="farm_size" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={
                        form.errors.farm_size && form.touched.farm_size
                      }
                    >
                      <Input
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        color="#929292"
                        variant="flushed"
                        {...field}
                        placeholder="Size of Farm"
                      />
                      <FormErrorMessage>
                        {form.errors.farm_size}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  bgColor="#F8A730"
                  color="white"
                  width="100%"
                  my="12px"
                  fontSize="14px"
                  fontWeight={400}
                  isLoading={props.isSubmitting}
                  //   isDisabled={success}
                  minH="48px"
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
                  Add farmer
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

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
