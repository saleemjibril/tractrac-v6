"use client";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
  Spacer,
  ComponentWithAs,
  IconProps,
  Button,
  Show,
  ListIcon,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons";

import { FaUser } from "react-icons/fa";

import { ArrowBackIcon, SearchIcon, StarIcon } from "@chakra-ui/icons";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Assign,
  Verification,
  Farmers,
  Entries,
  Wallet,
} from "../components/Icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { adminLogout } from "@/redux/features/auth/authActions";
import { Home2, Element4, Icon as IconSax } from "iconsax-react";
import { toast } from "react-toastify";
import { ChakraWrapper } from "../chakraUIWrapper";
import Link from "next/link";

interface LinkItemProps {
  name: string;
  path: string;
  imageLight?: string;
  imageDark: string;
  iconLight: ComponentWithAs<"svg", IconProps> | IconSax;
  iconDark: ComponentWithAs<"svg", IconProps> | IconSax;
}

interface NavItemProps extends FlexProps {
  image?: string;
  path: string;
  children: React.ReactNode;
  iconLight: ComponentWithAs<"svg", IconProps> | IconSax;
  iconDark: ComponentWithAs<"svg", IconProps> | IconSax;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  {
    name: "Dashboard",
    imageLight: "dashboard-light",
    imageDark: "dashboard-dark",
    path: "/admin/dashboard",
    iconLight: Element4,
    iconDark: Element4,
  },
  {
    name: "Farmers",
    imageLight: "pay-light",
    imageDark: "pay-dark",
    path: "/admin/farmers",
    iconLight: Farmers,
    iconDark: Farmers,
  },
  {
    name: "Entries",
    imageLight: "pay-light",
    imageDark: "pay-dark",
    path: "/admin/entries",
    iconLight: Entries,
    iconDark: Entries,
  },
  {
    name: "Payment",
    imageLight: "pay-light",
    imageDark: "pay-dark",
    path: "/admin/payment",
    iconLight: Wallet,
    iconDark: Wallet,
  },
  {
    name: "Verification",
    imageLight: "pay-light",
    imageDark: "pay-dark",
    path: "/admin/verification",
    iconLight: Verification,
    iconDark: Verification,
  },
  {
    name: "Assign",
    imageLight: "pay-light",
    imageDark: "pay-dark",
    path: "/admin/assign",
    iconLight: Assign,
    iconDark: Assign,
  },
  {
    name: "Users",
    imageLight: "user-light",
    imageDark: "user-dark",
    path: "/admin/users",
    iconLight: User,
    iconDark: User,
  },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      //   as="flex"
      h="full"
      {...rest}
    >
      <Box pl="18px" pt="24px" as="a" href="/" display="block">
        <Image
          display={{ base: "none", md: "flex" }}
          src="/logo.svg"
          fill="red"
          alt="Logo"
        />
      </Box>
      <Flex
        h={{ base: "20", md: "8" }}
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        {/* <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text> */}
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        const image = pathname == link.path ? link.imageLight : link.imageDark;
        return (
          <NavItem
            key={link.name}
            image={image}
            path={link.path}
            iconLight={link.iconLight}
            iconDark={link.iconDark}
          >
            <Text fontSize="14px">{link.name}</Text>
          </NavItem>
        );
      })}
      <Spacer />
      <Box
        mx="8"
        as="button"
        onClick={() => {
          dispatch(adminLogout());
          router.replace("/");
        }}
        position="absolute"
        bottom="24"
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex align="center" gap="8px">
          <Image
            width="16px"
            height="16px"
            src={`/icons/logout.svg`}
            alt="Logout icon"
            fill="red"
          />
          <Text>Logout</Text>
        </Flex>
      </Box>
    </Box>
  );
};

const NavItem = ({
  image,
  path,
  iconDark,
  iconLight,
  children,
  ...rest
}: NavItemProps) => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const icon = pathname == path || isHovered ? iconLight : iconDark;

  return (
    <Link
      href={path}
      prefetch={true}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setIsHovered(true)} // Set hoveredIndex on mouse enter
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        mb="8px"
        // borderRadius="lg"
        role="group"
        cursor="pointer"
        gap="6px"
        alignItems="end"
        color={`${pathname.startsWith(path) ? "white" : "#828282"}`}
        bg={`${pathname.startsWith(path) ? "#FA9411" : "transparent"}`}
        _hover={{
          bg: "#FA9411",
          // bg: "#FA941122",
          color: "white",
        }}
        {...rest}
      >
        <Icon as={icon} boxSize="20px" />
        {/* {image && (
          <Image
            width="24px"
            height="24px"
            src={`icons/${image}.svg`}
            fill="red"
          />
        )} */}
        {children}
        {/* {pathname} */}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { loading, adminInfo } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathLength = usePathname().split("/").length;
  useEffect(() => {
    // console.log(profileInfo)
    setMounted(true);
  }, []);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Image
        display={{ base: "flex", md: "none" }}
        src="/logo.svg"
        fill="red"
        alt="Logo"
      />

      {pathLength > 2 && (
        <Show above="md">
          <Button
            mr="auto"
            border="1px"
            bgColor="transparent"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowBackIcon boxSize="20px" mr="14px" />
            <Text fontSize="14px" fontWeight={400}>
              Back
            </Text>
          </Button>
        </Show>
      )}

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} /> */}
        <Flex alignItems={"center"}>
          <Menu id="app-menu">
            <MenuButton
              //  className="kkk"

              id="kkkkjjj"
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  // src={
                  //   "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  // }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  {mounted && (
                    <Text fontSize="sm">
                      Hello, {adminInfo?.fname ?? "Guest"}
                    </Text>
                  )}
                  {/* <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text> */}
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem key="1">Profile</MenuItem>
              <MenuItem key="2">Settings</MenuItem>
              {/* <MenuItem>Billing</MenuItem> */}
              <MenuDivider />
              <MenuItem
                key="3"
                onClick={() => {
                  dispatch(adminLogout());
                  toast.success("You have been logged out successfully");
                  router.replace("/");
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

interface ModalProps {
  // title: string;
  // modalType: string;
  children: React.ReactNode;
}

export const AdminSidebarWithHeader: React.FC<ModalProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { adminInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!adminInfo) {
      router.replace("/admin/login");
    }
  });

  return (
    <ChakraWrapper>
      <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")} p={0}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      {/* <MobileNavigation /> */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
    </ChakraWrapper>
  );
};

//  SidebarWithHeader
