"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function HomeBanner({ title, bannerTitle, subtitle, buttonText, link, image, height }: { title: string, bannerTitle: string, subtitle: string, buttonText: string, link: string, image: string, height?: string }) {
  const router = useRouter();
  
  const bannerRef = useRef(null);
  const brandTextRef = useRef(null);
  const headingRef = useRef(null);
  const subTextRef = useRef(null);
  const buttonRef = useRef(null);
  
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    gsap.set([brandTextRef.current, headingRef.current, subTextRef.current, buttonRef.current], { 
      opacity: 0,
      y: 20
    });
    
    gsap.fromTo(bannerRef.current, 
      { scale: 1.1 }, 
      { scale: 1, duration: 1.5, ease: "power2.out" }
    );
    
    tl.to(brandTextRef.current, { opacity: 1, y: 0, duration: 0.8 })
      .to(headingRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
      .to(subTextRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
      .to(buttonRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        onComplete: () => {
          gsap.to(buttonRef.current, {
            scale: 1.05,
            duration: 0.3,
            paused: true,
            repeat: 1,
            yoyo: true
          }).play();
        }
      }, "-=0.4");
      
    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <ChakraWrapper>
      <Box
        ref={bannerRef}
        position={"relative"}
        // height={{ base: "350px", md: !!height ? height : "535px" }}
        bgImage={`linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})`}
        bgPosition="center"
        bgSize="cover"
        bgAttachment="fixed"
        bgRepeat="no-repeat"
        width={"100%"}
      >
        <Box
          py={{ base: "40px", md: "86px" }}
          color={"white"}
          width={"100%"}
          maxWidth="1400px"
          margin={"0 auto"}
          pr="20px"
          pl="20px"
        >
          <Text 
            ref={brandTextRef}
            fontFamily={"cursive"} 
            fontSize={"40px"} 
            color={"#FA9411"} 
            display={{ base: "none", sm: "initial" }}
          >
            {title}
          </Text>
          <Text
            ref={headingRef}
            fontSize={{ base: "26px", md: "48px" }}
            lineHeight={{ base: "28px", md: "57.65px" }}
            mt="20px"
            maxWidth={"19ch"}
          >
            {bannerTitle}
          </Text>
          <Text 
            ref={subTextRef}
            mt="20px" 
            mb="30px"
            maxWidth={"46ch"}
          >
            {subtitle}
          </Text>
          <Button
            ref={buttonRef}
            bg="#FA9411"
            width={"190px"}
            height={"40px"}
            _hover={{ 
              opacity: 0.8,
              transform: "scale(1.05)",
              transition: "transform 0.3s ease"
            }}
            color="#FFFFFF"
            onClick={() => router.push(link)}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    </ChakraWrapper>
  );
}