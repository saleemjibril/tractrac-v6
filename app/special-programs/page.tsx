"use client";
import {
  SimpleGrid,
  Flex,
  Text,
  ComponentWithAs,
  IconProps,
  Image,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../components/Sidenav";
import {
  Money_2,
  TractorPlus,
  Agent2,
  IconWhite6,
  TractorPlusWhite,
} from "../components/Icons";
import { usePathname, useRouter } from "next/navigation";
import { createElement, useState } from "react";
import LoginRequiredModal from "../components/LoginRequiredModal";
import { useAppSelector } from "@/redux/hooks";

interface ItemProps {
  name: string;
  path: string;
  icon: ComponentWithAs<"svg", IconProps>;
  iconActive?: ComponentWithAs<"svg", IconProps>;
  imageLight?: string;
  imageDark?: string;
  requiredLogin: boolean;
}

export default function Dashboard() {
  const path = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modalState, setModalState] = useState<boolean>(false);
  const { profileInfo } = useAppSelector((state) => state.auth);

  const PageItems: Array<ItemProps> = [
    {
      name: "ISSAM",
      icon: TractorPlus,
      iconActive: TractorPlusWhite,
      path: `${path}/issam`,
      requiredLogin: false,
    },
    {
      name: "Women in Mechanization",
      imageLight: "woman-in-mech-colored",
      imageDark: "woman-in-mech-white",
      icon: TractorPlus,
      path: `${path}/women-in-mech`,
      requiredLogin: false,
    },
    {
      name: "Tractor Onboarding",
      icon: Agent2,
      iconActive: IconWhite6,
      path: `${path}/tractor-onboarding`,
      requiredLogin: true,
    },
    {
      name: "Collaborate with Us",
      icon: Money_2,
      path: `${path}/collaborate`,
      requiredLogin: false,
    },
  ];

  return (
    <SidebarWithHeader>
      <SimpleGrid
        columns={{ base: 2, md: 2 }}
        spacing={{ base: "12px", md: "40px" }}
        p={{ base: "0px", md: "50px" }}
        mr={{ md: "100px", lg: "200px", xl: "350px" }}
      >
        {PageItems.map((pageItem, index) => {
          return (
            <Flex
              key={pageItem.path}
              cursor="pointer"
              onMouseEnter={() => setHoveredIndex(index)} // Set hoveredIndex on mouse enter
              onMouseLeave={() => setHoveredIndex(null)}
              flexDir="column"
              // as="a"
              onClick={() => {
                if (pageItem.requiredLogin && !profileInfo?.id) {
                  setModalState(true);
                } else {
                  router.push(pageItem.path);
                }
              }}
              // href={pageItem.path}
              px="15px"
              py="35px"
              alignItems="center"
              bgColor="white"
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
              {pageItem.imageLight ? (
                hoveredIndex === index ? (
                  <Image
                    src={`/images/${pageItem.imageDark}.svg`}
                    alt="Icon image"
                    width="80px"
                  />
                ) : (
                  <Image
                    src={`/images/${pageItem.imageLight}.svg`}
                    alt="Icon image"
                    width="80px"
                  />
                )
              ) : (
                createElement(
                  hoveredIndex === index && pageItem.iconActive
                    ? pageItem.iconActive
                    : pageItem.icon, // Use iconDark if hovered
                  {
                    className: "item-icon",
                    color: "#FA9411",
                    boxSize: "60px",
                  }
                )
              )}
              {/* <pageItem.icon className="item-icon" color="#FA9411" boxSize="80px" /> */}
              {/* <Money_2  color="#FA9411" boxSize="40px" /> */}
              {/* <Image src="icons/tractor-light.svg" alt="" width="80px" /> */}
              <Text
                fontSize={{ base: "14px", md: "18px" }}
                fontWeight={600}
                mt={pageItem.imageLight ? "0px" :"16px"}
                textAlign="center"
              >
                {pageItem.name}
              </Text>
            </Flex>
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
