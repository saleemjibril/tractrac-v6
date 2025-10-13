"use client"
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import Image from "./Image";
import { ChakraWrapper } from "../chakraUIWrapper";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const points = [
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
        title: "Smart Tractor Booking & Deployment",
        subtitle: "Connects farmers and tractor owners for real-time, GPS-tracked operations."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214287/Group_1000001752_2_i0yql4.png",
        title: "Farm Mapping & Data Analytics",
        subtitle: "GPS tools capture field data to improve planning and precision farming."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214287/Group_1000001752_3_urmhsr.png",
        title: "Database Management",
        subtitle: "Central dashboard to track performance, maintenance, and impact metrics."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214287/Group_1000001752_4_wjbgct.png",
        title: "Performance & Reporting",
        subtitle: "Visual dashboards track progress and show real-time impact."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214287/Group_1000001752_5_rsr2kk.png",
        title: "Mechanisation Marketplace",
        subtitle: "A digital hub for buying, renting, or leasing tractors and equipment."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
        title: "Tracking & Monitoring",
        subtitle: "Real-time visibility into equipment use, performance, and field operations."
    }
]

export default function WhyTracTracPlus() {
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
                fontSize={"28px"} 
                color={"#FA9411"} 
                mb={"20px"}
                textAlign={"center"}
            >Why Tractrac Plus</Text>
            
            <Text
                ref={titleRef}
                fontSize={{ base: "26px", md: "32px" }}
                color={"#18191F"}
                mb={"13px"}
                textAlign={"center"}
                fontWeight={700}
            >Key Features & Services</Text>
            
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
            >Our platform combines technology, data, and transparency to help farmers, service providers, and partners achieve better outcomes in every operation.</Text>

            <Grid 
                templateColumns={{base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr"}} 
                gap={"30px"} 
                fontFamily={"Manrope"}
            >
                {points?.map((point, index) => 
                    <GridItem 
                        key={index}
                        ref={(el) => {gridItemsRef.current[index] = el}}
                        display={"flex"} 
                        flexDirection={"column"} 
                        alignItems={"center"}
                        cursor="pointer"
                        transition="all 0.3s ease"
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
                    </GridItem>
                )}
            </Grid>
        </Box>
        </ChakraWrapper>
    )
}