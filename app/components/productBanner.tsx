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
import Image from "./Image";

export default function ProductBanner({ title, subtitle, image, height }: { title: string, subtitle: string, image: string, height?: string }) {
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
        height={{ base: "370px", md: !!height ? height : "732px" }}
        bgImage={`url(${image})`}
        bgPosition="center"
        bgSize="cover"
        bgAttachment="fixed"
        bgRepeat="no-repeat"
        width={"100%"}
      >
        <Box
          pt={{ base: "40px", md: "86px" }}
          color={"white"}
          width={"100%"}
          maxWidth="1400px"
          margin={"0 auto"}
          pr="20px"
          pl="20px"
        >
          <Text 
            ref={brandTextRef}
            fontSize={{ base: "26px", md: "48px" }}
            color={"##FFFFFF"} 
            textAlign={"center"}
            fontWeight={700}
            width={"100%"}
            maxWidth={"20ch"}
            margin={"0 auto"}
            lineHeight={"120%"}
            mb={"15px"}
          >
            {title}
          </Text>
        
          <Text 
            ref={subTextRef}
            mt="20px" 
            mb="30px"
            textAlign={"center"}
            width={"100%"}
            maxWidth={"65ch"}
            fontSize={{base: "16px", md: "18px"}}
            margin={"0 auto"}
            marginTop={"12px"}
          >
            {subtitle}
          </Text>

          <Image margin={"0 auto"} marginTop={"10px"} src="https://res.cloudinary.com/tractrac-global/image/upload/v1760211402/ldAb_E9IiDEg3fgYQZz_F4mqwSeitd76CA_1_v9rfey.png"
          width={{base: 200, md: 300}}
          cursor={"pointer"}
          onClick={() => {
            window.open(
              `https://play.google.com/store/apps/details?id=com.tractrac.plus`
            );
          }}
          // height={124.22599792480469}
          />
          
        </Box>
      </Box>
    </ChakraWrapper>
  );
}