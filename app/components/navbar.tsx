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
  useBreakpointValue,
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
    const [isScrolled, setIsScrolled] = useState(false);
  

  const divider = useBreakpointValue({
    base: undefined,
    sm: (
      <Center height="40px">
        <Divider />
      </Center>
    )
  })

    useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Adjust this threshold as needed (105px is the navbar height)
      setIsScrolled(scrollTop > 105);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

useEffect(() => {
  const slider = document.querySelector(".header-banner");
  let intervalId;
  
  if (slider) {
    const isMobile = window.innerWidth < 566; // Adjust breakpoint as needed
    
    if (isMobile) {
      let currentIndex = 0;
      const items = slider.querySelectorAll(".header-banner__item");
      const totalItems = items.length;
      
      const scrollToNext = () => {
        currentIndex = (currentIndex + 1) % totalItems;
        const scrollAmount = currentIndex * slider.clientWidth;
        
        slider.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
        
        // Reset to first item after showing all items
        if (currentIndex === 0) {
          setTimeout(() => {
            slider.scrollTo({
              left: 0,
              behavior: "smooth",
            });
          }, 100);
        }
      };
      
      intervalId = setInterval(scrollToNext, 3000); // 3 seconds per slide
    }
  }
  
  // Cleanup interval on component unmount
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, []);


  return (
    <Box bg={"#F8F8F0"} p={0}>
     <Flex
  width="100%"  
  maxWidth="1400px"
  bg={"#F8F8F0"}
  margin={"0 auto"}
  minHeight={"96px"}
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
  //       width="100%"  
  // maxWidth="1400px"
  //       bg={"#FA9411"}
  //       margin={"auto"}
  //       height={"82px"}
  //       borderRadius={{ base: 0, lg: "10px" }}
  //       alignItems={"center"}

        bg={"#FA9411"}
        position={"absolute"}
        top={"54px"}
        width="100%" 
        left="50%" 
        transform={"translateX(-50%)"}
        maxWidth="1400px"
                  overflowX={{base: "hidden", sm: "initial"}}
                  className="header-banner"

        margin={"auto"}
        minHeight={"82px"}
        borderRadius={{ base: 0, lg: "10px" }}
        alignItems={"center"}
        padding={{ base: "8px 0", md: "0" } }
      >
        <Stack
          ml={{ base: "8px", lg: "30px" }}
          mr={{ base: "4px", lg: "0px" }}
          direction="row"
          color="white"
          divider={divider}
          
        >
          <Box width={{base: "100vw", sm: "initial"}} className="header-banner__item" display={"flex"}>
            <Image
              src="/icons/call.svg"
              alt="call icon"
              // layout='fill'
              // objectFit='cover'
              // className={styles.vercelLogo}
              width={{ base: "30px", lg: "40px" }}
              // height={40}
            />
            <Box pl={{ base: "4px", lg: "10px" }}>
              <Text
                fontSize={{base: "18px", md: "xs"}}
                opacity={0.8}
                // display={{ base: "none", sm: "flex" }}
              >
                Call Now
              </Text>
              <Text fontWeight={[400, 700]} fontSize={{ base: "12px", md: "12px" }}>
                +234 806 464 8720
              </Text>
            </Box>
          </Box>

          <Box width={{base: "100vw", sm: "initial"}} className="header-banner__item" display={"flex"} ml={{ base: "0px", lg: "30px" }}  mt={{ base: "4px", md: "0" }}>
            <Image
              src="/icons/clock.svg"
              alt="Clock Icon"
              width={{ base: "30px", lg: "40px" }}
              // width={40}
              // height={40}
            />
            <Box pl={{ base: "4px", lg: "10px" }}>
              <Text
                fontSize={{base: "18px", md: "xs"}}
                opacity={0.8}
                // display={{ base: "none", sm: "flex" }}
              >
                Open Hours
              </Text>
              <Text fontWeight={[400, 700]} fontSize={{ base: "12px", md: "12px" }}>
                24 Hours
              </Text>
            </Box>
          </Box>

          <Box width={{base: "100vw", sm: "initial"}} className="header-banner__item" display={"flex"} ml={{ base: "0px", lg: "30px" }} mt={{ base: "4px", md: "0" }}>
            <Image
              src="/icons/location.svg"
              alt="Location icon"
              width={{ base: "30px", lg: "40px" }}
              // width={40}
              // height={40}
            />
            <Box pl={{ base: "4px", lg: "10px" }}>
              <Text
                fontSize={{base: "18px", md: "xs"}}
                opacity={0.8}
                // display={{ base: "none", sm: "flex" }}
              >
                Address
              </Text>
              <Text fontWeight={[400, 700]} fontSize={{ base: "12px", md: "12px" }}>
                11 Vanern St, Wuse, Abuja 904101, Federal Capital Territory
              </Text>
            </Box>
          </Box>
        </Stack>
      </Flex>

      {/* BOTTOM NAV */}
      <Box
     bg="#FFFFFF"
     position={isScrolled ? "fixed" : "static"}
     top={isScrolled ? "0" : "auto"}
     left="0"
     right="0"
     zIndex={1000}
     boxShadow={isScrolled ? "0 2px 4px rgba(0,0,0,0.1)" : "none"}
     transition="all 0.3s ease-in-out" 
      >
        <Flex
          p={0}
          height={isScrolled ? "85px" : "105px"}
          pt={isScrolled ? 0 : "45px"}
          pr="20px"
          pl="20px"
          width={"100%"}
          maxWidth={"1440px"}
          margin={"0 auto"}
          // align={"center"}
          alignItems={isScrolled ? "center" : "none"}
          justifyContent="space-between"
          mt={isScrolled ? 0 : { base: "0", sm: "0px" }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Link href="/">
              <Image
                src="https://res.cloudinary.com/tractrac-global/image/upload/v1747644706/tractrac_logo_png_vfhoy7.png"
                alt="app Logo"
                // layout='fill'
                // objectFit='cover'
                // className={styles.vercelLogo}
                width={120}
                // height={24}
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
