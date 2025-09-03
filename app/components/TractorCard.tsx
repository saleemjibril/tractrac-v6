"use client";
import {
    Box,
    Image,
    ComponentWithAs,
    Flex,
    IconProps,
    SimpleGrid,
    Text,
    Button,
    Center,
    Stack,
    SkeletonCircle,
    SkeletonText,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Divider,
    Select,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    HStack,
    InputGroup,
    InputLeftElement,
    Input
} from "@chakra-ui/react";
import { TractorLocation } from "../components/Icons";

import { useRouter, useSearchParams } from "next/navigation";
import { statusTypes } from "../utils/tractorStatus";

interface ITractorCard {
    id: string;
    name: string;
    capacity: string;
    type: string;
    brand: string;
    location: string;
    status: string;
    image: string;
}


export default function TractorCard({
    id,
    name,
    type,
    location,
    status,
    image,
    capacity,
    brand
}: ITractorCard) {
    const router = useRouter();

    return (
        <Box
            // boxShadow="md"
            // borderRadius="4px"
            onClick={() => router.push(`/dashboard/tractor?id=${id}`)}
            cursor="pointer"
            _hover={{ transform: "translateY(-2px)", transition: "all 0.2s" }}
        >
            <Box h="200px">
                <Image
                    src={
                        image[0]?.startsWith("https") ? image[0] : "https://res.cloudinary.com/tractrac-global/image/upload/v1746446723/man-with-tractor_dxf5ly.svg"
                    }
                    alt="Man with a tractor image"
                    height="100%"
                    width="100%"
                    objectFit="cover"
                />
            </Box>
            <Text bg={"#F7F7F7"} borderRadius={"4px"} px={"8px"} textAlign={"center"} fontSize={"12px"} fontWeight={"600"} py={"4px"} color={"#4B4945"} textTransform={"uppercase"} isTruncated>{name}</Text>

            <Box p="12px 12px" bgColor="white">
                <Text
                    fontSize="12px"
                    color="#323232"
                    fontWeight={700}
                    // mt="8px"
                    lineHeight="12.1px"
                    pl={"4px"}
                >
                    Capacity:{" "}
                    <Box fontWeight={500} as="span">
                        {capacity}
                    </Box>
                </Text>
                <Text
                    fontSize="12px"
                    color="#323232"
                    fontWeight={700}
                    mt="5px"
                    mb="8px"
                    lineHeight="12.1px"
                    pl={"4px"}
                >
                    Brand:{" "}
                    <Box fontWeight={500} as="span">
                        {brand}
                    </Box>
                </Text>
                <Box pl={"4px"} fontWeight={400} fontSize="10px" color={"#707070"} mt="0" as="span" noOfLines={2}>
                    <Box fontWeight={700} as="span">
                        <TractorLocation width="12px" height="12px" />
                    </Box>{" "}
                    {location?.length < 2 ? "N/a" : location}
                </Box>
                {statusTypes[status]?.color && (
                    <Box
                        mt="10px"
                        bgColor={statusTypes[status].color}
                        height={"37px"}
                        textAlign="center"
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                    // borderRadius="4px"
                    // w="111px"
                    >
                        <Text fontSize="12px" fontWeight={600} color="white">
                            {statusTypes[status].title}
                        </Text>
                    </Box>
                )}

                {/* {status === 'pending_verification' && (
            <Button
              mt="12px"
              size="sm"
              bgColor="#FA9411"
              color="white"
              _hover={{ opacity: 0.85 }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/verification/tractor/manual?id=${id}`);
              }}
            >
              Manual verification
            </Button>
          )} */}
            </Box>
        </Box>
    );
}