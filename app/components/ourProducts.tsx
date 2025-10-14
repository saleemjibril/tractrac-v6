"use client"
import { Box, Flex, Grid, GridItem, Link, Text } from "@chakra-ui/react";
import Image from "./Image";
import { LearnMore } from "./Icons";
import { ChakraWrapper } from "../chakraUIWrapper";
import { motion } from "framer-motion";

// Create motion components
const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionFlex = motion(Flex);
const MotionLink = motion(Link);

const products = [
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760361448/Frame_1000005376_2_cnqpda.jpg",
        name: "TractracPlus",
        description: "TractracPlus is Tractrac's flagship digital platform designed to revolutionize how mechanisation services are delivered, tracked, and managed across Nigeria. It connects tractor owners, mechanisation service providers (MSPs), and farmers through ...",
        link: "/products/tractrac-plus"
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760361449/A5_-_3_zakm8e.jpg",
        name: "TRAxCelerate",
        description: "The Tractrac TRAxCelerate program is a flagship capacity-building program designed to train, certify, and deploy 2,000 Mechanisation Service Providers (MSPs) — including operators, booking and hiring agents, and mechanics — across Nigeria.",
        link: "/products/traxcelerate"
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760361450/Frame_1000005376_3_b9pzji.png",
        name: "TRACINVEST",
        description: "Nigeria's agricultural landscape is at a turning point. With over 70 million hectares of arable land, the demand for mechanisation services far exceeds supply. Current tractor density is estimated at less than 0.27 hp per hectare, far below the FAO's recommended 1.5 hp/ha.",
        link: "/products/tracinvest"
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760361448/A5_-_4_nl2sxv.jpg",
        name: "H₂O: Half-Way to Ownership",
        description: "Across Nigeria, young people and women are eager to participate in the agricultural mechanisation value chain — as operators, booking agents, technicians, and service entrepreneurs. However, access to finance remains a major barrier to ownership.",
        link: "/products/half-way-to-ownership"
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760361449/A5_-_5_usti4u.jpg",
        name: "Rise7: Empowering Seven to Scale",
        description: "Rise7 is a cooperative-based asset financing and empowerment model designed by Tractrac to accelerate access to mechanization across Nigeria. Built on the principle of shared ownership and mutual responsibility, Rise7 empowers groups of seven individuals...",
        link: "/products/rise7"
    },
]

// Animation variants for stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function OurProducts() {
  return (
    <ChakraWrapper>
    <Box py={{base: "61px", md: "102px"}}
    width={"100%"}
    maxWidth="1400px"
    margin={"0 auto"}
    pr="20px"
    pl="20px"
    >
      <MotionText
        fontFamily={"Nanum Pen Script"} 
        fontSize={"28px"} 
        color={"#FA9411"} 
        mb={"20px"}
        textAlign={"center"}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Our Products
      </MotionText>

      <MotionText
        fontSize={{ base: "26px", md: "32px" }}
        color={"#18191F"}
        mb={"13px"}
        textAlign={"center"}
        fontWeight={700}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Smarter Systems for Modern Mechanisation
      </MotionText>

      <MotionText
        lineHeight={"140%"}
        fontSize={{base: "16px", md: "18px"}}
        color={"#18191F"}
        textAlign={"center"}
        width={"100%"}
        maxWidth={"67ch"}
        margin={"0 auto"}
        fontWeight={400}
        mb={"36px"}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        TractracMSL provides technology-driven solutions that connect farmers, service providers, and equipment owners—making mechanisation smarter, faster, and more reliable
      </MotionText>

      <MotionFlex 
        flexWrap="wrap" 
        gap={"25px"} 
        justifyContent={"center"}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {products?.map((product, index) => 
          <MotionBox 
            key={index}
            boxShadow={"0px 4px 4px 0px #0000000D"}
            width={{
              base: "100%",
              md: "calc(50% - 12.5px)",
              lg: "calc(33.333% - 17px)"
            }}
            minWidth={"250px"}
            bg={"#FFF"}
            padding={0}
            variants={cardVariants}
            whileHover={{ 
              y: -10,
              boxShadow: "0px 12px 24px 0px #00000015",
              transition: { duration: 0.3 }
            }}
            overflow={"hidden"}
          >
            <MotionBox
              overflow={"hidden"}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <Image src={product?.image} width="100%" />
            </MotionBox>

            <Box padding={"16px 31px"}>
              <MotionText 
                fontSize={{base: "16px", md: "18px"}}
                fontWeight="700" 
                mb={"10px"} 
                color={"#323131"}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {product?.name}
              </MotionText>

              <MotionText 
                fontSize={"14px"} 
                color={"#201D1D"} 
                mb={"10px"} 
                fontFamily={"Manrope"}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                {product?.description}
              </MotionText>

              <MotionLink 
                href={product?.link} 
                display={"flex"} 
                alignItems={"center"} 
                gap={"8px"} 
                fontWeight={"700"} 
                color={"#FA9411"}
                whileHover={{ 
                  gap: "12px",
                  transition: { duration: 0.2 }
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                Learn more 
                <MotionBox
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <LearnMore />
                </MotionBox>
              </MotionLink>
            </Box>
          </MotionBox>
        )}
      </MotionFlex>
    </Box>
    </ChakraWrapper>
  );
}