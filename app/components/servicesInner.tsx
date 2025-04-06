"use client";

import {
  Box,
  Stack,
  Flex,
  Text,
  Button,
  Divider,
  Center,
  Spacer,
  Show,
  Hide,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import Header from "./header";
import FooterComponent from "./footer";
import { ChakraWrapper } from "../chakraUIWrapper";
import { serviceItems } from "../services/items";

export default function ServicesInner() {

  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />
        <Center mb={{ base: "0px", md: "40px" }}>
          <Stack mt={{ base: "20px", md: "60px" }} textAlign="center">
            <Text
              fontSize="24px"
              fontFamily="cursive"
              color="#FA9411"
              display="block"
              fontWeight={600}
              //   mb="16px"
            >
              Our Services
            </Text>
            <Text
              fontWeight={600}
              lineHeight={{ base: "28px", md: "18px" }}
              fontSize={{ base: "24px", md: "32px" }}
            >
              Bridging the Gap to Mechanisation
            </Text>
          </Stack>
        </Center>

        <Box
          maxW={{ base: "100%", md: "80vw" }}
          margin={"0 auto"}
          //   px={{ base: "20px", md: "0px" }}
        >
          {serviceItems.map((item: any) => (
            <Box
              boxShadow="lg"
              py="38px"
              px={{ base: "20px", md: "70px" }}
              mb="50px"
              key={item.buttonText}
            >
              <Flex mb="20px" justifyContent="center">
                <Text
                  fontWeight={600}
                  fontSize={{ base: "20px", md: "24px", lg: "28px" }}
                  alignSelf='center'
                  // textAlign={{ base: "center", md: "left" }}
                >
                  {item.title}
                </Text>
                <Show above="sm">
                  <Spacer />
                  <Button
                    fontSize="14px"
                    bgColor="#FA9411"
                    color="white"
                    _hover={{
                      bgColor: "#FA9411",
                      opacity: ".8",
                    }}
                    as="a"
                    href={item.buttonLink}
                  >
                    <Box as="span" mr="30px">
                      {item.buttonText}
                    </Box>
                    <AddIcon boxSize="12px" />
                  </Button>
                </Show>
              </Flex>
              <Divider mb="20px" />
              <Box
                color="#858A8F"
                lineHeight="30px"
                textAlign={{ base: "center", md: "left" }}
                fontSize={{base: "14px", md: "16px"}}
                fontWeight={500}
              >
                {item.content}
              </Box>
              <Hide above="sm">
                <Flex justifyContent="center">
                  <Button
                    // alignSelf="center"
                    mt="20px"
                    fontSize="14px"
                    bgColor="#FA9411"
                    color="white"
                    _hover={{
                      bgColor: "#FA9411",
                      opacity: ".8",
                    }}
                    as="a"
                    href={item.buttonLink}
                  >
                    <Box as="span" mr="30px">
                      {item.buttonText}
                    </Box>
                    <AddIcon boxSize="12px" />
                  </Button>
                </Flex>
              </Hide>
            </Box>
          ))}
        </Box>

        <FooterComponent />

      
      </Box>
      </ChakraWrapper>
  );
}


