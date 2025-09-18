"use client";

import {
  Box,
  Stack,
  Flex,
  Text,
  Button,
  Divider,
  Center,
  VStack,
  HStack,
  List,
  ListItem,
  Badge,
  Container,
} from "@chakra-ui/react";
import Header from "../../components/header";
import FooterComponent from "../../components/footer";
import { ChakraWrapper } from "../../chakraUIWrapper";
import Link from "next/link";
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaEnvelope } from "react-icons/fa";

export default function MERLManagerPage() {
  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />

        <Container maxW="1200px" py="40px">
          {/* Back Button */}
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

          {/* Job Header */}
          <VStack align="start" spacing="20px" mb="40px">
            <HStack spacing="20px" flexWrap="wrap">
              <Text fontSize="32px" fontWeight={700} color="#2D3748">
                MERL Manager (Monitoring, Evaluation, Research & Learning)
              </Text>
              <Badge colorScheme="orange" fontSize="14px" px="12px" py="6px">
                Full-time
              </Badge>
            </HStack>
            
            <HStack spacing="30px" flexWrap="wrap">
              <HStack>
                <FaMapMarkerAlt color="#FA9411" />
                <Text color="#6b6f74">Onsite, Abuja</Text>
              </HStack>
              <HStack>
                <FaClock color="#FA9411" />
                <Text color="#6b6f74">Application deadline: September 30th 2025</Text>
              </HStack>
            </HStack>
          </VStack>

          <Divider mb="40px" />

          {/* Position Overview */}
          <Box mb="40px">
            <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
              Position Overview
            </Text>
            <Text fontSize="16px" lineHeight="1.6" color="#4A5568">
              We are seeking a dynamic and skilled MERL Manager to lead the design, implementation, and oversight of Monitoring, Evaluation, Research, and Learning (MERL) for our programs. You will be instrumental in ensuring data driven decision-making, program accountability, and serve as the single source of verified and up-to-date program data for internal decision-making and external communication with stakeholders.continuous learning across TracTrac MSL's impactful interventions.
            </Text>
          </Box>

          {/* Key Responsibilities */}
          <Box mb="40px">
            <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
              Key Responsibilities
            </Text>
            
            <VStack align="start" spacing="30px">
              <Box>
                <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                  1. Monitoring and Evaluation (M&E)
                </Text>
                <List spacing="8px" pl="20px">
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Design and implement M&E frameworks for projects, ensuring alignment with organizational goals and objectives.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Develop and maintain data collection tools, systems, and databases. (GIS & MIS)
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Monitor project activities, collect data, and analyze results to assess progress and performance against targets.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Conduct regular field visits to gather data and provide on-the-ground support to project teams.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Prepare high-quality M&E reports for internal and external stakeholders.
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                  2. Research
                </Text>
                <List spacing="8px" pl="20px">
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Conduct research studies, including baseline and endline surveys, impact assessments, and market research.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Analyze and interpret research findings to inform program design and decision-making.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Stay up-to-date with industry trends and best practices in MERL and incorporate relevant innovations into our programs.
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                  3. Learning and Capacity Building
                </Text>
                <List spacing="8px" pl="20px">
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Facilitate regular learning sessions and knowledge-sharing events within the organization.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Collaborate with project teams to identify areas for improvement and adapt program strategies accordingly.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Provide training and capacity-building support to staff and partners on MERL best practices.
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                  4. Data Management
                </Text>
                <List spacing="8px" pl="20px">
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Ensure the accuracy, completeness, and security of project data.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Develop and manage data storage and archiving systems.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Support data quality assurance efforts, including data cleaning and validation.
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                  5. Partnerships & Stakeholder Engagement
                </Text>
                <List spacing="8px" pl="20px">
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Collaborate with partners, including government agencies and policy bodies, to align M&E activities.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Support consortium partners in adopting strong M&E systems.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Engage stakeholders in knowledge-sharing and evidence-based dialogue.
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                  6. Capacity Building & Team Leadership
                </Text>
                <List spacing="8px" pl="20px">
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Lead and mentor MERL officers, field staff, and enumerators.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Deliver training on M&E frameworks, tools, and methodologies.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Cultivate a culture of evidence-based decision-making and learning.
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                  7. General Technical Support
                </Text>
                <List spacing="8px" pl="20px">
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Assist the Team Leader with coordination, quality assurance, and stakeholder management.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Oversee technical aspects and deliverables of the MERL components of projects.
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Text fontSize="18px" fontWeight={600} mb="12px" color="#2D3748">
                  8. Reporting and Communication
                </Text>
                <List spacing="8px" pl="20px">
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Prepare and present MERL findings to internal and external stakeholders.
                  </ListItem>
                  <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                    Contribute to the development of communication materials, case studies, and success stories.
                  </ListItem>
                </List>
              </Box>
            </VStack>
          </Box>

          {/* Qualifications & Experience */}
          <Box mb="40px">
            <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
              Qualifications & Experience
            </Text>
            <List spacing="8px" pl="20px">
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Master's degree in a relevant field (e.g., social sciences, international development, statistics, or a related discipline). An advanced degree is an added advantage.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Proven experience in monitoring, evaluation, research, and learning in the development or humanitarian sector.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Strong data analysis skills and proficiency in data analysis software (e.g., Excel, SPSS, STATA, or R).
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Excellent written and verbal communication skills.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Experience with quantitative and qualitative data collection methods.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Strong project management skills and attention to detail.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Ability to work independently and as part of a team.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Knowledge of relevant industry standards and best practices in MERL.
              </ListItem>
            </List>
          </Box>

          {/* What We Offer */}
          <Box mb="40px">
            <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
              What We Offer
            </Text>
            <List spacing="8px" pl="20px">
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Competitive salary and benefits package.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Health Maintenance Organization (HMO) coverage for medical needs.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Pension contributions in line with statutory requirements.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Group Life Insurance for staff welfare and security.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                Opportunities for professional growth in a values-driven and innovative workplace.
              </ListItem>
              <ListItem fontSize="15px" lineHeight="1.5" color="#4A5568">
                A chance to contribute to agricultural transformation and food security in Nigeria.
              </ListItem>
            </List>
          </Box>

          {/* How to Apply */}
          <Box mb="40px" p="30px" bgColor="#F8F8F0" borderRadius="12px">
            <Text fontSize="24px" fontWeight={600} mb="20px" color="#2D3748">
              How to Apply
            </Text>
            <Text fontSize="16px" lineHeight="1.6" color="#4A5568" mb="20px">
              Please send your CV and a cover letter to{" "}
              <Text as="span" color="#FA9411" fontWeight={600}>
                jobs@tractrac.co
              </Text>{" "}
              with the subject line: "Application For MERL Manager (TracTrac MSL)".
            </Text>
            <Text fontSize="16px" fontWeight={600} color="#2D3748">
              Application deadline: September 30th 2025
            </Text>
          </Box>

          {/* Apply Button */}
          <Center>
            <Button
              as="a"
              href="mailto:jobs@tractrac.co?subject=Application For MERL Manager (TracTrac MSL)"
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
