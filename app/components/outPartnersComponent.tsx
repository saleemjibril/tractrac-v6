"use client";
import {
  Flex,
  Text,
  Image,
  Box
} from "@chakra-ui/react";
import { ChakraWrapper } from "../chakraUIWrapper";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function OutPartnersComponent() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 25%",
        toggleActions: "play none none reset"
      }
    });

    // const title = titleRef.current;
    // const words = title.innerText.split(' ');
    
    // title.innerText = '';
    
    // words.forEach((word, index) => {
    //   const wordSpan = document.createElement('span');
    //   wordSpan.innerText = word + (index < words.length - 1 ? ' ' : '');
    //   wordSpan.style.display = 'inline-block';
    //   wordSpan.style.opacity = '0';
    //   wordSpan.style.transform = 'translateY(30px)';
    //   title.appendChild(wordSpan);
    // });

    // tl.to(title.children, {
    //   opacity: 1,
    //   y: 0,
    //   duration: 0.8,
    //   stagger: 0.15,
    //   ease: "power3.out"
    // })
    // .fromTo(
    //   subtitleRef.current,
    //   { opacity: 1, y: 20 },
    //   { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
    //   "-=0.4"
    // );

    const logoAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: logoRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      }
    });

    logoAnimation.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1.2, 
        ease: "elastic.out(1, 0.5)" 
      }
    );



    // Clean up animations on component unmount
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
      tl.kill();
      logoAnimation.kill();
    };
  }, []);

  return (
    <ChakraWrapper>
      <Flex 
        ref={sectionRef}
        bgColor="#F8F8F0" 
        py="80px" 
        direction="column" 
        alignItems="center" 
        pr="20px"
        pl="20px"
        overflow="hidden"
      >
        <Text 
          // ref={titleRef}
          lineHeight="64px" 
          fontWeight={800} 
          fontSize="48px"
        >
          Our Partners
        </Text>
        <Text 
          ref={subtitleRef}
          fontSize="18px" 
          mt="4px" 
          mb="36px"
          textAlign="center"
        >
          Transforming Agricultural Mechanisation, Hand in Hand with Our Partners
        </Text>
        <Box ref={logoRef}>
          <Image 
            src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446734/partners-logo_v5iz3f.svg" 
            alt="Partner Logos" 
          />
        </Box>
      </Flex>
    </ChakraWrapper>
  );
}