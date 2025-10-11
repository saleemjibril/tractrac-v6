"use client"
import { Box, Flex, Grid, GridItem, Link, Text } from "@chakra-ui/react";
import Image from "./Image";
import { LearnMore } from "./Icons";
import { ChakraWrapper } from "../chakraUIWrapper";

const products = [
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760200788/97c60de74652dd7f72e1ffff45561371505c6ee1_hjikwn.jpg",
        name: "TractracPlus",
        description: "TractracPlus is Tractrac’s flagship digital platform designed to revolutionize how mechanisation services are delivered, tracked, and managed across Nigeria. It connects tractor owners, mechanisation service providers (MSPs), and farmers through ...",
        link: "/products/tractrac-plus"
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760200806/Frame_1000005376_xpxwxj.png",
        name: "TRAxCelerate",
        description: "The Tractrac TRAxCelerate program is a flagship capacity-building program designed to train, certify, and deploy 2,000 Mechanisation Service Providers (MSPs) — including operators, booking and hiring agents, and mechanics — across Nigeria.",
        link: "/"
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760200833/Frame_1000005376_1_aaha8d.png",
        name: "TRACINVEST",
        description: "Nigeria’s agricultural landscape is at a turning point. With over 70 million hectares of arable land, the demand for mechanisation services far exceeds supply. Current tractor density is estimated at less than 0.27 hp per hectare, far below the FAO’s recommended 1.5 hp/ha.",
        link: "/"
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760200791/Frame_1000005376_2_wyd9y7.png",
        name: "H₂O: Half-Way to Ownership",
        description: "Across Nigeria, young people and women are eager to participate in the agricultural mechanisation value chain — as operators, booking agents, technicians, and service entrepreneurs. However, access to finance remains a major barrier to ownership.",
        link: "/"
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760200792/Frame_1000005377_cknmim.png",
        name: "Rise7: Empowering Seven to Scale",
        description: "Rise7 is a cooperative-based asset financing and empowerment model designed by Tractrac to accelerate access to mechanization across Nigeria. Built on the principle of shared ownership and mutual responsibility, Rise7 empowers groups of seven individuals...",
        link: "/"
    },
]

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
      <Text
      fontFamily={"cursive"} 
      fontSize={"28px"} 
      color={"#FA9411"} 
      mb={"20px"}
      textAlign={"center"}
      >Our Products</Text>
        <Text
            fontSize={{ base: "26px", md: "32px" }}
            color={"#18191F"}
        mb={"13px"}
        textAlign={"center"}
        fontWeight={700}
        >Smarter Systems for Modern Mechanisation</Text>
        <Text
        lineHeight={"140%"}
        fontSize={{base: "16px", md: "18px"}}
        color={"#18191F"}
        textAlign={"center"}
        width={"100%"}
        maxWidth={"67ch"}
        margin={"0 auto"}
        fontWeight={400}
        mb={"36px"}
        >TractracMSL provides technology-driven solutions that connect farmers, service providers, and equipment owners—making mechanisation smarter, faster, and more reliable</Text>

<Flex flexWrap="wrap" gap={"25px"} justifyContent={"center"}>
  {products?.map((product) => 
    <Box 
      boxShadow={"0px 4px 4px 0px #0000000D"}
      width={{
        base: "100%",           // 1 item per row on mobile
        md: "calc(50% - 12.5px)",   // 2 items per row on tablet
        lg: "calc(33.333% - 17px)"  // 3 items per row on desktop
      }}
      minWidth={"250px"}
      bg={"#FFF"}
      padding={0}
    >
      <Image src={product?.image} width="100%" />

      <Box padding={"16px 31px"}>
        <Text 
                    fontSize={{base: "16px", md: "18px"}}

        fontWeight="700" mb={"10px"} color={"#323131"}>
          {product?.name}
        </Text>
        <Text fontSize={"14px"} color={"#201D1D"} mb={"10px"} fontFamily={"Manrope"}>
          {product?.description}
        </Text>
        <Link 
          href={product?.link} 
          display={"flex"} 
          alignItems={"center"} 
          gap={"8px"} 
          fontWeight={"700"} 
          color={"#FA9411"}
        >
          Learn more <LearnMore />
        </Link>
      </Box>
    </Box>
  )}
</Flex>
    </Box>
    </ChakraWrapper>
  );
}