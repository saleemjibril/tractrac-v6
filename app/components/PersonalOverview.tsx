import { useAppSelector } from "@/redux/hooks";
import { useGetPersonalStatsQuery } from "@/redux/services/userApi";
import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import { getUserStats } from "../apis/user";
import { useEffect, useState } from "react";
import formatNumber from "../utils/formatNumber";

export default function PersonalOverview() {
  const { userToken, profileInfo } = useAppSelector((state) => state.auth);
  const [userStats, setUserStats] = useState<any>(null);

  const handleGetUserStats = async () => {
    const response = await getUserStats(profileInfo?.id, userToken as string);
    console.log("getUserStats", response);
    setUserStats(response?.data);
  };

  useEffect(() => {
    handleGetUserStats();
  }, []);
  return (
   <>
    <Box
      bgColor="#FFFFFF"
      mt="40px"
      //   mr={{ base: "0px", lg: "120px" }}
      px={{base: "20px", lg: "66px"}}
      py={{base: "20px", lg: "43px"}}
      borderRadius="6px"
    >
      <Text color="#333333" fontWeight={700} fontSize="28px">
        Tractors Overview
      </Text>

      <SimpleGrid
        mt="20px"
        columns={{ base: 2, lg: 3 }}
        spacingX={{ base: "24px" }}
        spacingY="20px"
      >
        <StatisticsCard
          title="Total number of Tractors Hired"
          amount={formatNumber(userStats?.total_tractor_hire_requests || 0)}
        />
        <StatisticsCard
          title="Total Amount Paid for Hired Tractors"
          amount={`₦${formatNumber(
            userStats?.revenue_breakdown?.tractors?.paid || 0
          )}`}
        />
        <StatisticsCard
          title="Approved Leasing Request"
          amount={formatNumber(userStats?.tractor_hire_status_counts?.approved || 0)}
        />
        <StatisticsCard
          title="Total Tractors Enlisted"
          amount={formatNumber(userStats?.tractors_enlisted_count || 0)}
          // amount={"0"}
        />
        <StatisticsCard
          title="Total Tractors In-Use"
          amount={formatNumber(userStats?.tractor_hire_status_counts?.approved || 0)}
        />
        <StatisticsCard
          title="Total Pending Hire Requests"
          amount={formatNumber(userStats?.tractor_hire_status_counts?.pending || 0)}
        />
      </SimpleGrid>
    </Box>

    <Box
      bgColor="#FFFFFF"
      mt="40px"
      //   mr={{ base: "0px", lg: "120px" }}
      px={{base: "20px", lg: "66px"}}
      py={{base: "20px", lg: "43px"}}
      borderRadius="6px"
    >
      <Text color="#333333" fontWeight={700} fontSize="28px">
        Agro Tools Overview
      </Text>

      <SimpleGrid
        mt="20px"
        columns={{ base: 2, lg: 3 }}
        spacingX={{ base: "24px" }}
        spacingY="20px"
      >
        <StatisticsCard
          title="Total number of Agro Tools Hired"
          amount={formatNumber(userStats?.total_addon_hire_requests || 0)}
        />
        <StatisticsCard
          title="Total Amount Paid for Hired Agro Tools(Cash)"
          amount={`₦${formatNumber(
            userStats?.revenue_breakdown?.addons?.paid_online || 0
          )}`}
        />
        <StatisticsCard
          title="Total Amount Paid for Hired Agro Tools(Online)"
          amount={`₦${formatNumber(
            userStats?.revenue_breakdown?.addons?.paid_cash || 0
          )}`}
        />
        <StatisticsCard
          title="Approved Leasing Request"
          amount={formatNumber(userStats?.addon_hire_status_counts?.approved || 0)}
        />
        <StatisticsCard
          title="Total Agro Tools In-Use"
          amount={formatNumber(userStats?.addon_hire_status_counts?.approved || 0)}
        />
        <StatisticsCard
          title="Total Pending Hire Requests"
          amount={formatNumber(userStats?.addon_hire_status_counts?.pending || 0)}
        />
      </SimpleGrid>
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


