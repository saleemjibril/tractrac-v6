"use client";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import Image from "./Image";
import { ChakraWrapper } from "../chakraUIWrapper";
import { Equipment, Job, FarmMap, Training } from "./Icons";
import { useState } from "react";
import { motion } from "framer-motion";

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionGridItem = motion(GridItem);

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
        pb={"61px"}
        position={"relative"}
        bgImage={`url(https://res.cloudinary.com/tractrac-global/image/upload/v1760217372/Frame_34_dd1jzm.jpg)`}
        bgPosition="center"
        bgSize="cover"
        bgAttachment="fixed"
        bgRepeat="no-repeat"
      >
        <MotionText
          fontFamily={"cursive"}
          fontSize={"28px"}
          color={"#FA9411"}
          mb={"20px"}
          textAlign={"center"}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Impact Snapshot
        </MotionText>

        <MotionText
          fontSize={{ base: "26px", md: "32px" }}
          textAlign={"center"}
          fontWeight={700}
          color="#F5F5F5"
          width={"100%"}
          maxWidth={"27ch"}
          margin={"0 auto"}
          mb={"13px"}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          In its first year of deployment (under the ISSAM Project),
          TractracPlus has:
        </MotionText>

        <MotionText
          lineHeight={"140%"}
          fontSize={{ base: "16px", md: "18px" }}
          textAlign={"center"}
          width={"100%"}
          maxWidth={"67ch"}
          margin={"0 auto"}
          fontWeight={400}
          color={"#F5F5F5"}
          mb={"36px"}
          fontFamily={"Manrope"}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          In its first year of deployment (under the ISSAM Project),
          TractracPlus has
        </MotionText>

        <Grid
          templateColumns={{ base: "1fr", md: "1.3fr 1fr" }}
          gap={"26px"}
          fontFamily={"Manrope"}
          width={"100%"}
          maxWidth="1123px"
          margin={"0 auto"}
          pr="20px"
          pl="20px"
        >
          <MotionGridItem
            borderLeft={"3px solid #FFE4C24D"}
            borderRadius={"5px"}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {points?.map((point, index) => (
              <MotionFlex
                key={point.id}
                gap={"48px"}
                alignItems={"center"}
                color={selectedId === point?.id ? "#312C2C" : "#F5F5F5"}
                bg={selectedId === point?.id ? "#F8F5F0" : "transparent"}
                fontFamily={"Manrope"}
                padding={"30px"}
                onClick={() => setSelectedId(point?.id)}
                cursor={"pointer"}
                borderRadius={"5px 5px 5px 0"}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              
              >
                <MotionBox
                  animate={{
                    scale: selectedId === point?.id ? 1.1 : 1,
                    rotate: selectedId === point?.id ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedId === point?.id
                    ? point?.iconDark
                    : point?.iconWhite}
                </MotionBox>
                <Box>
                  <Text fontSize={{ base: "16px", md: "18px" }} fontWeight={700}>
                    {point?.title}
                  </Text>
                  <Text fontSize={"14px"}>{point?.subtitle}</Text>
                </Box>
              </MotionFlex>
            ))}
          </MotionGridItem>

          <MotionGridItem
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="https://res.cloudinary.com/tractrac-global/image/upload/v1760219658/iPhone_16_-_104_nc0zt4.jpg"
                borderRadius={"60.43px 60.43px 0 0"}
                width={475}
                objectFit="cover"
                margin={"0 auto"}
              />
            </MotionBox>
          </MotionGridItem>
        </Grid>
      </Box>
    </ChakraWrapper>
  );
}