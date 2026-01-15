"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  HStack,
  List,
  ListItem,
  Badge,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaArrowLeft, FaClock, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Header from "../../components/header";
import FooterComponent from "../../components/footer";
import { ChakraWrapper } from "../../chakraUIWrapper";

type Job = {
  id: string;
  slug: string;
  title: string;
  type: string;
  level?: string;
  location: string;
  reportsTo?: string;
  applicationDeadlineLabel?: string;
  overview: string;
  responsibilities?: { title: string; items: string[] }[];
  qualifications?: string[];
  skills?: string[];
  whatWeOffer?: string[];
  applicationRequirements?: string[];
  apply: {
    email: string;
    subject: string;
    deadlineLabel?: string;
  };
};

export default function JobDetailsClient({ job }: { job: Job }) {
  const mailto = `mailto:${job.apply.email}?subject=${encodeURIComponent(job.apply.subject)}`;

  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />

        <Container maxW="1200px" py="40px">
          <Button
            as={Link}
            href="/careers"
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            mb="30px"
            color="#FA9411"
            _hover={{ bgColor: "#FA9411", color: "white" }}
          >
            Back to Careers
          </Button>

          <VStack align="start" spacing="20px" mb="40px">
            <HStack spacing="20px" flexWrap="wrap">
              <Text fontSize="32px" fontWeight={700} color="#2D3748">
                {job.title}
              </Text>
              <Badge colorScheme="orange" fontSize="14px" px="12px" py="6px">
                {job.type}
              </Badge>
            </HStack>

            <HStack spacing="30px" flexWrap="wrap">
              <HStack>
                <FaMapMarkerAlt color="#FA9411" />
                <Text color="#6b6f74">{job.location}</Text>
              </HStack>
              {job.reportsTo && (
                <Text color="#6b6f74">Reports to: {job.reportsTo}</Text>
              )}
              {(job.applicationDeadlineLabel || job.apply.deadlineLabel) && (
                <HStack>
                  <FaClock color="#FA9411" />
                  <Text color="#6b6f74">
                    Application deadline: {job.applicationDeadlineLabel ?? job.apply.deadlineLabel}
                  </Text>
                </HStack>
              )}
            </HStack>
          </VStack>

          <Divider mb="40px" />

          <Box mb="40px">
            <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
              Position Overview
            </Text>
            <Text fontSize="16px" lineHeight="1.6" color="#4A5568">
              {job.overview}
            </Text>
          </Box>

          {!!job.responsibilities?.length && (
            <Box mb="40px">
              <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
                Key Responsibilities
              </Text>

              <VStack align="start" spacing="30px">
                {job.responsibilities.map((group, idx) => (
                  <Box key={`${job.id}-resp-${idx}`}>
                    <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                      {idx + 1}. {group.title}
                    </Text>
                    <List spacing="8px" pl="20px">
                      {group.items.map((item, itemIdx) => (
                        <ListItem
                          key={`${job.id}-resp-${idx}-${itemIdx}`}
                          fontSize="15px"
                          lineHeight="1.5"
                          color="#4A5568"
                        >
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          {!!job.qualifications?.length && (
            <Box mb="40px">
              <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
                Qualifications & Experience
              </Text>
              <List spacing="8px" pl="20px">
                {job.qualifications.map((q, idx) => (
                  <ListItem key={`${job.id}-q-${idx}`} fontSize="15px" lineHeight="1.5" color="#4A5568">
                    {q}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {!!job.skills?.length && (
            <Box mb="40px">
              <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
                Key Skills & Competencies
              </Text>
              <List spacing="8px" pl="20px">
                {job.skills.map((s, idx) => (
                  <ListItem key={`${job.id}-s-${idx}`} fontSize="15px" lineHeight="1.5" color="#4A5568">
                    {s}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {!!job.whatWeOffer?.length && (
            <Box mb="40px">
              <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
                What We Offer
              </Text>
              <List spacing="8px" pl="20px">
                {job.whatWeOffer.map((w, idx) => (
                  <ListItem key={`${job.id}-w-${idx}`} fontSize="15px" lineHeight="1.5" color="#4A5568">
                    {w}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box mb="40px" p="30px" bgColor="#F8F8F0" borderRadius="12px">
            <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
              How to Apply
            </Text>
            <Text fontSize="16px" lineHeight="1.6" color="#4A5568" mb="20px">
              Please send your CV and a cover letter to{" "}
              <Text as="span" color="#FA9411" fontWeight={600}>
                {job.apply.email}
              </Text>{" "}
              with the subject line: "{job.apply.subject}".
            </Text>
            {!!job.applicationRequirements?.length && (
              <Box mb="20px">
                <Text fontSize="16px" fontWeight={600} color="#2D3748" mb="10px">
                  Application Requirements
                </Text>
                <List spacing="8px" pl="20px">
                  {job.applicationRequirements.map((req, idx) => (
                    <ListItem
                      key={`${job.id}-req-${idx}`}
                      fontSize="15px"
                      lineHeight="1.5"
                      color="#4A5568"
                    >
                      {req}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {(job.applicationDeadlineLabel || job.apply.deadlineLabel) && (
              <Text fontSize="16px" fontWeight={600} color="#2D3748">
                Application deadline: {job.applicationDeadlineLabel ?? job.apply.deadlineLabel}
              </Text>
            )}
          </Box>

          <Center>
            <Button
              as="a"
              href={mailto}
              size="lg"
              bgColor="#FA9411"
              color="white"
              _hover={{ bgColor: "#FA9411", opacity: ".85" }}
              fontSize="16px"
              px="40px"
              py="24px"
              leftIcon={<FaEnvelope />}
            >
              Apply Now
            </Button>
          </Center>
        </Container>

        <FooterComponent />
      </Box>
    </ChakraWrapper>
  );
}


