"use client";
import {
  Box,
  Stack,
  Flex,
  Text
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import Link from "next/link";
import { ChakraWrapper } from "../chakraUIWrapper";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { toast } from "react-toastify";

export default function GetMobileAppComponent() {
  const containerRef = useRef(null);
  const handImageRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const appStoreRef = useRef(null);
  const googlePlayRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      }
    });

    gsap.to(handImageRef.current, {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(
      descriptionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    )
    .fromTo(
      [googlePlayRef.current, appStoreRef.current],
      { opacity: 0, y: 20, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        stagger: 0.2, 
        duration: 0.5, 
        ease: "back.out(1.5)"
      },
      "-=0.3"
    )
    .fromTo(
      handImageRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.8"
    );

    // Clean up animations on component unmount
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
      tl.kill();
    };
  }, []);

  const handleButtonHover = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: "power1.out"
    });
  };

  const handleButtonLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: "power1.out"
    });
  };

  return (
    <ChakraWrapper>
      <Box
        ref={containerRef}
        width={"100%"}
        bgColor="#F8A730"
        overflow="hidden"
      >
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          justifyContent="center"
          alignItems="center"
          gap="50px"
          color="white"
          pt="50px"
        >
          <Box ref={handImageRef}>
            <Image 
              src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446716/hand_cugsxq.svg" 
              alt="" 
              width="300px" 
            />
          </Box>
          <Stack>
            <Text
              ref={titleRef}
              fontSize={{ base: "24px", md: "50px" }}
              lineHeight={{ base: "30px", md: "54px" }}
              fontWeight={700}
            >
              Get the TracTrac <br /> mobile app
            </Text>
            <Text 
              ref={descriptionRef}
              my="16px"
            >
              Request, Enlist and Invest in Tractors on the GO!
            </Text>
            <Stack direction="row" gap="16px" justify="start">
              {/* <Link 
                href="https://play.google.com/store/apps/details?id=com.tractrac.trac_trac&hl=en_GB"
                href={"#"}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              > */}
                <Box ref={googlePlayRef}
                as={Link} 
                href="https://play.google.com/store/apps/details?id=com.tractrac.plus"
                target="_blank"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                // onClick={() => toast.info("We are currently making some updates to the mobile app. Please check back later.")}
                >
                  <Image
                    src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446714/google-play_ft9sq5.svg"
                    alt=""
                    width={{ base: "150px", md: "240px" }}
                  />
                </Box>
              {/* </Link> */}
              {/* <Box 
                ref={appStoreRef}
                // as={Link} 
                // href="#"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                                onClick={() => toast.info("We are currently making some updates to the mobile app. Please check back later.")}
              >
                <Image
                  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446750/app-store_iv64xk.svg"
                  alt=""
                  width={{ base: "150px", md: "240px" }}
                />
              </Box> */}
            </Stack>
          </Stack>
        </Flex>
      </Box>
    </ChakraWrapper>
  );
}