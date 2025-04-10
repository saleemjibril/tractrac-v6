"use client";
import {
  Box,
  List,
  ListIcon,
  ListItem,
  Stack,
  Flex,
  Text,
  Link,
  Image
} from "@chakra-ui/react";
import {
  FaCheckCircle
} from "react-icons/fa";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function ServicesComponent() {
  return (
    <ChakraWrapper>
    <Box mt={{ base: "0px", md: "80px" }}>
      <Flex
        bg="#F8F8F0"
        // bg={{base: "#F8F8F0", md: "red", lg: "green", xl:"black", "2xl": "pink"}}
        borderRadius={"10px"}
        pt="25px"
        pb="60px"
        pr="20px"
          pl="20px"
        width={"100%"}
        maxWidth={"1400px"}
        direction={{ base: "column-reverse", md: "row" }}
        margin={"auto"}
        position={"relative"}
        justifyContent={"center"}
        alignItems={"center"}
        columnGap={"50px"}
        mb={{ base: "0px", lg: "-250px" }}
      >
        <Stack ml={"120px"}>
          <Box mb="-100px" ml="-120px">
            <Image
              src="images/machinery.jpg"
              alt="Tractor image"
              width={216}
              height={245}
            />
          </Box>
          <Image
            src="images/tractor.jpg"
            alt="Tractor image"
            width={"328px"}
            // height={385}
          />

          <Box mt="-200px" ml="-90px">
            <Image
              src="images/years-of-experience.svg"
              alt="Tractor image"
              width={157}
              height={157}
            />
          </Box>
        </Stack>
        <Box flex="1" mt={{ base: "0px", md: "36px" }}>
          <Text
            fontFamily={"cursive"}
            fontSize={{ base: "20px", md: "28px" }}
            color={"#FA9411"}
          >
            About the Idea
          </Text>
          <Text
            fontSize={{ base: "20px", md: "32px" }}
            fontWeight={700}
            my="10px"
            lineHeight={{ base: "24px", md: "38px" }}
          >
            Improving the lives of all farmers across Africa.
          </Text>
          <Text fontSize={{ base: "14px", md: "18px" }}>
            We believe that affordable mechanisation services can revolutionize
            the agricultural sector in Africa, fostering economic growth.
          </Text>
          <Flex gap="20px" mt="20px" flexDir={{ base: "column", md: "row" }} flexWrap={"wrap"}>
            <Flex direction="row" alignItems="center" gap={"14px"}>
              <Image
                src="images/user-icon-avatar.svg"
                alt=""
                width={{ base: "30px", md: "50px" }}
              />
              <Text fontSize={"20px"} fontWeight={600}>
                Increase Tractor Density
              </Text>
            </Flex>
            <Stack direction="row" alignItems="center" gap={"14px"}>
              <Image
                src="images/tractor-icon-avatar.svg"
                alt=""
                width={{ base: "30px", md: "50px" }}
              />

              <Text fontSize={"20px"} fontWeight={600}>
                4,000 Agent Across Nigeria
              </Text>
            </Stack>
          </Flex>
          <Flex gap="20px" mt="32px" flexWrap={"wrap"}>
            <Image
              display={{ base: "none", md: "flex" }}
              src="images/machinery-2.jpg"
              alt="Farm machinery"
              width={"200px"}
              // height={149}
            />
            <List spacing={3}>
              <ListItem fontSize="18px" fontWeight="400" alignItems="center">
                <ListIcon as={FaCheckCircle} color="#FA9411" boxSize={"18px"} />
                Income for Tractor owners
              </ListItem>
              <ListItem fontSize="18px" fontWeight="400" alignItems="center">
                <ListIcon as={FaCheckCircle} color="#FA9411" boxSize={"18px"} />
                Foster Sustainable Agriculture
              </ListItem>
              <ListItem fontSize="18px" fontWeight="400" alignItems="center">
                <ListIcon as={FaCheckCircle} color="#FA9411" boxSize={"18px"} />
                Promote mechanisation Adoption
              </ListItem>
            </List>
          </Flex>
        </Box>
        {/* <Flex></Flex>  */}
      </Flex>

      <Stack
        bg="#333333"
        pt={{ base: "0px", md: "250px" }}
        pb="80px"
        color="white"
      >
        <Box 
        width={"100%"}
        maxWidth={"1400px"}
        margin={"auto"}
        pr="20px"
          pl="20px"
        >
          <Text
            fontFamily={"cursive"}
            fontSize={"28px"}
            color={"#FA9411"}
            mt="80px"
          >
            Our services
          </Text>
          <Text fontSize={"32px"} fontWeight={700}>
            Bridging the Gap to Mechanisation.
          </Text>

          {/* <Box> */}
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={"0"}
            mt="60px"
            mb="-100px"
            mx={{ base: "12px", md: "24px" }}
          >
            <Box bgColor="#CC6D02" p="20px" as="a" href="/home/hire-tractor">
              <Image
                src="icons/tractor-bold.svg"
                alt="Tractor image icon"
                width="110px"
              ></Image>
              <Text fontSize="16px" mt="18px" fontWeight={600}>
                Hire a Tractor
              </Text>
              <Text fontSize="14px" mt="8px">
                Seamlessly request tractor services for your farm or community.
                We offer a wide variety of farm machineries and tractor-drawn
                implements for hire at affordable rates.
              </Text>
            </Box>
            <Box
              bgColor="#FF8802"
              p="20px"
              color="#222222"
              as="a"
              href="/home/enlist-tractor"
            >
              <Image src="icons/list.svg" alt=""></Image>
              <Text fontSize="16px" mt="18px" fontWeight={600}>
                Enlist your Tractors
              </Text>
              <Text fontSize="14px" mt="8px">
                By enlisting your tractors on our platform, you get to make
                money while helping to build the network of tractors available
                to various farmers across Africa.
              </Text>
            </Box>
            <Box bgColor="#FFA035" p="20px" as="a" href="/home/agent">
              <Image src="icons/agent.svg" alt=""></Image>
              <Text fontSize="16px" mt="18px" fontWeight={600}>
                Become an Agent
              </Text>
              <Text fontSize="14px" mt="8px">
                Join our growing network of service aggregators who work with
                farmers and communities to bring tractor services to farms and
                communities.
              </Text>
            </Box>
            <Box
              bgColor="#FFB867"
              p="20px"
              color="#222222"
              as="a"
              href="/home/invest-in-tractor"
            >
              <Image src="icons/money.svg" alt=""></Image>
              <Text fontSize="16px" mt="18px" fontWeight={600}>
                Invest in Tractors
              </Text>
              <Text fontSize="14px" mt="8px">
                Unleash the power of your investment and transform the lives of
                small-scale farmers in Nigeria by joining our dynamic group of
                tractor investors. Together, we are revolutionizing the
                agricultural landscape.
              </Text>
            </Box>
          </Stack>
          {/* </Box> */}
          <Box
            border={"3px"}
            borderColor="white"
            borderStyle="solid"
            borderTopStyle={{ base: "solid", md: "dotted" }}
            // borderTopWidth={"4px"}
            // px={{ base: "1em", md: "4em", lg: "8em", xl: "12em" }}
            pt="140px"
            // pb="48px"
          >
            <Text
              textAlign="center"
              fontWeight={400}
              px={{ base: "1em", md: "4em", lg: "7em", xl: "10em" }}
            >
              Our integrated platform enables farmers to lease and own tractors,
              access genuine tractor implement, and participate in a sustainable
              and competitive mechanization market, driving positive change in
              the agricultural sector and empowering rural communities
              throughout Africa.
            </Text>

            <Flex
              mt="40px"
              mb="20px"
              px="30px"
              justifyContent="center"
              fontWeight={700}
            >
              {/* <Link href="/home/register-as-vendor">Register as Vendors</Link>
              <Link href="/home/enlist-as-op-mech">
                Enlist as Operators/Mechanics{" "}
              </Link> */}
              <Link href="/services">Explore more services</Link>
              {/* <Link href="/home/track-tractor">Track your Tractors</Link> */}
            </Flex>
          </Box>
        </Box>
      </Stack>
    </Box>
    </ChakraWrapper>
  );
}