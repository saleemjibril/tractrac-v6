"use client";

import { Box, Stack, Text, Image, Center, SimpleGrid } from "@chakra-ui/react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import Header from "./header";
import FooterComponent from "./footer";
import { ChakraWrapper } from "../chakraUIWrapper";

// components/blogInner.tsx
interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface BlogInnerProps {
  posts: Post[];
}

export default function BlogInner({ posts }: BlogInnerProps) {
  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />

        <Box
          pr="20px"
          pl="20px"
          width={"100%"}
          maxWidth={"1440px"}
          mx="auto"
          mt="20px"
          mb="80px"
        >
          <Text
            fontWeight={800}
            fontSize={{ base: "20px", md: "24px", lg: "39px" }}
            textAlign="left"
            mt="40px"
            mb="40px"
          >
            Insights on Agricultural Mechanization ...
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }} // Adjust columns based on screen size
            spacingX={{ base: "0px", md: "30px" }} // No horizontal spacing on small screens
            spacingY="30px" // Vertical spacing remains consistent
          >
            {posts.map((blog) => (
              <Box
                key={blog.id}
                as="a"
                href={`/blog/${blog.slug}`}
                display="block"
                boxShadow="sm"
                borderRadius="4px"
                cursor="pointer"
                border="2px"
                borderColor="#F5F6FA"
                backgroundColor="#fbfbfb"
                transition="transform 0.2s ease, box-shadow 0.2s ease"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "lg",
                }}
                width={{ base: "100%", md: "auto" }} // Full width on small screens
              >
                <Box h="250px">
                  <Image
                    borderTopRadius="4px"
                    src={blog.featuredImage.node.sourceUrl}
                    alt={blog.featuredImage.node.altText || `Blog image ${blog.id}`}
                    height="100%"
                    width="100%"
                    objectFit="cover"
                  />
                </Box>

                <Box p="12px" bgColor="transparent" mt="10px">
                  <Text
                    fontSize="18px"
                    color="#333333"
                    fontWeight={800}
                    lineHeight="25px"
                  >
                    {blog.title}
                  </Text>

                  <Text
                    fontSize="12px"
                    color="#858A8F"
                    fontWeight={500}
                    my="12px"
                    lineHeight="15px"
                    noOfLines={2}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    display="-webkit-box"
                    css={{
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                  >
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