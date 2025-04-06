"use client";
import {
  SimpleGrid,
  Flex,
  Text,
  ComponentWithAs,
  IconProps,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../components/Sidenav";
import {
  Wrench,
  Money_2,
  TractorPlus,
  Agent2,
  Vendor,
  Measure,
  Track,
  IconWhite6,
  IconWhite8,
  Tractor_2,
  TractorPlusWhite,
  CrawlerHandDrawnTransportWhite,
  ToolsWhite,
  TrackWhite,
  TaskListColored,
  TaskListWhite,
} from "../components/Icons";
import { usePathname } from "next/navigation";
import { useState, createElement } from "react";
import { useAppSelector } from "@/redux/hooks";
import LoginRequiredModal from "../components/LoginRequiredModal";
import { toast } from "react-toastify";
import Link from "next/link";

interface ItemProps {
  name: string;
  path: string;
  icon: ComponentWithAs<"svg", IconProps>;
  iconActive?: ComponentWithAs<"svg", IconProps>;
  imageLight: string;
  imageDark: string;
  loginRequired: boolean;
}

export default function Dashboard() {
  const path = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [modalState, setModalState] = useState<boolean>(false);
  const { profileInfo } = useAppSelector((state) => state.auth);

  const PageItems: Array<ItemProps> = [
    {
      name: "Special Programs",
      imageLight: "home-light",
      imageDark: "home-dark",
      icon: TractorPlus,
      iconActive: TractorPlusWhite,
      path: `/special-programs`,
      loginRequired: false,
    },
    {
      name: "Hire a Tractor",
      imageLight: "pay-light",
      imageDark: "pay-dark",
      icon: Tractor_2,
      path: `${path}/hire-tractor`,
      loginRequired: true,
    },
    {
      name: "Enlist your Tractor",
      imageLight: "dashboard-light",
      imageDark: "dashboard-dark",
      icon: TaskListColored,
      iconActive: TaskListWhite,
      path: `${path}/enlist-tractor`,
      loginRequired: true,
    },
    {
      name: "Become an Agent",
      imageLight: "user-light",
      imageDark: "user-dark",
      icon: Agent2,
      iconActive: IconWhite6,
      path: `${path}/agent`,
      loginRequired: true,
    },
    {
      name: "Invest In Tractors",
      imageLight: "user-light",
      imageDark: "user-dark",
      icon: Money_2,
      path: `${path}/invest-in-tractor`,
      loginRequired: false,
    },
    {
      name: "Register as Vendors",
      imageLight: "user-light",
      imageDark: "user-dark",
      icon: Vendor,
      iconActive: CrawlerHandDrawnTransportWhite,
      path: `${path}/register-as-vendor`,
      loginRequired: true,
    },
    {
      name: "Enlist as Operator/Mechanic",
      imageLight: "user-light",
      imageDark: "user-dark",
      icon: Wrench,
      iconActive: ToolsWhite,
      path: `${path}/enlist-as-op-mech`,
      loginRequired: true,
    },
    {
      name: "Measure your Farm",
      imageLight: "user-light",
      imageDark: "user-dark",
      icon: Measure,
      iconActive: IconWhite8,
      path: "#",
      loginRequired: true,
    },
    {
      name: "Track your Tractor",
      imageLight: "user-light",
      imageDark: "user-dark",
      icon: Track,
      iconActive: TrackWhite,
      path: `${path}/track-tractor`,
      loginRequired: true,
    },
  ];

  return (
    <SidebarWithHeader>
      <SimpleGrid
        columns={{ base: 2, xl: 3 }}
        spacing={{ base: "12px", md: "40px" }}
        p={{ base: "0px", md: "50px" }}
      >
        {PageItems.map((pageItem, index) => {
          //  const [isHovering, setIsHovered] = useState(false);
          //  const onMouseEnter = () => setIsHovered(true);
          //  const onMouseLeave = () => setIsHovered(false);

          return (
            <Link href={pageItem.path}
>
            <Flex
              key={pageItem.path}
              flexDir="column"
              as="a"
              onClick={(e) => {
                if (pageItem.loginRequired && !profileInfo?.id) {
                  setModalState(true);
                  e.preventDefault();
                }
                if (pageItem.path.includes("#")) {
                  toast.info("This page is coming soon");
                }
              }}
              py="35px"
              px="15px"
              alignItems="center"
              bgColor="white"
              onMouseEnter={() => setHoveredIndex(index)} // Set hoveredIndex on mouse enter
              onMouseLeave={() => setHoveredIndex(null)} // Clear hoveredIndex on mouse leave
              onTouchStart={() => setHoveredIndex(index)}
              onTouchEnd={() => setHoveredIndex(null)}
              // onMouseOver={() => setHoveredIndex(index)}
              // on={() => setHoveredIndex(null)}
              onPointerEnter={() => setHoveredIndex(index)}
              onPointerLeave={() => setHoveredIndex(null)}
              onTouchEndCapture={() => setHoveredIndex(index)}
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
              {createElement(
                hoveredIndex === index && pageItem.iconActive
                  ? pageItem.iconActive
                  : pageItem.icon, // Use iconDark if hovered
                {
                  className: "item-icon",
                  color: "#FA9411",
                  boxSize: "60px",
                }
              )}
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
                mt="16px"
                textAlign="center"
              >
                {pageItem.name}
              </Text>
            </Flex>
            </Link>
          );
        })}
      </SimpleGrid>
      <LoginRequiredModal
        title=""
        isOpen={modalState}
        setModalState={setModalState}
      />
    </SidebarWithHeader>
  );
}
