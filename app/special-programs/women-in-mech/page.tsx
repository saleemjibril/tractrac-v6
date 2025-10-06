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
  Input,
  Stack,
  Text,
  Box,
  Skeleton,
  Modal as ChakraModal,
  ModalOverlay,
  useDisclosure,
  ModalBody,
  ModalContent,
  Textarea
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../../components/Sidenav";
import { saveLoginInfo } from "@/redux/features/auth/authActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { FC, useState, useEffect } from "react";
import { ArrowForwardIcon, ArrowRightIcon } from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hooks";
import {
  useBecomeAnAgentMutation,
  useCollaborateMutation,
} from "@/redux/services/userApi";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/utils/errorUtils";
import { womenInMech } from "@/app/apis/general";

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

export default function BecomeAnAgent() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { profileInfo, userToken } = useAppSelector((state) => state.auth);

  const [collaborate] = useCollaborateMutation();

  function validateEmpty(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

  return (
    <SidebarWithHeader>
      <Flex p="16px" gap="50px" direction={{ base: "column", lg: "row" }}>
        <Stack w={{ base: "100%", lg: "60%" }} mt="10px">
          <Text fontSize="24px" fontWeight={700} mb="4px">
            Women in Mechanization
          </Text>
          <Image
            src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446746/women-in-mech_y8ekus.svg"
            alt="women-in-mechanization image"
          />
          <Text fontSize="20px" fontWeight={600} my="4px">
            Boosting the productivity and profitability of women in agriculture
          </Text>
          <Text color="#333333">
            The Women in Mechanization initiative from Tractrac MSL aims tackle
            the problem of low productivity in Nigeria&#39;s agricultural sector
            using a bottom-up approach centered on women farmers. The initiative
            aims to boost the productivity and profitability of women in
            agriculture by sustainably facilitating access to and ownership of
            power tillers and other labour-saving devices for these women.
            <br />
            Originally launched in 2020, Women in Mechanization set out to reach
            three hundred (300) women in its first year; training them as
            Booking and Hiring Agents, and Operators of these mechanization
            equipment and labour-saving devices. Post training, each woman was
            provided with at least one labour-saving device which they use on
            their farms and rent out to other farmers in their various
            communities at a fee. Beyond providing these women with
            labour-saving devices, Women in Mechanization also seeks to promote
            a better mechanization policy landscape in Nigeria.
          </Text>
        </Stack>

        <Box pr={{ base: "0px", lg: "100px" }} flex="1" mt="21px">
          <Text fontWeight={400} mb="20px" color="#333333">
            Fill the form below to support women in mechanization
          </Text>
          <Formik
            // initialValues={{ name: 'Sasuke' }}
            initialValues={{
              name: "",
              email: profileInfo?.email,
              organization: "",
              position: "",
              phone: "",
              message: ""
            }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              try {
                // alert('ss')
                console.log("my values", values);
                const response = await womenInMech(
                  {
                    ...values,
                    first_name: profileInfo?.name?.split(" ")[0],
                    last_name: profileInfo?.name?.split(" ")[1],
                    email: profileInfo?.email,
                    phone: values?.phone?.toString(),
                  },
                  userToken as string
                );
                toast.success("Thank you, We will get back to you soon");
                resetForm();
                // .unwrap();
                // if (response.status == "success") {
                //   // router.replace("/login");
                //   resetForm();
                //   setSuccess(true);
                //   onOpen();
                // } else {
                //   setError("An unknown error occured");
                // }
                // console.log("fulfilled", response?.data[0]);
              } catch (err) {
                const error = err as any;
                const errorMessage = getErrorMessage(error, "An unexpected error occurred");
                toast.error(errorMessage);
                console.log("Error submitting form", error);
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
                <CustomInput
                  label="Name"
                  fieldName="name"
                  placeHolder="Name"
                  type="text"
                  defaultValue={`${profileInfo?.name?.split(" ")[0]} ${
                    profileInfo?.name?.split(" ")[1]
                  }`}
                  defaultCheck={profileInfo?.name?.split(" ")[0]}
                  validate={validateEmpty}
                />
<Field name="email" validate={validateEmpty}>
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
                {/* <Field name="state" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.state && form.touched.state}
                    >
                      <FormLabel fontSize="14px">State</FormLabel>
                      <Select
                        {...field}
                        placeholder="Select state"
                        variant="flushed"
                        borderColor="orange"
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
                </Field> */}
                <Field name="organization" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={
                        form.errors.organization && form.touched.organization
                      }
                    >
                      {/* <FormLabel fontSize="14px">L.G.A.</FormLabel> */}
                      <Input
                        variant="flushed"
                        borderColor="#929292"
                        color="#929292"
                        {...field}
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        placeholder="Organisation"
                      />
                      <FormErrorMessage>
                        {form.errors.organization}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="position" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.position && form.touched.position}
                    >
                      {/* <FormLabel fontSize="14px">Town (Optional)</FormLabel> */}
                      <Input
                        borderColor="#929292"
                        color="#929292"
                        variant="flushed"
                        {...field}
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        //  ref={initialRef}
                        placeholder="Position in the Organization"
                      />
                      <FormErrorMessage>
                        {form.errors.position}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="phone" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.phone && form.touched.phone}
                    >
                      {/* <FormLabel fontSize="14px">Town (Optional)</FormLabel> */}
                      <Input
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        type="number"
                        color="#929292"
                        variant="flushed"
                        {...field}
                        //  ref={initialRef}
                        placeholder="Phone Number"
                      />
                      <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="message" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.message && form.touched.message}
                    >
                      <FormLabel fontSize="14px" color="#929292">
                        How do you want to Support
                      </FormLabel>
                      <Textarea
                        // borderColor="orange"
                        bgColor="white"
                        height="86px"
                        color="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        // variant="flushed"
                        {...field}
                        //  ref={initialRef}
                        placeholder="Message"
                      />
                      <FormErrorMessage>{form.errors.message}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  bgColor="#F8A730"
                  color="white"
                  width="100%"
                  fontSize="18px"
                  fontWeight={600}
                  my="16px"
                  minH="50px"
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
                  <Box as="span" mr="8px">
                    Submit
                  </Box>{" "}
                  <ArrowForwardIcon boxSize="24px" />
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
                src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446823/checkmark_jyuxnj.svg"
                width="120px"
                alt="Checkmark image icon"
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
                Go to Home <ArrowForwardIcon ml="8px" />
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </SidebarWithHeader>
  );
}

interface CustomInputProps {
  defaultCheck?: string;
  defaultValue?: string;
  label: string;
  fieldName: string;
  placeHolder: string;
  type: string;
  validate?: (value: any) => string | undefined;
}

const CustomInput: FC<CustomInputProps> = ({
  defaultCheck,
  defaultValue,
  label,
  fieldName,
  placeHolder,
  type,
  validate,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton height="30px" mt="16px" />;

  return defaultCheck ? (
    <FormControl mb="20px" isDisabled>
      <FormLabel fontSize="14px">{label}</FormLabel>
      <Input
        variant="flushed"
        borderColor="#929292"
        value={defaultValue}
        _focus={{
          borderColor: "orange",
          boxShadow: 0,
        }}
        placeholder={placeHolder}
      />
    </FormControl>
  ) : (
    <Field name={fieldName} validate={validate}>
      {({ field, form }: { [x: string]: any }) => (
        <FormControl
          isInvalid={form.errors[fieldName] && form.touched[fieldName]}
          mb="20px"
        >
          <Input
            {...field}
            variant="flushed"
            type={type}
            borderColor="#929292"
            color="#929292"
            _focus={{
              borderColor: "orange",
              boxShadow: 0,
            }}
            _focusVisible={{
              borderColor: "#929292",
            }}
            placeholder={placeHolder}
          />
          <FormErrorMessage>{form.errors[fieldName]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
