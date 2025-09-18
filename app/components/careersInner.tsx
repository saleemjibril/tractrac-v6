"use client";

import {
  Box,
  Stack,
  Flex,
  Text,
  Button,
  Divider,
  Center,
  SimpleGrid,
  Tag,
  TagLabel,
  List,
  ListItem,
  ListIcon,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Header from "./header";
import FooterComponent from "./footer";
import { ChakraWrapper } from "../chakraUIWrapper";
import Image from "next/image";
import Link from "next/link";
import { FaGlobe, FaChartLine, FaHeart, FaRocket, FaMapMarkerAlt } from "react-icons/fa";
import BlogCarousel from "./blogCarousel";

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

type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  summary: string;
  link: string;
};

const jobs: Job[] = [
  {
    id: "1",
    title: "MERL Manager (Monitoring, Evaluation, Research & Learning)",
    location: "Onsite, Abuja",
    type: "Full-time",
    summary:
      "Lead the design, implementation, and oversight of Monitoring, Evaluation, Research, and Learning for our programs.",
    link: "/careers/merl-manager",
  },
];

export default function CareersInner() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = `
          query AllPosts {
            posts(first: 12) {
              nodes {
                id
                title
                excerpt
                slug
                date
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        `;

        const response = await fetch('https://msps.tractrac.co/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: postsQuery }),
        });

        const data = await response.json();
        if (data.data?.posts?.nodes) {
          setPosts(data.data.posts.nodes);
        }
      } catch (error) {
        console.log("Error fetching posts for carousel:", error);
      }
    };

    fetchPosts();
  }, []);

  const galleryImages = [
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758188891/Gallery_Photo_2_p5h99p.jpg",
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758189025/Gallery_Photo_zpsnzj.jpg",
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758188949/Gallery_Photo_3_ken4fm.jpg",
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758189029/Gallery_Photo_8_gobhks.jpg",
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758188936/Gallery_Photo_1_cfqveu.jpg",
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758188939/Gallery_Photo_5_ib1bie.jpg",
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758188984/Gallery_Photo_7_zdjzdu.jpg",
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758188983/Gallery_Photo_6_wim0on.jpg",
    "https://res.cloudinary.com/tractrac-global/image/upload/v1758188929/Gallery_Photo_4_viuy7q.jpg",
  ];
  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />

        {/* Block 1: Banner Section */}
        
        <Box position="relative" margin={"0 auto"} width={"100%"} height={"600px"} bgColor={"#F8F8F0"}>

          <Image
            src="https://res.cloudinary.com/tractrac-global/image/upload/v1758233550/Main_Banner_Photo_1_iyyc93.png"
            alt="Careers banner"
            objectFit="cover"
            layout="fill"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0,0,0,0.4)"
            display="flex"
            alignItems="start"
            justifyContent="center"
            pt={"120px"}
          >
            <Stack textAlign="center" color="white" maxW="800px" px="20px">
            <Text
                fontSize={{ base: "28px", md: "48px" }}
              fontFamily="cursive"
              color="#FA9411"
              fontWeight={600}
                mb="20px"
            >
              Join the Humans of TracTra
            </Text>
            
              
          </Stack>
          </Box>
        </Box>



        <Box
          pr="20px"
          pl="20px"
          width={"100%"}
          maxWidth={"1440px"}
          margin={"0 auto"}
        >

          <Box  gap="20px" display={"grid"} gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }} py={"40px"} maxW="1200px" margin={"0 auto"}>
          <Text
              fontWeight={600}
                fontSize={{ base: "20px", md: "32px" }}
                mb="16px"
                color="#FA9411"
              >
                All of us at TracTrac are on the same mission:
              </Text>

              <Box>
              <Text
                fontWeight={500}
                fontSize={{ base: "18px", md: "22px" }}
                mb="24px"
              >
                to make mechanization accessible to smallholder farmers in Nigeria and Sub-Saharan Africa.
              </Text>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                mb="16px"
                lineHeight="1.6"
              >
                Currently, our work spans across Nigeria and we have offices in the FCT Abuja, and Nasarawa State. The people are at the heart of this transforming work we do to improve productivity for farmers and secure Nigeria's food security.
              </Text>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                mb="24px"
                fontWeight={600}
              >
                Ready to do work you care about with people who care?
            </Text>

            <Button
                as={Link}
                href="#open-positions"
                size="lg"
                bgColor="#FA9411"
                color="white"
                _hover={{ bgColor: "#FA9411", opacity: ".85" }}
                fontSize="16px"
                px="32px"
                py="24px"
              >
                See open roles
              </Button>
              </Box>
          </Box>
          {/* Block 2: Why Join Us */}
          <Box py="60px">
            <Text
              fontWeight={600}
              fontSize={{ base: "24px", md: "32px" }}
              mb="40px"
              textAlign="center"
              fontFamily={"cursive"}
            color={"#FA9411"}
            >
              Why Join the Humans of TracTrac?
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing="30px">
              <VStack 
                align="start" 
                spacing="20px" 
                p="30px"
                bg="white"
                borderRadius="16px"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                border="1px solid #F0F0F0"
                _hover={{ 
                  boxShadow: "0 8px 30px rgba(250, 148, 17, 0.15)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease"
                }}
                transition="all 0.3s ease"
              >
                <HStack>
                  <Box
                    p="12px"
                    bg="#FA9411"
                    borderRadius="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaGlobe} color="white" boxSize="20px" />
                  </Box>
                  <Text fontWeight={600} fontSize="20px" color="#2D3748">Mission & Impact</Text>
                </HStack>
                <List spacing="12px">
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Be part of food security solutions: Contribute to transforming smallholder farming across Africa through technology and mechanization.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Inclusive innovation: Work on projects that empower women, youths, persons with disabilities and internally displaced persons in agriculture.
                  </ListItem>
                </List>
              </VStack>

              <VStack 
                align="start" 
                spacing="20px" 
                p="30px"
                bg="white"
                borderRadius="16px"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                border="1px solid #F0F0F0"
                _hover={{ 
                  boxShadow: "0 8px 30px rgba(250, 148, 17, 0.15)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease"
                }}
                transition="all 0.3s ease"
              >
                <HStack>
                  <Box
                    p="12px"
                    bg="#FA9411"
                    borderRadius="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaChartLine} color="white" boxSize="20px" />
                  </Box>
                  <Text fontWeight={600} fontSize="20px" color="#2D3748">Growth & Learning</Text>
                </HStack>
                <List spacing="12px">
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Continuous training: Access to workshops, certifications, and learning resources in agri-tech, digital tools, and leadership.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Career advancement: Clear growth paths and mentorship from industry experts.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Exposure to global development partners
                  </ListItem>
                </List>
              </VStack>

              <VStack 
                align="start" 
                spacing="20px" 
                p="30px"
                bg="white"
                borderRadius="16px"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                border="1px solid #F0F0F0"
                _hover={{ 
                  boxShadow: "0 8px 30px rgba(250, 148, 17, 0.15)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease"
                }}
                transition="all 0.3s ease"
              >
                <HStack>
                  <Box
                    p="12px"
                    bg="#FA9411"
                    borderRadius="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaHeart} color="white" boxSize="20px" />
                  </Box>
                  <Text fontWeight={600} fontSize="20px" color="#2D3748">Wellbeing & Perks</Text>
                </HStack>
                <List spacing="12px">
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Health coverage: Comprehensive medical benefits for you and your family.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Paid time off: Generous leave to recharge or spend time with loved ones.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Competitive Salary
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Pension contributions in line with statutory requirements.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Group Life Insurance for staff welfare and security.
                  </ListItem>
                </List>
              </VStack>

              <VStack 
                align="start" 
                spacing="20px" 
                p="30px"
                bg="white"
                borderRadius="16px"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                border="1px solid #F0F0F0"
                _hover={{ 
                  boxShadow: "0 8px 30px rgba(250, 148, 17, 0.15)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease"
                }}
                transition="all 0.3s ease"
              >
                <HStack>
                  <Box
                    p="12px"
                    bg="#FA9411"
                    borderRadius="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaRocket} color="white" boxSize="20px" />
                  </Box>
                  <Text fontWeight={600} fontSize="20px" color="#2D3748">Beyond Work</Text>
                </HStack>
                <List spacing="12px">
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Purpose-driven brand: Your daily work directly contributes to transforming livelihoods.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Networking opportunities: Connect with leaders in agriculture, technology, and development.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.6" color="#4A5568">
                    Employee recognition: Celebrating innovation, commitment, and excellence at every level.
                  </ListItem>
                </List>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* Block 3: Where are we located */}
          <Box py="60px" bgColor="#F8F8F0" borderRadius="12px" mb="60px">
            <Text
              fontFamily={"cursive"}
              fontSize={{ base: "24px", md: "32px" }}
              color={"#FA9411"}
              textAlign="center"
              fontWeight={600}
              mb="40px"
            >
              Where are we located?
            </Text>
            <Text
              fontSize="18px"
              textAlign="center"
            mb="40px"
              color="#6b6f74"
            >
              Along with our two offices, we have team members spread throughout the country!
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="30px" maxW="1200px" mx="auto">
              <Box>
                <Text fontWeight={600} mb="16px" textAlign="center">FCT Abuja Office</Text>
                <Box height="600px" bgColor="white" borderRadius="8px" overflow="hidden">
                  <Image
                    src="https://res.cloudinary.com/tractrac-global/image/upload/v1758191983/Abuja_Location_oufheu.jpg"
                    alt="Abuja Office"
                    width={600}
                    height={600}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
              </Box>
              <Box>
                <Text fontWeight={600} mb="16px" textAlign="center">Nasarawa State Office</Text>
                <Box height="600px" bgColor="white" borderRadius="8px" overflow="hidden">
                  <Image
                    src="https://res.cloudinary.com/tractrac-global/image/upload/v1758191985/Nasarawa_Location_vkkcyy_mspgod.jpg"
                    alt="Nasarawa Office"
                    width={600}
                    height={600}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Block 4: Open Positions */}
          <Box id="open-positions" py="60px">
          <Text
            fontWeight={600}
              fontSize={{ base: "24px", md: "32px" }}
              mb="40px"
              textAlign="center"
              fontFamily={"cursive"}
            color={"#FA9411"}
            >
              Open Positions
          </Text>
            <Divider mb="40px" />

            <SimpleGrid columns={{ base: 1, md: 1 }} spacing="30px" maxW="800px" mx="auto">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </SimpleGrid>
          </Box>

          {/* Block 5: Life at TracTrac */}
          <Box py="60px" bgColor="#F8F8F0" borderRadius="12px" mb="60px">
            <Text
              fontWeight={600}
              fontSize={{ base: "24px", md: "32px" }}
              mb="40px"
              textAlign="center"
              fontFamily={"cursive"}
            color={"#FA9411"}
            >
              Life at TracTrac
            </Text>
            <Flex 
              direction={{ base: "column", md: "row" }} 
              gap="20px" 
              maxW="1200px" 
              mx="auto"
              wrap="wrap"
              justify={{ base: "center", md: "center" }}
              align={{ base: "center", md: "flex-start" }}
            >
              {galleryImages.map((src, idx) => {
                // Create different sizes for visual variety
                const sizes = [
                  { w: "300px", h: "250px" }, // Large
                  { w: "200px", h: "200px" }, // Medium
                  { w: "250px", h: "180px" }, // Medium-wide
                  { w: "180px", h: "220px" }, // Medium-tall
                  { w: "300px", h: "200px" }, // Large-wide
                  { w: "200px", h: "250px" }, // Medium-tall
                  { w: "250px", h: "200px" }, // Medium
                  { w: "180px", h: "180px" }, // Small
                  { w: "220px", h: "240px" }, // Medium-tall
                ];
                
                const size = sizes[idx % sizes.length];
                
                return (
                  <Box 
                    key={src} 
                    width={size.w}
                    height={size.h}
                    bgColor="white" 
                    borderRadius="12px" 
                    overflow="hidden"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "scale(1.02)",
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
                    }}
                    cursor="pointer"
                  >
                    <Image
                      src={src}
                      alt={`Life at TracTrac ${idx + 1}`}
                      width={300}
                      height={250}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </Box>
                );
              })}
            </Flex>
          </Box>

          {/* Block 6: Blog Preview */}
          <Box py="60px">
            <Text
              fontWeight={600}
              fontSize={{ base: "24px", md: "32px" }}
              mb="40px"
              textAlign="center"
            >
              Learn more about us in our blog posts
            </Text>
            <Box
              boxShadow="lg"
              py="28px"
              px={{ base: "20px", md: "40px" }}
              borderRadius="12px"
              position={"relative"}
            >
              
              {posts.length > 0 && (
                <BlogCarousel posts={posts} heading="Insights on Agricultural Mechanization" />
              )}
            </Box>
          </Box>
        </Box>

        <FooterComponent />
      </Box>
    </ChakraWrapper>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Box boxShadow="lg" p={{ base: "20px", md: "28px" }} borderRadius="12px">
      <Flex mb="12px" alignItems="center" gap="10px" flexWrap="wrap">
        <Text fontWeight={700} fontSize={{ base: "18px", md: "20px" }}>
          {job.title}
        </Text>
        <Tag size="sm" colorScheme="orange" borderRadius="full">
          <TagLabel>{job.type}</TagLabel>
        </Tag>
      </Flex>
      <Text color="#858A8F" fontSize={{ base: "14px", md: "16px" }} mb="10px">
        {job.location}
      </Text>
      <Text color="#6b6f74" fontSize={{ base: "14px", md: "15px" }} mb="16px">
        {job.summary}
      </Text>
      <Button
        as={Link}
        href={job.link}
        fontSize="14px"
        bgColor="#FA9411"
        color="white"
        _hover={{ bgColor: "#FA9411", opacity: ".85" }}
      >
        View Details
      </Button>
    </Box>
  );
}


