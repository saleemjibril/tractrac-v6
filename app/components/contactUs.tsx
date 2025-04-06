"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";

import { useState } from "react";
import {
    useCollaborateMutation
  } from "@/redux/services/userApi";
import { toast } from "react-toastify";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function ContactUsComponent() {
    const initialDataState = {
      name: "",
      message: "",
      email: "",
      type: "support",
    };
    const [data, setData] = useState(initialDataState);
    // Function to update the object state
    const handleInputChange = (e: any) => {
      const { name, value } = e?.target;
      // alert(value)
  
      // Use the spread operator to create a new object with updated property
      setData({
        ...data,
        [name]: value,
      });
    };
    const [contact] = useCollaborateMutation();
    const [error, setError] = useState<string | null>("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
  
    return (
      <ChakraWrapper>
      <Flex
        id="contact"
        width={"100%"}
        // height={"535px"}
        bgImage="url('images/contact-us.jpg')"
        bgPosition="center"
        bgSize="cover"
        bgAttachment="fixed"
        bgRepeat="no-repeat"
        py="8em"
        // pr={{ base: "0px", md: "8em" }}
        px={{ base: "12px", md: "0px" }}
        // pl={{ base: "12px", md: "0px" }}
        justifyContent="end"
      >
        <Box
          mr={{ base: "0px", md: "8em" }}
          bgColor="white"
          py="40px"
          px={{ base: "12px", md: "50px" }}
          borderRadius="6px"
          minW={{ base: "100%", md: "500px" }}
        >
          <Text fontSize="24px" mt="4px" mb="36px">
            Contact Us
          </Text>
  
          {error && (
            <Alert status="error" mb="16px">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
  
          <Box mb="20px">
            <Text mb="8px" fontSize={"14px"}>
              Name
            </Text>
            <Input
              name="name"
              placeholder="Name"
              value={data.name}
              onChange={handleInputChange}
            />
          </Box>
          <Box mb="20px">
            <Text mb="8px" fontSize={"14px"}>
              Email Address
            </Text>
            <Input
              name="email"
              placeholder="Enter your email address"
              value={data.email}
              onChange={handleInputChange}
            />
          </Box>
          <Box mb="20px">
            <Text mb="8px" fontSize={"14px"}>
              Message
            </Text>
            <Textarea
              placeholder="Message"
              name="message"
              value={data.message}
              onChange={handleInputChange}
            />
          </Box>
          <Button
            bgColor="#FA9411"
            color="white"
            borderRadius="4px"
            width="100%"
            onClick={async () => {
              try {
                setLoading(true);
                if (success) {
                  toast.error(
                    "You have already contacted us, please wait for a while  before trying again!"
                  );
                  return;
                }
                const emailRegex =
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
                if (data.name.length < 3) {
                  toast.error("Please enter a valid name");
                  return;
                }
  
                if (data.message.length < 15) {
                  toast.error("Message must have at least 15 characters");
                  return;
                }
  
                if (data.email.length < 1 || !emailRegex.test(data.email)) {
                  toast.error("Please enter a valid email");
                  return;
                }
                const response = await contact({
                  ...data,
                }).unwrap();
  
                if (response.status == "success") {
                  toast.success(
                    response.message ?? "Received, thanks for contacting us!"
                  );
                  setData({
                    ...data,
                    email: "",
                    name: "",
                    message: "",
                  });
                  setSuccess(true);
                } else {
                  toast.error("An unknown error occured");
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
              } finally {
                setLoading(false);
              }
            }}
            disabled={success}
            isLoading={loading}
          >
            Send
          </Button>
        </Box>
      </Flex>
      </ChakraWrapper>
    );
  }