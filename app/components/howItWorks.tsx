"use client";
import {
  Box,
  Stack,
  Flex,
  Text,
  Button,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ReactNode, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChakraWrapper } from "../chakraUIWrapper";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TabContent({
  title,
  content,
  icon,
  isSelected,
}: {
  title: ReactNode;
  content: string;
  icon: string;
  isSelected: boolean;
}) {
  const router = useRouter();
  const panelRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const iconRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      gsap.set([titleRef.current, contentRef.current, iconRef.current, buttonRef.current], {
        opacity: 0,
        y: 20
      });
      
      tl.fromTo(
        panelRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 }
      )
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.4 })
      .to(iconRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        ease: "back.out(1.7)" 
      }, "-=0.2")
      .to(contentRef.current, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
      .to(buttonRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        ease: "back.out(1.5)" 
      }, "-=0.2");
      
      const button = buttonRef.current;
      if (button) {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, { scale: 1.05, duration: 0.2 });
        });
        button.addEventListener("mouseleave", () => {
          gsap.to(button, { scale: 1, duration: 0.2 });
        });
      }
      
      // Cleanup function
      return () => {
        tl.kill();
        if (button) {
          button.removeEventListener("mouseenter", () => {});
          button.removeEventListener("mouseleave", () => {});
        }
      };
    }
  }, [isSelected]);

  return (
    <TabPanel
      p={0}
      bgColor="#33333380"
      pr={{ base: "0px", md: "30px" }}
      pb={{ base: "20px", md: "60px" }}
      borderBottomLeftRadius="10px"
      borderBottomRightRadius="10px"
      position="relative"
    >
      <Flex
        ref={panelRef}
        bgImage="url('https://res.cloudinary.com/tractrac-global/image/upload/v1746446738/tab-bg_rm8tl9.svg')"
        bgPosition="60% center"
        bgRepeat="no-repeat"
        height={{ base: "100%", lg: "450px" }}
        bgColor="#FFFFFF"
        ml={{ base: "0px", md: "-30px" }}
        borderRadius="10px"
        color="black"
        alignItems={{ base: "start", md: "center" }}
        px="60px"
        py="40px"
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        gap={{ base: "20px", md: "0px" }}
        position="relative"
      >
        <Box>
          <div ref={titleRef}>
            {title}
          </div>
          <Button
            ref={buttonRef}
            mt="20px"
            height="40px"
            bgColor="#FA9411"
            color="#FFFFFF"
            fontSize="12px"
            minW="194px"
            onClick={() => router.push("/signup")}
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s"
          >
            Sign up
          </Button>
        </Box>
        <Stack
          width={{ base: "100%", lg: "50%" }}
          align={{ base: "start", md: "end" }}
        >
          <div ref={iconRef}>
            <Image src={`icons/${icon}.svg`} alt="" width="120px" />
          </div>
          <div ref={contentRef}>
            <Text mt="12px">
              {content} <br />
              <strong>
                Click the &quot;sign up&quot; button to get started.
              </strong>
            </Text>
          </div>
        </Stack>
      </Flex>
    </TabPanel>
  );
}

export default function HowItWorksComponent() {
  const [tabIndex, setTabIndex] = useState(0);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const tabsRef = useRef(null);
  const tabButtonsRef = useRef([]);
  
  const addTabButtonRef = (el, index) => {
    if (el && !tabButtonsRef.current.includes(el)) {
      tabButtonsRef.current[index] = el;
    }
  };

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
    
    tl.fromTo(
      sectionRef.current,
      { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
      { 
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", 
        duration: 1.2, 
        ease: "power3.inOut" 
      }
    );
    
    gsap.fromTo(
      headerRef.current.children,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
    
    gsap.fromTo(
      tabButtonsRef.current,
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.1,
        delay: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tabsRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
    
    tabButtonsRef.current.forEach((button) => {
      if (button) {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, { y: -5, duration: 0.2 });
        });
        button.addEventListener("mouseleave", () => {
          gsap.to(button, { y: 0, duration: 0.2 });
        });
      }
    });
    
    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
      tl.kill();
    };
  }, []);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  return (
    <ChakraWrapper>
    <Box
      ref={sectionRef}
      bgColor="#FFFFDB"
      position="relative"
      py="80px" 
      px={{ base: "2em", md: "8em" }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: "75%",
        background: "#FA9411",
        transform: "skewX(30deg)",
        transformOrigin: "bottom right 60px",
      }}
      color={{ base: "black", md: "white" }}
    >
      <Box 
        ref={headerRef}
        position="relative"
        width={"100%"}
        maxWidth="1400px"
        margin={"0 auto"}
      >
        <Text fontSize="24px" fontFamily="cursive" color={{ base: "#000", xl: "#FFF" }}>
          How it works
        </Text>
        <Text fontSize="28px" fontWeight={700} lineHeight="38px" mt="4px" color={{ base: "#000", xl: "#FFF" }}>
          Driving Growth, Harvesting <br />
          Success
        </Text>

        <Tabs 
          ref={tabsRef}
          variant="unstyled" 
          isFitted 
          mt="20px" 
          borderRadius="10px"
          index={tabIndex}
          onChange={handleTabChange}
        >
          <TabList flexDir={{ base: "column", md: "row" }}>
            <Tab
              ref={(el) => addTabButtonRef(el, 0)}
              _selected={{ color: "white", bg: "#33333380", fontSize: "18px" }}
              bg="#333333"
              borderTopLeftRadius="10px"
              borderTopRightRadius={{ base: "10px", md: "0px" }}
              height="70px"
              color="white"
              transition="all 0.3s ease"
            >
              Step 1
            </Tab>
            <Tab
              ref={(el) => addTabButtonRef(el, 1)}
              _selected={{ color: "white", bg: "#33333380", fontSize: "18px" }}
              bg="#333333"
              height="70px"
              color="white"
              transition="all 0.3s ease"
            >
              Step 2
            </Tab>
            <Tab
              ref={(el) => addTabButtonRef(el, 2)}
              _selected={{ color: "white", bg: "#33333380", fontSize: "18px" }}
              bg="#333333"
              height="70px"
              color="white"
              transition="all 0.3s ease"
            >
              Step 3
            </Tab>
            <Tab
              ref={(el) => addTabButtonRef(el, 3)}
              _selected={{ color: "white", bg: "#33333380", fontSize: "18px" }}
              bg="#333333"
              height="70px"
              borderTopRightRadius={{ base: "0px", md: "10px" }}
              color="white"
              transition="all 0.3s ease"
            >
              Step 4
            </Tab>
          </TabList>
          <TabPanels
            bgColor="#33333380"
            borderBottomLeftRadius="10px"
            borderBottomRightRadius="10px"
            position="relative"
          >
            <TabContent
              title={
                <Text fontSize="28px" fontWeight={700} lineHeight="34px">
                  Create an <br /> Account
                </Text>
              }
              content="Fill out our form to create an account.  You will be redirected to our services page after successfully creating an account and verifying your identity."
              icon="profilecircle"
              isSelected={tabIndex === 0}
            />
            <TabContent
              title={
                <Text fontSize="28px" fontWeight={700} lineHeight="34px">
                  Click on the services <br /> you are interested in
                </Text>
              }
              content="The service page has a comprehensive list of our services. Select your preferred service offering and follow the prompts!"
              icon="services"
              isSelected={tabIndex === 1}
            />
            <TabContent
              title={
                <Text fontSize="28px" fontWeight={700} lineHeight="34px">
                  Visit your dashboard.
                </Text>
              }
              content="The dashboard allows all users access their status and track their activities on the tractrac platform. 
              The dashboard also provides a global view of the activities on the tractrac platform."
              icon="business"
              isSelected={tabIndex === 2}
            />
            <TabContent
              title={
                <Text fontSize="28px" fontWeight={700} lineHeight="34px">
                  Complete your Profile
                </Text>
              }
              content="Within Accounts, you can access your profile and provide the information needed to complete your profile. 
              On your profile page, you can reset your password as well"
              icon="profilecircle"
              isSelected={tabIndex === 3}
            />
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
    </ChakraWrapper>
  );
}