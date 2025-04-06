"use client";
import {
  Box,
  Image,
  ComponentWithAs,
  Flex,
  IconProps,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { AdminSidebarWithHeader } from "../../components/AdminSidenav";
import { createElement, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useGetDashboardStatsQuery } from "@/redux/services/adminApi";

interface ItemProps {
  name: string;
  path: string;
  icon: ComponentWithAs<"svg", IconProps>;
  iconActive?: ComponentWithAs<"svg", IconProps>;
  // imageLight: string;
  // imageDark: string;
}

export default function Dashboard() {
  const path = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { adminInfo } = useAppSelector((state) => state.auth);

  const {
    data: result,
    // isFetching,
    isLoading,
  } = useGetDashboardStatsQuery({});

  return (
    <AdminSidebarWithHeader>
      {mounted && (
        <Flex alignItems="center" py="8px" mb="10px" columnGap="8px">
          <Image src="/sun.svg" width="30px" alt="Sun image icon" />
          <Text fontSize="24px" color="#929292" fontWeight={400}>
            Good day,{" "}
            <Box as="span" fontWeight={600} color="#929292">
              {adminInfo?.fname || "Admin"}
            </Box>
          </Text>
        </Flex>
      )}
      <Box
        bgColor="#FFFFFF"
        mt="20px"
        mr={{ base: "0px", lg: "120px" }}
        px={{ base: "24px", lg: "66px" }}
        pt="20px"
        pb="43px"
        borderRadius="6px"
      >
        <Text color="#333333" fontWeight={700} fontSize="24px">
          Engagement Overview
        </Text>

        <SimpleGrid
          mt="20px"
          columns={{ base: 1, lg: 3 }}
          spacingX={{ base: "24px" }}
          spacingY="20px"
        >
          <StatisticsCard
            title="Total Amount Invested"
            amount={result?.data?.total_investments || 0}
          />
          <StatisticsCard title="Total Farmers Registered" amount={result?.data?.total_farmers || 0}/>

          <StatisticsCard
            title="Total Tractors Hired"
            amount={result?.data?.total_hired_tractors || 0}
          />
          <StatisticsCard
            title="Total Agents Registered"
            amount={result?.data?.total_agents || 0}
          />
          <StatisticsCard
            title="Total Tractors Enlisted"
            amount={result?.data?.total_tractors_enlisted || 0}
          />
          <StatisticsCard
            title="Total Number of Demand Fulfilled"
            amount={result?.data?.total_demand_fulfilled || 0}
          />
            <StatisticsCard
            title="Total Number of leasing requests"
            amount={result?.data?.total_tractor_leasing || 0}
          />
            <StatisticsCard
            title="Total Number of Enlisting requests"
            amount={result?.data?.total_tractor_enlisting || 0}
          />
            <StatisticsCard
            title="Total Number of Demand Fulfilled"
            amount={result?.data?.total_demand_fulfilled || 0}
          />
        </SimpleGrid>
      </Box>
    </AdminSidebarWithHeader>
  );
}

function StatisticsCard({ amount, title }: { amount: string; title: string }) {
  return (
    <Box border="1px" borderColor="#F8A730" p="20px" textAlign="center" borderRadius="6px">
      <Text fontWeight={700} fontSize={amount?.length > 9 ? "24px" : "28px"}>
        {formatNumber(amount)}
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
    return "0";
  }

  if (number >= 1000000) {
    // Format numbers in millions as "X.Xm"
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 99999) {
    // Format numbers in thousands with commas
    return (number / 1000).toLocaleString() + "K";
  } else {
    // Numbers below 1000 remain the same with commas
    return number.toLocaleString();
  }
}
