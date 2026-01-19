"use client";
import { useEffect, useRef } from "react";
import {
  Box,
  List,
  ListIcon,
  ListItem,
  Stack,
  Flex,
  Text,
  Link
} from "@chakra-ui/react";
import Image from "./Image";
import {
  FaCheckCircle
} from "react-icons/fa";
import { ChakraWrapper } from "../chakraUIWrapper";
import { Tractor_2, List as ListIconSvg, Money } from "./Icons";

export default function ServicesComponent() {
  const aboutSectionRef = useRef(null);
  const tractorImagesRef = useRef(null);
  const tractorStatsRef = useRef(null);
  const aboutTextRef = useRef(null);
  const servicesSectionRef = useRef(null);
  const serviceCardsRef = useRef(null);
  const serviceBoxesRef = useRef([]);
  const bottomQuoteRef = useRef(null);
  const enterHandlersRef = useRef<Array<() => void>>([]);
  const leaveHandlersRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    // Dynamically load GSAP and ScrollTrigger only when component mounts
    const loadGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }
      
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      if (aboutSectionRef.current) {
        gsap.set([tractorImagesRef.current.children], { 
          opacity: 0, 
          y: 50 
        });
        
        gsap.set(aboutTextRef.current.children, { 
          opacity: 0, 
          y: 30 
        });

      tl.fromTo(
        aboutSectionRef.current,
        { backgroundColor: "rgba(248, 248, 240, 0.5)" },
        { backgroundColor: "rgba(248, 248, 240, 1)", duration: 1 }
      );

      gsap.to(tractorImagesRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: tractorImagesRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      gsap.to(aboutTextRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        scrollTrigger: {
          trigger: aboutTextRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      gsap.fromTo(
        tractorStatsRef.current,
        { rotation: -5, scale: 0.8, opacity: 0 },
        { 
          rotation: 0, 
          scale: 1, 
          opacity: 1,
          duration: 1.2,
          scrollTrigger: {
            trigger: tractorImagesRef.current,
            start: "center 70%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    if (servicesSectionRef.current) {
      gsap.fromTo(
        servicesSectionRef.current.children[0].children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: servicesSectionRef.current,
            start: "top 60%",
            toggleActions: "play none none none"
          }
        }
      );

      serviceBoxesRef.current.forEach((box, index) => {
        gsap.fromTo(
          box,
          { 
            y: 60, 
            opacity: 0, 
            scale: 0.95
          },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            scrollTrigger: {
              trigger: serviceCardsRef.current,
              start: "top 70%",
              toggleActions: "play none none none"
            },
            onComplete: () => {
              const onEnter = () => { gsap.to(box, { y: -10, duration: 0.3 }); };
              const onLeave = () => { gsap.to(box, { y: 0, duration: 0.3 }); };
              enterHandlersRef.current[index] = onEnter;
              leaveHandlersRef.current[index] = onLeave;
              box.addEventListener("mouseenter", onEnter);
              box.addEventListener("mouseleave", onLeave);
            }
          }
        );
      });

      gsap.fromTo(
        bottomQuoteRef.current,
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 1.2,
          scrollTrigger: {
            trigger: bottomQuoteRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
    };
    
    loadGSAP();
    
    // Cleanup function
    return () => {
      serviceBoxesRef.current.forEach((box, index) => {
        if (box) {
          const onEnter = enterHandlersRef.current[index];
          const onLeave = leaveHandlersRef.current[index];
          if (onEnter) box.removeEventListener("mouseenter", onEnter);
          if (onLeave) box.removeEventListener("mouseleave", onLeave);
        }
      });
    };
  }, []);

  return (
    <ChakraWrapper>
    <Box mt={{ base: "0px", xl: "80px" }}>
      <Flex
        ref={aboutSectionRef}
        bg="#F8F8F0"
        borderRadius={"10px"}
        pt="25px"
        pb="60px"
        pr="20px"
        pl="20px"
        width={"100%"}
        maxWidth={"1400px"}
        direction={{ base: "column-reverse", lg: "row" }}
        margin={"auto"}
        position={"relative"}
        justifyContent={"center"}
        alignItems={"center"}
        columnGap={"50px"}
        mb={{ base: "0px", lg: "-250px" }}
      >
        <Stack ref={tractorImagesRef} ml={"120px"}>
          <Box mb="-100px" ml="-120px">
            <Image
              src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/machinery_hhd88c.jpg"
              alt="Tractor image"
              width={216}
              height={245}
            />
          </Box>
          <Image
            src="https://res.cloudinary.com/tractrac-global/image/upload/f_auto,q_auto,w_1200,c_limit/v1746446531/tractor_q5dtvz.jpg"
            alt="Tractor image"
            width={"328px"}
          />

          <Box ref={tractorStatsRef} mt="-200px" ml="-90px">
            <Image
              src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446746/years-of-experience_eoc5k9.svg"
              alt="Tractor image"
              width={157}
              height={157}
            />
          </Box>
        </Stack>
        <Box ref={aboutTextRef} flex="1" mt={{ base: "0px", md: "36px" }}>
          <Text
            fontFamily={"cursive"}
            fontSize={{ base: "20px", md: "28px" }}
            color={"#FA9411"}
          >
            About the Idea
          </Text>
          <Text
            fontSize={{ base: "20px", md: "32px" }}
            fontWeight={700}
            my="10px"
            lineHeight={{ base: "24px", md: "38px" }}
          >
            Improving the lives of all farmers across Africa.
          </Text>
          <Text fontSize={{ base: "14px", md: "18px" }}>
            We believe that affordable mechanisation services can revolutionize
            the agricultural sector in Africa, fostering economic growth.
          </Text>
          <Flex gap="20px" mt="20px" flexDir={{ base: "column", md: "row" }} flexWrap={"wrap"}>
            <Flex direction="row" alignItems="center" gap={"14px"}>
              <Image
                src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446743/user-icon-avatar_itnjf5.svg"
                alt=""
                width={{ base: "30px", md: "50px" }}
              />
              <Text fontSize={"20px"} fontWeight={600}>
                Increase Tractor Density
              </Text>
            </Flex>
            <Stack direction="row" alignItems="center" gap={"14px"}>
              <Image
                src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446742/tractor-icon-avatar_opoeff.svg"
                alt=""
                width={{ base: "30px", md: "50px" }}
              />

              <Text fontSize={"20px"} fontWeight={600}>
                4,000 Agent Across Nigeria
              </Text>
            </Stack>
          </Flex>
          <Flex gap="20px" mt="32px" flexWrap={"wrap"}>
            <Image
              display={{ base: "none", md: "flex" }}
              src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446531/machinery-2_ys9jlb.jpg"
              alt="Farm machinery"
              width={"200px"}
            />
            <List spacing={3}>
              <ListItem fontSize="18px" fontWeight="400" alignItems="center">
                <ListIcon as={FaCheckCircle} color="#FA9411" boxSize={"18px"} />
                Income for Tractor owners
              </ListItem>
              <ListItem fontSize="18px" fontWeight="400" alignItems="center">
                <ListIcon as={FaCheckCircle} color="#FA9411" boxSize={"18px"} />
                Foster Sustainable Agriculture
              </ListItem>
              <ListItem fontSize="18px" fontWeight="400" alignItems="center">
                <ListIcon as={FaCheckCircle} color="#FA9411" boxSize={"18px"} />
                Promote mechanisation Adoption
              </ListItem>
            </List>
          </Flex>
        </Box>
      </Flex>

      <Stack
        ref={servicesSectionRef}
        bg="#333333"
        pt={{ base: "0px", md: "250px" }}
        pb="80px"
        color="white"
      >
        <Box 
          width={"100%"}
          maxWidth={"1400px"}
          margin={"auto"}
          pr="20px"
          pl="20px"
        >
          <Text
            fontFamily={"cursive"}
            fontSize={"28px"}
            color={"#FA9411"}
            mt="80px"
          >
            Our services
          </Text>
          <Text fontSize={"32px"} fontWeight={700}>
            Bridging the Gap to Mechanisation.
          </Text>

          <Stack
            ref={serviceCardsRef}
            direction={{ base: "column", md: "row" }}
            gap={"0"}
            mt="60px"
            mb="-100px"
            mx={{ base: "12px", md: "24px" }}
            zIndex={2}
            position="relative"
          >
            <Box 
              ref={el => serviceBoxesRef.current[0] = el}
              bgColor="#CC6D02" 
              p="20px" 
              as="a" 
              href="/home/hire-tractor"
              transition="transform 0.3s"
            >
              <Tractor_2 boxSize="90px" color="currentColor" />
              <Text fontSize="16px" mt="18px" fontWeight={600}>
                Hire a Tractor
              </Text>
              <Text fontSize="14px" mt="8px">
                Seamlessly request tractor services for your farm or community.
                We offer a wide variety of farm machineries and tractor-drawn
                implements for hire at affordable rates.
              </Text>
            </Box>
            <Box
              ref={el => serviceBoxesRef.current[1] = el}
              bgColor="#FF8802"
              p="20px"
              color="#222222"
              as="a"
              href="/home/enlist-tractor"
              transition="transform 0.3s"
            >
              <ListIconSvg boxSize="90px" color="#222222" />
              <Text fontSize="16px" mt="18px" fontWeight={600}>
                Enlist your Tractors
              </Text>
              <Text fontSize="14px" mt="8px">
                By enlisting your tractors on our platform, you get to make
                money while helping to build the network of tractors available
                to various farmers across Africa.
              </Text>
            </Box>
            <Box 
              ref={el => serviceBoxesRef.current[2] = el}
              bgColor="#FFA035" 
              p="20px" 
              as="a" 
              href="/home/agent"
              transition="transform 0.3s"
            >
              <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1747817550/agent_hxadwc.svg" alt=""></Image>
              <Text fontSize="16px" mt="18px" fontWeight={600}>
                Become an Agent
              </Text>
              <Text fontSize="14px" mt="8px">
                Join our growing network of service aggregators who work with
                farmers and communities to bring tractor services to farms and
                communities.
              </Text>
            </Box>
            <Box
              ref={el => serviceBoxesRef.current[3] = el}
              bgColor="#FFB867"
              p="20px"
              color="#222222"
              as="a"
              href="/home/invest-in-tractor"
              transition="transform 0.3s"
            >
              <Money boxSize="90px" color="#222222" />
              <Text fontSize="16px" mt="18px" fontWeight={600}>
                Invest in Tractors
              </Text>
              <Text fontSize="14px" mt="8px">
                Unleash the power of your investment and transform the lives of
                small-scale farmers in Nigeria by joining our dynamic group of
                tractor investors. Together, we are revolutionizing the
                agricultural landscape.
              </Text>
            </Box>
          </Stack>
          
          <Box
            ref={bottomQuoteRef}
            border={"3px"}
            borderColor="white"
            borderStyle="solid"
            borderTopStyle={{ base: "solid", md: "dotted" }}
            pt="140px"
          >
            <Text
              textAlign="center"
              fontWeight={400}
              px={{ base: "1em", md: "4em", lg: "7em", xl: "10em" }}
            >
              Our integrated platform enables farmers to lease and own tractors,
              access genuine tractor implement, and participate in a sustainable
              and competitive mechanization market, driving positive change in
              the agricultural sector and empowering rural communities
              throughout Africa.
            </Text>

            <Flex
              justifyContent="center"
              fontWeight={700}
              bg={"#FA9411"}
              color={"white"}
              borderRadius={"10px"}
              py="10px"
              px="20px"
              width={"fit-content"}
              margin={"auto"}
              mt="40px"
              mb="-25px"
              _hover={{
                bg: "#FA9411",
                // opacity: ".8",
                transform: "scale(1.05)",
                transition: "transform 0.3s ease"
              }}
            >
              <Link 
                            textDecoration={"none"}
              href="/services">Explore more services</Link>
            </Flex>
          </Box>
        </Box>
      </Stack>
    </Box>
    </ChakraWrapper>
  );
}