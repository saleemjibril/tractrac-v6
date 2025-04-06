"use client";
import {
  Box,
  Image,
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
  AlertTitle,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { createElement, Dispatch, SetStateAction, useState } from "react";
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useMakePaymentMutation } from "@/redux/services/userApi";
import { useAppSelector } from "@/redux/hooks";

export default function Pay() {
  const initialState: Record<string, string> = {
    amount: "",
    url: "",
  };
  const [data, setData] = useState(initialState);

  return (
    <SidebarWithHeader>
      {data.amount.length < 1 ? (
        <EnterInvoice setData={setData} />
      ) : (
        <MakePaymentForInvoice data={data} />
      )}
    </SidebarWithHeader>
  );
}

function EnterInvoice({
  setData,
}: {
  setData: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  const [makePayment] = useMakePaymentMutation();
  const { profileInfo } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState("");
  const [error, setError] = useState<string | null>("");

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
          <Image src="/images/pay.svg" alt="wallet image icon" />
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
          />
        </Box>

        <Button
          mt="40px"
          height="56px"
          isLoading={isLoading}
          onClick={async () => {
            try {
              setIsLoading(true);
              setError(null);
              const response = await makePayment({
                user_id: "2",
                // user_id: profileInfo?.id,
                invoice_id: invoice,
              }).unwrap();
              if (response?.status == "success") {
                setData({
                  amount: response?.data[0].amount,
                  url: response?.data[0].auth_url,
                });
              } else {
                setError(
                  response?.message || "An unknown error occured, try again!"
                );
              }
            } catch (e) {
              const error = e as any;
              if (error?.data?.errors) {
              } else if (error?.data?.message) {
                setError(error?.data?.message);
              }
              console.error("rejected", error);
            } finally {
              setIsLoading(false);
            }
          }}
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
          <Image src="/images/pay.svg" alt="wallet image icon" />
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
            ₦{parseFloat(data.amount).toLocaleString()}
          </Text>
        </Box>

        <Button
          mt="40px"
          height="56px"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              window.open(data.url);
              setDisabled(true);
            }
          }}
          w="100%"
          bgColor="#FA9411"
          color="white"
          _hover={{ opacity: 0.8 }}
        >
          <Text>
            {disabled ? "Payment has been initiated" : "Make payment"}
          </Text>
          { !disabled && <ArrowForwardIcon boxSize="24px" ml="8px" mt="3px" /> }
        </Button>
      </Box>
    </Flex>
  );
}
