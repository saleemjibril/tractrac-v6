"use client";
import {
  Box,
  ComponentWithAs,
  Flex,
  IconProps,
  SimpleGrid,
  Text,
  Button,
  Center,
  Input,
  Alert,
  AlertIcon,
  AlertTitle
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../../../components/Sidenav";
import { createElement, Dispatch, SetStateAction, useEffect, useState } from "react";
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useMakePaymentMutation } from "@/redux/services/userApi";
import { useAppSelector } from "@/redux/hooks";
import { getTrackerInvoiceDetails, initialiseTrackerPayment, initializeTrackerPayment, verifyTrackerPayment } from "@/app/apis/payment";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/utils/errorUtils";
import { usePaystackPayment } from "react-paystack";
import dynamic from 'next/dynamic';
import { useSearchParams } from "next/navigation";

const PaystackHook = dynamic(
  () => import('react-paystack').then(mod => mod.usePaystackPayment),
  { ssr: false }
);


export default function Pay() {
  const initialState: Record<string, string> = {
    amount: "",
    url: "",
  };
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const { userToken } = useAppSelector((state) => state.auth);

  const [invoice, setInvoice] = useState("");
  const [tractorId, setTractorId] = useState("");

  const searchParams = useSearchParams();

  // Get tractor_id from URL parameters
  useEffect(() => {
    const tractorIdFromParams = searchParams.get('tractor_id');
    if (tractorIdFromParams) {
      setTractorId(tractorIdFromParams);
    }
  }, [searchParams]);

  const handleGetInvoiceDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await initializeTrackerPayment(invoice, tractorId, userToken as string);
      console.log("getTrackerInvoiceDetails", response);

         if (typeof window !== 'undefined') {
      window.open(response?.data.authorization_url);
    }
    } catch (err) {
      const error = err as any;
      const errorMessage = getErrorMessage(error, "An unexpected error occurred");
      toast.error(errorMessage);
      console.log("Error getting payment details", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarWithHeader>
      {!data?.total_amount ? (
        <EnterInvoice
          onClickFunction={handleGetInvoiceDetails}
          setData={setData}
          setInvoice={setInvoice}
          setTractorId={setTractorId}
          error={error}
          isLoading={isLoading}
        />
      ) : (
        <MakePaymentForInvoice data={data} />
      )}
    </SidebarWithHeader>
  );
}

function EnterInvoice({
  onClickFunction,
  setData,
  setInvoice,
  setTractorId,
  error,
  isLoading,
}: {
  setData: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  const [makePayment] = useMakePaymentMutation();

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box
        bgColor="white"
        width="400px"
        py="50px"
        px="36px"
        textAlign="center"
        mt="40px"
      >
        {error && (
          <Alert status="error" mb="12px">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        <Center>
          <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446743/pay_y7fzuy.svg" alt="wallet image icon" />
        </Center>
        {/* {invoice} */}
        <Text color="#333333" fontWeight="400" fontSize="14px" mt="10px">
          To access the features and functionality, please enter your Invoice
          Number below:
        </Text>

        <Text color="#00000090" fontWeight={600} mt="12px">
          Enter Invoice Number
        </Text>
        <Box px="40px">
          <Input
            mt="0"
            variant="flushed"
            borderBottom="1px"
            borderBottomColor="#000000"
            onChange={(e) => setInvoice(e.target.value)}
            textAlign={"center"}
            mb={"14px"}
          />
        <Text color="#00000090" fontWeight={600} mt="12px">
          Enter Tractor Id
        </Text>
          <Input
            mt="0"
            variant="flushed"
            borderBottom="1px"
            borderBottomColor="#000000"
            onChange={(e) => setTractorId(e.target.value)}
            textAlign={"center"}
          />
        </Box>

        <Button
          mt="40px"
          height="56px"
          isLoading={isLoading}
          onClick={onClickFunction}
          w="100%"
          bgColor="#FA9411"
          color="white"
          _hover={{ opacity: 0.8 }}
        >
          <Text>Continue</Text>
          <ArrowForwardIcon boxSize="24px" ml="8px" mt="3px" />
        </Button>
      </Box>
    </Flex>
  );
}

function MakePaymentForInvoice({ data }: { data: Record<string, string> }) {
  const [disabled, setDisabled] = useState(false);
  const { userToken, profileInfo } = useAppSelector((state) => state.auth);
  console.log("profileInfo", profileInfo);

  const configPaystack = {
    reference: new Date().getTime().toString(),
    email: profileInfo?.email,
    amount: Number(data?.total_amount) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    metadata: {
      firstName: profileInfo?.name?.split(" ")[0],
      lastName: profileInfo?.name?.split(" ")[0],
      email: profileInfo?.email,
      phone: profileInfo?.phone,
    },
    publicKey: "pk_test_96075d9d4a603d00186c2025094d058b5f4f3b3a",
    // publicKey: "pk_live_6a7e7c0b5677117392f596dff24695cbd0dd2eb0",
    text: "Pay Now",
  };

  const handleCallBack = async (transactionId: string) => {
    console.log("transactionId", transactionId);

    const response = await verifyTrackerPayment(data?.tractor_id, transactionId, userToken as string);

    console.log("verifyTrackerPayment", response);
  };

  const initializePayment = typeof window !== 'undefined' ? PaystackHook(configPaystack) : null;

  const handlePay = async () => {
    setDisabled(true);
    
    const response = await initialiseTrackerPayment(
      data?.tractor_id,
      data?.invoice_number,
      data?.total_amount,
      userToken as string
    )

    console.log("initialiseTrackerPayment", response);
    

    if (typeof window !== 'undefined') {
      window.open(response?.data.authorization_url);
    }
    
    // initializePayment({
    //   onSuccess: (response) => {
    //     console.log("response", response);
    //     handleCallBack(response?.reference);
    //     setDisabled(false);
    //   },
    //   onClose: () => {
    //     alert("Are you want to cancel this transaction");
    //     setDisabled(false);
    //   },
    // });
  };

  return (
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
          fontSize="40px"
          borderRadius="40px"
        >
          <Text color="#FA9411" fontWeight={700}>
            ₦{parseFloat(data?.total_amount).toLocaleString()}
          </Text>
        </Box>

        <Button
          mt="40px"
          height="56px"
          disabled={disabled}
          onClick={handlePay}
          w="100%"
          bgColor="#FA9411"
          color="white"
          _hover={{ opacity: 0.8 }}
        >
          <Text>
            {disabled ? "Payment has been initiated" : "Make payment"}
          </Text>
          {!disabled && <ArrowForwardIcon boxSize="24px" ml="8px" mt="3px" />}
        </Button>
      </Box>
    </Flex>
  );
}
