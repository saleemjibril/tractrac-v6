import { useAppSelector } from "@/redux/hooks";
import { useGetPersonalStatsQuery } from "@/redux/services/userApi";
import { SimpleGrid, Box, Text, GridItem, Grid, Flex, IconButton, HStack } from "@chakra-ui/react";
import { getUserStats } from "../apis/user";
import { useEffect, useState } from "react";
import React from "react";
import formatNumber, { formatAmount } from "../utils/formatNumber";
import {
  AvailableMini,
  CalendarMini,
  CancelledMini,
  DemandFullFiledMini,
  InUseMini,
  InvestedMini,
  TractorsMini,
  VerifiedMini,
} from "./Icons";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Image from "next/image";
export default function PersonalOverview() {
    const router = useRouter();
  const { userToken, profileInfo } = useAppSelector((state) => state.auth);
  const [userStats, setUserStats] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGetUserStats = async () => {
    const response = await getUserStats(profileInfo?.id, userToken as string);
    console.log("getUserStats", response);
    setUserStats(response?.data);
  };

  useEffect(() => {
    handleGetUserStats();
  }, []);

  const stats = [
    {
      icon: <Image src="/icons/2.svg" alt="Tractors" width={60} height={60} />,
      title: "Total Number of Tractors Enlisted",
      value: 0,
      backgroundColor: "#00A2E3",
      link: "/dashboard/enlisted-tractors",
    },
    {
      icon: <Image src="/icons/2.svg" alt="Tractors" width={60} height={60} />,
      title: "Total Number of Tractors Hired",
      value: userStats?.tractors_hired_count || 0,
      backgroundColor: "#0E3850",
      link: "/dashboard/hired-tractors",
    },
    {
      icon: <Image src="/icons/1.svg" alt="Agro Tools" width={60} height={60} />,
      title: "Total Number of Agro Tools Hired",
      value: userStats?.addons_hired_count || 0,
      backgroundColor: "#1C5597",
      link: "/dashboard/hired-tools",
    },
    {
      icon: <Image src="/icons/3.svg" alt="Approved" width={60} height={60} />,
      title: "Approved Leasing Requests",
      value: userStats?.tractor_hire_status_counts?.approved || 0,
      backgroundColor: "#256A6E",
      link: "/dashboard/hired-tractors",
    },
    {
      icon: <Image src="/icons/4.svg" alt="Cancelled" width={60} height={60} />,
      title: "Total cancelled Request",
      value: userStats?.tractor_hire_status_counts?.cancelled || 0,
      backgroundColor: "#01A9A2",
      // link: "/verification?type=tractor&status=cancelled",
    },
          // {
          //   icon: <InvestedMini width="26" height="26" />,
          //   title: "Revenue",
          //   value: userStats?.total_revenue_tractors || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   link: "/payment",

          // },
          // {
          //   icon: <DemandFullFiledMini width="26" height="26" />,
          //   title: "Total Demand fulfilled",
          //   value: userStats?.tractor_demands_fulfilled || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          // },
          // {
          //   icon: <VerifiedMini width="26" height="26" />,
          //   title: "Verified Tractors",
          //   value: userStats?.total_tractors_verified || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          // },
          // {
          //   icon: <InUseMini width="26" height="26" />,
          //   title: "Number of Tractors In Use",
          //   value: userStats?.total_tractors_in_use || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   // link: "/verification?type=tractor&status=in_use",
          // },
          // {
          //   icon: <AvailableMini width="26" height="26" />,
          //   title: "Available Tractors",
          //   value: userStats?.available_tractors_count || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   // link: "/verification?type=tractor&status=available",
          // },
          // {
          //   icon: <CalendarMini width="26" height="26" />,
          //   title: "Hired Tractors",
          //   value: userStats?.total_number_tractors_hired || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   link: "/dashboard/hired-tractors",
          // },
          // {
          //   icon: <TractorsMini width="26" height="26" />,
          //   title: "Number of Tractors",
          //   value: userStats?.total_tractors_enlisted || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   link: "/dashboard/enlisted-tractors",
          // },
          // {
          //   icon: <CancelledMini width="26" height="26" />,
          //   title: "Total cancelled Request",
          //   value: userStats?.cancelled_tractor_requests || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   // link: "/verification?type=tractor&status=cancelled",
          // },
          // {
          //   icon: <DemandFullFiledMini width="26" height="26" />,
          //   title: "Total Demand fulfilled",
          //   value: userStats?.addon_demands_fulfilled || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          // },
          // {
          //   // dont have
          //   icon: <VerifiedMini width="26" height="26" />,
          //   title: "Verified Agro Tools", 
          //   value:  0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   // link: "/verification?type=agro-tool&status=verified",
          // },
          // {
          //   icon: <InUseMini width="26" height="26" />,
          //   title: "Number of Agro In Use",
          //   value: userStats?.total_agro_tools_in_use || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   // link: "/verification?type=agro-tool&status=in_use",
          // },
          // {
          //   // dont have
          //   icon: <AvailableMini width="26" height="26" />,
          //   title: "Available Agro Tools",
          //   value: 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   // link: "/verification?type=agro-tool&status=available",
          // },
          // {
          //   icon: <CalendarMini width="26" height="26" />,
          //   title: "Hired Agro Tools",
          //   value: userStats?.total_number_agro_tools_hired || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   link: "/dashboard/hired-tools",
          // },
          // {
          //   // dont have
          //   icon: <TractorsMini width="26" height="26" />,
          //   title: "Number of Agro Tools",
          //   value: "1,433",
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   // link: "/verification?type=agro-tool",
          // },
          // {
          //   icon: <CancelledMini width="26" height="26" />,
          //   title: "Total cancelled Request",
          //   value: userStats?.cancelled_addon_requests || 0,
          //   borderColor: "#BBD9FF",
          //   backgroundColor: "#EFF6FF80",
          //   color: "#898989",
          //   // link: "/verification?type=agro-tool&status=cancelled",
          // },
        ] 

  // const stats = [
  //   {
  //     icon: <InvestedMini width="26" height="26" />,
  //     title: "Total number of Tractors Hired",
  //     value: userStats?.total_tractor_hire_requests || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //     link: "/payments?payment-type=tractors",

  //   },
  //   {
  //     icon: <DemandFullFiledMini width="26" height="26" />,
  //     title: "Total Amount Paid for Hired Tractors",
  //     value: userStats?.revenue_breakdown?.tractors?.paid || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //   },
  //   {
  //     icon: <VerifiedMini width="26" height="26" />,
  //     title: "Approved Leasing Request",
  //     value: userStats?.tractor_hire_status_counts?.approved || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //   },
  //   {
  //     icon: <InUseMini width="26" height="26" />,
  //     title: "Total Tractors Enlisted",
  //     value: userStats?.tractors_enlisted_count || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //     link: "/verification?type=tractor&status=in_use",
  //   },
  //   {
  //     icon: <AvailableMini width="26" height="26" />,
  //     title: "Total Tractors In-Use",
  //     value: userStats?.tractor_hire_status_counts?.in_use || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //     link: "/verification?type=tractor&status=available",
  //   },
  //   {
  //     icon: <CalendarMini width="26" height="26" />,
  //     title: "Total Pending Hire Requests",
  //     value: userStats?.tractor_hire_status_counts?.pending || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //     link: "/verification?type=tractor&status=booked",
  //   },
  //   {
  //     icon: <TractorsMini width="26" height="26" />,
  //     title: "Total number of Agro Tools Hired",
  //     value: userStats?.total_addon_hire_requests || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //     link: "/verification?type=tractor",
  //   },
  //   {
  //     icon: <CancelledMini width="26" height="26" />,
  //     title: "Total Amount Paid for Hired Agro Tools(Cash)",
  //     value: userStats?.revenue_breakdown?.addons?.paid_cash || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //     link: "/verification?type=tractor&status=cancelled",
  //   },
  

  //   {
  //     icon: <InvestedMini width="26" height="26" />,
  //     title: "Total Amount Paid for Hired Agro Tools(Online)",
  //     value: formatAmount(userStats?.revenue_breakdown?.addons?.paid_online) || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //   },
  //   {
  //     icon: <DemandFullFiledMini width="26" height="26" />,
  //     title: "Approved Leasing Request",
  //     value: userStats?.addon_hire_status_counts?.approved || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //   },
  //   {
  //     // dont have
  //     icon: <VerifiedMini width="26" height="26" />,
  //     title: "Total Agro Tools In-Use", 
  //     value: userStats?.addon_hire_status_counts?.in_use || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //     link: "/verification?type=agro-tool&status=verified",
  //   },
  //   {
  //     icon: <InUseMini width="26" height="26" />,
  //     title: "Total Pending Hire Requests",
  //     value: userStats?.addon_hire_status_counts?.pending || 0,
  //     borderColor: "#BBD9FF",
  //     backgroundColor: "#EFF6FF80",
  //     color: "#898989",
  //     link: "/verification?type=agro-tool&status=in_use",
  //   },
   
  // ] 

  // Carousel logic - mobile shows 1 card per slide, desktop shows all cards
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = isMobile ? stats.length : 1;

  function nextSlide() {
    if (isMobile) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  }

  function prevSlide() {
    if (isMobile) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  }

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
   <>
    <Box width={"100%"} mb={"23px"} position="relative">
      {/* Mobile Carousel */}
      {isMobile ? (
        <>
          <Box
            width={"100%"}
            overflow="hidden"
            position="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            px="24px"
          >
            <Box
              display="flex"
              transform={`translateX(-${currentSlide * 100}%)`}
              transition="transform 0.3s ease-in-out"
            >
              {stats.map((item, index) => (
                <Box
                  key={index}
                  width="100%"
                  pr="10px"
                  flexShrink={0}
                >
                  <Box
                    borderRadius={"9px"}
                    bg={item?.backgroundColor}
                    padding="20px 13px"
                    cursor={item?.link ? "pointer" : "default"}
                    onClick={() => {
                      if (item?.link) {
                        router.push(item?.link);
                      }
                    }}
                    transition="all 0.2s ease-in-out"
                    boxShadow="0 6.24px 24.94px rgba(0, 0, 0, 0.1)"
                    position="relative"
                    minH="105px"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      bottom="0"
                      right="28px"
                      opacity={0.6}
                    >
                      {item?.icon && React.cloneElement(item.icon, { 
                        width: "60", 
                        height: "60" 
                      })}
                    </Box>
                    <Box position="relative" zIndex={1}>
                      <Text 
                        fontSize={"14px"} 
                        mb={"13px"} 
                        lineHeight={"1"}
                        color="white"
                        fontWeight="400"
                      >
                        {item?.title}
                      </Text>
                      <Text
                        fontSize="30px"
                        color="white"
                        fontWeight={"700"}
                        lineHeight={"1"}
                      >
                        {item?.value}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* Carousel Indicators */}
          <HStack justifyContent="center" mt="20px" spacing="4px">
            {stats.map((_, index) => (
              <Box
                key={index}
                width={currentSlide === index ? "22px" : "7px"}
                height="5px"
                bg={currentSlide === index ? "#00A2E3" : "rgba(0, 162, 227, 0.2)"}
                borderRadius="10px"
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </HStack>
        </>
      ) : (
        /* Desktop Grid Layout */
        <Grid
          width={"100%"}
          templateColumns="1fr 1fr 1fr 1fr"
          gap={"10px"}
        >
          {stats.map((item, index) => (
            <GridItem
              key={index}
              borderRadius={"9px"}
              bg={item?.backgroundColor}
              padding="20px 13px"
              cursor={item?.link ? "pointer" : "default"}
              onClick={() => {
                if (item?.link) {
                  router.push(item?.link);
                }
              }}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
              }}
              transition="all 0.2s ease-in-out"
              boxShadow="0 6.24px 24.94px rgba(0, 0, 0, 0.1)"
              position="relative"
              minH="105px"
              overflow="hidden"
            >
              <Box
                position="absolute"
                bottom="0"
                right="28px"
                opacity={0.6}
              >
                {item?.icon && React.cloneElement(item.icon, { 
                  width: "60", 
                  height: "60" 
                })}
              </Box>
              <Box position="relative" zIndex={1}>
                <Text 
                  fontSize={"14px"} 
                  mb={"13px"} 
                  lineHeight={"1"}
                  color="white"
                  fontWeight="400"
                >
                  {item?.title}
                </Text>
                <Text
                  fontSize="30px"
                  color="white"
                  fontWeight={"700"}
                  lineHeight={"1"}
                >
                  {item?.value}
                </Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
   </>
  );
}

function StatisticsCard({ amount, title }: { amount: string; title: string }) {
  return (
    <Box border="1px" borderColor="#F8A730" p="20px" textAlign="center">
      <Text fontWeight={700} fontSize={amount?.length > 9 ? "24px" : "28px"}>
        {amount}
      </Text>
      <Text fontSize="14px" mt="10px">
        {title}
      </Text>
    </Box>
  );
}


