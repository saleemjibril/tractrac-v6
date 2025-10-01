"use client";
import {
  Box,
  ComponentWithAs,
  Flex,
  Text,
  Button,
  Center,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../../components/Sidenav";
import { useEffect, useState } from "react";
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
// import { useMakePaymentMutation } from "@/redux/services/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { verifyAgroToolPayment, verifyPayment } from "@/app/apis/payment";

export default function PaymentSuccessful() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const params = useSearchParams();
  const reference = params.get("reference");
    const { userToken } = useAppSelector((state) => state.auth);
  

  const handleVerification = async () => {

    console.log({
      reference, userToken
    });

    if(reference?.includes("addon")) {
      const response = await verifyAgroToolPayment(reference, userToken as string);
        console.log("verifyAgroToolPayment", response);
    }
    
        const response = await verifyPayment(reference, userToken as string);
        console.log("verifyPayment", response);
        
    
  }

  useEffect(() => {
    handleVerification();
  }, []);

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <SidebarWithHeader>
      <Flex justifyContent="center" alignItems="center">
        <Box
          bgColor="white"
          width="400px"
          py="50px"
          px="36px"
          textAlign="center"
          mt="40px"
        >
          <Center>
            <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446743/pay_y7fzuy.svg" alt="wallet image icon" />
          </Center>

          <Box
            bgColor="#FA941133"
            py="10px"
            px="24px"
            mt="12px"
            fontSize="30px"
            borderRadius="40px"
          >
            <Text color="#FA9411" fontWeight={700}>
                Processing ...
              {/* ₦{parseFloat("0").toLocaleString()} */}
            </Text>
          </Box>

          <Button
            mt="40px"
            height="56px"
            disabled={true}
            w="100%"
            bgColor="#FA9411"
            color="white"
            _hover={{ opacity: 0.8 }}
          >
            <Text>Make payment</Text>
            <ArrowForwardIcon boxSize="24px" ml="8px" mt="3px" />
          </Button>
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
             bg='none'
             backdropFilter='auto'
             backdropInvert='30%'
             backdropBlur='20px'
        />
        <ModalContent py="24px" px="14px">
          <ModalBody textAlign="center">
            <Flex flexDir="column" alignItems="center">
              <Image
                src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446823/checkmark_jyuxnj.svg"
                width="120px"
                alt="Checkmark image icon"
              />
              <Text fontSize="16px" fontWeight={600}>
                Payment Successful
              </Text>
              <Text my="8px" fontSize="14px">
                Congratulations! Your payment has been successfully processed,
                check your profile for the status of your tractor
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
