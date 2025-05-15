"use client";
import {
  Box,
  Stack,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
} from "@chakra-ui/react";
import { ChakraWrapper } from "../chakraUIWrapper";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function FaqComponent() {
  const titleRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);
  const accordionRef = useRef(null);
  const accordionItemsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const tl = gsap.timeline();
    
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(
      descriptionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    );
    
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 1.2, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none"
        }
      }
    );
    
    gsap.fromTo(
      accordionItemsRef.current,
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: accordionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none"
        }
      }
    );
    
    // Clean up 
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
      tl.kill();
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !accordionItemsRef.current.includes(el)) {
      accordionItemsRef.current.push(el);
    }
  };

  return (
    <ChakraWrapper>
      <Box 
        position="relative"
        width={"100%"}
        bgColor="#F8F8F0"
      >
        <Flex 
          flexWrap={{ base: "wrap", xl: "nowrap" }}
          width={"100%"}
          maxWidth="1440px"
          margin={"0 auto"}
          padding={"0 20px"}
          gap={"53px"}
        >
          <Image
            ref={imageRef}
            src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/faq_uuekot.jpg"
            alt=""
            display={{ base: "none", md: "block" }}
            width={{ base: "100%", xl: "unset" }}
          />
          <Stack
            bgColor="#F8F8F0"
            py="80px"
            width="100%"
          >
            <Text 
              ref={titleRef} 
              fontSize="28px" 
              fontFamily="cursive" 
              color="#FA9411"
            >
              FAQ
            </Text>
            <Text 
              ref={headingRef} 
              fontSize="28px" 
              fontWeight={700}
            >
              Please Do you have any question
            </Text>
            <Text ref={descriptionRef}>
              Get answers to common questions about our services. Contact us for
              further assistance.
            </Text>

            <Accordion ref={accordionRef} defaultIndex={[0]} mt="20px">
              <AccordionItem ref={addToRefs} border="0px" mb="20px">
                <h2>
                  <AccordionButton
                    bg="#FA9411"
                    _expanded={{ bg: "#FA9411", color: "white" }}
                    _focus={{ bg: "#FA9411", color: "white" }}
                    borderRadius={"10px"}
                    border="0px"
                    py="16px"
                    onClick={(e) => {
                      
                      gsap.to(e.currentTarget, {
                        scale: 0.98,
                        duration: 0.1,
                        onComplete: () => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            duration: 0.1,
                          });
                        }
                      });
                    }}
                  >
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      color="white"
                      fontSize="16px"
                    >
                      How are interest paid
                    </Box>
                    <AccordionIcon color="white" />
                  </AccordionButton>
                </h2>
                <AccordionPanel px={1} pt="20px">
                  Investment returns are paid to investor via online, wire transfer,
                  or cheque.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem ref={addToRefs} border="0px" mb="20px">
                <h2>
                  <AccordionButton
                    bg="#FA9411"
                    _expanded={{ bg: "#FA9411", color: "white" }}
                    _focus={{ bg: "#FA9411", color: "white" }}
                    borderRadius={"10px"}
                    py="16px"
                    border="0px"
                    onClick={(e) => {
                      
                      gsap.to(e.currentTarget, {
                        scale: 0.98,
                        duration: 0.1,
                        onComplete: () => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            duration: 0.1,
                          });
                        }
                      });
                    }}
                  >
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      color="white"
                      fontSize="16px"
                    >
                      Is there Tractor enlistment limit?
                    </Box>
                    <AccordionIcon color="white" />
                  </AccordionButton>
                </h2>
                <AccordionPanel px={1} pt="20px">
                  There is no limit to Tractor enlistment.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem ref={addToRefs} border="0px" mb="0px">
                <h2>
                  <AccordionButton
                    bg="#FA9411"
                    _expanded={{ bg: "#FA9411", color: "white" }}
                    _focus={{ bg: "#FA9411", color: "white" }}
                    borderRadius={"10px"}
                    py="16px"
                    border="0px"
                    onClick={(e) => {
                      
                      gsap.to(e.currentTarget, {
                        scale: 0.98,
                        duration: 0.1,
                        onComplete: () => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            duration: 0.1,
                          });
                        }
                      });
                    }}
                  >
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      color="white"
                      fontSize="16px"
                    >
                      How long does it take to get returns
                    </Box>
                    <AccordionIcon color="white" />
                  </AccordionButton>
                </h2>
                <AccordionPanel px={1} pt="20px">
                  9 month (On site)
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
        </Flex>
      </Box>
    </ChakraWrapper>
  );
}