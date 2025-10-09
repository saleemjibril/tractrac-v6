"use client";
import {
  Box,
  Flex,
  Text,
  Button,
  Center,
  Skeleton,
  SkeletonText,
  VStack,
  HStack,
  Badge,
  Divider,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { getTractor } from "@/app/apis/tractor";
import { SidebarWithHeader } from "@/app/components/Sidenav";
import { CheckIcon, TimeIcon, WarningIcon } from "@chakra-ui/icons";
import { statusTypes } from "@/app/utils/tractorStatus";

interface Tractor {
  id?: string;
  name?: string;
  tractor_name?: string;
  brand?: string;
  model?: string;
  status?: string;
  tractor_image?: string[];
  created_at?: string;
  updated_at?: string;
}

const statusSteps = [
  { key: 'pending', title: 'Request Received', icon: TimeIcon, color: '#FA9411' },
  { key: 'pending_verification', title: 'Under Review', icon: TimeIcon, color: '#D69E2E' },
  { key: 'verified', title: 'Verified', icon: CheckIcon, color: '#38A169' },
  { key: 'awaiting_payment', title: 'Awaiting Payment', icon: WarningIcon, color: '#E53E3E' },
  { key: 'approved', title: 'Approved', icon: CheckIcon, color: '#38A169' },
  { key: 'available', title: 'Available', icon: CheckIcon, color: '#38A169' },
];

const getStepMessage = (currentStatus: string, stepIndex: number) => {
  const status = ['pending', 'pending_verification', 'verified', 'awaiting_payment', 'approved', 'available'];
  const stepStatus = status[stepIndex];
  const currentStatusIndex = status.indexOf(currentStatus);

  if (stepIndex === currentStatusIndex) {
    // Current step
    switch (stepStatus) {
      case 'pending':
        return "Your Tractor enlistment request is Received successfully";
      case 'pending_verification':
        return "Your Tractor enlistment request is accepted by one of our agent and its pending verification.";
      case 'verified':
        return "Your enlistment has been verified by our agent and an invoice has been sent to you, Please make payment to get your tracker installed and tractor approved";
      case 'awaiting_payment':
        return "Your enlistment is awaiting your tractor tracker payment, please make payment to get your tractor approved";
      case 'approved':
        return "Congratulations🎉, your enlistment has been approved successfully. And available for hire";
      case 'available':
        return "Congratulations🎉, your enlistment has been approved successfully. And available for hire";
      default:
        return "We're working on your request. We'll notify you when there is an update.";
    }
  } else if (stepIndex < currentStatusIndex) {
    // Completed step
    switch (stepStatus) {
      case 'pending':
        return "Your Tractor enlistment has been reviewed successfully and moved forward.";
      case 'pending_verification':
        return "Your Tractor enlistment was processed successfully by our team.";
      case 'verified':
        return "Your enlistment has been verified successfully by our agent";
      case 'awaiting_payment':
        return "Your Tracker payment is recieved by us and will be installed in due time";
      case 'approved':
        return "Congratulations🎉, your enlistment has been approved successfully. And available for hire";
      case 'available':
        return "Congratulations🎉, your enlistment has been approved successfully. And available for hire";
      default:
        return "This step has been completed successfully.";
    }
  } else {
    // Future step
    switch (stepStatus) {
      case 'pending':
        return "Your Tractor enlistment request will be received and processed.";
      case 'pending_verification':
        return "One of our agents closer to your tractor location will accept your enlistment request.";
      case 'verified':
        return "Our Agent will reach out to you within Two(2) days for your tractor verification";
      case 'awaiting_payment':
        return "Your enlistment will be awaiting payment for tracker installation";
      case 'approved':
        return "Your tractor will await final approval from our admin";
      case 'available':
        return "Your tractor will be approved and available for hire";
      default:
        return "This step will be processed in due time.";
    }
  }
};

const getCurrentStepIndex = (status: string) => {
  return statusSteps.findIndex(step => step.key === status);
};

export default function TrackTractorPage() {
  const { userToken } = useAppSelector((state) => state.auth);
  const [tractorId, setTractorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [tractor, setTractor] = useState<Tractor | null>(null);
  const [error, setError] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const id = params.get("id");
    if (!id) {
      router.back();
      return;
    }
    setTractorId(id);
    handleGetTractor(id);
  }, [params, router]);

  const handleGetTractor = async (id: string) => {
    setLoading(true);
    try {
      const response = await getTractor(id, userToken as string);
      setTractor(response?.data);
      console.log("Tractor details:", response?.data);
      setLoading(false);
    } catch (err) {
      const error = err as any;
      console.log("Error fetching tractor", error);
      setError(true);
      setLoading(false);
    }
  };

  const currentStepIndex = tractor ? getCurrentStepIndex(tractor.status || '') : -1;
  const statusMessage = tractor ? getStepMessage(tractor.status || '', currentStepIndex) : '';

  return (
    <SidebarWithHeader>
      <Box bg="white" boxShadow="lg" borderRadius="12px" p="32px" mb="40px">
        {loading ? (
          <VStack spacing="4" align="stretch">
            <Skeleton height="40px" />
            <SkeletonText noOfLines={3} spacing="4" skeletonHeight="20px" />
            <Skeleton height="200px" />
          </VStack>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              Failed to load tractor details. Please try again.
            </AlertDescription>
          </Alert>
        ) : tractor ? (
          <>
            {/* Tractor Name and Status Header */}
            <Flex justify="space-between" align="center" mb="24px">
              <VStack align="start" spacing="1">
                <Text fontSize="28px" fontWeight={700} color="#2D3748">
                  {tractor.name || tractor.tractor_name || "Unnamed Tractor"}
                </Text>
                <Text fontSize="14px" color="#718096">
                  {tractor.brand && tractor.model 
                    ? `${tractor.brand} - ${tractor.model}` 
                    : 'Tractor Details'}
                </Text>
              </VStack>
              <Badge
                bg={statusTypes[tractor.status || '']?.color || '#FA9411'}
                color="white"
                fontSize="14px"
                px="4"
                py="2"
                borderRadius="full"
                fontWeight={600}
              >
                {statusTypes[tractor.status || '']?.title || tractor.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
              </Badge>
            </Flex>

            <Divider mb="24px" />

            {/* Header Section */}
            <Text fontSize="24px" mb="2" fontWeight={700}>
                Track Your Tractor Verification
                </Text>
                <Text fontSize="14px" mb="32px">
                Your tractor is currently undergoing the verification process. You can monitor the progress here and receive updates as soon as the verification is completed.
                </Text>

            {/* Tractor Image */}
            {/* {tractor.tractor_image && tractor.tractor_image.length > 0 && (
              <Box mb="32px">
                <Image
                  src={tractor.tractor_image[0]}
                  alt="Tractor"
                  width="100%"
                  height="200px"
                  objectFit="cover"
                  borderRadius="12px"
                  border="1px solid #E2E8F0"
                />
              </Box>
            )} */}

            {/* Status Message */}
           

            {/* Progress Steps */}
            <Box>
              <Text fontSize="20px" fontWeight={600} color="#2D3748" mb="24px">
                Progress Timeline
              </Text>
              
              <VStack spacing="0" align="stretch">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const IconComponent = step.icon;
                  
                  return (
                    <Box key={step.key} position="relative">
                      <HStack spacing="4" py="4">
                        {/* Step Icon */}
                        <Box
                          w="40px"
                          h="40px"
                          borderRadius="full"
                          bg={isCompleted ? step.color : '#E2E8F0'}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border={isCurrent ? `3px solid ${step.color}` : 'none'}
                          boxShadow={isCurrent ? `0 0 0 4px ${step.color}20` : 'none'}
                        >
                          <IconComponent
                            color={isCompleted ? 'white' : '#A0AEC0'}
                            boxSize="20px"
                          />
                        </Box>
                        
                        {/* Step Content */}
                        <VStack align="start" spacing="1" flex="1">
                          <Text
                            fontSize="16px"
                            fontWeight={isCurrent ? 600 : 500}
                            color={isCompleted ? '#2D3748' : '#A0AEC0'}
                          >
                            {step.title}
                          </Text>
                          <Text fontSize="14px" color="#718096">
                            {tractor ? getStepMessage(tractor.status || '', index) : ''}
                          </Text>
                        </VStack>
                        
                        {/* Status Badge */}
                        {isCurrent && (
                          <Badge
                            colorScheme={tractor.status === 'approved' || tractor.status === 'available' ? 'green' : 'orange'}
                            fontSize="12px"
                            px="2"
                            py="1"
                            borderRadius="full"
                          >
                            CURRENT
                          </Badge>
                        )}
                      </HStack>
                      
                      {/* Connecting Line */}
                      {index < statusSteps.length - 1 && (
                        <Box
                          position="absolute"
                          left="19px"
                          top="44px"
                          w="2px"
                          h="32px"
                          bg={isCompleted ? step.color : '#E2E8F0'}
                        />
                      )}
                    </Box>
                  );
                })}
              </VStack>
            </Box>

            {/* Action Buttons */}
            <Flex gap="4" mt="32px" justify="center">
              <Button
                colorScheme="orange"
                variant="outline"
                onClick={() => router.back()}
              >
                Back to Dashboard
              </Button>
              {(tractor.status === 'verified' || tractor.status === 'awaiting_payment') && (
                <Button
                  colorScheme="orange"
                  bg="#FA9411"
                  _hover={{ bg: "#E67E22" }}
                  onClick={() => router.push(`/payment/pay`)}
                >
                  Make Payment
                </Button>
              )}
            </Flex>
          </>
        ) : (
          <Center py="20">
            <Text color="#718096">No tractor data available</Text>
          </Center>
        )}
      </Box>
    </SidebarWithHeader>
  );
}
