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
  Text,
  Box,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { Formik, Form, Field } from "formik";
import { useState } from "react";

export default function TrackATractor() {
  const [error, setError] = useState<string | null>(null);

  return (
    <SidebarWithHeader isAuth={true}>
      <Box
        pl="60px"
        pr={{ base: "60px", lg: "150px", xl: "200px" }}
        py="40px"
        mt="15px"
        mx="20px"
        bgColor="white"
      >
        <Text fontSize="24px" fontWeight={700} mb="10px" lineHeight="16px">
          Track tractors.
        </Text>
        <Text color="grey" mb="30px">
          Use the form below to track real time location of your tractor
        </Text>
        <Formik
          initialValues={{
            note: "",
          }}
          onSubmit={async (values: any, { resetForm }) => {
            setError(null);

            try {
              // alert('ss')
              console.log(values);

              // const response = await hireTractor({
              //   ...values,
              //   user_id: profileInfo?.id,
              //   tractor_id: id,
              // }).unwrap();

              // if (response.status == "success") {
              //   //   // router.replace("/login");
              //   //   resetForm();
              //   //   setSuccess(true);
              // } else {
              //   setError("An unknown error occured");
              // }
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

              <Flex
                mt="20px"
                columnGap="30px"
                // justifyContent="center"
                alignItems="end"
                // alignContent="center"
              >
                <Field name="tracker_code">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.tracker_code && form.touched.tracker_code
                      }
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Enter tracker code
                      </FormLabel>
                      <Input
                        {...field}
                        bgColor="#3232320D"
                        fontSize="12px"
                        color="#323232"
                      />
                      <FormErrorMessage>
                        {form.errors.tracker_code}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  bgColor="#F8A730"
                  color="white"
                  width={{ base: "100%", md: "50%" }}
                  fontSize="16px"
                  fontWeight={600}
                  // mt="16px"
                  // minH="100%"
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
                  <Text fontSize="14px">Track tractor</Text>
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>

        <Image src="/images/map2.svg" width="100%" mt="24px" alt="Map image" />
      </Box>
    </SidebarWithHeader>
  );
}

// function HireTractorForm({ id }: { id: string }) {

//   const [hireTractor] = useHireTractorMutation();
//   const { profileInfo } = useAppSelector((state) => state.auth);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const router = useRouter();

//   return (

//   );
// }
