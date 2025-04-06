"use client";
import { toast } from "react-toastify";
import {
  useSubscribeMutation,
} from "@/redux/services/userApi";
import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  Button,
  Divider,
  Input,
} from "@chakra-ui/react";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function FooterComponent() {
    const [subscribe] = useSubscribeMutation();
    // const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
  
    return (
      <ChakraWrapper>
      <Flex
        bgColor="#FA9411"
        pt="80px"
        pb="40px"
        direction="column"
        alignItems="center"
        color="white"
        px="16px"
      >
        <Text lineHeight="43px" fontWeight={500} fontSize="36px">
          Join our community &{" "}
          <Box as="span" textDecoration="underline">
            stay updated.
          </Box>
        </Text>
        <Text fontSize="18px" mt="12px" mb="36px">
          No Spam. Only sweet content and updates of our products.
        </Text>
        <Box position="relative" mb="60px">
          <Input
            width={{ base: "350px", md: "670px" }}
            borderRadius="50px"
            height={{ base: "55px", md: "64px" }}
            pr={{ base: "120px", md: "170px" }}
            bgColor="white"
            color="black"
            placeholder="Email address"
            disabled={success}
            onChange={(e) => setEmail(e?.currentTarget.value)}
          />
          <Button
            width={{ base: "100px", md: "150px" }}
            height={{ base: "40px", md: "50px" }}
            onClick={async () => {
              try {
                setLoading(true);
                if (success) {
                  toast.error("You have already subscribed");
                  return;
                }
                const emailRegex =
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
                if (email.length < 1 || !emailRegex.test(email)) {
                  toast.error("Please enter a valid email");
                  return;
                }
                const response = await subscribe({
                  email,
                }).unwrap();
  
                if (response.status == "success") {
                  toast.success(
                    response.message ?? "Received, thanks for subscribing!"
                  );
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
                  toast.error(error?.data?.message);
                }
                console.error("rejected", error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={success}
            isLoading={loading}
            borderRadius="90px"
            bgColor="black"
            position="absolute"
            right={4}
            top={2}
            color="white"
            zIndex={1}
          >
            Submit
          </Button>
        </Box>
        <Divider mx="40px" />
        {/* direction={{ base: "row", lg: "row" }} */}
        <Flex
          mt="50px"
          columnGap="50px"
          rowGap="12px"
          flexWrap="wrap"
          justifyContent="center"
        >
          <Link href="/about">About us</Link>
          <Link href="/contact">Contact us</Link>
          <Link href="https://www.linkedin.com/company/tractrac">LinkedIn</Link>
          <Link href="https://web.facebook.com/tractracglobal">Facebook</Link>
          <Link href="https://twitter.com/TractracGlobal">Twitter</Link>
          <Link href="https://www.instagram.com/tractracglobal">Instagram</Link>
        </Flex>
      </Flex>
      </ChakraWrapper>
    );
  }