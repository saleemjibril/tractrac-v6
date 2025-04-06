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
import { SidebarWithHeader } from "../components/Sidenav";
import {
  TaskList,
  Tractor_2,
  Money_2,
  DemandLight,
  DemandDark,
  TaskListWhite,
} from "../components/Icons";
import { createElement, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { useGetDashboardStatsQuery } from "@/redux/services/userApi";
import LoginRequiredModal from "../components/LoginRequiredModal";
import { toast } from "react-toastify";
import Link from "next/link";

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

  const PageItems: Array<ItemProps> = [
    {
      name: "Hired Tractors",
      // imageLight: "home-light",
      // imageDark: "home-dark",
      icon: Tractor_2,
      path: `${path}/hired-tractors`,
    },
    {
      name: "Enlisted Tractors",
      // imageLight: "pay-light",
      // imageDark: "pay-dark",
      icon: TaskList,
      iconActive: TaskListWhite,
      path: `${path}/enlisted-tractors`,
    },
    {
      name: "Investment",
      // imageLight: "pay-light",
      // imageDark: "pay-dark",
      icon: Money_2,
      path:`${path}/investment`,
    },
    {
      name: "Land Processed",
      // imageLight: "pay-light",
      // imageDark: "pay-dark",
      iconActive: TaskListWhite,
      icon: TaskList,
      path:  `${path}/land-processed`,
    },
    {
      name: "Serviced Hour",
      // imageLight: "pay-light",
      // imageDark: "pay-dark",
      icon: TaskList,
      iconActive: TaskListWhite,
      path: `${path}/serviced-hour`,
    },
    {
      name: "Demand Generated",
      // imageLight: "pay-light",
      // imageDark: "pay-dark",
      icon: DemandDark,
      iconActive: DemandLight,
      path: `${path}/demand-generated`,
    },
    {
      name: "Demand Fulfilled",
      // imageLight: "pay-light",
      // imageDark: "pay-dark",
      icon: TaskList,
      iconActive: TaskListWhite,
      path:`${path}/demand-fulfilled`,
    },
    {
      name: "Revenue Generated",
      // imageLight: "pay-light",
      // imageDark: "pay-dark",
      icon: TaskList,
      iconActive: TaskListWhite,
      path: `${path}/revenue-generated`,
    },
    {
      name: "Agent",
      // imageLight: "pay-light",
      // imageDark: "pay-dark",
      icon: TaskList,
      iconActive: TaskListWhite,
      path:  `${path}/agent`,
    },
  ];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // console.log(profileInfo)
    setMounted(true);
  }, []);

  const [modalState, setModalState] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { profileInfo } = useAppSelector((state) => state.auth);

  const {
    data: result,
    // isFetching,
    isLoading,
  } = useGetDashboardStatsQuery({});

  console.log(result?.data);

  /**
   * 
   *    "data": {
        "": null,
        "": null,
        "": null
    }

   */

  return (
    <SidebarWithHeader>
      {mounted && (
        <Flex alignItems="center" py="8px" mb="10px" columnGap="8px">
          <Image src="/sun.svg" width="30px" alt="Sun image icon" />
          <Text fontSize="24px" color="#929292" fontWeight={400}>
            Good day,{" "}
            <Box as="span" fontWeight={600} color="#929292">
              {profileInfo?.fname || "Guest"}
            </Box>
          </Text>
        </Flex>
      )}
      <SimpleGrid
        columns={{ base: 2, lg: 3 }}
        // spacing={{base: "12px", md: "35px"}}
        spacingX={{ base: "20px", md: "40px" }}
        spacingY="20px"
        p={{ base: "0px", md: "0px" }}
        mr={{ base: "0px", lg: "120px" }}
      >
        {PageItems.map((pageItem, index) => {
          //  const [isHovering, setIsHovered] = useState(false);
          //  const onMouseEnter = () => setIsHovered(true);
          //  const onMouseLeave = () => setIsHovered(false);

          return (
            <Link href={pageItem.path}>
            <Flex
              key={pageItem.path}
              // flexDir="column"
              borderColor="#FA9411"
              borderWidth="1px"
              px="15px"
              py="10px"
              as="a"
              
              // py="35px"
              // px="15px"
              color="#929292"
              alignItems="center"
              justifyContent="start"
              gap="10px"
              bgColor="white"
              onClick={(e) => {
                if (!profileInfo?.id) {
                  setModalState(true);
                  e.preventDefault();
                }

                if(pageItem.path.includes("#")){
                  toast.info("This page is coming soon")
                }
              }}
              onMouseEnter={() => setHoveredIndex(index)} // Set hoveredIndex on mouse enter
              onMouseLeave={() => setHoveredIndex(null)} // Clear hoveredIndex on mouse leave
              _hover={{
                bgColor: "#FA9411",
                color: "white",
                "& > .item-icon": {
                  // Use "& > .child-element" to select the child element
                  color: "white", // Change the color of the child element on hover
                },
              }}
              borderRadius="15px"
            >
              <Flex
                bgColor={hoveredIndex === index ? "#FFFFFF20" : "#92929240"}
                borderRadius="12px"
                width="50px"
                height="50px"
                justifyContent="center"
                alignItems="center"
              >
                {/* <Center> */}
                {createElement(
                  // 1 === index && pageItem.iconActive
                  hoveredIndex === index && pageItem.iconActive
                    ? pageItem.iconActive
                    : pageItem.icon, // Use iconDark if hovered
                  {
                    className: "item-icon",
                    // color: "#FA9411",
                    boxSize: "28px",
                  }
                )}
                {/* </Center> */}
              </Flex>
              {/* <pageItem.icon
                className="item-icon"
                color="#FA9411"
                boxSize="60px"
              /> */}
              {/* <Money_2  color="#FA9411" boxSize="40px" /> */}
              {/* <Image src="icons/tractor-light.svg" alt="" width="80px" /> */}
              <Text
                fontSize={{ base: "14px", md: "18px" }}
                fontWeight={600}
                // textAlign="center"
              >
                {pageItem.name}
              </Text>
            </Flex>
            </Link>
          );
        })}
      </SimpleGrid>
      <Box
        bgColor="#FFFFFF"
        mt="50px"
        mr={{ base: "0px", lg: "120px" }}
        px={{base: "24px", lg: "66px"}}
        py="43px"
        borderRadius="6px"
      >
        <Text color="#333333" fontWeight={700} fontSize="28px">
          Engagement Overview
        </Text>

        <SimpleGrid
          mt="20px"
          columns={{ base: 1, lg: 3 }}
          spacingX={{ base: "24px" }}
          spacingY="20px"
        >
          <StatisticsCard
            title="Total Tractors Enlisted"
            amount={result?.data?.total_tractors_enlisted || 0}
          />

          <StatisticsCard
            title="Total Tractors Hired"
            amount={result?.data?.total_hired_tractors || 0}
          />
          

          <StatisticsCard
            title="Total Tractors In-Use"
            amount={result?.data?.total_hired_tractors || 0}
          />
          
          <StatisticsCard
            title="Total Agents Registered"
            amount={result?.data?.total_agents || 0}
          />

          <StatisticsCard
            title="Total Tractor Vendors Registered"
            amount={result?.data?.total_agents || 0}
          />
          
          <StatisticsCard
            title="Total Operators/Mechanic Registered"
            amount={result?.data?.total_demand_fulfiled || 0}
          />
        </SimpleGrid>
      </Box>
      <LoginRequiredModal title="" isOpen={modalState} setModalState={setModalState} />
    </SidebarWithHeader>
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
