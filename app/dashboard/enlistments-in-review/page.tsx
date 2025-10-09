"use client";
import {
  Box,
  Flex,
  Text,
  Button,
  SimpleGrid,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../../components/Sidenav";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { getMyTractors } from "@/app/apis/tractor";
import { getErrorMessage } from "@/app/utils/errorUtils";
import Link from "next/link";

export default function EnlistmentsInReview() {
  const { profileInfo, userToken } = useAppSelector((state) => state.auth);
  const [tractors, setTractors] = useState([]);
  const [loadingTractors, setLoadingTractors] = useState(false);
  const [tractorError, setTractorError] = useState(null);

  const handleGetTractors = async () => {
    setLoadingTractors(true);
    try {
      if (typeof userToken === "string") {
        const response = await getMyTractors(userToken);
        setTractors(response?.data);
        console.log("getMyTractors", response?.data);
        setLoadingTractors(false);
      } else {
        console.log("User token is not a string");
        setLoadingTractors(false);
      }
    } catch (err) {
      const error = err as any;
      const errorMessage = getErrorMessage(error, "An unexpected error occurred");
      setTractorError(errorMessage);
      console.log("Error fetching tractors", error);
      setLoadingTractors(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      handleGetTractors();
    }
  }, [userToken]);

  return (
    <SidebarWithHeader>
      <Box>
        <Flex justifyContent="space-between" mb="20px" flexWrap={"wrap"} gap="20px">
          <Box>
            <Text fontSize="24px" fontWeight={700} lineHeight="24px" mb="8px">
              All Enlistment Activities
            </Text>
            <Text color="#323232" fontSize="16px" display={{base: "none", md: "block"}}
            >
              Track the status of your enlisted tractors and their review process
            </Text>
          </Box>
          <Button
            bgColor="#FA9411"
            height="42px"
            borderRadius="4px"
            minWidth="200px"
            color="white"
            as="a"
            href="/home/enlist-tractor"
            _hover={{
              opacity: 0.8,
            }}
            display={{base: "none", md: "flex"}}
          >
            Enlist a new tractor
          </Button>
        </Flex>

        {loadingTractors ? (
          <Box bg={"white"} padding={"20px"}
            borderRadius={"4px"}
            border={"1px solid #FF8E291A"}
            boxShadow={"0px 0px 4px 0px #FF8E291A"}
          >
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing="20px"
            >
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Box key={index} boxShadow="lg" bg="white" borderRadius="4px">
                  <Skeleton height="120px" />
                  <Box p="12px">
                    <SkeletonText
                      my="12px"
                      noOfLines={3}
                      spacing="3"
                      skeletonHeight="6px"
                    />
                    <Skeleton
                      mt="12px"
                      height="30px"
                      borderRadius="4px"
                      w="111px"
                    />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ) : tractorError ? (
          <Box bg={"white"} padding={"20px"}
            borderRadius={"4px"}
            border={"1px solid #FF8E291A"}
            boxShadow={"0px 0px 4px 0px #FF8E291A"}
          >
            <Text color="#E53E3E" fontSize="16px" textAlign="center">
              Error loading tractors: {tractorError}
            </Text>
          </Box>
        ) : tractors?.length > 0 ? (
          <Box bg={"white"} padding={"20px"}
            borderRadius={"4px"}
            border={"1px solid #FF8E291A"}
            boxShadow={"0px 0px 4px 0px #FF8E291A"}
          >
            {/* Display all tractors without the slice limitation */}
            {tractors?.map((tractor: any, index: number) => (
              <Link
                key={tractor.id || index}
                href={`/dashboard/track-tractor-progress?id=${tractor.id}`}
              >
                <Flex
                  border="1px solid #E2E8F0"
                  borderRadius="12px"
                  p="16px"
                  mb="12px"
                  alignItems="center"
                  justifyContent="space-between"
                  _hover={{
                    bg: "#F7FAFC",
                    borderColor: "#FA9411",
                    cursor: "pointer",
                  }}
                  transition="all 0.2s"
                >
                  <Flex alignItems="center" gap="12px">
                    <Box>
                      <Image
                        src={tractor.tractor_image[0]}
                        alt="Tractor"
                        width="60px"
                        height="60px"
                        borderRadius="8px"
                        objectFit="cover"
                      />
                    </Box>
                    <Box>
                      <Text
                        fontSize="18px"
                        fontWeight={600}
                        color="#2D3748"
                        mb="4px"
                      >
                        {tractor.name ||
                          tractor.tractor_name ||
                          "Unnamed Tractor"}
                      </Text>
                      <Text fontSize="14px" color="#718096">
                        Created:{" "}
                        {tractor.created_at
                          ? new Date(tractor.created_at).toLocaleDateString()
                          : "Unknown date"}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex gap={"20px"}>
                    <Text fontSize="14px" color="#718096">
                      <Box
                        as="span"
                        fontWeight={500}
                        color={
                          tractor.status === "verified"
                            ? "#38A169"
                            : tractor.status === "pending"
                            ? "#FA9411"
                            : "#FA9411"
                        }
                      >
                        {tractor.status || "Unknown"}
                      </Box>
                    </Text>
                    <Box color="#FA9411">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                  </Flex>
                </Flex>
              </Link>
            ))}
          </Box>
        ) : (
          <Box bg={"white"} padding={"40px"}
            borderRadius={"4px"}
            border={"1px solid #FF8E291A"}
            boxShadow={"0px 0px 4px 0px #FF8E291A"}
            textAlign="center"
          >
            <Text color="#718096" fontSize="16px" mb="20px">
              No tractors found in review.
            </Text>
            <Button
              bgColor="#FA9411"
              height="42px"
              borderRadius="4px"
              color="white"
              as="a"
              href="/home/enlist-tractor"
              _hover={{
                opacity: 0.8,
              }}
            >
              Enlist your first tractor
            </Button>
          </Box>
        )}
      </Box>
    </SidebarWithHeader>
  );
}
