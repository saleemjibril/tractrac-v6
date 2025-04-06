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
  Skeleton,
  Modal as ChakraModal,
  ModalOverlay,
  useDisclosure,
  ModalBody,
  ModalContent,
  Textarea,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { saveLoginInfo } from "@/redux/features/auth/authActions";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hooks";
import {
  useBecomeAnAgentMutation,
  useCollaborateMutation,
} from "@/redux/services/userApi";
import { toast } from "react-toastify";

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

export default function BecomeAnAgent() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { profileInfo } = useAppSelector((state) => state.auth);

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
      <Flex p="16px" gap="60px" direction={{ base: "column", lg: "row" }}>
        <Stack w={{ base: "100%", lg: "60%" }} mt="12px">
          <Text fontSize="24px" fontWeight={700} mb="4px">
            Collaborate with US
          </Text>
          <Image
            src="/images/women-in-mech.svg"
            alt="women-in-mechanization image"
          />
          <Text fontSize="20px" fontWeight={600} my="4px">
            Information
          </Text>
          <Text color="#929292" fontSize="14px">
            We believe in the power of collaboration and the value of diverse
            perspectives. We are always excited to explore new opportunities and
            partnerships. That&apos;s why we invite you to collaborate on a
            journey toward innovation, growth, and mutual success. Together, we
            can achieve remarkable things and make a lasting impact in our
            respective industries
          </Text>
          <Text fontSize="20px" fontWeight={600} my="4px">
            How to collaborate with us
          </Text>

          <Text fontSize="14px" color="#929292">
            <Box as="span" color="#333333" fontWeight={700}>
              Partnership Opportunities:
            </Box>{" "}
            We offer various partnership models tailored to your needs and
            objectives. Whether you&apos;re looking for joint ventures,
            strategic alliances, research collaborations, or any other form of
            partnership, we are open to exploring opportunities that align with
            our vision and values.{" "}
          </Text>

          <Text fontSize="14px" color="#929292">
            <Box as="span" color="#333333" fontWeight={700}>
              Co-Creation Projects:{" "}
            </Box>
            Let&apos;s embark on exciting co-creation projects that combine our
            expertise and resources. By collaborating on a specific project or
            initiative, we can harness the collective power of our teams to
            develop innovative solutions and achieve outstanding results.{" "}
          </Text>

          <Text fontSize="14px" color="#929292">
            <Box as="span" color="#333333" fontWeight={700}>
              {" "}
              Knowledge Sharing:{" "}
            </Box>
            We believe in sharing knowledge and learning from one another. Join
            us in workshops, seminars, and conferences where we exchange
            insights, best practices, and industry trends. Together, we can
            foster a culture of continuous learning and growth.
          </Text>
          <Text fontSize="14px" color="#929292">
            <Box as="span" color="#333333" fontWeight={700}>
              Open Innovation:
            </Box>
            We embrace open innovation, where ideas are sourced from a diverse
            range of collaborators. We encourage you to reach out if you have a
            unique concept or innovation that aligns with our vision. Together,
            we can explore its potential and turn it into a reality.
          </Text>
        </Stack>

        <Box pr={{ base: "0px", lg: "90px" }} flex="1">
          <Box
            p="10px"
            fontSize="13px"
            bgColor="#FEF9F2"
            borderColor="#FFB547"
            borderWidth="1px"
          >
            <Text>
              We believe in the power of collaboration and the value of diverse
              perspectives. We are always excited to explore new opportunities
              and partnerships.
            </Text>
            {!hidden && (
              <Text>
                That&apos;s why we invite you to collaborate on a journey toward
                innovation, growth, and mutual success. Together, we can achieve
                remarkable things and make a lasting impact in our respective
                industries
              </Text>
            )}
            {/*  */}
            <Box
              as="button"
              color="#FA9411"
              fontWeight={600}
              mt="4px"
              onClick={() => setHidden(!hidden)}
            >
              {hidden ? "Read more" : "See less"} <ArrowForwardIcon />
            </Box>
          </Box>
          <Text fontWeight={500} my="24px">
            Fill the form below
          </Text>
          <Formik
            // initialValues={{ name: 'Sasuke' }}
            initialValues={{ state: "", lga: "" }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              try {
                // alert('ss')
                console.log(values);
                const response = await collaborate({
                  ...values,
                  user_id: profileInfo?.id,
                  type: "collaborate",
                }).unwrap();
                if (response.status == "success") {
                  // router.replace("/login");
                  resetForm();
                  setSuccess(true);
                  onOpen();
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
                  </Alert>
                )}

                {/* <FormControl isDisabled>
                  <FormLabel fontSize="14px">Name</FormLabel>
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={`${profileInfo?.fname} ${profileInfo?.lname}`}
                    _focusVisible={{
                      borderColor: "#929292",
                    }}
                    placeholder="Enter your L.G.A."
                  />
                </FormControl> */}

                <CustomInput
                  label="Name"
                  fieldName="name"
                  placeHolder="Name"
                  type="text"
                  defaultValue={`${profileInfo?.fname} ${profileInfo?.lname}`}
                  defaultCheck={profileInfo?.fname}
                  validate={validateEmpty}
                />

                <CustomInput
                  label="Email"
                  fieldName="email"
                  placeHolder="Email Address"
                  type="email"
                  defaultValue={profileInfo?.email}
                  defaultCheck={profileInfo?.email}
                  // validate={validateEmpty}
                />

                {/* <FormControl isDisabled mt="30px">
                  <FormLabel fontSize="14px">Email</FormLabel>
                  <Input
                    variant="flushed"
                    borderColor="#929292"
                    value={profileInfo?.email}
                    _focusVisible={{
                      borderColor: "#929292",
                    }}
                    placeholder="Enter your email"
                  />
                </FormControl> */}

                <Field name="organization" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      mt="20px"
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
                      mt="20px"
                      isInvalid={form.errors.position && form.touched.position}
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
                      mt="20px"
                      isInvalid={form.errors.phone && form.touched.phone}
                    >
                      {/* <FormLabel fontSize="14px">Town (Optional)</FormLabel> */}
                      <Input
                        borderColor="#929292"
                        color="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        type="number"
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
                      mt="20px"
                      isInvalid={form.errors.message && form.touched.message}
                    >
                      <FormLabel fontSize="16px" color="#929292">
                        How do you want to Support
                      </FormLabel>
                      <Textarea
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        bgColor="white"
                        borderColor="#929292"
                        color="#929292"
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
                  mt="48px"
                  isLoading={props.isSubmitting}
                  isDisabled={success}
                  fontSize="18px"
                  fontWeight={600}
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
                  Submit <ArrowForwardIcon boxSize="24px" ml="8px" />
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
  useEffect(()=>{
    setMounted(true);
  }, [])

  if(!mounted) return <Skeleton height="30px" mt="16px" />

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

