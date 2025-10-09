"use client";
import {
  Box,
  ComponentWithAs,
  Flex,
  Grid,
  IconProps,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../components/Sidenav";
import {
  TaskList,
  Tractor_2,
  Money_2,
  DemandLight,
  DemandDark,
  TaskListWhite,
  AgroTools,
  RightArrow,
} from "../components/Icons";
import { createElement, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useGetDashboardStatsQuery } from "@/redux/services/userApi";
import LoginRequiredModal from "../components/LoginRequiredModal";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/utils/errorUtils";
import Link from "next/link";
import PersonalOverview from "../components/PersonalOverview";
import { getMyHiredTractors, getMyTractors } from "@/app/apis/tractor";
import { getMyHiredTools } from "@/app/apis/tools";
import moment from "moment";
import { formatAmount } from "../utils/formatNumber";
import { statusTypes } from "../utils/tractorStatus";

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
  const router = useRouter();

  const PageItems: Array<ItemProps> = [
    {
      name: "Hired Tractors",
      // imageLight: "home-light",
      // imageDark: "home-dark",
      icon: Tractor_2,
      path: `${path}/hired-tractors`,
    },
    {
      name: "Hired Tools",
      // imageLight: "home-light",
      // imageDark: "home-dark",
      icon: AgroTools,
      path: `${path}/hired-tools`,
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
      path: `${path}/investment`,
    },
    // {
    //   name: "Land Processed",
    //   // imageLight: "pay-light",
    //   // imageDark: "pay-dark",
    //   iconActive: TaskListWhite,
    //   icon: TaskList,
    //   path:  `${path}/land-processed`,
    // },
    // {
    //   name: "Serviced Hour",
    //   // imageLight: "pay-light",
    //   // imageDark: "pay-dark",
    //   icon: TaskList,
    //   iconActive: TaskListWhite,
    //   path: `${path}/serviced-hour`,
    // },
    // {
    //   name: "Demand Generated",
    //   // imageLight: "pay-light",
    //   // imageDark: "pay-dark",
    //   icon: DemandDark,
    //   iconActive: DemandLight,
    //   path: `${path}/demand-generated`,
    // },
    // // {
    //   name: "Demand Fulfilled",
    //   // imageLight: "pay-light",
    //   // imageDark: "pay-dark",
    //   icon: TaskList,
    //   iconActive: TaskListWhite,
    //   path:`${path}/demand-fulfilled`,
    // },
    // {
    //   name: "Revenue Generated",
    //   // imageLight: "pay-light",
    //   // imageDark: "pay-dark",
    //   icon: TaskList,
    //   iconActive: TaskListWhite,
    //   path: `${path}/revenue-generated`,
    // },
    // {
    //   name: "Agent",
    //   // imageLight: "pay-light",
    //   // imageDark: "pay-dark",
    //   icon: TaskList,
    //   iconActive: TaskListWhite,
    //   path:  `${path}/agent`,
    // },
  ];

  const [mounted, setMounted] = useState(false);
  const [tractors, setTractors] = useState([]);
  const [loadingTractors, setLoadingTractors] = useState(false);
  const [tractorError, setTractorError] = useState(null);
  const [hiredTractors, setHiredTractors] = useState([]);
  const [hiredTools, setHiredTools] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [pendingPayment, setPendingPayment] = useState([]);
  const [pendingEndOperation, setPendingEndOperation] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [paidBookings, setPaidBookings] = useState([]);
  const [rejectedBookings, setRejectedBookings] = useState([]);
  const [abandonedBookings, setAbandonedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [modalState, setModalState] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { profileInfo, userToken } = useAppSelector((state) => state.auth);

  const handleGetHiredTractors = async () => {
    setLoading(true);
    try {
      const response = await getMyHiredTractors(userToken as string);
      console.log("getMyHiredTractors", response);
      let tractorData = response?.data?.items || [];
      setHiredTractors(tractorData);
      return tractorData;
    } catch (err) {
      const error = err as any;
      const errorMessage = getErrorMessage(error, "An unexpected error occurred");
      setError(true);
      console.log("Error fetching hired tractors", error);
      return [];
    }
  };

  const handleGetHiredTools = async () => {
    try {
      const response = await getMyHiredTools(userToken as string);
      console.log("getMyHiredTools", response);
      let toolData = response?.data || [];
      setHiredTools(toolData);
      return toolData;
    } catch (err) {
      const error = err as any;
      const errorMessage = getErrorMessage(error, "An unexpected error occurred");
      console.log("Error fetching hired tools", error);
      return [];
    }
  };

  const handleGetAllBookings = async () => {
    setLoading(true);
    try {
      const [tractorData, toolData] = await Promise.all([
        handleGetHiredTractors(),
        handleGetHiredTools()
      ]);

      console.log("tractorData", tractorData);
      console.log("toolData", toolData);

      // Filter and combine bookings by status
      const tractorPending = tractorData?.filter((item: any) => 
        item?.status === "pending" || item?.status === "approved"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      
      const toolPending = toolData?.filter((item: any) => 
        item?.status === "pending" || item?.status === "approved"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));

      const tractorPaymentPending = tractorData?.filter((item: any) => 
        item?.status === "payment_pending"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      
      const toolPaymentPending = toolData?.filter((item: any) => 
        item?.status === "payment_pending"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));

      const tractorInProgress = tractorData?.filter((item: any) => 
        item?.status === "in_progress"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      
      const toolInProgress = toolData?.filter((item: any) => 
        item?.status === "in_progress"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));

      // Completed bookings
      const tractorCompleted = tractorData?.filter((item: any) => 
        item?.status === "completed"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      
      const toolCompleted = toolData?.filter((item: any) => 
        item?.status === "completed"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));

      // Paid bookings
      const tractorPaid = tractorData?.filter((item: any) => 
        item?.status === "paid"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      
      const toolPaid = toolData?.filter((item: any) => 
        item?.status === "paid"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));

      // Rejected bookings
      const tractorRejected = tractorData?.filter((item: any) => 
        item?.status === "rejected"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      
      const toolRejected = toolData?.filter((item: any) => 
        item?.status === "rejected"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));

      // Abandoned bookings
      const tractorAbandoned = tractorData?.filter((item: any) => 
        item?.status === "abandoned"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      
      const toolAbandoned = toolData?.filter((item: any) => 
        item?.status === "abandoned"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));

      // Cancelled bookings
      const tractorCancelled = tractorData?.filter((item: any) => 
        item?.status === "cancelled"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      
      const toolCancelled = toolData?.filter((item: any) => 
        item?.status === "cancelled"
      ).slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));

      // Recent bookings - all bookings sorted by date
      const tractorRecent = tractorData?.slice(0, 3).map((item: any) => ({ ...item, type: "tractor" }));
      const toolRecent = toolData?.slice(0, 3).map((item: any) => ({ ...item, type: "tool" }));
      
      // Combine and sort by created_at date (most recent first), show only 3 total
      const allRecent = [...tractorRecent, ...toolRecent].sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 3);

      setPendingBookings([...tractorPending, ...toolPending]);
      setPendingPayment([...tractorPaymentPending, ...toolPaymentPending]);
      setPendingEndOperation([...tractorInProgress, ...toolInProgress]);
      setCompletedBookings([...tractorCompleted, ...toolCompleted]);
      setPaidBookings([...tractorPaid, ...toolPaid]);
      setRejectedBookings([...tractorRejected, ...toolRejected]);
      setAbandonedBookings([...tractorAbandoned, ...toolAbandoned]);
      setCancelledBookings([...tractorCancelled, ...toolCancelled]);
      setRecentBookings(allRecent);
    } catch (err) {
      const error = err as any;
      const errorMessage = getErrorMessage(error, "An unexpected error occurred");
      setError(true);
      console.log("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log(profileInfo)
    setMounted(true);
    if (userToken) {
      handleGetAllBookings();
    }
  }, [userToken]);

  console.log("profileInfo", profileInfo);

  const {
    data: result,
    // isFetching,
    isLoading,
  } = useGetDashboardStatsQuery({});

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

  console.log(result?.data);
  console.log("My tractors:", tractors);

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
        <Flex alignItems="center" columnGap="4px" mb="6px">
          <Text fontSize="18px" color="#FA9411" fontWeight={600}>
            Hello {profileInfo?.name || "Guest"}
            
          </Text>
        </Flex>
      )}

<Text fontSize="24px" fontWeight={500} color="#000">
            Dashboard Overview
          </Text>
<Text fontSize="14px" color="#929292" fontWeight={400} mb="16px">
            Stay updated with your performance insights
          </Text>
      {/* <SimpleGrid
        columns={{ base: 2, lg: 3 }}
        spacingX={{ base: "20px", md: "40px" }}
        spacingY="20px"
        p={{ base: "0px", md: "0px" }}
        mr={{ base: "0px", lg: "120px" }}
      >
        {PageItems.map((pageItem, index) => {
        

          return (
            <Link href={pageItem.path}>
            <Flex
              key={pageItem.path}
              borderColor="#FA9411"
              borderWidth="1px"
              px="15px"
              py="10px"
              as="a"

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
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              _hover={{
                bgColor: "#FA9411",
                color: "white",
                "& > .item-icon": {
                  color: "white",
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
                {createElement(
                  hoveredIndex === index && pageItem.iconActive
                    ? pageItem.iconActive
                    : pageItem.icon,
                  {
                    className: "item-icon",
                    boxSize: "28px",
                  }
                )}
              </Flex>
             
              <Text
                fontSize={{ base: "14px", md: "18px" }}
                fontWeight={600}
              >
                {pageItem.name}
              </Text>
            </Flex>
            </Link>
          );
        })}
      </SimpleGrid> */}
      {/* Enlistments in Review Section */}

      <PersonalOverview />
      <Grid templateColumns={{ base: "1fr", lg: "2.76fr 1fr" }} gap={{base: "10px", lg: "33px"}}>
        <Box>

        {tractors?.length > 0 && <Box
        pt={0}
        mb={"20px"}
        //  mb={"100px"}
         >

          {loadingTractors ? (
            <Text>Loading tractors...</Text>
          ) : tractorError ? (
            <Text color="#E53E3E" fontSize="16px">
              Error loading tractors: {tractorError}
            </Text>
          ) : tractors?.length > 0 ? (
            <Box bg={"white"} padding={"20px"}
            borderRadius={"4px"}
            border={"1px solid #FF8E291A"}
            boxShadow={"0px 0px 4px 0px #FF8E291A"}
>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex
              gap={"12px"}
              alignItems={"center"}
              mb={"12px"}
            >
              <Text fontSize={"14px"} color={"#050F24"} fontWeight={{base: 600, lg: 500}}>
              Enlistments in Review
              </Text>
              <svg
                width="26"
                height="25"
                viewBox="0 0 26 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  width="25"
                  height="25"
                  rx="3.125"
                  fill="#27AE60"
                />
                <path
                  d="M8.25 15C7.13182 15 6 15.3435 6 16V19C6 19.6565 7.13182 20 8.25 20C9.36818 20 10.5 19.6565 10.5 19V16C10.5 15.3435 9.36818 15 8.25 15ZM8.25 19.5C7.11328 19.5 6.5 19.1452 6.5 19V18.15C7.04916 18.3981 7.64765 18.5178 8.25 18.5C8.85235 18.5178 9.45084 18.3981 10 18.15V19C10 19.1452 9.38672 19.5 8.25 19.5ZM8.25 18C7.11328 18 6.5 17.6452 6.5 17.5V16.65C7.04916 16.8981 7.64765 17.0178 8.25 17C8.85235 17.0178 9.45084 16.8981 10 16.65V17.5C10 17.6452 9.38672 18 8.25 18ZM8.25 16.5C7.11328 16.5 6.5 16.1452 6.5 16C6.5 15.8548 7.11328 15.5 8.25 15.5C9.38672 15.5 10 15.8548 10 16C10 16.1452 9.38672 16.5 8.25 16.5ZM13.5 13.5C12.3818 13.5 11.25 13.8435 11.25 14.5V19C11.25 19.6565 12.3818 20 13.5 20C14.6182 20 15.75 19.6565 15.75 19V14.5C15.75 13.8435 14.6182 13.5 13.5 13.5ZM13.5 19.5C12.3633 19.5 11.75 19.1452 11.75 19V18.15C12.2992 18.3981 12.8977 18.5178 13.5 18.5C14.1023 18.5178 14.7008 18.3981 15.25 18.15V19C15.25 19.1452 14.6367 19.5 13.5 19.5ZM13.5 18C12.3633 18 11.75 17.6452 11.75 17.5V16.65C12.2992 16.8981 12.8977 17.0178 13.5 17C14.1023 17.0178 14.7008 16.8981 15.25 16.65V17.5C15.25 17.6452 14.6367 18 13.5 18ZM13.5 16.5C12.3633 16.5 11.75 16.1452 11.75 16V15.15C12.2992 15.3981 12.8977 15.5178 13.5 15.5C14.1023 15.5178 14.7008 15.3981 15.25 15.15V16C15.25 16.1452 14.6367 16.5 13.5 16.5ZM13.5 15C12.3633 15 11.75 14.6452 11.75 14.5C11.75 14.3548 12.3633 14 13.5 14C14.6367 14 15.25 14.3548 15.25 14.5C15.25 14.6452 14.6367 15 13.5 15ZM18.75 12C17.6318 12 16.5 12.3435 16.5 13V19C16.5 19.6565 17.6318 20 18.75 20C19.8682 20 21 19.6565 21 19V13C21 12.3435 19.8682 12 18.75 12ZM18.75 12.5C19.8867 12.5 20.5 12.8548 20.5 13C20.5 13.1452 19.8867 13.5 18.75 13.5C17.6133 13.5 17 13.1452 17 13C17 12.8548 17.6133 12.5 18.75 12.5ZM18.75 19.5C17.6133 19.5 17 19.1452 17 19V18.15C17.5492 18.3981 18.1477 18.5178 18.75 18.5C19.3523 18.5178 19.9508 18.3981 20.5 18.15V19C20.5 19.1452 19.8867 19.5 18.75 19.5ZM18.75 18C17.6133 18 17 17.6452 17 17.5V16.65C17.5492 16.8981 18.1477 17.0178 18.75 17C19.3523 17.0178 19.9508 16.8981 20.5 16.65V17.5C20.5 17.6452 19.8867 18 18.75 18ZM18.75 16.5C17.6133 16.5 17 16.1452 17 16V15.15C17.5492 15.3981 18.1477 15.5178 18.75 15.5C19.3523 15.5178 19.9508 15.3981 20.5 15.15V16C20.5 16.1452 19.8867 16.5 18.75 16.5ZM18.75 15C17.6133 15 17 14.6452 17 14.5V13.65C17.5492 13.8981 18.1477 14.0178 18.75 14C19.3523 14.0178 19.9508 13.8981 20.5 13.65V14.5C20.5 14.6452 19.8867 15 18.75 15ZM6.82325 12.6768C6.80003 12.6535 6.7816 12.626 6.76903 12.5957C6.75646 12.5653 6.74999 12.5328 6.74999 12.5C6.74999 12.4672 6.75646 12.4347 6.76903 12.4043C6.7816 12.374 6.80003 12.3465 6.82325 12.3232L11.1162 8.0304C11.3506 7.79602 11.6685 7.66435 11.9999 7.66435C12.3314 7.66435 12.6493 7.79602 12.8837 8.0304L14.5 9.64647L17.6465 6.5H16.75C16.6174 6.49985 16.4904 6.44712 16.3966 6.35339C16.3029 6.25965 16.2502 6.13256 16.25 6V5.5C16.2502 5.36744 16.3029 5.24035 16.3966 5.14661C16.4904 5.05288 16.6174 5.00015 16.75 5H19.5C19.6988 5.00022 19.8895 5.07931 20.0301 5.21991C20.1707 5.36052 20.2498 5.55115 20.25 5.75V8.5C20.2498 8.63256 20.1971 8.75965 20.1034 8.85339C20.0096 8.94712 19.8826 8.99985 19.75 9H19.25C19.1174 8.99985 18.9904 8.94712 18.8966 8.85339C18.8029 8.75965 18.7502 8.63256 18.75 8.5V7.60352L15.3838 10.9696C15.1494 11.204 14.8315 11.3356 14.5 11.3356C14.1686 11.3356 13.8507 11.204 13.6163 10.9696L12 9.35353L7.92675 13.4268C7.8796 13.4723 7.81645 13.4975 7.7509 13.4969C7.68535 13.4963 7.62265 13.4701 7.5763 13.4237C7.52994 13.3774 7.50365 13.3146 7.50308 13.2491C7.50251 13.1836 7.52771 13.1204 7.57325 13.0732L11.8232 8.82325C11.8465 8.80003 11.874 8.7816 11.9043 8.76903C11.9347 8.75646 11.9672 8.74999 12 8.74999C12.0328 8.74999 12.0653 8.75646 12.0957 8.76903C12.126 8.7816 12.1535 8.80003 12.1768 8.82325L13.9697 10.6161C14.1126 10.7524 14.3025 10.8285 14.5 10.8285C14.6975 10.8285 14.8874 10.7524 15.0303 10.6161L18.8232 6.82325C18.8582 6.7883 18.9028 6.7645 18.9512 6.75485C18.9997 6.74521 19.05 6.75016 19.0957 6.76908C19.1413 6.788 19.1804 6.82003 19.2079 6.86114C19.2353 6.90224 19.25 6.95056 19.25 7V8.5H19.75V5.75C19.7499 5.68371 19.7236 5.62016 19.6767 5.57329C19.6298 5.52642 19.5663 5.50006 19.5 5.5H16.75V6H18.25C18.2994 6.00001 18.3478 6.01468 18.3889 6.04215C18.43 6.06962 18.462 6.10866 18.4809 6.15434C18.4998 6.20001 18.5048 6.25027 18.4951 6.29876C18.4855 6.34725 18.4617 6.39179 18.4268 6.42675L14.6768 10.1768C14.6535 10.2 14.626 10.2184 14.5957 10.231C14.5653 10.2435 14.5328 10.25 14.5 10.25C14.4672 10.25 14.4347 10.2435 14.4043 10.231C14.374 10.2184 14.3465 10.2 14.3232 10.1768L12.5303 8.3839C12.3874 8.24757 12.1975 8.1715 12 8.1715C11.8025 8.1715 11.6126 8.24757 11.4697 8.3839L7.17675 12.6768C7.15355 12.7 7.12599 12.7184 7.09567 12.731C7.06534 12.7435 7.03283 12.75 7 12.75C6.96717 12.75 6.93466 12.7435 6.90433 12.731C6.87401 12.7184 6.84645 12.7 6.82325 12.6768Z"
                  fill="white"
                />
              </svg>
            </Flex>

            <Link href="/dashboard/enlistments-in-review">
              <Text fontSize={"12px"} color={"#050F24"} fontWeight={500}>
                View all
              </Text>
            </Link>
                </Flex>
              {tractors?.slice(0, 4)?.map((tractor: any, index: number) => (
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
            <Text color="#718096" fontSize="16px">
              No tractors found in review.
            </Text>
          )}
        </Box>}

          {/* Pending Bookings Section */}
          {pendingBookings.length > 0 && <BookingSection
            title="Pending Bookings"
            bookings={pendingBookings}
            viewAllLink="/dashboard/hired-tractors"
          />}

          {/* Pending Payment Section */}
         {pendingPayment.length > 0 && <BookingSection
            title="Bookings Pending Payment"
            bookings={pendingPayment}
            viewAllLink="/dashboard/hired-tractors"
          />}

          {/* Pending End Operation Section */}
          {pendingEndOperation.length > 0 && <BookingSection
            title="Bookings In-Progress"
            bookings={pendingEndOperation}
            viewAllLink="/dashboard/hired-tractors"
          />}

          {/* Completed Bookings Section */}
          {completedBookings.length > 0 && <BookingSection
            title="Completed Bookings"
            bookings={completedBookings}
            viewAllLink="/dashboard/hired-tractors"
          />}

          {/* Paid Bookings Section */}
          {paidBookings.length > 0 && <BookingSection
            title="Paid Bookings"
            bookings={paidBookings}
            viewAllLink="/dashboard/hired-tractors"
          />}

          {/* Rejected Bookings Section */}
          {rejectedBookings.length > 0 && <BookingSection
            title="Rejected Bookings"
            bookings={rejectedBookings}
            viewAllLink="/dashboard/hired-tractors"
          />}

          {/* Abandoned Bookings Section */}
          {abandonedBookings.length > 0 && <BookingSection
            title="Abandoned Bookings"
            bookings={abandonedBookings}
            viewAllLink="/dashboard/hired-tractors"
          />}

          {/* Cancelled Bookings Section */}
          {cancelledBookings.length > 0 && <BookingSection
            title="Cancelled Bookings"
            bookings={cancelledBookings}
            viewAllLink="/dashboard/hired-tractors"
          />}

          {/* Recent Bookings Section */}
         
        </Box>

          {recentBookings.length > 0 && <BookingSectionMini
            title="Recent Bookings"
            bookings={recentBookings}
            viewAllLink="/dashboard/hired-tractors"
          />}
      </Grid>
      
      <LoginRequiredModal
        title=""
        isOpen={modalState}
        setModalState={setModalState}
      />
    </SidebarWithHeader>
  );
}

function StatisticsCard({ amount, title }: { amount: string; title: string }) {
  return (
    <Box
      border="1px"
      borderColor="#F8A730"
      p="20px"
      textAlign="center"
      borderRadius="6px"
    >
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

interface BookingSectionProps {
  title: string;
  bookings: any[];
  viewAllLink: string;
}

function BookingSection({ title, bookings, viewAllLink }: BookingSectionProps) {
  const router = useRouter();
  
  return (
    <Box
      border={"1px solid #FF8E291A"}
      borderRadius={"4px"}
      padding={"20px"}
      boxShadow={"0px 0px 4px 0px #FF8E291A"}
      mb="20px"
      minHeight={"200px"}
      bg={"#FFF"}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={"12px"}
      >
        <Flex
          gap={"12px"}
          alignItems={"center"}
          mb={"12px"}
        >
          <Text fontSize={"14px"} color={"#050F24"} fontWeight={{base: 600, lg: 500}}>
            {title}
          </Text>
          <svg
            width="26"
            height="25"
            viewBox="0 0 26 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              width="25"
              height="25"
              rx="3.125"
              fill="#27AE60"
            />
            <path
              d="M8.25 15C7.13182 15 6 15.3435 6 16V19C6 19.6565 7.13182 20 8.25 20C9.36818 20 10.5 19.6565 10.5 19V16C10.5 15.3435 9.36818 15 8.25 15ZM8.25 19.5C7.11328 19.5 6.5 19.1452 6.5 19V18.15C7.04916 18.3981 7.64765 18.5178 8.25 18.5C8.85235 18.5178 9.45084 18.3981 10 18.15V19C10 19.1452 9.38672 19.5 8.25 19.5ZM8.25 18C7.11328 18 6.5 17.6452 6.5 17.5V16.65C7.04916 16.8981 7.64765 17.0178 8.25 17C8.85235 17.0178 9.45084 16.8981 10 16.65V17.5C10 17.6452 9.38672 18 8.25 18ZM8.25 16.5C7.11328 16.5 6.5 16.1452 6.5 16C6.5 15.8548 7.11328 15.5 8.25 15.5C9.38672 15.5 10 15.8548 10 16C10 16.1452 9.38672 16.5 8.25 16.5ZM13.5 13.5C12.3818 13.5 11.25 13.8435 11.25 14.5V19C11.25 19.6565 12.3818 20 13.5 20C14.6182 20 15.75 19.6565 15.75 19V14.5C15.75 13.8435 14.6182 13.5 13.5 13.5ZM13.5 19.5C12.3633 19.5 11.75 19.1452 11.75 19V18.15C12.2992 18.3981 12.8977 18.5178 13.5 18.5C14.1023 18.5178 14.7008 18.3981 15.25 18.15V19C15.25 19.1452 14.6367 19.5 13.5 19.5ZM13.5 18C12.3633 18 11.75 17.6452 11.75 17.5V16.65C12.2992 16.8981 12.8977 17.0178 13.5 17C14.1023 17.0178 14.7008 16.8981 15.25 16.65V17.5C15.25 17.6452 14.6367 18 13.5 18ZM13.5 16.5C12.3633 16.5 11.75 16.1452 11.75 16V15.15C12.2992 15.3981 12.8977 15.5178 13.5 15.5C14.1023 15.5178 14.7008 15.3981 15.25 15.15V16C15.25 16.1452 14.6367 16.5 13.5 16.5ZM13.5 15C12.3633 15 11.75 14.6452 11.75 14.5C11.75 14.3548 12.3633 14 13.5 14C14.6367 14 15.25 14.3548 15.25 14.5C15.25 14.6452 14.6367 15 13.5 15ZM18.75 12C17.6318 12 16.5 12.3435 16.5 13V19C16.5 19.6565 17.6318 20 18.75 20C19.8682 20 21 19.6565 21 19V13C21 12.3435 19.8682 12 18.75 12ZM18.75 12.5C19.8867 12.5 20.5 12.8548 20.5 13C20.5 13.1452 19.8867 13.5 18.75 13.5C17.6133 13.5 17 13.1452 17 13C17 12.8548 17.6133 12.5 18.75 12.5ZM18.75 19.5C17.6133 19.5 17 19.1452 17 19V18.15C17.5492 18.3981 18.1477 18.5178 18.75 18.5C19.3523 18.5178 19.9508 18.3981 20.5 18.15V19C20.5 19.1452 19.8867 19.5 18.75 19.5ZM18.75 18C17.6133 18 17 17.6452 17 17.5V16.65C17.5492 16.8981 18.1477 17.0178 18.75 17C19.3523 17.0178 19.9508 16.8981 20.5 16.65V17.5C20.5 17.6452 19.8867 18 18.75 18ZM18.75 16.5C17.6133 16.5 17 16.1452 17 16V15.15C17.5492 15.3981 18.1477 15.5178 18.75 15.5C19.3523 15.5178 19.9508 15.3981 20.5 15.15V16C20.5 16.1452 19.8867 16.5 18.75 16.5ZM18.75 15C17.6133 15 17 14.6452 17 14.5V13.65C17.5492 13.8981 18.1477 14.0178 18.75 14C19.3523 14.0178 19.9508 13.8981 20.5 13.65V14.5C20.5 14.6452 19.8867 15 18.75 15ZM6.82325 12.6768C6.80003 12.6535 6.7816 12.626 6.76903 12.5957C6.75646 12.5653 6.74999 12.5328 6.74999 12.5C6.74999 12.4672 6.75646 12.4347 6.76903 12.4043C6.7816 12.374 6.80003 12.3465 6.82325 12.3232L11.1162 8.0304C11.3506 7.79602 11.6685 7.66435 11.9999 7.66435C12.3314 7.66435 12.6493 7.79602 12.8837 8.0304L14.5 9.64647L17.6465 6.5H16.75C16.6174 6.49985 16.4904 6.44712 16.3966 6.35339C16.3029 6.25965 16.2502 6.13256 16.25 6V5.5C16.2502 5.36744 16.3029 5.24035 16.3966 5.14661C16.4904 5.05288 16.6174 5.00015 16.75 5H19.5C19.6988 5.00022 19.8895 5.07931 20.0301 5.21991C20.1707 5.36052 20.2498 5.55115 20.25 5.75V8.5C20.2498 8.63256 20.1971 8.75965 20.1034 8.85339C20.0096 8.94712 19.8826 8.99985 19.75 9H19.25C19.1174 8.99985 18.9904 8.94712 18.8966 8.85339C18.8029 8.75965 18.7502 8.63256 18.75 8.5V7.60352L15.3838 10.9696C15.1494 11.204 14.8315 11.3356 14.5 11.3356C14.1686 11.3356 13.8507 11.204 13.6163 10.9696L12 9.35353L7.92675 13.4268C7.8796 13.4723 7.81645 13.4975 7.7509 13.4969C7.68535 13.4963 7.62265 13.4701 7.5763 13.4237C7.52994 13.3774 7.50365 13.3146 7.50308 13.2491C7.50251 13.1836 7.52771 13.1204 7.57325 13.0732L11.8232 8.82325C11.8465 8.80003 11.874 8.7816 11.9043 8.76903C11.9347 8.75646 11.9672 8.74999 12 8.74999C12.0328 8.74999 12.0653 8.75646 12.0957 8.76903C12.126 8.7816 12.1535 8.80003 12.1768 8.82325L13.9697 10.6161C14.1126 10.7524 14.3025 10.8285 14.5 10.8285C14.6975 10.8285 14.8874 10.7524 15.0303 10.6161L18.8232 6.82325C18.8582 6.7883 18.9028 6.7645 18.9512 6.75485C18.9997 6.74521 19.05 6.75016 19.0957 6.76908C19.1413 6.788 19.1804 6.82003 19.2079 6.86114C19.2353 6.90224 19.25 6.95056 19.25 7V8.5H19.75V5.75C19.7499 5.68371 19.7236 5.62016 19.6767 5.57329C19.6298 5.52642 19.5663 5.50006 19.5 5.5H16.75V6H18.25C18.2994 6.00001 18.3478 6.01468 18.3889 6.04215C18.43 6.06962 18.462 6.10866 18.4809 6.15434C18.4998 6.20001 18.5048 6.25027 18.4951 6.29876C18.4855 6.34725 18.4617 6.39179 18.4268 6.42675L14.6768 10.1768C14.6535 10.2 14.626 10.2184 14.5957 10.231C14.5653 10.2435 14.5328 10.25 14.5 10.25C14.4672 10.25 14.4347 10.2435 14.4043 10.231C14.374 10.2184 14.3465 10.2 14.3232 10.1768L12.5303 8.3839C12.3874 8.24757 12.1975 8.1715 12 8.1715C11.8025 8.1715 11.6126 8.24757 11.4697 8.3839L7.17675 12.6768C7.15355 12.7 7.12599 12.7184 7.09567 12.731C7.06534 12.7435 7.03283 12.75 7 12.75C6.96717 12.75 6.93466 12.7435 6.90433 12.731C6.87401 12.7184 6.84645 12.7 6.82325 12.6768Z"
              fill="white"
            />
          </svg>
        </Flex>

        <Link href={viewAllLink}>
          <Text fontSize={"14px"} color={"#050F24"} fontWeight={500}>
            View all
          </Text>
        </Link>
      </Flex>

      {bookings?.length > 0 ? (
        bookings.map((booking) => (
          <Flex
            key={booking?.id}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pb={"8px"}
            mb={"8px"}
            borderBottom={"1px solid #ECECEC"}
            onClick={() => router.push(`/dashboard/booking-details/${booking?.id}`)}
            cursor={"pointer"}
          >
            <Flex gap={"8px"} alignItems={"center"}>
              <Box>
                <Text fontSize={"12px"} fontWeight={"700"}>
                  {booking?.type === "tool" 
                    ? booking?.addons?.[0]?.name || "Tool Booking"
                    : booking?.tractor?.name || "Tractor Booking"}
                </Text>
                <Text fontSize={"8px"} fontWeight={"500"} color={"#000"}>
                  {moment(booking?.created_at).format(
                    "MMMM D, YYYY [at] h:mm:ss A"
                  )}
                </Text>
              </Box>

              <Box
                fontSize={"8px"}
                borderRadius={"14px"}
                border={`1px solid ${statusTypes[booking?.status]?.color || "#FA9411"}`}
                padding={"4px 8px"}
                color={statusTypes[booking?.status]?.color || "#FA9411"}
                bg={"#FAF6F6"}
              >
                {statusTypes[booking?.status]?.title || booking?.status}
              </Box>
              
              {booking?.status === "payment_pending" && (
                <Box
                  fontSize={"8px"}
                  borderRadius={"14px"}
                  border={"1px solid #FA9411"}
                  padding={"4px 8px"}
                  color={"#FA9411"}
                  bg={"#FAF6F6"}
                >
                  ₦{formatAmount(booking?.total_amount?.toString())}
                </Box>
              )}
              
              <Box
                fontSize={"7px"}
                borderRadius={"14px"}
                padding={"4px 8px"}
                bg={booking?.type === "tool" ? "#E8F5E9" : "#FFF3E0"}
                color={booking?.type === "tool" ? "#2E7D32" : "#E65100"}
                fontWeight={600}
              >
                {booking?.type === "tool" ? "Tool" : "Tractor"}
              </Box>
            </Flex>

            <RightArrow />
          </Flex>
        ))
      ) : (
        <Text fontSize={"12px"} color={"#929292"} textAlign="center" mt="20px">
          No bookings found
        </Text>
      )}
    </Box>
  );
}

function BookingSectionMini({ title, bookings, viewAllLink }: BookingSectionProps) {
  const router = useRouter();
  
  return (
    <Box
      border={"1px solid #FF8E291A"}
      borderRadius={"4px"}
      padding={"20px"}
      boxShadow={"0px 0px 4px 0px #FF8E291A"}
      mb="20px"
      height={"fit-content"}
      bg={"#FFF"}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={"12px"}
      >
        <Flex
          gap={"12px"}
          alignItems={"center"}
          mb={"12px"}
        >
          <Text fontSize={"14px"} color={"#050F24"} fontWeight={{base: 600, lg: 500}}>
            {title}
          </Text>
          <svg
            width="26"
            height="25"
            viewBox="0 0 26 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              width="25"
              height="25"
              rx="3.125"
              fill="#27AE60"
            />
            <path
              d="M8.25 15C7.13182 15 6 15.3435 6 16V19C6 19.6565 7.13182 20 8.25 20C9.36818 20 10.5 19.6565 10.5 19V16C10.5 15.3435 9.36818 15 8.25 15ZM8.25 19.5C7.11328 19.5 6.5 19.1452 6.5 19V18.15C7.04916 18.3981 7.64765 18.5178 8.25 18.5C8.85235 18.5178 9.45084 18.3981 10 18.15V19C10 19.1452 9.38672 19.5 8.25 19.5ZM8.25 18C7.11328 18 6.5 17.6452 6.5 17.5V16.65C7.04916 16.8981 7.64765 17.0178 8.25 17C8.85235 17.0178 9.45084 16.8981 10 16.65V17.5C10 17.6452 9.38672 18 8.25 18ZM8.25 16.5C7.11328 16.5 6.5 16.1452 6.5 16C6.5 15.8548 7.11328 15.5 8.25 15.5C9.38672 15.5 10 15.8548 10 16C10 16.1452 9.38672 16.5 8.25 16.5ZM13.5 13.5C12.3818 13.5 11.25 13.8435 11.25 14.5V19C11.25 19.6565 12.3818 20 13.5 20C14.6182 20 15.75 19.6565 15.75 19V14.5C15.75 13.8435 14.6182 13.5 13.5 13.5ZM13.5 19.5C12.3633 19.5 11.75 19.1452 11.75 19V18.15C12.2992 18.3981 12.8977 18.5178 13.5 18.5C14.1023 18.5178 14.7008 18.3981 15.25 18.15V19C15.25 19.1452 14.6367 19.5 13.5 19.5ZM13.5 18C12.3633 18 11.75 17.6452 11.75 17.5V16.65C12.2992 16.8981 12.8977 17.0178 13.5 17C14.1023 17.0178 14.7008 16.8981 15.25 16.65V17.5C15.25 17.6452 14.6367 18 13.5 18ZM13.5 16.5C12.3633 16.5 11.75 16.1452 11.75 16V15.15C12.2992 15.3981 12.8977 15.5178 13.5 15.5C14.1023 15.5178 14.7008 15.3981 15.25 15.15V16C15.25 16.1452 14.6367 16.5 13.5 16.5ZM13.5 15C12.3633 15 11.75 14.6452 11.75 14.5C11.75 14.3548 12.3633 14 13.5 14C14.6367 14 15.25 14.3548 15.25 14.5C15.25 14.6452 14.6367 15 13.5 15ZM18.75 12C17.6318 12 16.5 12.3435 16.5 13V19C16.5 19.6565 17.6318 20 18.75 20C19.8682 20 21 19.6565 21 19V13C21 12.3435 19.8682 12 18.75 12ZM18.75 12.5C19.8867 12.5 20.5 12.8548 20.5 13C20.5 13.1452 19.8867 13.5 18.75 13.5C17.6133 13.5 17 13.1452 17 13C17 12.8548 17.6133 12.5 18.75 12.5ZM18.75 19.5C17.6133 19.5 17 19.1452 17 19V18.15C17.5492 18.3981 18.1477 18.5178 18.75 18.5C19.3523 18.5178 19.9508 18.3981 20.5 18.15V19C20.5 19.1452 19.8867 19.5 18.75 19.5ZM18.75 18C17.6133 18 17 17.6452 17 17.5V16.65C17.5492 16.8981 18.1477 17.0178 18.75 17C19.3523 17.0178 19.9508 16.8981 20.5 16.65V17.5C20.5 17.6452 19.8867 18 18.75 18ZM18.75 16.5C17.6133 16.5 17 16.1452 17 16V15.15C17.5492 15.3981 18.1477 15.5178 18.75 15.5C19.3523 15.5178 19.9508 15.3981 20.5 15.15V16C20.5 16.1452 19.8867 16.5 18.75 16.5ZM18.75 15C17.6133 15 17 14.6452 17 14.5V13.65C17.5492 13.8981 18.1477 14.0178 18.75 14C19.3523 14.0178 19.9508 13.8981 20.5 13.65V14.5C20.5 14.6452 19.8867 15 18.75 15ZM6.82325 12.6768C6.80003 12.6535 6.7816 12.626 6.76903 12.5957C6.75646 12.5653 6.74999 12.5328 6.74999 12.5C6.74999 12.4672 6.75646 12.4347 6.76903 12.4043C6.7816 12.374 6.80003 12.3465 6.82325 12.3232L11.1162 8.0304C11.3506 7.79602 11.6685 7.66435 11.9999 7.66435C12.3314 7.66435 12.6493 7.79602 12.8837 8.0304L14.5 9.64647L17.6465 6.5H16.75C16.6174 6.49985 16.4904 6.44712 16.3966 6.35339C16.3029 6.25965 16.2502 6.13256 16.25 6V5.5C16.2502 5.36744 16.3029 5.24035 16.3966 5.14661C16.4904 5.05288 16.6174 5.00015 16.75 5H19.5C19.6988 5.00022 19.8895 5.07931 20.0301 5.21991C20.1707 5.36052 20.2498 5.55115 20.25 5.75V8.5C20.2498 8.63256 20.1971 8.75965 20.1034 8.85339C20.0096 8.94712 19.8826 8.99985 19.75 9H19.25C19.1174 8.99985 18.9904 8.94712 18.8966 8.85339C18.8029 8.75965 18.7502 8.63256 18.75 8.5V7.60352L15.3838 10.9696C15.1494 11.204 14.8315 11.3356 14.5 11.3356C14.1686 11.3356 13.8507 11.204 13.6163 10.9696L12 9.35353L7.92675 13.4268C7.8796 13.4723 7.81645 13.4975 7.7509 13.4969C7.68535 13.4963 7.62265 13.4701 7.5763 13.4237C7.52994 13.3774 7.50365 13.3146 7.50308 13.2491C7.50251 13.1836 7.52771 13.1204 7.57325 13.0732L11.8232 8.82325C11.8465 8.80003 11.874 8.7816 11.9043 8.76903C11.9347 8.75646 11.9672 8.74999 12 8.74999C12.0328 8.74999 12.0653 8.75646 12.0957 8.76903C12.126 8.7816 12.1535 8.80003 12.1768 8.82325L13.9697 10.6161C14.1126 10.7524 14.3025 10.8285 14.5 10.8285C14.6975 10.8285 14.8874 10.7524 15.0303 10.6161L18.8232 6.82325C18.8582 6.7883 18.9028 6.7645 18.9512 6.75485C18.9997 6.74521 19.05 6.75016 19.0957 6.76908C19.1413 6.788 19.1804 6.82003 19.2079 6.86114C19.2353 6.90224 19.25 6.95056 19.25 7V8.5H19.75V5.75C19.7499 5.68371 19.7236 5.62016 19.6767 5.57329C19.6298 5.52642 19.5663 5.50006 19.5 5.5H16.75V6H18.25C18.2994 6.00001 18.3478 6.01468 18.3889 6.04215C18.43 6.06962 18.462 6.10866 18.4809 6.15434C18.4998 6.20001 18.5048 6.25027 18.4951 6.29876C18.4855 6.34725 18.4617 6.39179 18.4268 6.42675L14.6768 10.1768C14.6535 10.2 14.626 10.2184 14.5957 10.231C14.5653 10.2435 14.5328 10.25 14.5 10.25C14.4672 10.25 14.4347 10.2435 14.4043 10.231C14.374 10.2184 14.3465 10.2 14.3232 10.1768L12.5303 8.3839C12.3874 8.24757 12.1975 8.1715 12 8.1715C11.8025 8.1715 11.6126 8.24757 11.4697 8.3839L7.17675 12.6768C7.15355 12.7 7.12599 12.7184 7.09567 12.731C7.06534 12.7435 7.03283 12.75 7 12.75C6.96717 12.75 6.93466 12.7435 6.90433 12.731C6.87401 12.7184 6.84645 12.7 6.82325 12.6768Z"
              fill="white"
            />
          </svg>
        </Flex>

        <Link href={viewAllLink}>
          <Text fontSize={"14px"} color={"#050F24"} fontWeight={500}>
            View all
          </Text>
        </Link>
      </Flex>

      {bookings?.length > 0 ? (
        bookings.map((booking) => (
          <Flex
            key={booking?.id}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pb={"8px"}
            mb={"8px"}
            borderBottom={"1px solid #ECECEC"}
            onClick={() => router.push(`/dashboard/booking-details/${booking?.id}`)}
            cursor={"pointer"}
          >
            <Flex gap={"8px"} alignItems={"center"}>
              <Box>
                <Text fontSize={"10px"} fontWeight={"700"}>
                  {booking?.type === "tool" 
                    ? booking?.addon?.name 
                    : booking?.tractor?.name}
                </Text>
                <Text fontSize={"8px"} fontWeight={"500"} color={"#000"}>
                  {moment(booking?.created_at).format(
                    "MMMM D, YYYY [at] h:mm:ss A"
                  )}
                </Text>
              </Box>

              <Box
                fontSize={"8px"}
                borderRadius={"14px"}
                border={`1px solid ${statusTypes[booking?.status]?.color || "#FA9411"}`}
                padding={"4px 8px"}
                color={statusTypes[booking?.status]?.color || "#FA9411"}
                bg={"#FAF6F6"}
              >
                {statusTypes[booking?.status]?.title || booking?.status}
              </Box>
              
              {booking?.status === "payment_pending" && (
                <Box
                  fontSize={"8px"}
                  borderRadius={"14px"}
                  border={"1px solid #FA9411"}
                  padding={"4px 8px"}
                  color={"#FA9411"}
                  bg={"#FAF6F6"}
                >
                  ₦{formatAmount(booking?.total_amount?.toString())}
                </Box>
              )}
              
              <Box
                fontSize={"7px"}
                borderRadius={"14px"}
                padding={"4px 8px"}
                bg={booking?.type === "tool" ? "#E8F5E9" : "#FFF3E0"}
                color={booking?.type === "tool" ? "#2E7D32" : "#E65100"}
                fontWeight={600}
              >
                {booking?.type === "tool" ? "Tool" : "Tractor"}
              </Box>
            </Flex>

            <RightArrow />
          </Flex>
        ))
      ) : (
        <Text fontSize={"12px"} color={"#929292"} textAlign="center" mt="20px">
          No bookings found
        </Text>
      )}
    </Box>
  );
}
