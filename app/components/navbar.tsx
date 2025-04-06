import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import {
  Box,
  ButtonGroup,
  Stack,
  Flex,
  Text,
  Button,
  IconButton,
  Divider,
  Image,
  Center,
  FlexProps,
  // NavItem,
} from "@chakra-ui/react";

import { useAppSelector } from "@/redux/hooks";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export default function Navbar({ onOpen }: MobileProps) {
  const router = useRouter();
  const { profileInfo } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box bg={"#F8F8F0"} p={0}>
      <Flex
        // px={"160px"}
        width={{ base: "100%", md: "80vw" }}
        bg={"#F8F8F0"}
        margin={"0 auto"}
        height={"96px"}
        alignItems={"center"}
        pb="40px"
        justifyContent={{ base: "end", md: "space-between" }}
      >
        {/* <Box  width={"80vw"}
    margin={"auto"}> */}
        <Text
          fontSize={"16px"}
          fontWeight={"bold"}
          display={{ base: "none", md: "inline-flex" }}
          visibility="hidden"
        >
          Contact Us
        </Text>
        <Box
          pb="4px"
          display={"flex"}
          gap={"12px"}
          mr={{ base: "16px", md: "0px" }}
        >
          {/* <Stack height={"20px"} width={"20px"} direction={"row"}> */}

          <Link href="https://www.linkedin.com/company/tractrac/">
            <IconButton
              fontSize="18px"
              size={"sm"}
              aria-label="LinkedIn Icon"
              bg="#FFFFFF"
              icon={<FaLinkedinIn />}
              isRound={true}
            />
          </Link>
          <Link href="https://web.facebook.com/tractracglobal">
            <IconButton
              size={"sm"}
              aria-label="Facebook Icon"
              icon={<FaFacebookF />}
              bg="#FFFFFF"
              isRound={true}
            />
          </Link>
          <Link href="https://twitter.com/TractracGlobal">
            <IconButton
              fontSize="18px"
              size={"sm"}
              aria-label="Twitter Icon"
              bg="#FFFFFF"
              icon={<FaTwitter />}
              isRound={true}
            />
          </Link>

          <Link href="https://www.instagram.com/tractracglobal/">
            <IconButton
              fontSize="18px"
              size={"sm"}
              aria-label="Instagram Icon"
              bg="#FFFFFF"
              icon={<FaInstagram />}
              isRound={true}
            />
          </Link>

          {/* <IconButton
            fontSize="18px"
            size={"sm"}
            aria-label="Whatsapp Icon"
            bg="#FFFFFF"
            icon={<FaWhatsapp />}
            isRound={true}
          /> */}
          {/* <IconButton
            fontSize="18px"
            size={"sm"}
            aria-label="Youtube Icon"
            bg="#FFFFFF"
            icon={<FaYoutube />}
            isRound={true}
          /> */}
        </Box>
      </Flex>

      {/* MIDDLE NAV */}
      <Flex
        bg={"#FA9411"}
        position={"absolute"}
        top={"54px"}
        width={{ base: "100%", lg: "80vw" }}
        margin={"auto"}
        height={"82px"}
        borderRadius={{ base: 0, lg: "10px" }}
        left={{ base: 0, lg: "10vw" }}
        alignItems={"center"}
      >
        <Stack
          ml={{ base: "8px", lg: "30px" }}
          mr={{ base: "4px", lg: "0px" }}
          direction={"row"}
          color="white"
          divider={
            <Center height="40px">
              <Divider />
            </Center>
          }
        >
          <Box display={"flex"}>
            <Image
              src="icons/call.svg"
              alt="call icon"
              // layout='fill'
              // objectFit='cover'
              // className={styles.vercelLogo}
              width={{ base: "20px", lg: "40px" }}
              // height={40}
            />
            <Box pl={{ base: "4px", lg: "10px" }}>
              <Text
                fontSize="xs"
                opacity={0.8}
                display={{ base: "none", sm: "flex" }}
              >
                Call Now
              </Text>
              <Text fontWeight={[400, 700]} fontSize="12px">
                +234 806 464 8720
              </Text>
            </Box>
          </Box>

          <Box display={"flex"} ml={{ base: "0px", lg: "30px" }}>
            <Image
              src="icons/clock.svg"
              alt="Clock Icon"
              width={{ base: "20px", lg: "40px" }}
              // width={40}
              // height={40}
            />
            <Box pl={{ base: "4px", lg: "10px" }}>
              <Text
                fontSize="xs"
                opacity={0.8}
                display={{ base: "none", sm: "flex" }}
              >
                Open Hours
              </Text>
              <Text fontWeight={[400, 700]} fontSize="12px">
                24 Hours
              </Text>
            </Box>
          </Box>

          <Box display={"flex"} ml={{ base: "0px", lg: "30px" }}>
            <Image
              src="icons/location.svg"
              alt="Location icon"
              width={{ base: "20px", lg: "40px" }}
              // width={40}
              // height={40}
            />
            <Box pl={{ base: "4px", lg: "10px" }}>
              <Text
                fontSize="xs"
                opacity={0.8}
                display={{ base: "none", sm: "flex" }}
              >
                Address
              </Text>
              <Text fontWeight={[400, 700]} fontSize="12px">
                11 Vanern St, Wuse, Abuja 904101, Federal Capital Territory
              </Text>
            </Box>
          </Box>
        </Stack>
      </Flex>

      {/* BOTTOM NAV */}
      <Box bg="#FFFFFF">
        <Flex
          p={0}
          height={"105px"}
          pt="45px"
          pr="20px"
          pl="20px"
          width={"100%"}
          maxWidth={"1300px"}
          margin={"0 auto"}
          justifyContent="space-between"
        >
          <Box display={"flex"} alignItems={"center"}>
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="app Logo"
                // layout='fill'
                // objectFit='cover'
                // className={styles.vercelLogo}
                width={120}
                height={24}
              />
            </Link>

            <Stack
              direction={"row"}
              spacing={"32px"}
              ml="32px"
              pt="4px"
              display={{ base: "none", lg: "flex" }}
            >
              <Link
                // p={2}
                href={"/"}
                style={{ fontSize: "14px", fontWeight: "700" }}
                color="#FA9411"
                prefetch={true}
              >
                Home
              </Link>
              <Link
                // p={2}
                href={"/about"}
                style={{ fontSize: "14px", fontWeight: "700" }}
                // color={linkColor}
                prefetch={true}
              >
                About Us
              </Link>
              <Link
                // p={2}
                href={"/services"}
                style={{ fontSize: "14px", fontWeight: "700" }}
                // color={linkColor}
                prefetch={true}
              >
                Services
              </Link>
              <Link
                // p={2}
                href={"/contact"}
                style={{ fontSize: "14px", fontWeight: "700" }}
                // color={linkColor}
                // onClick={(e) => {
                //   e.preventDefault()
                //   let contact = document.getElementById("contact");
                //   contact && contact.scrollIntoView({ behavior: "smooth", block: "start" });
                // }}
                prefetch={true}
              >
                Contact Us
              </Link>
              {/* <Link
                // p={2}
                href={"/careers"}
                style={{fontSize: "14px", fontWeight: "700"}}
                // color={linkColor}
              >
                Careers
              </Link> */}
              <Link
                // p={2}
                href={"/blog"}
                style={{ fontSize: "14px", fontWeight: "700" }}
                // color={linkColor}
                prefetch={true}
              >
                Blog
              </Link>
            </Stack>
          </Box>
          <Box pt="5px" display={{ base: "none", lg: "flex" }}>
            {profileInfo?.id && mounted ? (
              <ButtonGroup>
                <Link href={"/home"} prefetch={true}>
                  <Button
                    bg="#FA9411"
                    width={"190px"}
                    height={"40px"}
                    _hover={{ opacity: 0.8 }}
                    color="#FFFFFF"
                  >
                    Dashboard
                  </Button>
                </Link>
              </ButtonGroup>
            ) : (
              <ButtonGroup>
                <Link href={"/login"} prefetch={true}>
                  <Button
                    bg="#FFF5E8"
                    width={"190px"}
                    height={"40px"}
                    color="#FA9411"
                  >
                    Login
                  </Button>
                </Link>
                <Link href={"/signup"} prefetch={true}>
                  <Button
                    bg="#FA9411"
                    width={"190px"}
                    height={"40px"}
                    _hover={{ opacity: 0.8 }}
                    color="#FFFFFF"
                  >
                    Sign up
                  </Button>
                </Link>
              </ButtonGroup>
            )}
          </Box>

          <IconButton
            display={{ base: "flex", lg: "none" }}
            onClick={onOpen}
            variant="outline"
            mt="8px"
            // boxSize="23px"
            color="#FA9411"
            aria-label="open menu"
            icon={<FiMenu />}
          />
        </Flex>
      </Box>
    </Box>
  );
}
