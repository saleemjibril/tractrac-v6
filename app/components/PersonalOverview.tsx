import { useAppSelector } from "@/redux/hooks";
import { useGetPersonalStatsQuery } from "@/redux/services/userApi";
import { SimpleGrid, Box, Text } from "@chakra-ui/react";

export default function PersonalOverview() {

  const { profileInfo } = useAppSelector((state) => state.auth);

  const {
    data: result,
    // isFetching,
    isLoading,
  // } = useGetPersonalStatsQuery("3");
} = useGetPersonalStatsQuery(profileInfo?.id);

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
        <StatisticsCard title="Total number of Tractors Hired" amount={formatNumber(result?.data?.total_hired_tractors || 0)} />
        <StatisticsCard
          title="Total Amount Paid for Hired Tractors"
          amount={formatNumber(result?.data?.total_amount_paid_for_tractors || 0)}
        />
        <StatisticsCard title="Approved Leasing Request" amount={formatNumber(result?.data?.total_approved_leasing || 0)}/>
        <StatisticsCard title="Total Tractors Enlisted" amount={formatNumber(result?.data?.total_tractors_enlisted || 0)}/>
        <StatisticsCard title="Total Tractors In-Use" amount={formatNumber(result?.data?.total_demands_fulfilled || 0)} />
        <StatisticsCard title="Total Pending Requests" amount={formatNumber(result?.data?.total_investments || 0)} />
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

function formatNumber(numberString: string) {
  const number = parseFloat(numberString); // Convert the string to a number

  if (isNaN(number)) {
    // Handle invalid input (e.g., non-numeric strings)
    return '0';
  }

  if (number >= 1000000) {
    // Format numbers in millions as "X.Xm"
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 99999) {
    // Format numbers in thousands with commas
    return (number / 1000).toLocaleString() + 'K';
  } else {
    // Numbers below 1000 remain the same with commas
    return number.toLocaleString();
  }
}

