"use client"
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import Image from "./Image";
import { ChakraWrapper } from "../chakraUIWrapper";

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
    return (
        <ChakraWrapper>
        <Box
        py={"61px"}
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
      >Why Tractrac Plus</Text>
            <Text
            fontSize={{ base: "26px", md: "32px" }}
            color={"#18191F"}
        mb={"13px"}
        textAlign={"center"}
        fontWeight={700}
        >Key Features & Services</Text>
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
            fontFamily={"Manrope"}
            >Our platform combines technology, data, and transparency to help farmers, service providers, and partners achieve better outcomes in every operation.</Text>

            <Grid templateColumns={{base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr"}} gap={"30px"} fontFamily={"Manrope"}>
                {points?.map((point) => 
                <GridItem display={"flex"} flexDirection={"column"} alignItems={"center"}>
                <Image src={point?.image} mb={"10px"} width={79.31690896252975}/>
                    <Text fontSize={"18px"} color={"#312C2C"} mb={"10px"} fontWeight={700} textAlign={"center"}>{point?.title}</Text>
                    <Text fontSize={"14px"} color={"#312C2C"}
                    textAlign={"center"}
                    >{point?.subtitle}</Text>
            </GridItem>
                )}
            </Grid>
        </Box>
        </ChakraWrapper>
    )
}