"use client";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  ModalContent,
  Image,
  Input,
  Modal as ChakraModal,
  Stack,
  Text,
  Box,
  ModalOverlay,
  useDisclosure,
  ModalBody,
} from "@chakra-ui/react";
// const DynamicComponent = dynamic(() => import('../../components/Sidenav'))
import { SidebarWithHeader } from "../../components/Sidenav";
import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hooks";
import { useValidateIssamIdMutation } from "@/redux/services/userApi";
import { toast } from "react-toastify";

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

export default function Issam() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { profileInfo } = useAppSelector((state) => state.auth);
  // const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [validateIssamId] = useValidateIssamIdMutation();

  function validateEmpty(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

  return (
    <SidebarWithHeader>
      <Flex p="16px" gap="20px" direction={{ base: "column", lg: "row" }}>
        <Stack w={{ base: "100%", lg: "60%" }}>
          <Text fontSize="24px" fontWeight={700} mb="4px">
            ISSAM
          </Text>
          <Image src="/images/agent.svg" alt="Agent image icon" />

          <Text mt="24px" fontSize="14px">
            To access the features and functionality, please enter your unique
            ID below:
          </Text>

          <Formik
            // initialValues={{ name: 'Sasuke' }}
            initialValues={{ state: "", lga: "" }}
            onSubmit={async (values: any, { resetForm }) => {
              setError(null);

              try {
                // alert('ss')
                console.log(values);
                const response = await validateIssamId({
                  ...values,
                  user_id: profileInfo?.id,
                }).unwrap();
                if (response.status == "success") {
                  // router.replace("/login");
                  setSuccess(true);
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
                onOpen();
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

                <Field name="issam_id" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      my={4}
                      isInvalid={form.errors.issam_id && form.touched.issam_id}
                    >
                      <Input
                        variant="flushed"
                        borderColor="#929292"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        {...field}
                        width={{ base: "100%", lg: "328px" }}
                        placeholder="Enter ID."
                      />
                      <FormErrorMessage>
                        {form.errors.issam_id}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  bgColor="#F8A730"
                  color="white"
                  width={{ base: "100%", lg: "328px" }}
                  minH="50px"
                  my="16px"
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
                  Continue <ArrowForwardIcon boxSize="24px" ml="8px" />
                </Button>
              </Form>
            )}
          </Formik>
        </Stack>

        <Box p="24px" flex="1">
          <Text fontSize="18px" fontWeight={600} mb="4px">
            About ISSAM
          </Text>
          <Text mt="16px" fontSize="16px" color="#333333">
            The ISSAM (Improving Smallholder Farmers&#39; access to Small-scaled
            Agricultural Mechanisation Services) project, supported by the
            Mastercard Foundation, aims to address limited access to
            mechanisation in Nigeria. <br />
            <br />
            Led by Tractrac Mechanisation Services, it targets young men and
            women in rural communities, creating work opportunities and
            improving access to affordable technologies. Implementation will
            occur in five states: Adamawa, Federal Capital Territory, Kaduna,
            Kano, and Nasarawa. The project seeks to create direct work
            opportunities for 10,192 youth, with a focus on increasing female
            participation. Indirectly, it aims to impact around 315,000 farmers.
            <br />
            <br />
            Objectives include bundled mechanisation services, affordable last
            mile access, financial inclusion, technology integration, and policy
            enhancement. Strategic partners include Women In Mechanisation
            Association (WIMA), National Centre for Agricultural Mechanisation
            (NCAM), and others. Aligned with the Mastercard Foundation&#39;s vision,
            the project aims to empower youth, promote gender equality, and
            drive sustainable agricultural development in the target regions.
            Through innovative technologies and inclusive market systems, the
            project seeks to transform the rural mechanisation supply chain and
            uplift smallholder farmers.
          </Text>
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
        <ModalOverlay
        // bgImage="url('images/modal-bg.jpg')"
        // bgRepeat="no-repeat"
        // bgPosition="right bottom"
        // bgSize="cover"
        />
        <ModalContent
        //   mr={{ base: "12px", md: "150px" }}
        //   ml={{ base: "12px" }}
        //   margin="auto"
        >
          <ModalBody textAlign="center">
            <Text fontWeight={600}>Error: {error}</Text>
            <Text mt="8px">
              Ensure you have entered the correct ID or Contact the admin
            </Text>
            <Button
              onClick={onClose}
              width="100%"
              height="45px"
              bgColor="#FA9411"
              _hover={{
                bgColor: "#FA9411",
              }}
              mt="12px"
              color="white"
            >
              OK
            </Button>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </SidebarWithHeader>
  );
}
