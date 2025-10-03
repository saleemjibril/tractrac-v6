"use client";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Skeleton,
  Flex,
  Text,
  Button,
  Center,
  SkeletonText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../components/Sidenav";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserPayments, getUserAgroToolPayments } from "../apis/payment";
import { AddIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import moment from "moment";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  success: { title: "Success", color: "#27AE60" },
  maintenance: { title: "Maintenance", color: "#FF0000" },
  failed: { title: "Failed", color: "#FE391E" },
};

export default function Payments() {
  const { userToken } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [tractorPayments, setTractorPayments] = useState([]);
  const [agroToolPayments, setAgroToolPayments] = useState([]);
  const [trackerPayments, setTrackerPayments] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const handleGetTractorPayments = async () => {
    setLoading(true);
    try {
      const response = await getUserPayments(userToken as string);
      console.log("Tractor Payments", response);
      setTractorPayments(response.data);
    } catch (err) {
      const error = err as any;
      toast.error(
        error?.response?.data?.detail || "An unexpected error occurred"
      );
      setError(error?.response?.data?.detail || "An unexpected error occurred");
      console.log("ERROR GETTING TRACTOR PAYMENTS", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAgroToolPayments = async () => {
    setLoading(true);
    try {
      const response = await getUserAgroToolPayments(userToken as string);
      console.log("Agro Tool Payments", response);
      setAgroToolPayments(response.data);
    } catch (err) {
      const error = err as any;
      toast.error(
        error?.response?.data?.detail || "An unexpected error occurred"
      );
      setError(error?.response?.data?.detail || "An unexpected error occurred");
      console.log("ERROR GETTING AGRO TOOL PAYMENTS", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrackerPayments = async () => {
    setLoading(true);
    try {
      const response = await getUserPayments(userToken as string);
      console.log("All Payments", response);
      // Filter for tracker payments
      const trackerPayments = response.data.filter(
        (payment: any) => payment.type === "tracker"
      );
      setTrackerPayments(trackerPayments);
    } catch (err) {
      const error = err as any;
      toast.error(
        error?.response?.data?.detail || "An unexpected error occurred"
      );
      setError(error?.response?.data?.detail || "An unexpected error occurred");
      console.log("ERROR GETTING TRACKER PAYMENTS", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTractorPayments();
  }, []);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setError("");
    if (index === 0) {
      handleGetTractorPayments();
    } else if (index === 1) {
      handleGetAgroToolPayments();
    } else if (index === 2) {
      handleGetTrackerPayments();
    }
  };

  return (
    <SidebarWithHeader>
      <Box mx="20px" my="12px" py="20px">
        <Text
          fontSize="24px"
          fontWeight={700}
          lineHeight="40px"
          color="#333333"
          mb="20px"
        >
          Payments
        </Text>

        <Tabs
          index={activeTab}
          onChange={handleTabChange}
          // colorScheme="orange"
          // variant="enclosed"
        >
          <TabList>
            <Tab
             _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              fontWeight={600}
            >
              Tractor Payment
            </Tab>
            <Tab
             _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              fontWeight={600}
            >
              Agro Tool Payment
            </Tab>
          </TabList>

          <TabPanels>
            {/* Tractor Payment Tab */}
            <TabPanel px={0}>
              <PaymentTabContent
                loading={loading}
                error={error}
                payments={tractorPayments}
                paymentType="Tractor"
                makePaymentUrl="/payment/pay"
                idField="hire_tractor_id"
              />
            </TabPanel>

            {/* Agro Tool Payment Tab */}
            <TabPanel px={0}>
              <PaymentTabContent
                loading={loading}
                error={error}
                payments={agroToolPayments}
                paymentType="Agro Tool"
                makePaymentUrl="/payment/tools/pay"
                idField="hire_addon_id"
              />
            </TabPanel>

          </TabPanels>
        </Tabs>
      </Box>
    </SidebarWithHeader>
  );
}

interface PaymentTabContentProps {
  loading: boolean;
  error: string;
  payments: any[];
  paymentType: string;
  makePaymentUrl: string;
  idField: string;
}

function PaymentTabContent({
  loading,
  error,
  payments,
  paymentType,
  makePaymentUrl,
  idField,
}: PaymentTabContentProps) {
  if (loading) {
    return (
      <Box boxShadow="lg" bg="white" borderRadius="12px" mt="20px">
        <Skeleton height="80px" />
        <Box p="12px">
          <SkeletonText
            my="12px"
            noOfLines={8}
            spacing="3"
            skeletonHeight="24px"
          />
        </Box>
      </Box>
    );
  }

  if (error || payments?.length < 1) {
    return (
      <EmptyPaymentPlaceholder
        paymentType={paymentType}
        makePaymentUrl={makePaymentUrl}
      />
    );
  }

  return (
    <Box mt="20px">
      <Flex justifyContent="space-between" mb="10px" alignContent="center">
        <Text
          fontSize="20px"
          fontWeight={600}
          lineHeight="32px"
          color="#333333"
        >
          {paymentType} Payment History
        </Text>

        <Button
          bgColor="#FA9411"
          mb="12px"
          height="42px"
          borderRadius="4px"
          width="170px"
          color="white"
          as="a"
          href={makePaymentUrl}
          _hover={{
            opacity: 0.8,
          }}
        >
          <Flex justifyContent="center" alignContent="center">
            <Text fontSize="14px">Make Payment</Text>
            <AddIcon boxSize="12px" ml="30px" mt="3px" />
          </Flex>
        </Button>
      </Flex>

      <TableContainer
        border="1px"
        borderColor="#32323220"
        borderRadius="12px"
        height="500px"
        bgColor="white"
      >
        <Table variant="simple" bgColor="white">
          <Thead bgColor="#FA9411">
            <Tr>
              <Th color="white">Payment ID</Th>
              <Th color="white">{paymentType === "Agro Tool" ? "Tool" : "Tractor"} ID</Th>
              <Th color="white">Invoice number</Th>
              <Th color="white">Amount Paid (₦)</Th>
              <Th color="white">Reference</Th>
              <Th color="white">Payment type</Th>
              <Th color="white">Date</Th>
              <Th color="white">Payment status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments?.map((payment: any) => (
              <Tr
                cursor={"pointer"}
                key={payment?.id}
                onClick={() => {
                  if (payment?.payment_status === "pending") {
                    window.open(
                      `https://checkout.paystack.com/${payment?.paystack_access_code}`
                    );
                  }
                }}
              >
                <Td>{payment?.id}</Td>
                <Td>{payment[idField]}</Td>
                <Td>{payment?.invoice_number}</Td>
                <Td>{payment?.amount}</Td>
                <Td>{payment?.paystack_reference}</Td>
                <Td>{payment?.payment_type}</Td>
                <Td>
                  {moment(payment?.created_at).format(
                    "MMMM D, YYYY [at] h:mm:ss A"
                  )}
                </Td>
                <Td>
                  {statusTypes[payment?.payment_status]?.color && (
                    <Box
                      mt="10px"
                      bgColor={statusTypes[payment?.payment_status].color}
                      py="4px"
                      textAlign="center"
                      borderRadius="4px"
                      w="80px"
                    >
                      <Text fontSize="14px" color="white">
                        {statusTypes[payment?.payment_status].title}
                      </Text>
                    </Box>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

interface EmptyPaymentPlaceholderProps {
  paymentType: string;
  makePaymentUrl: string;
}

function EmptyPaymentPlaceholder({
  paymentType,
  makePaymentUrl,
}: EmptyPaymentPlaceholderProps) {
  return (
    <Flex justifyContent="center" alignItems="center" mt="40px">
      <Box bgColor="white" width="400px" p="60px" textAlign="center">
        <Center>
          <Image
            src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446712/empty-state_tytpqr.svg"
            alt="Empty state image icon"
          />
        </Center>
        <Text color="#323232" fontWeight="700" fontSize="20px" mt="57px">
          Your list is empty
        </Text>

        <Text color="#323232" fontWeight="400" fontSize="18px">
          All {paymentType} Payments will be listed here
        </Text>
        <Link href={makePaymentUrl} prefetch={true}>
          <Button
            as="a"
            mt="50px"
            height="56px"
            w="240px"
            bgColor="#FA9411"
            color="white"
          >
            Make Payment
          </Button>
        </Link>
      </Box>
    </Flex>
  );
}
