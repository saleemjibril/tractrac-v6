"use client";

import {
  Box,
  Stack,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  useDisclosure,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  Divider,
  HStack,
  Icon,
} from "@chakra-ui/react";

import { useAppDispatch } from "@/redux/hooks";
import { useCollaborateMutation } from "@/redux/services/userApi";
import { toast } from "react-toastify";
import FooterComponent from "./footer";
import Header from "./header";
import React, { useState } from "react";
import { ChakraWrapper } from "../chakraUIWrapper";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { createCustomIcon } from "../leafletLoader";
import { LeafletStrictModeGate } from "./LeafletStrictModeGate";

interface Office {
  name: string;
  address: string;
  position: { lat: number; lng: number };
  placeholder?: boolean;
}

function FitBounds({ offices }: { offices: Office[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (offices.length > 0) {
      const bounds = L.latLngBounds(
        offices.map(office => [office.position.lat, office.position.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [offices, map]);

  return null;
}

export default function ContactUsInner() {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialDataState = {
    name: "",
    message: "",
    email: "",
    type: "support",
  };
  const [data, setData] = useState(initialDataState);
  // Function to update the object state
  const handleInputChange = (e: any) => {
    const { name, value } = e?.target;
    // alert(value)

    // Use the spread operator to create a new object with updated property
    setData({
      ...data,
      [name]: value,
    });
  };
  const [contact] = useCollaborateMutation();
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const offices = [
    {
      name: "Abuja Office",
      address:
        "11 Vanern Crescent, Wuse, FCT 904101, Federal Capital Territory",
      position: { lat: 9.081999, lng: 7.48 },
    },
    {
      name: "Nasarawa Office",
      address: "Coming soon",
      position: { lat: 8.4926, lng: 8.515 }, // Placeholder coordinates (Lafia)
      placeholder: true,
    },
  ];

  return (
    <ChakraWrapper>
      <Box position={"relative"}>
        <Header />

        <Box
          pr="20px"
          pl="20px"
          width={"100%"}
          maxWidth={"1440px"}
          margin={"0 auto"}
          pt="40px"
          pb={"80px"}
        >
          <Box width={"100%"} display={"grid"} gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="70px">
            <Stack spacing={4}>
              <Heading color="#111111" fontSize={{ base: "28px", md: "32px" }}>
                Let&rsquo;s Talk
              </Heading>
              <Text color="#444444" fontSize="16px" lineHeight={1.6}>
                Tractrac are open to partnerships with organizations that share our
                vision of a more mechanized and sustainable Nigeria.
              </Text>
              <Divider />
              <Stack spacing={3}>
                <Box>
                  <Text color="#111111" fontSize="14px" fontWeight={600} textTransform="uppercase" letterSpacing="0.6px">
                    Email
                  </Text>
                  <HStack mt="6px" spacing={3}>
                    <Icon viewBox="0 0 24 24" boxSize={5} color="#FA9411">
                      <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5L4 8V6l8 5l8-5z" />
                    </Icon>
                    <Text color="#333333" fontSize="16px">info@tractrac.co</Text>
                  </HStack>
                </Box>
                <Box>
                  <Text color="#111111" fontSize="14px" fontWeight={600} textTransform="uppercase" letterSpacing="0.6px">
                    Phone Number
                  </Text>
                  <HStack mt="6px" spacing={3}>
                    <Icon viewBox="0 0 24 24" boxSize={5} color="#FA9411">
                      <path fill="currentColor" d="M6.62 10.79a15.91 15.91 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.29 22 2 13.71 2 3.5a1 1 0 0 1 1-1H6.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01z" />
                    </Icon>
                    <Text color="#333333" fontSize="16px">07019898493</Text>
                  </HStack>
                </Box>
              </Stack>
            </Stack>

            <Box
              bgColor="#ffffff"
              borderRadius="10px"
              minW={{ base: "100%", md: "50%" }}
              p={{ base: "16px", md: "24px" }}
              boxShadow="0 8px 24px rgba(0,0,0,0.06)"
              border="1px solid #EFEFEF"
            >
              <Heading as="h2" fontSize={{ base: "18px", md: "20px" }} mb="16px" color="#111111">
                Contact Us
              </Heading>

              {error && (
                <Alert status="error" mb="16px">
                  <AlertIcon />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              <Box mb="18px">
                <Text mb="8px" fontSize={"14px"} color="#111111" fontWeight={500}>
                  Name
                </Text>
                <Input
                  name="name"
                  border="1px solid #E6E6E6"
                  bgColor="#F9F9F9"
                  _focus={{ bg: "white", borderColor: "#FA9411", boxShadow: "0 0 0 1px #FA9411" }}
                  value={data.name}
                  onChange={handleInputChange}
                />
              </Box>
              <Box mb="18px">
                <Text mb="8px" fontSize={"14px"} color="#111111" fontWeight={500}>
                  Email Address
                </Text>
                <Input
                  name="email"
                  type="email"
                  border="1px solid #E6E6E6"
                  bgColor="#F9F9F9"
                  _focus={{ bg: "white", borderColor: "#FA9411", boxShadow: "0 0 0 1px #FA9411" }}
                  value={data.email}
                  onChange={handleInputChange}
                />
              </Box>
              <Box mb="20px">
                <Text mb="8px" fontSize={"14px"} color="#111111" fontWeight={500}>
                  Message
                </Text>
                <Textarea
                  minH="165px"
                  name="message"
                  border="1px solid #E6E6E6"
                  bgColor="#F9F9F9"
                  _focus={{ bg: "white", borderColor: "#FA9411", boxShadow: "0 0 0 1px #FA9411" }}
                  value={data.message}
                  onChange={handleInputChange}
                />
              </Box>
              <Button
                bgColor="#FA9411"
                _hover={{ bg: "#e88305" }}
                _active={{ bg: "#cf7604" }}
                color="white"
                borderRadius="6px"
                height="44px"
                width="100%"
                onClick={async () => {
                  try {
                    setLoading(true);
                    if (success) {
                      toast.error(
                        "You have already contacted us, please wait for a while  before trying again!"
                      );
                      return;
                    }
                    const emailRegex =
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                    if (data.name.length < 3) {
                      toast.error("Please enter a valid name");
                      return;
                    }

                    if (data.message.length < 15) {
                      toast.error("Message must have at least 15 characters");
                      return;
                    }

                    if (data.email.length < 1 || !emailRegex.test(data.email)) {
                      toast.error("Please enter a valid email");
                      return;
                    }
                    const response = await contact({
                      ...data,
                    }).unwrap();

                    if (response.status == "success") {
                      toast.success(
                        response.message ??
                          "Received, thanks for contacting us!"
                      );
                      setData({
                        ...data,
                        email: "",
                        name: "",
                        message: "",
                      });
                      setSuccess(true);
                    } else {
                      toast.error("An unknown error occured");
                    }
                  } catch (err) {
                    const error = err as any;
                    if (error?.data?.errors) {
                    } else if (error?.data?.message) {
                      setError(error?.data?.message);
                    }
                    console.log("rejected", error);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={success}
                isLoading={loading}
              >
                Send
              </Button>
            </Box>

            <Box minW={{ base: "100%", md: "45%" }}>
            <Heading color="#111111" fontSize={{ base: "22px", md: "24px" }} mb="16px">
            Our Offices
          </Heading>
              <Stack spacing={4}>
                <Box p={{ base: "14px", md: "16px" }} borderRadius="10px" border="1px solid #EFEFEF" boxShadow="0 6px 16px rgba(0,0,0,0.04)">
                  <HStack spacing={3} mb={2}>
                    <Icon viewBox="0 0 24 24" boxSize={5} color="#FA9411">
                      <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                    </Icon>
                    <Text color="#111111" fontSize="18px" fontWeight={600}>
                      Abuja Office
                    </Text>
                  </HStack>
                  <Text color="#444444" fontSize="14px" lineHeight={1.6}>
                    11 Vanern Crescent, Wuse, FCT 904101, Federal Capital Territory
                  </Text>
                </Box>
                <Box p={{ base: "14px", md: "16px" }} borderRadius="10px" border="1px solid #EFEFEF" boxShadow="0 6px 16px rgba(0,0,0,0.04)">
                  <HStack spacing={3} mb={2}>
                    <Icon viewBox="0 0 24 24" boxSize={5} color="#FA9411">
                      <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                    </Icon>
                    <Text color="#111111" fontSize="18px" fontWeight={600}>
                      Nasarawa Office
                    </Text>
                  </HStack>
                  {/* <Text color="#999999" fontSize="14px">(Placeholder)</Text> */}
                </Box>
              </Stack>
            </Box>

            <Box flex={1} minH="420px" borderRadius="12px" overflow="hidden" border="1px solid #EFEFEF" boxShadow="0 8px 24px rgba(0,0,0,0.06)">
              <LeafletStrictModeGate style={{ height: "100%", width: "100%", minHeight: "420px" }}>
                <MapContainer
                  center={[9.082, 8.6753]}
                  zoom={6}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {offices.map((office, index) => (
                  <Marker
                    key={index}
                    position={[office.position.lat, office.position.lng]}
                  >
                    <Popup>
                      <div style={{ padding: "8px", maxWidth: "260px" }}>
                        <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                          {office.name}{office.placeholder ? " (Placeholder)" : ""}
                        </div>
                        <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
                          {office.address}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <FitBounds offices={offices} />
                </MapContainer>
              </LeafletStrictModeGate>
            </Box>
          </Box>
        </Box>

       

        <FooterComponent />

      
      </Box>
    </ChakraWrapper>
  );
}

