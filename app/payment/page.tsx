"use client";
import {
  Box,
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
  SimpleGrid,
} from "@chakra-ui/react";
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../components/Sidenav";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserPayments, getUserAgroToolPayments } from "../apis/payment";
import { AddIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/utils/errorUtils";
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
      const errorMessage = getErrorMessage(error, "An unexpected error occurred");
      toast.error(errorMessage);
      setError(errorMessage);
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
      const errorMessage = getErrorMessage(error, "An unexpected error occurred");
      toast.error(errorMessage);
      setError(errorMessage);
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
      const errorMessage = getErrorMessage(error, "An unexpected error occurred");
      toast.error(errorMessage);
      setError(errorMessage);
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
      <Box>
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
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "card":
        return "💳";
      case "transfer":
        return "🏦";
      case "mobile money":
        return "📱";
      default:
        return "💰";
    }
  };

  const formatDate = (date: string) => {
    return moment(date).format("DD/MM/YYYY HH:mm");
  };

  if (loading) {
    return (
      <Box mt="20px">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="16px">
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              bg="white"
              borderRadius="16px"
              p="15px"
              boxShadow="0px 2px 10px rgba(0, 0, 0, 0.08)"
            >
              <Skeleton height="80px" mb="12px" />
              <SkeletonText noOfLines={4} spacing="3" skeletonHeight="20px" />
            </Box>
          ))}
        </SimpleGrid>
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
      <Flex justifyContent="space-between" mb="20px" alignItems="center">
        <Text fontSize="20px" fontWeight={600} color="#333333">
          {paymentType} Payment History
        </Text>

        <Button
          bgColor="#FA9411"
          height="42px"
          borderRadius="8px"
          px="20px"
          color="white"
          as="a"
          href={makePaymentUrl}
          _hover={{
            opacity: 0.8,
          }}
        >
          <Flex alignItems="center" gap="8px">
            <AddIcon boxSize="12px" />
            <Text fontSize="14px" fontWeight={600}>
              Make Payment
            </Text>
          </Flex>
        </Button>
      </Flex>

      <Box maxHeight="600px" overflowY="auto" pr="8px">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="16px">
          {payments?.map((payment: any) => (
            <Box
              key={payment?.id}
              bg="white"
              borderRadius="16px"
              p="15px"
              boxShadow="0px 2px 10px rgba(0, 0, 0, 0.08)"
              transition="all 0.2s"
              _hover={{
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.12)",
              }}
            >
            {/* Status and Amount Row */}
            <Flex justifyContent="space-between" alignItems="center" mb="12px">
              <Flex
                align="center"
                gap="6px"
                bg={statusTypes[payment?.payment_status]?.color || "#FA9411"}
                color="white"
                px="10px"
                py="7px"
                borderRadius="20px"
                fontSize="12px"
                fontWeight={600}
              >
                <Box as="span">
                  {payment?.payment_status === "success"
                    ? "✓"
                    : payment?.payment_status === "pending"
                    ? "⏱"
                    : "✕"}
                </Box>
                <Text>
                  {statusTypes[payment?.payment_status]?.title || "Unknown"}
                </Text>
              </Flex>

              <Box
                bg="rgba(250, 148, 17, 0.1)"
                color="#FA9411"
                px="16px"
                py="8px"
                borderRadius="20px"
                border="1px solid rgba(250, 148, 17, 0.3)"
              >
                <Text fontSize="16px" fontWeight={700}>
                  ₦{payment?.amount?.toLocaleString()}
                </Text>
              </Box>
            </Flex>

            {/* Payment ID */}
            <InfoRow
              label="Payment ID"
              value={payment?.id}
              icon="💳"
              copyable
              onCopy={handleCopyToClipboard}
            />

            {/* Tractor/Tool ID */}
            <InfoRow
              label={paymentType === "Agro Tool" ? "Tool ID" : "Tractor ID"}
              value={payment[idField]}
              icon="🚜"
              copyable
              onCopy={handleCopyToClipboard}
            />

            {/* Invoice and Reference Row */}
            <Flex gap="16px" mb="12px">
              <Box flex={1}>
                <InfoRow
                  label="Invoice"
                  value={payment?.invoice_number}
                  icon="🧾"
                  copyable
                  onCopy={handleCopyToClipboard}
                />
              </Box>
              <Box flex={1}>
                <InfoRow
                  label="Reference"
                  value={payment?.paystack_reference}
                  icon="🏷️"
                  copyable={false}
                  onCopy={handleCopyToClipboard}
                />
              </Box>
            </Flex>

            {/* Type and Date Row */}
            <Flex gap="16px">
              <Box flex={1}>
                <InfoRow
                  label="Type"
                  value={payment?.payment_type}
                  icon={getPaymentTypeIcon(payment?.payment_type)}
                  copyable={false}
                  onCopy={handleCopyToClipboard}
                />
              </Box>
              <Box flex={1}>
                <InfoRow
                  label="Date"
                  value={formatDate(payment?.created_at)}
                  icon="📅"
                  copyable={false}
                  onCopy={handleCopyToClipboard}
                />
              </Box>
            </Flex>

            {/* Verify Payment Button for Pending Payments */}
            {payment?.payment_status === "pending" && (
              <Button
                mt="12px"
                w="100%"
                bgColor="#FA9411"
                color="white"
                height="40px"
                borderRadius="8px"
                fontWeight={600}
                _hover={{
                  opacity: 0.9,
                }}
                onClick={() => {
                  window.open(
                    `https://checkout.paystack.com/${payment?.paystack_access_code}`
                  );
                }}
              >
                Verify Payment
              </Button>
            )}
          </Box>
        ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  icon: string;
  copyable: boolean;
  onCopy: (text: string) => void;
}

function InfoRow({ label, value, icon, copyable, onCopy }: InfoRowProps) {
  return (
    <Box mb="12px">
      <Text fontSize="12px" fontWeight={700} color="#929292" mb="4px">
        {label}
      </Text>
      <Flex alignItems="center" gap="8px">
        <Text fontSize="16px">{icon}</Text>
        <Text
          fontSize="14px"
          fontWeight={500}
          flex={1}
          overflow="hidden"
          textOverflow="ellipsis"
          // whiteSpace="nowrap"
        >
          {value}
        </Text>
        {copyable && (
          <Box
            as="button"
            onClick={() => onCopy(value)}
            p="4px"
            bg="gray.100"
            borderRadius="6px"
            cursor="pointer"
            _hover={{
              bg: "gray.200",
            }}
          >
            <Text fontSize="14px">📋</Text>
          </Box>
        )}
      </Flex>
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
