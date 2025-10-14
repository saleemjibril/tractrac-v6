"use client"
import { Box, Text } from "@chakra-ui/react";
import Image from "./Image";
import { ChakraWrapper } from "../chakraUIWrapper";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}



export default function WhyTracTracPlus({points, bannerTitle, title, subtitle}: {points: any, bannerTitle: string, title: string, subtitle: string}) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Create a timeline for coordinated animations
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none none",
                }
            });

            // Animate heading
            tl.from(headingRef.current, {
                opacity: 0,
                y: -30,
                duration: 0.8,
                ease: "power3.out",
            })
            // Animate title
            .from(titleRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power3.out",
            }, "-=0.6")
            // Animate description
            .from(descRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power3.out",
            }, "-=0.6")
            // Animate grid items with stagger
            .from(gridItemsRef.current.filter(item => item !== null), {
                opacity: 0,
                y: 50,
                scale: 0.9,
                duration: 0.7,
                stagger: 0.12,
                ease: "back.out(1.2)",
                clearProps: "transform,opacity"
            }, "-=0.4");

            // Add hover animations for each grid item
            gridItemsRef.current.forEach((item) => {
                if (!item) return;

                const image = item.querySelector('img');
                const title = item.querySelector('[data-title]');
                const subtitle = item.querySelector('[data-subtitle]');

                item.addEventListener('mouseenter', () => {
                    gsap.to(item, {
                        y: -8,
                        duration: 0.3,
                        ease: "power2.out"
                    });

                    if (image) {
                        gsap.to(image, {
                            scale: 1.1,
                            rotation: 5,
                            duration: 0.4,
                            ease: "back.out(1.5)"
                        });
                    }

                    if (title) {
                        gsap.to(title, {
                            color: "#FA9411",
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }

                    if (subtitle) {
                        gsap.to(subtitle, {
                            y: -3,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(item, {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });

                    if (image) {
                        gsap.to(image, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.4,
                            ease: "back.out(1.5)"
                        });
                    }

                    if (title) {
                        gsap.to(title, {
                            color: "#312C2C",
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }

                    if (subtitle) {
                        gsap.to(subtitle, {
                            y: 0,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <ChakraWrapper>
        <Box
            ref={sectionRef}
            py={"61px"}
            width={"100%"}
            maxWidth="1400px"
            margin={"0 auto"}
            pr="20px"
            pl="20px"
        >
           <Text
                ref={headingRef}
                fontFamily={"Nanum Pen Script"} 
                fontSize={{base: "28px", md: "40px"}}
                color={"#FA9411"} 
                // mb={"13px"}
                textAlign={"center"}
            >{bannerTitle}</Text>
            
            <Text
                ref={titleRef}
                fontSize={{ base: "26px", md: "32px" }}
                color={"#18191F"}
                mb={"13px"}
                textAlign={"center"}
                fontWeight={700}
            >{title}</Text>
            
            <Text
                ref={descRef}
                lineHeight={"140%"}
                fontSize={{base: "16px", md: "18px"}}
                color={"#18191F"}
                textAlign={"center"}
                width={"100%"}
                maxWidth={"67ch"}
                margin={"0 auto"}
                fontWeight={400}
                mb={"36px"}
                fontFamily={"Manrope"}
            >{subtitle}</Text>

            <Box
                display="flex"
                flexWrap="wrap"
                columnGap="30px"
                rowGap="45px"
                fontFamily="Manrope"
                justifyContent="center"
            >
                {points?.map((point, index) => 
                    <Box
                        key={index}
                        ref={(el) => {gridItemsRef.current[index] = el}}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        cursor="pointer"
                        transition="all 0.3s ease"
                        flexBasis={{base: "100%", md: "calc(50% - 15px)", lg: "calc(33.333% - 20px)"}}
                        minWidth={{base: "280px", md: "300px", lg: "250px"}}
                        maxWidth={{base: "400px", md: "350px", lg: "320px"}}
                    >
                        <Image src={point?.image} mb={"10px"} width={79.31690896252975}/>
                        <Text 
                            data-title
                            fontSize={"18px"} 
                            color={"#312C2C"} 
                            mb={"10px"} 
                            fontWeight={700} 
                            textAlign={"center"}
                            transition="color 0.3s ease"
                        >{point?.title}</Text>
                        <Text 
                            data-subtitle
                            fontSize={"14px"} 
                            color={"#312C2C"}
                            textAlign={"center"}
                        >{point?.subtitle}</Text>
                    </Box>
                )}
            </Box>
        </Box>
        </ChakraWrapper>
    )
}