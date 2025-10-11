"use client";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import Image from "./Image";
import { ChakraWrapper } from "../chakraUIWrapper";
import { Equipment, Job, FarmMap, Training } from "./Icons";
import { useState } from "react";

const points = [
  {
    id: 1,
    iconWhite: <Training width="41" height="41" fill={"white"} />,
    iconDark: <Training width="41" height="41" fill={"black"} />,
    title: "MSP Training & Engagement",
    subtitle: "Enabled the training and deployment of 2,500 service providers.",
  },
  {
    id: 2,
    iconWhite: <Equipment width="41" height="41" fill={"white"} />,
    iconDark: <Equipment width="41" height="41" fill={"black"} />,
    title: "Equipment Access",
    subtitle:
      "Facilitated over 160 tractors and 280+ labour-saving implements.",
  },
  {
    id: 3,
    iconWhite: <Job width="41" height="41" fill={"white"} />,
    iconDark: <Job width="41" height="41" fill={"black"} />,
    title: "Job Creation",
    subtitle: "Supported more than 2,500 direct and indirect jobs.",
  },
  {
    id: 4,
    iconWhite: <FarmMap width="41" height="41" fill={"white"} />,
    iconDark: <FarmMap width="41" height="41" fill={"black"} />,
    title: "Farm Mapping",
    subtitle:
      "Digitally recorded and tracked over 10,000 hectares of farmland.",
  },
];

export default function TractracPlusImpact() {
  const [selectedId, setSelectedId] = useState(1);
  return (
    <ChakraWrapper>
      <Box
        pt={"61px"}
        position={"relative"}
        // height={{ base: "350px", md: "732px" }}
        bgImage={`url(https://res.cloudinary.com/tractrac-global/image/upload/v1760217372/Frame_34_dd1jzm.jpg)`}
        bgPosition="center"
        bgSize="cover"
        bgAttachment="fixed"
        bgRepeat="no-repeat"
      >
        <Text
          fontFamily={"cursive"}
          fontSize={"28px"}
          color={"#FA9411"}
          mb={"20px"}
          textAlign={"center"}
        >
          Impact Snapshot
        </Text>
        <Text
            fontSize={{ base: "26px", md: "32px" }}
            textAlign={"center"}
          fontWeight={700}
          color="#F5F5F5"
          width={"100%"}
          maxWidth={"27ch"}
          margin={"0 auto"}
          mb={"13px"}
        >
          In its first year of deployment (under the ISSAM Project),
          TractracPlus has:
        </Text>
        <Text
          lineHeight={"140%"}
          fontSize={{base: "16px", md: "18px"}}
          textAlign={"center"}
          width={"100%"}
          maxWidth={"67ch"}
          margin={"0 auto"}
          fontWeight={400}
          color={"#F5F5F5"}
          mb={"36px"}
          fontFamily={"Manrope"}
        >
          In its first year of deployment (under the ISSAM Project),
          TractracPlus has
        </Text>

        <Grid
          templateColumns={{base: "1fr", md:"1.3fr 1fr"}}
          gap={"26px"}
          fontFamily={"Manrope"}
          width={"100%"}
          maxWidth="1123px"
          margin={"0 auto"}
          pr="20px"
          pl="20px"
        >
          <GridItem borderLeft={"3px solid #FFE4C24D"} borderRadius={"5px"}>
            {points?.map((point) => (
              <Flex
                gap={"48px"}
                alignItems={"center"}
                color={selectedId === point?.id ? "#312C2C" : "#F5F5F5"}
                bg={selectedId === point?.id ? "#F8F5F0" : "transparent"}
                fontFamily={"Manrope"}
                padding={"30px"}
                onClick={() => setSelectedId(point?.id)}
                cursor={"pointer"}
                borderRadius={"5px 5px 5px 0"}
              >
                <Box>
                  {selectedId === point?.id
                    ? point?.iconDark
                    : point?.iconWhite}
                </Box>
                <Box>
                  <Text 
            fontSize={{base: "16px", md: "18px"}}
            fontWeight={700}>
                    {point?.title}
                  </Text>
                  <Text fontSize={"14px"}>{point?.subtitle}</Text>
                </Box>
              </Flex>
            ))}
          </GridItem>

          <GridItem>
            <Image
              src="https://res.cloudinary.com/tractrac-global/image/upload/v1760219658/iPhone_16_-_104_nc0zt4.jpg"
              borderRadius={"60.43px 60.43px 0 0"}
              width={475}
              objectFit="cover"
              margin={"0 auto"}
            />
          </GridItem>
        </Grid>
      </Box>
    </ChakraWrapper>
  );
}
