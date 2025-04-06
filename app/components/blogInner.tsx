"use client";

import { Box, Stack, Text, Image, Center, SimpleGrid } from "@chakra-ui/react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import Header from "./header";
import FooterComponent from "./footer";
import { ChakraWrapper } from "../chakraUIWrapper";
import { blogItems } from "../blog/items";

export default function BlogInner() {
  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />
        <Center mb={{ base: "0px", md: "20px" }}>
          <Stack mt={{ base: "20px", md: "60px" }} textAlign="center">
            <Text
              fontSize="24px"
              fontFamily="cursive"
              color="#FA9411"
              display="block"
              fontWeight={600}
            >
              Blog
            </Text>
          </Stack>
        </Center>

        <Box maxW={{ base: "100%", md: "80vw" }} mx="auto" mt="20px" mb="80px">
          <SimpleGrid
            columns={{ base: 2, md: 3 }}
            spacingX="28px"
            spacingY="20px"
          >
            {blogItems.map((blog) => (
              <Box
                key={blog.id}
                as="a"
                href={`/blog/${blog.id}`}
                display="block"
                boxShadow="sm"
                borderRadius="4px"
                cursor="pointer"
                border="2px"
                borderColor="#F5F6FA"
              >
                <Box h="200px">
                  <Image
                    borderTopRadius="4px"
                    src={blog.image}
                    alt={`Blog image ${blog.id}`}
                    height="100%"
                    width="100%"
                    objectFit="cover"
                  />
                </Box>

                <Box p="12px" bgColor="white">
                  <Text
                    fontSize="16px"
                    color="#333333"
                    fontWeight={500}
                    lineHeight="20px"
                  >
                    {blog.title}
                  </Text>
                  <Text
                    fontSize="12px"
                    color="#858A8F"
                    fontWeight={500}
                    my="12px"
                    lineHeight="16.1px"
                  >
                    {blog.excerpt}
                  </Text>

                  <Box
                    color="#FA9411"
                    as="span"
                    fontSize="14px"
                    fontWeight={600}
                  >
                    Read story <ArrowForwardIcon ml="10px" />
                  </Box>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <FooterComponent />
      </Box>
    </ChakraWrapper>
  );
}
