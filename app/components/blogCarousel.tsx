"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";

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

interface BlogCarouselProps {
  posts: Post[];
  heading?: string;
}

export default function BlogCarousel({ posts, heading = "Latest insights" }: BlogCarouselProps) {
  const visibleCount = useBreakpointValue({ base: 1, md: 2, lg: 2 }) || 1;
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, posts.length - visibleCount);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const gapPx = useBreakpointValue({ base: 14, md: 18, lg: 22 }) || 0;
  const slideWidthCss = useMemo(() => {
    const count = Math.max(1, visibleCount);
    return `calc((100% - ${gapPx}px * (${count - 1})) / ${count})`;
  }, [visibleCount, gapPx]);
  const translateCss = useMemo(() => {
    // shift by one card width plus gap for each index
    return `translateX(calc(-${index} * (${slideWidthCss} + ${gapPx}px)))`;
  }, [index, slideWidthCss, gapPx]);
  const totalPages = Math.max(1, posts.length - visibleCount + 1);

  useEffect(() => {
    if (isHovered || totalPages <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, maxIndex, totalPages]);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <Box width="100%" maxWidth="1440px" mx="auto" px="20px" my="40px">
      <Flex align="center" justify="space-between" mb="16px">
        <Text fontWeight={800} fontSize={{ base: "22px", lg: "32px" }}>{heading}</Text>
        <Box as="a" href="/blog" color="#FA9411" fontWeight={600} fontSize={{ base: "14px", lg: "16px" }}>
          View all
        </Box>
      </Flex>

      <Box position="relative" overflow="hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Flex
          ref={trackRef}
          transition="transform 0.35s ease"
          style={{ transform: translateCss }}
          gap={`${gapPx}px`}
        >
          {posts.map((blog) => (
            <Box
              key={blog.id}
              as="a"
              href={`/blog/${blog.slug}`}
              minW={slideWidthCss}
              maxW={slideWidthCss}
              flexShrink={0}
              borderRadius="6px"
              border="1px"
              borderColor="#F0F2F5"
              backgroundColor="#fbfbfb"
              _hover={{ boxShadow: "md" }}
            >
              <Flex direction={{ base: "column", md: "row" }} p="12px" gap={{ base: "10px", md: "16px" }} align="stretch">
                <Box w={{ base: "100%", md: "40%" }}>
                  <Box h={{ base: "180px", md: "160px" }}>
                    <Image
                      borderRadius="6px"
                      src={blog.featuredImage.node.sourceUrl}
                      alt={blog.featuredImage.node.altText || `Blog image ${blog.id}`}
                      height="100%"
                      width="100%"
                      objectFit="cover"
                    />
                  </Box>
                  <Text mt="10px" fontSize="16px" color="#333333" fontWeight={700} noOfLines={2}>
                    {blog.title}
                  </Text>
                </Box>
                <Box flex="1" display="flex" flexDirection="column">
                  <Text
                    fontSize="12px"
                    color="#858A8F"
                    fontWeight={500}
                    lineHeight="18px"
                    dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                  />
                  <Text mt="10px" color="#FA9411" fontSize="14px" fontWeight={600}>
                    Read story →
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Flex>

        <Flex justify="center" align="center" mt="12px" gap="8px">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Box
              key={i}
              as="button"
              onClick={() => setIndex(i)}
              w="8px"
              h="8px"
              borderRadius="full"
              bg={i === index ? "#FA9411" : "#D9DDE2"}
              transition="background-color 0.2s ease"
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
}


