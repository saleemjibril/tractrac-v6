import { useAppSelector } from "@/redux/hooks";
import { useGetPersonalStatsQuery } from "@/redux/services/userApi";
import { SimpleGrid, Box, Text, GridItem, Grid, Flex, IconButton, HStack } from "@chakra-ui/react";
import { getUserStats } from "../apis/user";
import { useEffect, useState } from "react";
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
      icon: <TractorsMini width="26" height="26" />,
      title: "Total Number of Tractors Enlisted",
      value: 0,
      borderColor: "#BBD9FF",
      backgroundColor: "#EFF6FF80",
      color: "#898989",
      link: "/dashboard/enlisted-tractors",
    },
    {
      icon: <TractorsMini width="26" height="26" />,
      title: "Total Number of Tractors Hired",
      value: userStats?.tractors_hired_count || 0,
      borderColor: "#BBD9FF",
      backgroundColor: "#EFF6FF80",
      color: "#898989",
      link: "/dashboard/hired-tractors",
    },
    {
      icon: <InUseMini width="26" height="26" />,
      title: "Total Number of Agro Tools Hired",
      value: userStats?.addons_hired_count || 0,
      borderColor: "#BBD9FF",
      backgroundColor: "#EFF6FF80",
      color: "#898989",
      link: "/dashboard/hired-tools",
    },
    {
      icon: <VerifiedMini width="26" height="26" />,
      title: "Approved Leasing Requests",
      value: userStats?.tractor_hire_status_counts?.approved || 0,
      borderColor: "#BBD9FF",
      backgroundColor: "#EFF6FF80",
      color: "#898989",
      link: "/dashboard/hired-tractors",
    },
    {
      icon: <CancelledMini width="26" height="26" />,
      title: "Total cancelled Request",
      value: userStats?.tractor_hire_status_counts?.cancelled || 0,
      borderColor: "#BBD9FF",
      backgroundColor: "#EFF6FF80",
      color: "#898989",
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

  // Carousel logic - responsive items per slide
  const [itemsPerSlide, setItemsPerSlide] = useState(8);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1); // Mobile: 1 item per slide (1 row of 1)
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(4); // Tablet: 4 items per slide (1 row of 4)
      } else {
        setItemsPerSlide(8); // Desktop: 8 items per slide (2 rows of 4)
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(stats.length / itemsPerSlide);

  function nextSlide() {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }

  function prevSlide() {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }

  function getCurrentSlideItems() {
    const startIndex = currentSlide * itemsPerSlide;
    const endIndex = startIndex + itemsPerSlide;
    return stats.slice(startIndex, endIndex);
  }

  return (
   <>
    <Box width={"100%"} mb={"23px"} position="relative">
      {/* Navigation Controls */}
    

      {/* Stats Grid */}
      <Box
        width={"100%"}
        className="stats_grid"
        transition="all 0.3s ease-in-out"
      >
        {/* First Row */}
        <Grid
          width={"100%"}
          templateColumns={{
            base: "1fr", // Mobile: 1 column
            md: "1fr 1fr 1fr 1fr", // Tablet: 4 columns
            lg: "1fr 1fr 1fr 1fr", // Desktop: 4 columns
          }}
          gap={"10px"}
          mb={{ base: "0", md: "10px" }}
        >
          {getCurrentSlideItems()?.slice(0, 4).map((item, index) => (
            <GridItem
              key={`${currentSlide}-${index}`}
              border={`1px solid ${item?.borderColor}`}
              borderRadius={"10px"}
              // bg={item?.backgroundColor}
              bg="#FFF"
              padding={{base: "24px 26px", md: "17px 26px"}}
              cursor={item?.link ? "pointer" : "default"}
              onClick={() => {
                if (item?.link) {
                  router.push(item?.link);
                }
              }}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              transition="all 0.2s ease-in-out"
              display={{ base: index === 0 ? "block" : "none", md: "block" }}
            >
              <Flex
                gap={"10px"}
                alignItems={"start"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontSize={"12px"} mb={"5px"} lineHeight={"1"}>
                    {item?.title}
                  </Text>
                  <Text
                    fontSize={"36px"}
                    color={item?.color}
                    fontWeight={"600"}
                    lineHeight={"1"}
                  >
                    {item?.value}
                  </Text>
                </Box>
                {item?.icon}
              </Flex>
            </GridItem>
          ))}
        </Grid>

        {/* Second Row - Hidden on mobile */}
        <Grid
          width={"100%"}
          templateColumns={{
            base: "1fr", // Mobile: 1 column
            md: "1fr 1fr 1fr 1fr", // Tablet: 4 columns
            lg: "1fr 1fr 1fr 1fr", // Desktop: 4 columns
          }}
          gap={"10px"}
          display={{ base: "none", md: "grid" }}
        >
          {getCurrentSlideItems()?.slice(4, 8).map((item, index) => (
            <GridItem
              key={`${currentSlide}-${index + 4}`}
              border={`1px solid ${item?.borderColor}`}
              borderRadius={"10px"}
              // bg={item?.backgroundColor}
              bg="#FFF"
              padding={"17px 26px"}
              cursor={item?.link ? "pointer" : "default"}
              onClick={() => {
                if (item?.link) {
                  router.push(item?.link);
                }
              }}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              transition="all 0.2s ease-in-out"
            >
              <Flex
                gap={"10px"}
                alignItems={"start"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontSize={"12px"} mb={"5px"} lineHeight={"1"}>
                    {item?.title}
                  </Text>
                  <Text
                    fontSize={"36px"}
                    color={item?.color}
                    fontWeight={"600"}
                    lineHeight={"1"}
                  >
                    {item?.value}
                  </Text>
                </Box>
                {item?.icon}
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </Box>
      <HStack justifyContent="space-between" mt="10px">
        <IconButton
          aria-label="Previous slide"
          icon={<ChevronLeftIcon />}
          size="sm"
          variant="outline"
          onClick={prevSlide}
          isDisabled={totalSlides <= 1}
        />
        {/* <Text fontSize="sm" color="gray.600">
          {currentSlide + 1} of {totalSlides}
        </Text> */}
        <IconButton
          aria-label="Next slide"
          icon={<ChevronRightIcon />}
          size="sm"
          variant="outline"
          onClick={nextSlide}
          isDisabled={totalSlides <= 1}
        />
      </HStack>
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


