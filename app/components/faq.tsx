
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
    // NavItem,
  } from "@chakra-ui/react";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function FaqComponent() {
  return (
    <ChakraWrapper>
    <Flex 
    flexWrap={{ base: "wrap", lg: "nowrap" }}
    width={"100%"}
        maxWidth="1400px"
        margin={"0 auto"}
    >
      <Image
        src="images/faq.jpg"
        alt=""
        display={{ base: "none", md: "block" }}
      />
      <Stack
        bgColor="#F8F8F0"
        py="80px"
        pl="53px"
        pr={{ base: "53px", md: "140px" }}
        // px={{ base: "16px", md: "200px" }}
        width="100%"
      >
        <Text fontSize="28px" fontFamily="cursive" color="#FA9411">
          FAQ
        </Text>
        <Text fontSize="28px" fontWeight={700}>
          Please Do you have any question
        </Text>
        <Text>
          Get answers to common questions about our services. Contact us for
          further assistance.
        </Text>

        <Accordion defaultIndex={[0]} mt="20px">
          <AccordionItem border="0px" mb="20px">
            <h2>
              <AccordionButton
                bg="#FA9411"
                _expanded={{ bg: "#FA9411", color: "white" }}
                _focus={{ bg: "#FA9411", color: "white" }}
                borderRadius={"10px"}
                border="0px"
                py="16px"
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

          <AccordionItem border="0px" mb="20px">
            <h2>
              <AccordionButton
                bg="#FA9411"
                _expanded={{ bg: "#FA9411", color: "white" }}
                _focus={{ bg: "#FA9411", color: "white" }}
                borderRadius={"10px"}
                py="16px"
                border="0px"
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

          <AccordionItem border="0px" mb="0px">
            <h2>
              <AccordionButton
                bg="#FA9411"
                _expanded={{ bg: "#FA9411", color: "white" }}
                _focus={{ bg: "#FA9411", color: "white" }}
                borderRadius={"10px"}
                py="16px"
                border="0px"
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
    </ChakraWrapper>
  );
}
