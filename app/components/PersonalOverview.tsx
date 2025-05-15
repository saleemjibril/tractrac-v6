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
    <Box
      bgColor="#FFFFFF"
      mt="40px"
      //   mr={{ base: "0px", lg: "120px" }}
      px="66px"
      py="43px"
      borderRadius="6px"
    >
      <Text color="#333333" fontWeight={700} fontSize="28px">
        Personal Overview
      </Text>

      <SimpleGrid
        mt="20px"
        columns={{ base: 2, lg: 3 }}
        spacingX={{ base: "24px" }}
        spacingY="20px"
      >
        <StatisticsCard
          title="Total number of Tractors Hired"
          amount={formatNumber(userStats?.tractors_hired_count || 0)}
        />
        <StatisticsCard
          title="Total Amount Paid for Hired Tractors"
          amount={`₦${formatNumber(
            userStats?.total_amount_paid || 0
          )}`}
        />
        <StatisticsCard
          title="Approved Leasing Request"
          amount={formatNumber(userStats?.hire_status_counts?.approved || 0)}
        />
        <StatisticsCard
          title="Total Tractors Enlisted"
          // amount={formatNumber(result?.data?.total_tractors_enlisted || 0)}
          amount={"0"}
        />
        <StatisticsCard
          title="Total Tractors In-Use"
          amount={formatNumber(userStats?.hire_status_counts?.in_progress || 0)}
        />
        <StatisticsCard
          title="Total Pending Requests"
          amount={formatNumber(userStats?.hire_status_counts?.pending || 0)}
        />
      </SimpleGrid>
    </Box>
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


