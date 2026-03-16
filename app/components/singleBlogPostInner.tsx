"use client";

import {
  Box,
  Stack,
  Text,
  Center,
  Skeleton,
  SkeletonText,
  SimpleGrid,
  Flex
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ChakraWrapper } from "@/app/chakraUIWrapper";
import Header from "@/app/components/header";
import FooterComponent from "@/app/components/footer";
import relatedBlogs from "../blog/related";
import { useEffect, useState } from "react";

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

// Helper function to decode HTML entities
const decodeHtmlEntities = (text) => {
  if (typeof window === 'undefined') return text; // SSR safety
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// Helper function to clean and fix HTML content
const cleanHtmlContent = (content) => {
  if (!content) return '';

  return content
    // Fix common HTML entities
    .replace(/&#8217;/g, "'")
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Fix malformed id attributes that start with >
    .replace(/id=">[^"]*"/g, '')
    // Fix malformed data-content attributes
    .replace(/data-content="[^"]*"/g, 'data-content="true"')
    // Clean up any remaining malformed attributes
    .replace(/="[^"]*&#8221;[^"]*"/g, '=""')
    // Remove any remaining HTML entity artifacts
    .replace(/&#\d+;/g, (match) => {
      try {
        const num = parseInt(match.slice(2, -1));
        return String.fromCharCode(num);
      } catch {
        return match;
      }
    });
};

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [cleanedContent, setCleanedContent] = useState('');

  console.log("my blog post", post);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      const posts = await relatedBlogs(post?.slug);
      setRelatedPosts(posts);
    };

    fetchRelatedPosts();
  }, [post?.slug]);

  useEffect(() => {
    if (post?.content) {
      const cleaned = cleanHtmlContent(post?.content);
      setCleanedContent(cleaned);
    }
  }, [post?.content]);

  const formattedDate = new Date(post?.modified).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          justifyContent={post?.toc && post?.toc?.length > 0 ? "flex-start" : "center"} // Center content if TOC is empty
        >
          {/* Main Content */}
          <Box
            flex={{ base: "1", md: "0 0 70%" }} // 70% width on tablets
            width={{ base: "100%", md: "70%" }}
            pr={post?.toc && post?.toc?.length > 0 ? { base: "0px", md: "100px" } : "0px"} // Set padding-right to 0 when TOC is empty
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
                  {decodeHtmlEntities(post?.title)}
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
                  fontSize={{ base: "1.4rem", md: "1rem" }}
                  lineHeight="30px"
                  dangerouslySetInnerHTML={{ __html: cleanedContent }}
                  sx={{
                    // Additional CSS to ensure proper rendering and consistent text sizes
                    '& p': {
                      marginBottom: '1rem',
                      fontSize: '16px !important', // Override any inline font sizes
                      fontWeight: "400"
                    },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      marginTop: '1.5rem',
                      marginBottom: '1rem',
                      fontWeight: 'bold',
                    },
                    '& h2': {
                      fontSize: '1.5rem !important',
                    },
                    '& h3': {
                      fontSize: '1.25rem !important',
                    },
                    '& h4': {
                      fontSize: '1.125rem !important',
                    },
                    '& h5, & h6': {
                      fontSize: '1rem !important',
                    },
                    '& ul, & ol': {
                      marginLeft: '1.5rem',
                      marginBottom: '1rem',
                      fontSize: '1rem !important',
                    },
                    '& li': {
                      marginBottom: '0.5rem',
                      fontSize: '1rem !important',
                    },
                    '& a': {
  color: '#fa9411', // Your brand orange color
  textDecoration: 'underline',
  fontWeight: '500',
  transition: 'color 0.2s ease',
},
'& a:hover': {
  color: '#e8850f', // Darker shade for hover
  textDecoration: 'none',
},
'& a:visited': {
  color: '#d4780d', // Slightly different shade for visited links
},
                    '& strong, & b': {
                      fontWeight: 'bold',
                      fontSize: '20px !important', // Prevent strong tags from making text larger
                      // background: "yellow"
                    },
                    '& img': {
                      maxWidth: '100%',
                      height: 'auto',
                      marginBottom: "20px",
                      marginTop: "60px"
                    },
                    '& table': {
                      marginTop: "40px"
                    },
                    '& table, & .wp-block-table table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      marginBottom: '1rem',
                      fontSize: '16px !important',
                    },
                    '@media (max-width: 768px)': {
                      '& table, & .wp-block-table table': {
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginBottom: '1rem',
                        fontSize: '16px !important',
                        display: 'block',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                      },
                    },
                    '& th, & td': {
                      border: '1px solid #ddd',
                      padding: '8px',
                      textAlign: 'left',
                      fontSize: '16px !important', // Ensure table cells use inherited font size
                      fontWeight: 'normal',
                    },
                    '& th': {
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                    },
                    '& tbody th': {
                      fontWeight: 'bold',
                    },
                    // WordPress specific overrides
                    '& .wp-block-table': {
                      fontSize: '16px !important',
                    },
                    '& .wp-block-list': {
                      fontSize: '16px !important',
                    },
                    '& .has-small-font-size': {
                      fontSize: '0.875rem !important',
                    },
                    '& .has-medium-font-size': {
                      fontSize: '1rem !important',
                    },
                    '& .has-large-font-size': {
                      fontSize: '1.125rem !important',
                    },
                    // Override any potential inline styles
                    '& *': {
                      fontSize: '16px !important',
                    },
                    // But restore proper heading sizes
                    '& h1': {
                      fontSize: '2rem !important',
                    },
                    '& h2': {
                      fontSize: '1.5rem !important',
                    },
                    '& h3': {
                      fontSize: '1.25rem !important',
                    },
                    '& h4': {
                      fontSize: '1.125rem !important',
                    },
                    '& h5, & h6': {
                      fontSize: '1rem !important',
                    },
                  }}
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
                      src={post?.author?.node?.avatar?.url}
                      alt={`${post?.author?.node?.name}'s avatar`}
                      borderRadius="full"
                      boxSize="100px"
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontSize="20px" fontWeight="bold" color="#213343">
                        {post?.author?.node?.name}
                      </Text>
                      {!!post?.author?.node?.description && <Box
                        fontSize="16px"
                        color="#555"
                        mt="5px"
                        lineHeight="1.5"
                        dangerouslySetInnerHTML={{
                          __html: decodeHtmlEntities(
                            post?.author?.node?.description?.replace(/\r\n/g, "<br />")
                          ),
                        }}
                      />}
                    </Box>
                  </Stack>
                </Box>
              </>
            )}
          </Box>

          {/* Table of Contents */}
          {post?.toc && post?.toc?.length > 0 && (
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
              {post?.toc?.map((item) => (
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
                    {decodeHtmlEntities(item.content)}
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
                {relatedPosts.map((blog, index) => (
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
                        {decodeHtmlEntities(blog.title)}
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
                        {decodeHtmlEntities(
                          blog.excerpt?.replace("<p>", "").replace("</p>", "") || ""
                        )}
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