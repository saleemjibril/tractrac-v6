"use client";

import {
  Box,
  Stack,
  Text,
  Image,
  Center,
  Skeleton,
  SkeletonText,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ChakraWrapper } from "@/app/chakraUIWrapper";
import Header from "@/app/components/header";
import FooterComponent from "@/app/components/footer";
import relatedBlogs from "../blog/related";

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
  author: {
    node: {
      name: string;
      avatar: {
        url: string;
      };
      description: string;
      url: string;
    };
  };
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  toc?: { id: string; content: string }[]; // Add optional TOC field
}

interface BlogPostDetailProps {
  post: Post;
}

export default async function BlogPostDetail({ post }: BlogPostDetailProps) {
  const formattedDate = new Date(post.modified).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const relatedPosts = relatedBlogs(post.id);

  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />
        <Box
          maxW={{ base: "100%", md: "75vw" }}
          mx="auto"
          mt="20px"
          mb="80px"
          px={{ base: "20px", md: "0px" }}
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={post.toc && post.toc.length > 0 ? "flex-start" : "center"} // Center content if TOC is empty
        >
          {/* Main Content */}
          <Box
            flex={{ base: "1", md: "0 0 70%" }} // 70% width on tablets
            width={{ base: "100%", md: "70%" }}
            pr={post.toc && post.toc.length > 0 ? { base: "0px", md: "100px" } : "0px"} // Set padding-right to 0 when TOC is empty
          >
            {!post ? (
              <>
                <Skeleton height="30px" />
                <Skeleton height="400px" mt="40px" />
                <Box p="12px">
                  <SkeletonText
                    my="12px"
                    noOfLines={8}
                    spacing="3"
                    skeletonHeight="24px"
                  />
                </Box>
              </>
            ) : (
              <>
                <Text
                  fontWeight={800}
                  fontSize={{ base: "20px", md: "24px", lg: "35px" }}
                  textAlign="left"
                  mt={{ base: "10px", md: "10px", lg: "50px" }} // Adjusted margin-top
                >
                  {post?.title}
                </Text>

                <Text
                  fontWeight={500}
                  fontSize={{ base: "20px", md: "24px", lg: "15px" }}
                  textAlign="left"
                  mt="10px"
                  mb="50px"
                  color="rgba(1, 27, 51, .5)"
                >
                  Updated on {formattedDate}
                </Text>

                <Box
                  mt={{ base: "20px", md: "50px" }}
                  fontSize={{ base: "14px", md: "16px" }}
                  lineHeight="30px"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></Box>

                {/* Author Details */}
                <Box
                  mt="40px"
                  px={{ base: "20px", md: "40px" }}
                  backgroundColor="#f6f9fc"
                  p="20px"
                  borderRadius="8px"
                >
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    align="flex-start"
                    spacing="20px"
                  >
                    <Image
                      src={post.author.node.avatar.url}
                      alt={`${post.author.node.name}'s avatar`}
                      borderRadius="full"
                      boxSize="100px"
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontSize="20px" fontWeight="bold" color="#213343">
                        {post.author.node.name}
                      </Text>
                      <Box
                        fontSize="16px"
                        color="#555"
                        mt="5px"
                        lineHeight="1.5"
                        dangerouslySetInnerHTML={{
                          __html: post.author.node.description.replace(
                            /\r\n/g,
                            "<br />"
                          ),
                        }}
                      />
                    </Box>
                  </Stack>
                </Box>
              </>
            )}
          </Box>

          {/* Table of Contents */}
          {post.toc && post.toc.length > 0 && (
            <Box
              flex={{ base: "0", md: "0 0 30%" }} // 30% width on tablets
              width={{ base: "100%", md: "30%" }}
              position="sticky"
              mt="70px"
              top="200px"
              alignSelf="flex-start"
              display={{ base: "none", lg: "block" }}
              backgroundColor="#f6f9fc"
              p="20px"
              borderRadius="8px"
            >
              <Text fontWeight="bold" fontSize="18px" mb="10px">
                In this Article
              </Text>
              {post.toc.map((item) => (
                <Flex
                  key={item.id}
                  align="center"
                  mb="10px"
                  cursor="pointer"
                  onClick={() => {
                    const element = document.getElementById(item.id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {/* Orange Circle */}
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="50%"
                    backgroundColor="#fa9411"
                    mr="10px"
                  ></Box>

                  {/* Underlined Content */}
                  <Text
                    fontSize="14px"
                    color="gray.600"
                    textDecoration="underline"
                    _hover={{ color: "#fa9411" }}
                  >
                    {item.content}
                  </Text>
                </Flex>
              ))}
            </Box>
          )}
        </Box>

        {/* Related Articles */}
        <Box
          maxW={{ base: "100%", md: "100vw" }}
          mx="auto"
          mt="20px"
          pb="100px"
          px={{ base: "20px", md: "0px" }}
          backgroundColor="#f6f9fc"
        >
          <Center mb={{ base: "0px", md: "20px" }}>
            <Stack
              mt={{ base: "20px", md: "60px" }}
              mb="20px"
              textAlign="center"
            >
              <Text
                fontSize="35px"
                color="#213343"
                display="block"
                fontWeight={700}
              >
                Related Articles
              </Text>
            </Stack>
          </Center>

          <Center>
            <Box
              pr="20px"
              pl="20px"
              width={"100%"}
              maxWidth={"1440px"}
              mx="auto"
              mt="20px"
              mb="80px"
            >
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }} // Adjust columns based on screen size
                spacingX={{ base: "0px", md: "30px" }} // No horizontal spacing on small screens
                spacingY="30px" // Vertical spacing remains consistent
              >
                {(await relatedPosts).map((blog, index) => (
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
                    backgroundColor="#fff"
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
                        alt={
                          blog.featuredImage.node.altText ||
                          `Blog image ${blog.id}`
                        }
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
                      >
                        {blog.excerpt.replace("<p>", "").replace("</p>", "")}
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
          </Center>
        </Box>

        <FooterComponent />
      </Box>
    </ChakraWrapper>
  );
}