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
  SimpleGrid
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ChakraWrapper } from "@/app/chakraUIWrapper";
import Header from "@/app/components/header";
import FooterComponent from "@/app/components/footer";
import relatedBlogs from "../blog/related";

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
  
  export default async function BlogPostDetail({ post }: BlogPostDetailProps) {
    // Format the date for display
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const relatedPosts = relatedBlogs(post.id);

    return (
      <ChakraWrapper>
      <Box position={"relative"}>
        <Header />
        {/* <Center mb={{ base: "0px", md: "20px" }}>
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
        </Center> */}

        <Box 
          maxW={{ base: "100%", md: "50vw" }}
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
                fontWeight={800}
                fontSize={{ base: "20px", md: "24px", lg: "35px" }}
                textAlign="left"
                mt="50px"
              >
                {post?.title}
              </Text>

              <Text 
                fontWeight={500}
                fontSize={{base: "20px", md: "24px", lg: "15px"}}
                textAlign="left"
                mt="10px"
                mb="50px"
                color="rgba(1, 27, 51, .5)"
              >
                Updated on {formattedDate}
              </Text>

              <Box h={{ base: "250px", md: "500px" }} mt="20px">
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

        

        <Box
          maxW={{ base: "100%", md: "100vw" }}
          mx="auto"
          mt="20px"
          // mb="80px"
          pb="100px"
          px={{ base: "20px", md: "0px" }}
          backgroundColor='#f6f9fc'
        >

          <Center mb={{ base: "0px", md: "20px" }}>
            <Stack mt={{ base: "20px", md: "60px" }} mb="20px" textAlign="center">
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

          {/* <Center> */}

          <Center>

            <Box 
              pr="20px"
              pl="20px"
              width={"75%"}
              maxWidth={"1440px"}
              mx="auto" mt="20px" mb="80px">

                <SimpleGrid
                  columns={{ base: 2, md: 3 }}
                  spacingX="30px"
                  spacingY="70px"
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
                    >
                      <Box h="250px">
                        <Image
                          borderTopRadius="4px"
                          src={blog.image}
                          alt={`Blog image ${blog.id}`}
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
                          // dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                        >
                          {(blog.excerpt).replace("<p>","")}
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



            
          {/* </Center> */}

        </Box>

        <FooterComponent />
      </Box>
    </ChakraWrapper>
    );
  }









//   <Box
//   maxW={{ base: "100vw", md: "70vw" }}
//   display="grid"
//   gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
//   gap="25px" // Space between the boxes
// >
//   {(await relatedPosts).map((item, index) => (
//     <Box
//       as="a"
//       href={`/blog/${item.slug}`}
//       key={index}
//       textAlign="center"
//       borderRadius="8px"
//       transition="transform 0.2s ease, box-shadow 0.2s ease"
//       _hover={{
//         transform: "scale(1.05)",
//         boxShadow: "lg",
//       }}
//       border="1px solid #e2e8f0"
//       bg="#fff"
//     >
//       {/* Image Wrapper */}
//       <Box
//         width="100%"
//         height="200px"
//         mx="auto"
//         overflow="hidden"
//         borderTopLeftRadius="4px"
//         borderTopRightRadius="4px"
//       >
//         <Image
//           src={item?.image}
//           alt="single blog image"
//           width="100%"
//           height="100%"
//           objectFit="cover"
//         />
//       </Box>

//       {/* Slog Text and Date Wrapper */}
//       <Box
//         mt="10px"
//         height="auto"
//         minHeight="250px"
//         pb="50px"
//         pt="10px"
//         px="20px"
//         display="flex"
//         flexDirection="column"
//         justifyContent="space-between"
//       >
//         {/* Slog Text */}
//         <Text
//           fontSize="18px"
//           color="#2e475d"
//           fontWeight="600"
//           textAlign="left"
//         >
//           {item?.title || "Fetching..."}
//         </Text>

//         {/* Date */}
//         <Text
//           fontSize="14px"
//           color="#2e475d"
//           textAlign="left"
//           >
//           {new Date(item?.date).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </Text>
//       </Box>
//     </Box>
//   ))}
// </Box>