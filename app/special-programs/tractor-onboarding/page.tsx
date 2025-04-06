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
  Textarea,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { saveLoginInfo } from "@/redux/features/auth/authActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowForwardIcon, AttachmentIcon } from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  useBecomeAnAgentMutation,
  useCollaborateMutation,
  // useTractorOnboardingMutation,
} from "@/redux/services/userApi";
import { toast } from "react-toastify";
import { FiFile, FiUpload } from "react-icons/fi";
import { FaUpload } from "react-icons/fa";
import { tractorOnboarding } from "@/redux/features/user/userActions";

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export default function BecomeAnAgent() {
  const [error, setError] = useState<string | null>(null);
  const [idImageError, setIdImageError] = useState<string | null>(null);
  const [tractorImageError, setTractorImageError] = useState<string | null>(
    null
  );

  const [success, setSuccess] = useState<boolean>(false);
  const inputRef = useRef<any>();
  const inputRef2 = useRef<any>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { profileInfo } = useAppSelector((state) => state.auth);
  const {
    loading,
    error: tractorOnboardingError,
    success: requestSuccessful,
  } = useAppSelector((state) => state.user);

  // const [onboardTractor] = useTractorOnboardingMutation();

  function validateEmpty(value: any) {
    // alert('jjj')
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

  function validateImage(value: any) {
    // alert('jjj')
    // let error;
    if (!value) {
      setIdImageError("This field is required");
    } else {
      setIdImageError(null);
    }
    // return error;
  }

  function validateTractorImage(value: any) {
    if (!value) {
      setTractorImageError("This field is required");
    } else {
      setTractorImageError(null);
    }
    // return error;
  }

  return (
    <SidebarWithHeader isAuth={true}>
      <Flex p="16px" gap="50px" direction={{ base: "column", lg: "row" }}>
        <Stack w={{ base: "100%", lg: "60%" }} mt="10px">
          <Text fontSize="24px" fontWeight={700} mb="4px">
            Tractor Onboarding
          </Text>
          <Image
            src="/images/women-in-mech.svg"
            alt="women-in-mechanization image"
          />
          <Text fontSize="20px" fontWeight={500} my="4px">
            Information
          </Text>
          <Text color="#333333" fontSize="14px">
          At Tractrac, we are committed to providing farmers with access to tractors, regardless of location. That&apos;s why we have created the Tractor Onboarding Program.
          </Text>
          <Text color="#333333" fontSize="14px" mt="8px">
          The Tractor Onboarding Program is a way for students and youth corpers to earn money while gaining valuable skills in agricultural mechanization. As part of the program, students and youth corpers will be responsible for onboarding tractors in their communities. This includes inspecting the tractors, ensuring that they are in good working condition, and registering them with Tractrac.
          </Text>
          <Text color="#333333" fontSize="14px" mt="8px">
          If you are a student or youth corper who is interested in participating in the Onboard program. fill the form.
          </Text>
        </Stack>

        <Box pr={{ base: "0px", lg: "90px" }} flex="1" mt="21px">
          <Box
            p="10px"
            fontSize="13px"
            bgColor="#FEF9F2"
            borderColor="#FFB547"
            borderWidth="1px"
          >
            <Text color="#FA9411" fontWeight={600}>
              Earn up to N100,000 monthly
            </Text>
            <Text fontWeight={600}>by onboarding tractors around you</Text>
            <Text mt="8px">
              The Tractor Onboarding Program is a win-win for everyone involved.
              Students and youth corpers earn money while gaining valuable
              skills.
            </Text>
            <Text color="#FF0000" mt="8px">
              For Students and Youth corpers Only
            </Text>
          </Box>
          <Text fontWeight={600} fontSize="16px" my="24px">
            Fill the form below to join this progam
          </Text>
          <Formik
            // initialValues={{ name: 'Sasuke' }}
            initialValues={{
              dob: "",
              school: "",
              course: "",
              id_type: "",
              email: profileInfo?.email || "",
            }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              try {
                // alert('ss')
                console.log("nn", values);
                const formData = new FormData();
                formData.append("user_id", profileInfo?.id);
                formData.append("dob", values?.dob);
                formData.append("email", values?.email || "");
                formData.append("id_no", values?.id_no);
                formData.append("school", values?.school);
                formData.append("course", values?.course);
                formData.append("id_type", values?.id_type);

                formData.append("id_image", values?.id_image);
                formData.append("tractor_image", values?.tractor_image);

                dispatch(tractorOnboarding(formData));
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
                {tractorOnboardingError && (
                  <Alert status="error" mb="12px">
                    <AlertIcon />
                    <AlertTitle>{tractorOnboardingError}</AlertTitle>
                  </Alert>
                )}
                {requestSuccessful && (
                  <Alert status="success" mb="12px">
                    <AlertIcon />
                    <AlertTitle>Information has been submitted</AlertTitle>
                  </Alert>
                )}
                <FormControl isDisabled mb="16px">
                  <FormLabel fontSize="14px">Name</FormLabel>
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={`${profileInfo?.fname} ${profileInfo?.lname}`}
                    _focusVisible={{
                      borderColor: "#929292",
                    }}
                    //  ref={initialRef}
                    placeholder="Enter your L.G.A."
                  />
                </FormControl>

                <Field name="email">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl isDisabled={!!profileInfo?.email} mb="16px">
                      <FormLabel fontSize="14px" color="#929292">
                        Email
                      </FormLabel>
                      <Input
                        {...field}
                        variant="flushed"
                        borderColor="#929292"
                        // value={profileInfo?.email}
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        //  ref={initialRef}
                        placeholder="Email"
                      />
                    </FormControl>
                  )}
                </Field>

                <Field name="dob" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.dob && form.touched.dob}
                    >
                      <FormLabel fontSize="14px" color="#929292">
                        Date of birth
                      </FormLabel>
                      <Input
                        variant="flushed"
                        borderColor="#929292"
                        color="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        {...field}
                        type="date"
                        placeholder="Date of birth"
                      />
                      <FormErrorMessage>{form.errors.dob}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="school" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.school && form.touched.school}
                    >
                      {/* <FormLabel fontSize="14px">Town (Optional)</FormLabel> */}
                      <Input
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        color="#929292"
                        variant="flushed"
                        {...field}
                        //  ref={initialRef}
                        placeholder="Name of school"
                      />
                      <FormErrorMessage>{form.errors.school}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="course" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.course && form.touched.course}
                    >
                      {/* <FormLabel fontSize="14px">Town (Optional)</FormLabel> */}
                      <Input
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        type="text"
                        color="#929292"
                        variant="flushed"
                        {...field}
                        //  ref={initialRef}
                        placeholder="Course of Study"
                      />
                      <FormErrorMessage>{form.errors.course}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                {/* <Field name="user_id" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                    visibility={"hidden"}
                      my={4}
                      isInvalid={form.errors.user_id && form.touched.user_id}
                    >
                      <Input
                        borderColor="#929292"
                        _focus={{
                          borderColor: "orange",
                          boxShadow: 0,
                        }}
                        type="text"
                        variant="flushed"
                        {...field}
                        //  ref={initialRef}
                        value={profileInfo?.id}
                        placeholder="User ID"
                      />
                      <FormErrorMessage>{form.errors.user_id}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field> */}
                <Field name="id_type" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.id_type && form.touched.id_type}
                    >
                      <Select
                        {...field}
                        color="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        placeholder="Type of ID"
                        variant="flushed"
                        borderColor="#929292"
                      >
                        {idTypes.map((idType) => (
                          <option
                            key={idType.value}
                            value={idType.value.toLowerCase()}
                          >
                            {idType.name}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{form.errors.id_type}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="id_no">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.id_no && form.touched.id_no}
                    >
                      <Input
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        color="#929292"
                        variant="flushed"
                        {...field}
                        placeholder="ID Number"
                      />
                      <FormErrorMessage>{form.errors.id_no}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Flex rowGap="16px" my="24px">
                  <Field
                    name="id_image"
                    validate={(e: any) => validateImage(e)}
                  >
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.id_image && form.touched.id_image
                        }
                        isRequired
                      >
                        <InputGroup>
                          {/*<InputLeftElement
                          pointerEvents="none"
                          children={
                            <>
                             
                            </>
                          }
                        /> */}
                          <input
                            type="file"
                            // accept={["png", "jpg"]}
                            //   name={name}
                            ref={inputRef}
                            onChange={(event) => {
                              const files = event?.currentTarget?.files;
                              if (files) {
                                const file = files[0];
                                if (file.size > MAX_IMAGE_SIZE_BYTES) {
                                  toast.error(
                                    "Image size exceeds the maximum allowed size (2MB). Please select a smaller image."
                                  );
                                  return;
                                }
                                form.setFieldValue(field.name, file);
                              }
                            }}
                            // {...field}
                            style={{ display: "none" }}
                          ></input>
                          <Button
                            onClick={() => inputRef.current?.click()}
                            borderWidth="1px"
                            borderColor="#929292"
                            borderRightWidth="0.5px"
                            borderRadius={0}
                            width="100%"
                          >
                            <AttachmentIcon color="#FA9411" />
                            <Text
                              ml="8px"
                              color="#929292"
                              fontSize="16px"
                              fontWeight={400}
                            >
                              {field.value ? "ID attached" : "Attach ID"}
                            </Text>
                          </Button>
                        </InputGroup>
                        {idImageError && (
                          <Text color="red" fontSize="14px" mt="2px">
                            {idImageError}
                          </Text>
                        )}
                      </FormControl>
                    )}
                  </Field>

                  <Field name="tractor_image" validate={validateTractorImage}>
                    {({ field, form }: { [x: string]: any }) => (
                      <FormControl
                        isInvalid={
                          form.errors.tractor_image &&
                          form.touched.tractor_image
                        }
                        isRequired
                      >
                        <InputGroup>
                          <input
                            type="file"
                            // accept={["png", "jpg"]}
                            //   name={name}
                            ref={inputRef2}
                            onChange={(event) => {
                              if (event?.currentTarget?.files) {
                                const file = event?.currentTarget?.files[0];
                                if (file.size > MAX_IMAGE_SIZE_BYTES) {
                                  toast.error(
                                    "Image size exceeds the maximum allowed size (2MB). Please select a smaller image."
                                  );
                                  return;
                                }

                                form.setFieldValue(
                                  field.name,
                                  event?.currentTarget?.files[0]
                                );
                              }
                            }}
                            style={{ display: "none" }}
                          ></input>
                          <Button
                            onClick={() => inputRef2.current?.click()}
                            borderWidth="1px"
                            borderRadius={0}
                            borderLeftWidth="0.5px"
                            borderColor="#929292"
                            width="100%"
                          >
                            <FiUpload color="#FA9411" />
                            <Text
                              ml="8px"
                              color="#929292"
                              fontSize="16px"
                              fontWeight={400}
                            >
                              {field.value
                                ? "Image attached"
                                : " Tractor Image"}
                            </Text>
                          </Button>
                          {/* <Input
                        cursor="pointer"
                            //   pointerEvents="none"
                          placeholder={ "Your file ..."}
                          onClick={() => inputRef.current?.click()}
                        //   value={value}
                        /> */}
                        </InputGroup>
                        {tractorImageError && (
                          <Text color="red" fontSize="14px" mt="2px">
                            {tractorImageError}
                          </Text>
                        )}
                      </FormControl>
                    )}
                  </Field>
                </Flex>

                <Button
                  bgColor="#F8A730"
                  color="white"
                  width="100%"
                  // my="24px"
                  fontSize="18px"
                  fontWeight={600}
                  isLoading={props.isSubmitting || loading}
                  isDisabled={success}
                  minH="50px"
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
                  <Box mr="8px">Submit</Box> <ArrowForwardIcon boxSize="24px" />
                </Button>
              </Form>
            )}
          </Formik>
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
                alt="checkmark icon"
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
                Back to home <ArrowForwardIcon ml="8px" />
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </SidebarWithHeader>
  );
}

const idTypes = [
  { name: "NIN", value: "nin" },
  { name: "International Password", value: "int_passport" },
];
