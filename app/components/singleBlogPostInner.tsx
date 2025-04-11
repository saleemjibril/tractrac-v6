"use client";

import {
  Box,
  Stack,
  Text,
  Image,
  Center,
  useDisclosure,
  FlexProps,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { ChakraWrapper } from "@/app/chakraUIWrapper";
import Header from "@/app/components/header";
import FooterComponent from "@/app/components/footer";

// components/blogPostDetail.tsx
interface Post {
    id: string;
    title: string;
    content: string;
    slug: string;
    date: string;
    image?: string;
    imageAlt?: string;
  }
  
  interface BlogPostDetailProps {
    post: Post;
  }
  
  export default function BlogPostDetail({ post }: BlogPostDetailProps) {
    // Format the date for display
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
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

        <Box
          maxW={{ base: "100%", md: "80vw" }}
          mx="auto"
          mt="20px"
          mb="80px"
          px={{ base: "20px", md: "0px" }}
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
                fontWeight={600}
                fontSize={{ base: "20px", md: "24px", lg: "30px" }}
                textAlign="center"
              >
                {post?.title}
              </Text>

              <Box h={{ base: "250px", md: "500px" }} mt="50px">
                <Image
                  borderRadius="4px"
                  src={post?.image}
                  alt="single blog image"
                  height="100%"
                  width="100%"
                  objectFit="cover"
                />
              </Box>
              <Box
                mt={{ base: "20px", md: "50px" }}
                fontSize={{ base: "14px", md: "16px" }}
                lineHeight="30px"
                dangerouslySetInnerHTML={{ __html: post.content }}
              >
                
              </Box>
            </>
          )}
        </Box>

        <FooterComponent />
      </Box>
    </ChakraWrapper>
    );
  }