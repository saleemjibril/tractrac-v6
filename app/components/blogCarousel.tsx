"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Image, Text, useBreakpointValue, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon, ChevronRightIcon } from "@chakra-ui/icons";

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
  const visibleCount = useBreakpointValue({ base: 1, md: 3, lg: 4 }) || 1;
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
    <Box width="100%" maxWidth="1440px" mx="auto" px="20px" py="80px">
      <Text
            fontFamily={"cursive"}
            fontSize={{ base: "20px", md: "28px" }}
            color={"#FA9411"}
          >
            News
          </Text>
      <Flex align="center" justify="space-between" mb="16px">
        <Text fontWeight={800} fontSize={{ base: "22px", lg: "32px" }}>{heading}</Text>
        <Box as="a" href="/blog" color="#FA9411" fontWeight={600} fontSize={{ base: "14px", lg: "16px" }}>
          {/* Desktop: Show "View all" text */}
          <Text display={{ base: "none", md: "block" }}>View all</Text>
          {/* Mobile: Show arrow icon */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="View all blogs"
            icon={<ChevronRightIcon />}
            variant="ghost"
            color="#FA9411"
            size="lg"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            as="span"
          />
        </Box>
      </Flex>

      <Box position="relative" overflow="hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Navigation Buttons */}
        <IconButton
          aria-label="Previous"
          icon={<ArrowBackIcon color="#FA9411" />}
          position="absolute"
          top="50%"
          left="8px"
          transform="translateY(-50%)"
          zIndex={1}
          size="md"
          isDisabled={index <= 0}
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
          bg="white"
          _hover={{ bg: "white", boxShadow: "md" }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
          boxShadow="md"
        />
        <IconButton
          aria-label="Next"
          icon={<ArrowForwardIcon color="#FA9411" />}
          position="absolute"
          top="50%"
          right="8px"
          transform="translateY(-50%)"
          zIndex={1}
          size="md"
          isDisabled={index >= maxIndex}
          onClick={() => setIndex((prev) => Math.min(maxIndex, prev + 1))}
          bg="white"
          _hover={{ bg: "white", boxShadow: "md" }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
          boxShadow="md"
        />
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
              borderRadius="4px"
              border="2px"
              borderColor="#F5F6FA"
              backgroundColor="#fbfbfb"
              transition="transform 0.2s ease, box-shadow 0.2s ease"
              _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
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
                  noOfLines={2}
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
                  css={{ WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                  dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                >
                </Text>

                <Box color="#FA9411" as="span" fontSize="14px" fontWeight={600}>
                  Read story →
                </Box>
              </Box>
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


