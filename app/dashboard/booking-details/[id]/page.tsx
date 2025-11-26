"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  useToast,
  Flex,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppSelector } from "@/redux/hooks";
import { getMyHiredTractorsDetails, cancelBooking } from "@/app/apis/tractor";
import { formatAmount } from "@/app/utils/formatNumber";
import { SidebarWithHeader } from "@/app/components/Sidenav";
import { Schedule, Pneding, Paid, InUse, Cancelled, Complete, Warning } from "@/app/components/Icons";

interface BookingDetails {
  id: string;
  farmer_id: string;
  owner_id: string;
  tractor_id: string;
  farm_size?: number;
  state: string;
  local_government_area: string;
  community: string;
  implement_types: string[];
  address: string;
  start_date: string;
  end_date: string;
  additional_info?: string;
  total_amount: number;
  invoice_number?: string;
  status: string;
  distance?: number;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  is_paid: boolean;
  payment_method?: string;
  tractor: {
    id: string;
    name: string;
    capacity: string;
    brand: string;
    type: string;
    location: string;
  };
  farmer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { userToken } = useAppSelector((state) => state.auth);
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bookingId = params.id as string;

  useEffect(() => {
    if (bookingId && userToken) {
      fetchBookingDetails();
    }
  }, [bookingId, userToken]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyHiredTractorsDetails(bookingId, userToken as string);
      console.log("getMyHiredTractorsDetails", response);
      
      setBooking(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load booking details");
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to load booking details",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Schedule boxSize="70px" />;
      case "approved":
      case "payment_pending":
        return <Pneding boxSize="70px" />;
      case "paid":
        return <Paid boxSize="70px" />;
      case "in_progress":
        return <InUse boxSize="70px" />;
      case "rejected":
      case "cancelled":
      case "abandoned":
        return <Cancelled boxSize="70px" />;
      case "completed":
        return <Complete boxSize="70px" />;
      default:
        return <Pneding boxSize="70px" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "Request Summary";
      case "approved":
        return "Pending";
      case "payment_pending":
        return "Payment Pending";
      case "in_progress":
        return "Operation Progress";
      case "cancelled":
        return "Cancelled";
      case "rejected":
        return "Rejected";
      case "abandoned":
        return "Abandoned";
      case "completed":
        return "Completed";
      case "paid":
        return "Paid";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBackToHome = () => {
    router.push("/dashboard");
  };

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      await cancelBooking(bookingId, "User requested cancellation", userToken as string);
      
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
      
      // Refresh booking details
      await fetchBookingDetails();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to cancel booking",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={10}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="#FA9411" />
        </Flex>
      </Container>
    );
  }

  if (error || !booking) {
    return (
      <Container maxW="container.lg" py={10}>
        <VStack spacing={6} align="center" minH="400px" justify="center">
          <Text fontSize="18px" fontWeight={600} color="#333">
            {error || "Booking not found"}
          </Text>
          <Button
            bg="#FA9411"
            color="white"
            _hover={{ bg: "#0091cc" }}
            onClick={() => fetchBookingDetails()}
          >
            Try Again
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <SidebarWithHeader>
    <Box minH="100vh" bg="white">
      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Status Icon and Title */}
          <VStack spacing={3} align="center" pt={6}>
            {getStatusIcon(booking.status)}
            <Text fontSize="18px" fontWeight={600}>
              {getStatusText(booking.status)}
            </Text>
          </VStack>

          {/* Tractor Details */}
          <Box>
            <Text fontSize="16px" fontWeight={600} mb={3}>
              Tractor Details
            </Text>
            <Box
              p="20px 15px"
              borderRadius="10px"
              bg="#ffc77e19"
              border="1px solid rgba(0, 162, 227, 0.2)"
            >
              <VStack spacing={3} align="stretch">
                <DetailRow label="Tractor Name" value={booking.tractor?.name || ""} />
                <DetailRow label="Tractor Capacity" value={`${booking.tractor?.capacity || ""} HP`} />
                <DetailRow label="Tractor Brand" value={booking.tractor?.brand || ""} />
                <DetailRow label="Tractor Type" value={booking.tractor?.type || ""} />
                <DetailRow
                  label="Implement Type"
                  value={booking.implement_types?.map((type) => type.split("_").join(" ")).join(", ") || ""}
                />
                <DetailRow label="Tractor Location" value={booking.tractor?.location || ""} />
              </VStack>
            </Box>
          </Box>

          {/* Your Details */}
          <Box>
            <Text fontSize="16px" fontWeight={600} mb={3}>
              Your Details
            </Text>
            <Box
              p="20px 15px"
              borderRadius="10px"
              bg="#ffc77e19"
              border="1px solid rgba(0, 162, 227, 0.2)"
            >
              <VStack spacing={3} align="stretch">
                <DetailRow label="State" value={booking.state || ""} />
                <DetailRow label="LGA" value={booking.local_government_area || ""} />
                <DetailRow label="Address" value={booking.address || ""} />
                <DetailRow label="Community" value={booking.community || ""} />
                <DetailRow label="Tractor Name" value={booking.tractor?.name || ""} />
                {booking.farm_size && (
                  <DetailRow
                    label="Farm Size"
                    value={`${booking.farm_size} Square metres`}
                  />
                )}
                <DetailRow
                  label="Implement Type"
                  value={booking.implement_types?.map((type) => type.split("_").join(" ")).join(", ") || ""}
                />
                {booking.additional_info && (
                  <DetailRow
                    label="Additional Information/Comment"
                    value={booking.additional_info}
                  />
                )}
                <DetailRow label="Start Date" value={formatDate(booking.start_date)} />
                <DetailRow label="End Date" value={formatDate(booking.end_date)} />
              </VStack>
            </Box>
          </Box>

          {/* Requested On */}
          <Box>
            <Text fontSize="14px" fontWeight={400} color="#333">
              Requested On
            </Text>
            <Text fontSize="14px" fontWeight={600} mt={1}>
              {formatDate(booking.created_at)}
            </Text>
          </Box>

          {/* Invoice Details */}
          {booking.status !== "pending" &&
            booking.status !== "rejected" &&
            booking.status !== "cancelled" && (
              <Box
                mt={6}
                mb={3}
                p="20px 15px"
                bg="white"
                border="1px solid #ECECEC"
                borderRadius="10px"
                boxShadow="0 6.24px 24.94px rgba(148, 163, 184, 0.1)"
              >
                <VStack spacing={4} align="stretch">
                  <TransactionRow
                    label="Invoice Number"
                    value={booking.invoice_number || ""}
                  />
                  <TransactionRow
                    label="Amount Due"
                    value={
                      booking.status === "paid" ||
                      booking.is_paid ||
                      booking.status === "in_progress" ||
                      booking.status === "completed"
                        ? "₦0.00"
                        : `₦${formatAmount(String(booking.total_amount || 0))}`
                    }
                  />
                  {(booking.status === "paid" ||
                    booking.status === "in_progress" ||
                    booking.is_paid ||
                    booking.status === "completed") && (
                    <TransactionRow
                      label="Amount Paid"
                      value={`₦${formatAmount(String(booking.total_amount || 0))}`}
                    />
                  )}
                </VStack>
              </Box>
            )}

          {/* Action Buttons */}
          <Box
            position="sticky"
            bottom={0}
            bg="white"
            borderTop="1px solid #ECECEC"
            pt={4}
            pb={6}
          >
            {booking.status === "paid" ||
            booking.status === "pending" ||
            booking.status === "approved" ||
            booking.status === "payment_pending" ? (
              <HStack spacing={3}>
                <Button
                  flex={1}
                  variant="outline"
                  borderColor="#FA9411"
                  color="#FA9411"
                  _hover={{ bg: "rgba(250, 148, 17, 0.1)" }}
                  onClick={onOpen}
                >
                  Cancel Booking
                </Button>
                <Button
                  flex={1}
                  bg="#FA9411"
                  color="white"
                  _hover={{ bg: "#0091cc" }}
                  onClick={() => {
                    if (booking.status === "approved" || booking.status === "payment_pending") {
                      router.push(`/payment/pay${booking.invoice_number ? `?invoice=${encodeURIComponent(booking.invoice_number)}` : ""}`);
                    } else {
                      handleBackToHome();
                    }
                  }}
                >
                  {booking.status === "approved" || booking.status === "payment_pending" ? "Pay Now" : "Back to Home"}
                </Button>
              </HStack>
            ) : (
              <Button
                w="full"
                bg="#FA9411"
                color="white"
                _hover={{ bg: "#0091cc" }}
                onClick={handleBackToHome}
              >
                Back to Home
              </Button>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>

    {/* Cancel Booking Confirmation Modal */}
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader textAlign="center" pt={6}>
          <VStack spacing={3}>
            <Warning boxSize="100px" />
            <Text fontSize="18px" fontWeight={600} color="#333">
              Are you sure?
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody textAlign="center" px={6}>
          <Text fontSize="14px" fontWeight={400} color="#929292">
            This cannot be undone. Please confirm if you want to proceed with
            cancelling this booking.
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center" gap={3} pb={6}>
          <Button
            flex={1}
            variant="outline"
            borderColor="#FA9411"
            color="#FA9411"
            onClick={onClose}
            isDisabled={cancelling}
          >
            Cancel
          </Button>
          <Button
            flex={1}
            bg="#FA9411"
            color="white"
            _hover={{ bg: "#e08410" }}
            onClick={handleCancelBooking}
            isLoading={cancelling}
            loadingText="Cancelling..."
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </SidebarWithHeader>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack justify="space-between" align="flex-start">
      <Text
        fontSize="14px"
        fontWeight={400}
        color="#929292"
        flex="0 0 120px"
        textAlign="left"
      >
        {label}
      </Text>
      <Text
        fontSize="14px"
        fontWeight={500}
        color="#333"
        flex={1}
        textAlign="right"
        textTransform={"capitalize"}
      >
        {value}
      </Text>
    </HStack>
  );
}

function TransactionRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack justify="space-between" align="flex-start">
      <Text
        fontSize="14px"
        fontWeight={400}
        color="#929292"
        flex="0 0 120px"
        textAlign="left"
      >
        {label}
      </Text>
      <Text
        fontSize="14px"
        fontWeight={500}
        color="#333"
        flex={1}
        textAlign="right"
      >
        {value}
      </Text>
    </HStack>
  );
}

