
import {
    Box,
    ButtonGroup,
    List,
    ListIcon,
    ListItem,
    Stack,
    Flex,
    Text,
    Link,
    Button,
    IconButton,
    useColorModeValue,
    Divider,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Image,
    Input,
    Textarea,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Center,
    Drawer,
    useDisclosure,
    DrawerContent,
    FlexProps,
    CloseButton,
    Alert,
    AlertIcon,
    AlertTitle,
    useMediaQuery,
    // NavItem,
  } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

  interface SidebarProps extends FlexProps {
    onClose: () => void;
  }

  const LinkItems: Array<{ name: string; path: string; active: boolean }> = [
    {
      name: "Home",
      path: `/`,
      active: true,
    },
    {
      name: "About",
      path: "/about",
      active: false,
    },
    { name: "Services", path: "/services", active: false },
    {
      name: "Contact Us",
      path: "/contact",
      active: false,
    },
    // {
    //   name: "Careers",
    //   path: "#",
    //   active: false,
    // },
    {
      name: "Blog",
      path: "/blog",
      active: false,
    },
  ];

export const SidebarContent = ({ onClose }: SidebarProps) => {
    const router = useRouter();
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
        // {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          {/* <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Logo
          </Text> */}
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => {
          return (
            <Link
              px="36px"
              key={link.name}
              href={link.path}
              // mb="12px"
              py="12px"
              fontSize={"md"}
              fontWeight={700}
              // color={linkColor}
              display="block"
              _hover={{
                textDecoration: "none",
                bgColor: "#FA9411",
                color: "white",
              }}
            >
              {link.name}
            </Link>
            // <NavItem
            //   // image={image}
            //   path={link.path}
            //   // icon={link.icon}
            // >
            //   <Text fontSize="14px">{link.name}</Text>
            // </NavItem>
          );
        })}
  
        <Flex gap="16px" px="12px" mt="24px">
          <Button
            bg="#FFF5E8"
            width={"100%"}
            height={"40px"}
            color="#FA9411"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            bg="#FA9411"
            width={"100%"}
            height={"40px"}
            _hover={{ opacity: 0.8 }}
            color="#FFFFFF"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </Button>
        </Flex>
        {/* <Spacer />
        <Box
          mx="8"
          as="button"
          onClick={() => {
            dispatch(userLogout());
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
        </Box> */}
      </Box>
    );
  };