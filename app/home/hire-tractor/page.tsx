"use client";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Box,
  Select,
  Modal as ChakraModal,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalBody,
  ModalContent,
  Icon,
  Center,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  InputRightAddon,
  Skeleton,
  SkeletonText,
  Tooltip,
  Collapse,
  Checkbox,
  VStack,
  Divider,
  ModalCloseButton
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../../components/Sidenav";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import { Select as MultiSelect } from "chakra-react-select";
import * as nigerianStates from "nigerian-states-and-lgas";
import { ArrowDown2, Filter } from "iconsax-react";
import {
  useLazyGetTractorsQuery,
  useHireTractorMutation,
  useLazyGetSearchTractorsQuery,
} from "@/redux/services/tractorApi";
import Autocomplete from "react-google-autocomplete";

import Map from "../../components/Map";
import {
  filterTractors,
  getApprovedTractors,
  getBookedDates,
  getTractors,
  hireTractor,
} from "@/app/apis/tractor";
import moment from "moment";
import Link from "next/link";
import { states } from "@/app/utils/states";
import { implementTypes } from "@/app/utils/implementTypes";

const fileTypes = ["JPG", "PNG", "JPEG"];

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })
const tractorTypes = ["small", "medium", "large", "specialized", "utility"];

const tractorTypeOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "Specialized", value: "specialized" },
  { label: "Utility", value: "utility" }
];

const brandOptions = [
  { label: "Case IH", value: "case_ih" },
  { label: "Sonalika", value: "sonalika" },
  { label: "John Deere", value: "john_deere" },
  { label: "Mahindra", value: "mahindra" },
  { label: "Others", value: "others" }
];

const statusOptions = [
  { label: "Available now", value: "available" },
  { label: "Book ahead", value: "book_ahead" }
];

const horsepowerOptions = [
  { label: "30+ HP", value: 30 },
  { label: "50+ HP", value: 50 },
  { label: "75+ HP", value: 75 },
  { label: "100+ HP", value: 100 },
  { label: "135+ HP", value: 135 }
];


interface ICoordinates {
  latitude: number;
  longitude: number;
}


interface ITractorCard {
  id: string;
  name: string;
  image: string | string[];
  capacity: string;
  location: string;
  status: string;
  tractor_type: string;
  setTractorId: Dispatch<SetStateAction<string | null>>;
  coordinates: ICoordinates;
  userCoordinates?: ICoordinates | null;
  onCardClick?: (tractor: any) => void;
  tractorData?: any;
}

const statusTypes: Record<string, { title: string; color: string }> = {
  booked: { title: "Booked", color: "#FA9411" },
  maintenance: { title: "Maintenance", color: "#FF0000" },
  available: { title: "Available", color: "#27AE60" },
  in_use: { title: "In Use", color: "#FA9411" },
};

/**
 * Gets the user's current location and returns the principalSubdivision (state)
 * @returns Promise<string | null> - The principalSubdivision or null if not found
 */
async function getCurrentLocationState(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Get principalSubdivision using reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            resolve(null);
            return;
          }
          
          const data = await response.json();
          console.log("getCurrentLocationState", data);
          const principalSubdivision = data.principalSubdivision;
          
          resolve(principalSubdivision || null);
        } catch (error) {
          console.error('Error getting location state:', error);
          resolve(null);
        }
      },
      (error) => {
        // Silently handle geolocation errors - don't show error to user
        console.log('Geolocation error:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}
export default function HireTractor() {
  const { userToken } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [searchData, setSearchData] = useState<any>(null);
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tractorId, setTractorId] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [lgas, setLgas] = useState<string[]>([]);
  const [lga, setLga] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [implement, setImplement] = useState<string | null>(null);
  const [tractorType, setTractorType] = useState<string | null>(null);
  const [tractorSearchTerm, setTractorSearchTerm] = useState<string | null>(null);
  const [selectedHorsepower, setSelectedHorsepower] = useState<number | null>(null);
  const [selectedImplementType, setSelectedImplementType] = useState<string | null>(null);
  const [selectedTractorType, setSelectedTractorType] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<ICoordinates | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTractorDetailModal, setShowTractorDetailModal] = useState(false);
  const [showImplementModal, setShowImplementModal] = useState(false);
  const [selectedTractorForBooking, setSelectedTractorForBooking] = useState<any>(null);
  const [selectedImplements, setSelectedImplements] = useState<string[]>([]);
  // const [getTractors, result] = useLazyGetTractorsQuery();
  const [result] = useLazyGetTractorsQuery();
  const [trigger, searchResult] = useLazyGetSearchTractorsQuery({});

  const handleGetTractors = async () => {
    setLoading(true);
    try {
      if (typeof userToken === "string") {
        const response = await getApprovedTractors(userToken);
        const tractorsData = response?.data || [];
        console.log("handleGetTractors: Got tractors data:", tractorsData.length);
        
        // Sort tractors by distance before setting state
        console.log("handleGetTractors: About to sort tractors...");
        const sortedTractorsData = await sortTractorsByDistance(tractorsData);
        console.log("handleGetTractors: Sorted tractors:", sortedTractorsData.length);
        setTractors(sortedTractorsData);
        console.log("getTractorss", response);
      } else {
        // Handle the case when userToken is not a string
        console.log("User token is not a string");
        // Maybe redirect to login or show an error
      }
    } catch (error) {
      console.log("Error fetching Tractors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTractors();
    // setLocationBasedState(); // Automatically set state and LGA based on user's location
  }, []);

  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
  //     console.log("error->", "dd");
  //     navigator.geolocation.getCurrentPosition(
  //       ({ coords }) => {
  //         console.log("error->", coords);
  //         const { latitude, longitude } = coords;
  //         if (latitude && longitude) {
  //           // if (latitude && longitude && result.status !== "fulfilled") {
  //           setLocation({ latitude, longitude });
  //           getTractors(
  //             `${latitude.toString().replace(".", "_")}/${longitude
  //               .toString()
  //               .replace(".", "_")}`
  //           );
  //         } else {
  //           getTractors(null);
  //         }
  //       },
  //       (err) => {
  //         getTractors(null);
  //         console.log("err", err);
  //       }
  //     );
  //   } else {
  //     getTractors(null);
  //   }
  //   // return {getTractors}
  // }, [getTractors]);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchFilteredTractors = async () => {
      setLoading(true);
      console.log("change", state, tractorType, lga);

      // Build query parameters
      const queryParams = new URLSearchParams();

      // Only add parameters that have values
      if (state) queryParams.append("state", state);
      if (lga) queryParams.append("local_government_area", lga);
      if (tractorType) queryParams.append("tractor_type", tractorType);
      if (tractorSearchTerm) queryParams.append("search", tractorSearchTerm);
      if (selectedHorsepower) {
        queryParams.append("min_horsepower", selectedHorsepower.toString());
      }
      if (selectedImplementType) {
        queryParams.append("implement_types", selectedImplementType);
      }
      if (selectedTractorType) {
        queryParams.append("tractor_type", selectedTractorType);
      }
      if (selectedBrand) {
        queryParams.append("brands", selectedBrand);
      }
      if (selectedStatus) {
        queryParams.append("status", selectedStatus);
      }

      // Convert URLSearchParams to string
      const queryString = queryParams.toString();

      if (queryString) {
        console.log("query parameters:", queryString);

        try {
          // Now we can use await properly inside the async function
          const response = await filterTractors(
            queryString,
            userToken as string
          );
          console.log("filterTractors", response);
          const tractorsData = response?.data || [];
          
          // Sort tractors by distance before setting state
          const sortedTractorsData = await sortTractorsByDistance(tractorsData);
          setTractors(sortedTractorsData);

          // Assuming response has a data property
          // setSearchData(response?.data || []);
        } catch (error) {
          console.log("Search error:", error);
          setSearchData([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchData(null);
      }
    };

    // Call the async function
    fetchFilteredTractors();
  }, [state, lga, tractorType, tractorSearchTerm, selectedHorsepower, selectedImplementType, selectedTractorType, selectedBrand, selectedStatus, userToken]);

  const clearFilters = async () => {
    setState(null);
    setLga(null);
    setTractorType(null);
    setSelectedHorsepower(null);
    setSelectedImplementType(null);
    setSelectedTractorType(null);
    setSelectedBrand(null);
    setSelectedStatus(null);
    await handleGetTractors();
  }

  const handleTractorCardClick = (tractor: any) => {
    setSelectedTractorForBooking(tractor);
    setShowTractorDetailModal(true);
  };

  const handleBookNowClick = () => {
    // setShowTractorDetailModal(false);
    // setShowImplementModal(true);
    router.push(`/home/hire-tractor/${selectedTractorForBooking.id}`);
  };

  const handleProceedWithImplements = (implementsList: string[]) => {
    setSelectedImplements(implementsList);
    if (selectedTractorForBooking) {
      // Navigate to the tractor detail page
      router.push(`/home/hire-tractor/${selectedTractorForBooking.id}`);
    }
  };

  // Function to automatically set state and LGA based on user's location
  const setLocationBasedState = async () => {
    try {
      const principalSubdivision = await getCurrentLocationState();
      console.log("principalSubdivision", principalSubdivision);
      
      if (principalSubdivision) {
        if (principalSubdivision.toLowerCase().includes("abuja")) {
          // Federal Capital Territory
          setState("fct - abuja");
          setLgas(nigerianStates.lgas("fct - abuja") ?? []);
        } else {
          setState(principalSubdivision.toLowerCase());
          setLgas(nigerianStates.lgas(principalSubdivision.toLowerCase()) ?? []);
        }
      }

      // Also get user coordinates for distance calculations
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserCoordinates(userCoords);
          },
          (error) => {
            console.log("Error getting user coordinates:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      }
    } catch (error) {
      console.error('Error setting location-based state:', error);
    }
  }

  async function search() {
    // alert(state);
    try {
      let param = "";
      if (state && brand && implement) {
        // const result = await trigger(
        //   `${implement}/${brand}/${state}`
        // ).unwrap();
        // setSearchData(result?.data || []);
        param = `${implement}/${brand}/${state}`;
        console.log("SEARCH DATA", searchData);
      } else if (state && !brand && !implement) {
        // const result = await trigger(state).unwrap();
        // setSearchData(result?.data || []);
        param = state;
      } else if (!state && brand && implement) {
        // const result = await trigger(`${implement}/${brand}`).unwrap();
        // setSearchData(result?.data || []);
        param = `${implement}/${brand}`;
      } else if (!state && !brand && implement) {
        // const result = await trigger(implement).unwrap();
        // setSearchData(result?.data || []);
        param = implement;
      } else if (!state && brand && !implement) {
        // alert(brand);
        // const result = await trigger(brand).unwrap();
        // // alert(result?.data || [])
        // console.log("DDD", result?.data);
        // setSearchData(result?.data || []);
        param = brand;
      } else {
        // setSearchData(null);
      }
      if (param.length > 1 && searchData == null) {
        const result = await trigger(param).unwrap();
        setSearchData(result?.data || []);
      }
    } catch (e) {
      setSearchData([]);
    }
  }
  // console.log(result);

  //     id, {
  //     pollingInterval: 3000,
  //     refetchOnMountOrArgChange: true,
  //     skip: false,
  //   })

  function snakeToCamelWithSpaces(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Function to get user coordinates if not already available
  const getUserCoordinates = (): Promise<ICoordinates | null> => {
    return new Promise((resolve) => {
      console.log("getUserCoordinates called, current userCoordinates:", userCoordinates);
      
      // If we already have user coordinates, return them
      if (userCoordinates) {
        console.log("Using existing user coordinates:", userCoordinates);
        resolve(userCoordinates);
        return;
      }

      // If geolocation is not supported, resolve with null
      if (!navigator.geolocation) {
        console.log("Geolocation not supported");
        resolve(null);
        return;
      }

      console.log("Requesting user location for sorting...");
      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("Got user coordinates for sorting:", coords);
          setUserCoordinates(coords); // Store for future use
          resolve(coords);
        },
        (error) => {
          console.log("Error getting user coordinates for sorting:", error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Function to sort tractors by distance from user
  const sortTractorsByDistance = async (tractorsArray: any[]): Promise<any[]> => {
    console.log("sortTractorsByDistance called with tractors:", tractorsArray.length);
    
    if (tractorsArray.length === 0) {
      console.log("No tractors to sort");
      return tractorsArray;
    }

    // Get user coordinates (either from state or by requesting them)
    const coords = await getUserCoordinates();
    console.log("Got coordinates for sorting:", coords);
    
    if (!coords) {
      // If we can't get user coordinates, return tractors as-is
      console.log("No coordinates available, returning tractors unsorted");
      return tractorsArray;
    }

    const sortedTractors = tractorsArray
      .map((tractor) => {
        if (tractor?.current_location_lat && tractor?.current_location_lng) {
          const distance = calculateDistance(
            coords.latitude,
            coords.longitude,
            tractor.current_location_lat,
            tractor.current_location_lng
          );
          return { ...tractor, distanceFromUser: distance };
        }
        return { ...tractor, distanceFromUser: Infinity }; // Put tractors without coordinates at the end
      })
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
    
    console.log("Sorted tractors by distance:", sortedTractors.map(t => ({ name: t.name, distance: t.distanceFromUser })));
    return sortedTractors;
  };

  return (
    <SidebarWithHeader isAuth={true}>
      {/* Tractor Detail Modal */}
      <TractorDetailModal
        isOpen={showTractorDetailModal}
        onClose={() => {
          setShowTractorDetailModal(false);
          setSelectedTractorForBooking(null);
        }}
        tractor={selectedTractorForBooking}
        onBookNow={handleBookNowClick}
      />
      
      {/* Implement Selection Modal */}
      <ImplementSelectionModal
        isOpen={showImplementModal}
        onClose={() => setShowImplementModal(false)}
        tractor={selectedTractorForBooking}
        onProceed={handleProceedWithImplements}
      />
      
        <Box
          bgColor="white"
          mx={{ base: "0px", md: "20px" }}
          my="12px"
          px={{ base: "12px", md: "34px" }}
          py="20px"
        >
          <Stack>
            <Text fontSize="24px" fontWeight={700} mb="15px">
              Hire a Tractor
            </Text>
            {loading ? (
              <Skeleton
                mt="12px"
                height="360px"
                borderRadius="4px"
              // w="111px"
              />
            ) : (
              // <Map />
              <></>
            )}
            {/* <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446725/map_punpe8.svg" alt="map image" /> */}
          </Stack>
          <Box mt="40px">
            {/* Filter Controls */}
            <Flex alignItems="center" gap="10px" mb="20px">
              <Button
                size="sm"
                variant="outline"
                colorScheme="orange"
                bgColor="transparent"
                color="#FA9411"
                borderColor="#FA9411"
                borderRadius="20px"
                fontSize="12px"
                fontWeight="500"
                px="16px"
                py="8px"
                height="32px"
                _hover={{
                  bgColor: "#FA941110",
                }}
                _active={{
                  bgColor: "#FA941120",
                }}
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter size="16" />}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              {showFilters && <Button
                size="sm"
                variant="outline"
                colorScheme="orange"
                bgColor="#FA9411"
                color="#FFF"
                borderRadius="20px"
                fontSize="12px"
                fontWeight="500"
                px="16px"
                py="8px"
                height="32px"
                onClick={clearFilters}
                // leftIcon={<Filter size="16" />}
              >
               Clear filters
              </Button>}
              <Input
                value={tractorSearchTerm}
                borderColor="#FA9411"
                _focus={{
                  borderColor: "#FA9411",
                }}
                _focusVisible={{
                  borderColor: "#FA9411",
                }}
                onChange={(e) =>
                  setTractorSearchTerm(e.target.value)
                }
                placeholder="Search tractors..."
                bgColor="#FFF"
                fontSize="12px"
                color="#323232"
                flex="1"
                maxWidth="400px"
              />
            </Flex>

           
            {/* Collapsible Filter Section */}
            <Collapse in={showFilters} animateOpacity>
              <Box>
                <SimpleGrid display={"flex"} gap={"20px"} flexWrap={"wrap"} width={"fit-content"} mb={"20px"} alignItems={"center"}>
              {/* <InputGroup
                width="140px"
                border="1px"
                borderColor="#FA9411"
                borderRadius="8px"
                _focus={{
                  borderColor: "#FA9411",
                }}
                _focusVisible={{
                  borderColor: "#FA9411",
                }}
              >
                <InputRightElement pointerEvents="none" width="4rem">
                  <Icon as={Filter} mr="20px" color="#FA9411" mb="1px" />
                </InputRightElement>
                <Select
                  pl="35px"
                  bottom="1.5"
                  position="absolute"
                  icon={<ArrowDown2 />}
                  color="#FA9411"
                  variant="unstyled"
                >
                  <option>All filters</option>
                </Select>
              </InputGroup> */}
<Box>
<Text fontSize="12px" color="#323232" mb="6px" mt="10px" fontWeight={700}>State</Text>
              <Select
                width="150px"
                placeholder="State"
                value={(state || "").toLowerCase()}
                icon={<ArrowDown2 />}
                color="#FA9411"
                border="1px"
                borderColor="#FA9411"
                _focus={{
                  borderColor: "#FA9411",
                }}
                _focusVisible={{
                  borderColor: "#FA9411",
                }}
                onChange={(e) => {
                  // alert(e?.target?.value);
                  const state = e.currentTarget.value || "";
                  if (!!state) {
                    console.log("state???", state);
                    setState(e?.currentTarget?.value);
                    // search();
                    if (state.includes("abuja")) {
                      // Federal Capital Territory
                      setLgas(
                        nigerianStates.lgas("Federal Capital Territory") ?? []
                      );
                    } else {
                      setLgas(nigerianStates.lgas(state) ?? []);
                    }
                  } else {
                    setState(null);
                    //   // search();
                  }
                }}
              >
                {states.map((state) => (
                  <option key={state} value={state.toLowerCase()}>
                    {state}
                  </option>
                ))}
              </Select>
              </Box>
              <Box>
              <Text fontSize="12px" color="#323232" mb="6px" mt="10px" fontWeight={700}>Local Government Area</Text>
              <Select
                width="150px"
                placeholder="Lga"
                value={(lga || "").toLowerCase()}
                icon={<ArrowDown2 />}
                color="#FA9411"
                border="1px"
                borderColor="#FA9411"
                _focus={{
                  borderColor: "#FA9411",
                }}
                _focusVisible={{
                  borderColor: "#FA9411",
                }}
                onChange={(e) => {
                  if (e?.target?.value) {
                    setLga(e?.target?.value);
                    // search();
                  } else {
                    setLga(null);
                    // search();
                  }
                }}
              >
                {lgas.map((state) => (
                  <option key={state} value={state.toLowerCase()}>
                    {state}
                  </option>
                ))}
              </Select>
              </Box>
              {/* <Box>
              <Text fontSize="12px" color="#323232" mb="6px" mt="10px" fontWeight={700}>Tractor Types</Text>
              <Select
                width="150px"
                placeholder="Tractor Type"
                value={(tractorType || "").toLowerCase()}
                icon={<ArrowDown2 />}
                color="#FA9411"
                border="1px"
                borderColor="#FA9411"
                _focus={{
                  borderColor: "#FA9411",
                }}
                _focusVisible={{
                  borderColor: "#FA9411",
                }}
                onChange={(e) => {
                  if (e?.target?.value) {
                    setTractorType(e?.target?.value);
                    // search();
                  } else {
                    setTractorType(null);
                    // search();
                  }
                }}
              >
                {tractorTypes.map((tractorType) => (
                  <option key={tractorType} value={tractorType.toLowerCase()}>
                    {tractorType}
                  </option>
                ))}
              </Select>
              </Box> */}

                  {/* Horsepower Filter Pills */}
              <Box>
              <Text fontSize="12px" color="#323232" mb="6px" fontWeight={700}>Horsepower</Text>
              <Flex gap="8px" wrap="wrap" align="center">
                {horsepowerOptions.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={selectedHorsepower === option.value ? "solid" : "outline"}
                    colorScheme={selectedHorsepower === option.value ? "orange" : "gray"}
                    bgColor={selectedHorsepower === option.value ? "#FA9411" : "transparent"}
                    color={selectedHorsepower === option.value ? "white" : "#FA9411"}
                    borderColor="#FA9411"
                    borderRadius="20px"
                    fontSize="12px"
                    fontWeight="500"
                    px="16px"
                    py="8px"
                    height="32px"
                    _hover={{
                      bgColor: selectedHorsepower === option.value ? "#e67e00" : "#FA941110",
                    }}
                    _active={{
                      bgColor: selectedHorsepower === option.value ? "#e67e00" : "#FA941120",
                    }}
                    onClick={() => {
                      setSelectedHorsepower(
                        selectedHorsepower === option.value ? null : option.value
                      );
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Flex>
              </Box>

              {/* Implement Type Filter Pills */}
              <Box>
              <Text fontSize="12px" color="#323232" mb="6px" mt="10px" fontWeight={700}>Implement Types</Text>
              <Flex gap="8px" wrap="wrap" align="center">
                {implementTypes.map((implement) => (
                  <Button
                    key={implement.value}
                    size="sm"
                    variant={selectedImplementType === implement.value ? "solid" : "outline"}
                    colorScheme={selectedImplementType === implement.value ? "orange" : "gray"}
                    bgColor={selectedImplementType === implement.value ? "#FA9411" : "transparent"}
                    color={selectedImplementType === implement.value ? "white" : "#FA9411"}
                    borderColor="#FA9411"
                    borderRadius="20px"
                    fontSize="12px"
                    fontWeight="500"
                    px="16px"
                    py="8px"
                    height="32px"
                    _hover={{
                      bgColor: selectedImplementType === implement.value ? "#e67e00" : "#FA941110",
                    }}
                    _active={{
                      bgColor: selectedImplementType === implement.value ? "#e67e00" : "#FA941120",
                    }}
                    onClick={() => {
                      setSelectedImplementType(
                        selectedImplementType === implement.value ? null : implement.value
                      );
                    }}
                  >
                    {implement.label}
                  </Button>
                ))}
              </Flex>
              </Box>

              {/* Tractor Type Filter Pills */}
              <Box>
              <Text fontSize="12px" color="#323232" mb="6px" mt="10px" fontWeight={700}>Tractor Types</Text>
              <Flex gap="8px" wrap="wrap" align="center" height={"fit-content"}>
                {tractorTypeOptions.map((type) => (
                  <Button
                    key={type.value}
                    size="sm"
                    variant={selectedTractorType === type.value ? "solid" : "outline"}
                    colorScheme={selectedTractorType === type.value ? "orange" : "gray"}
                    bgColor={selectedTractorType === type.value ? "#FA9411" : "transparent"}
                    color={selectedTractorType === type.value ? "white" : "#FA9411"}
                    borderColor="#FA9411"
                    borderRadius="20px"
                    fontSize="12px"
                    fontWeight="500"
                    px="16px"
                    py="8px"
                    height="32px"
                    _hover={{
                      bgColor: selectedTractorType === type.value ? "#e67e00" : "#FA941110",
                    }}
                    _active={{
                      bgColor: selectedTractorType === type.value ? "#e67e00" : "#FA941120",
                    }}
                    onClick={() => {
                      setSelectedTractorType(
                        selectedTractorType === type.value ? null : type.value
                      );
                    }}
                  >
                    {type.label}
                  </Button>
                ))}
              </Flex>
              </Box>

              {/* Brand Filter Pills */}
              {/* <Box>
              <Text fontSize="12px" color="#323232" mb="6px" mt="10px" fontWeight={700}>Brands</Text>
              <Flex gap="8px" wrap="wrap" align="center" height={"fit-content"}>
                {brandOptions.map((brand) => (
                  <Button
                    key={brand.value}
                    size="sm"
                    variant={selectedBrand === brand.value ? "solid" : "outline"}
                    colorScheme={selectedBrand === brand.value ? "orange" : "gray"}
                    bgColor={selectedBrand === brand.value ? "#FA9411" : "transparent"}
                    color={selectedBrand === brand.value ? "white" : "#FA9411"}
                    borderColor="#FA9411"
                    borderRadius="20px"
                    fontSize="12px"
                    fontWeight="500"
                    px="16px"
                    py="8px"
                    height="32px"
                    _hover={{
                      bgColor: selectedBrand === brand.value ? "#e67e00" : "#FA941110",
                    }}
                    _active={{
                      bgColor: selectedBrand === brand.value ? "#e67e00" : "#FA941120",
                    }}
                    onClick={() => {
                      setSelectedBrand(
                        selectedBrand === brand.value ? null : brand.value
                      );
                    }}
                  >
                    {brand.label}
                  </Button>
                ))}
              </Flex>
              </Box> */}

              {/* Status Filter Pills */}
              {/* <Text fontSize="12px" color="#323232" mb="6px" mt="10px">Status</Text>
              <Flex gap="8px" wrap="wrap" align="center">
                {statusOptions.map((status) => (
                  <Button
                    key={status.value}
                    size="sm"
                    variant={selectedStatus === status.value ? "solid" : "outline"}
                    colorScheme={selectedStatus === status.value ? "orange" : "gray"}
                    bgColor={selectedStatus === status.value ? "#FA9411" : "transparent"}
                    color={selectedStatus === status.value ? "white" : "#FA9411"}
                    borderColor="#FA9411"
                    borderRadius="20px"
                    fontSize="12px"
                    fontWeight="500"
                    px="16px"
                    py="8px"
                    height="32px"
                    _hover={{
                      bgColor: selectedStatus === status.value ? "#e67e00" : "#FA941110",
                    }}
                    _active={{
                      bgColor: selectedStatus === status.value ? "#e67e00" : "#FA941120",
                    }}
                    onClick={() => {
                      setSelectedStatus(
                        selectedStatus === status.value ? null : status.value
                      );
                    }}
                  >
                    {status.label}
                  </Button>
                ))}
              </Flex> */}




              {/* <Select
                width="130px"
                placeholder="Brand"
                icon={<ArrowDown2 />}
                color="#FA9411"
                border="1px"
                borderColor="#FA9411"
                _focus={{
                  borderColor: "#FA9411",
                }}
                _focusVisible={{
                  borderColor: "#FA9411",
                }}
                onChange={(e) => {
                  if (e?.target?.value) {
                    setBrand(e?.target?.value);
                    // search();
                  } else {
                    setBrand(null);
                    // search();
                  }
                }}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand.toLowerCase()}>
                    {snakeToCamelWithSpaces(brand)}
                  </option>
                ))}
              </Select> */}
                </SimpleGrid>
              </Box>
            </Collapse>
            {
              // searchResult?.isFetching ||
              loading ? (
                <SimpleGrid
                  columns={{ base: 1, md: 4 }}
                  spacingX="20px"
                  spacingY="15px"
                  mt="30px"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                    <Box
                      key={index}
                      boxShadow="lg"
                      bg="white"
                      borderRadius="4px"
                    >
                      <Skeleton height="120px" />
                      <Box p="12px">
                        <SkeletonText
                          my="12px"
                          noOfLines={3}
                          spacing="3"
                          skeletonHeight="6px"
                        />

                        <Skeleton
                          mt="12px"
                          height="30px"
                          borderRadius="4px"
                          w="111px"
                        />
                      </Box>

                      {/* <SkeletonCircle size="10" /> */}
                      {/* */}
                    </Box>
                  ))}
                </SimpleGrid>
              ) : // { location }
                // <SimpleGrid
                //   columns={{ base: 2, md: 4 }}
                //   spacingX="20px"
                //   spacingY="15px"
                //   mt="30px"
                // >
                //   {
                // searchData ? (
                //   searchData?.length < 1 ? (
                //     <EmptyDataPlaceholder isSearch={true} />
                //   ) : (
                //     <SimpleGrid
                //       columns={{ base: 2, md: 4 }}
                //       spacingX="20px"
                //       spacingY="15px"
                //       mt="30px"
                //     >
                //       {tractors.map((tractor: any) => (
                //         <TractorCard
                //           key={tractor?.id}
                //           setTractorId={setTractorId}
                //           id={tractor?.id}
                //           name={`${tractor?.name}`}
                //           image={tractor?.tractor_image}
                //           capacity=" 105 to 135 HP"
                //           location={tractor?.address}
                //           distance={tractor?.distance}
                //           tractor_type={tractor?.tractor_type}
                //         />
                //       ))}
                //     </SimpleGrid>
                //   )
                // ) :
                tractors?.length < 1 ? (
                  <EmptyDataPlaceholder isSearch={false} />
                ) : (
                  <SimpleGrid
                    columns={{ base: 1, md: 4 }}
                    spacingX="20px"
                    spacingY="15px"
                    mt="30px"
                  >
                    {tractors?.map((tractor: any) => (
                      <TractorCard
                        key={tractor?.id}
                        setTractorId={setTractorId}
                        id={tractor?.id}
                        name={`${tractor?.name}`}
                        image={tractor?.tractor_image_files || tractor?.tractor_image}
                        capacity=" 105 to 135 HP"
                        location={`${tractor?.lga},${tractor?.state}`}
                        tractor_type={tractor?.tractor_type}
                        status={tractor?.status}
                        coordinates={{
                          latitude: tractor?.current_location_lat,
                          longitude: tractor?.current_location_lng
                        }}
                        userCoordinates={userCoordinates}
                        onCardClick={handleTractorCardClick}
                        tractorData={tractor}
                      />
                    ))}
                  </SimpleGrid>
                )
              //   }
              // </SimpleGrid>
            }
          </Box>
        </Box>
    </SidebarWithHeader>
  );
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Earth's radius in kilometers
  const R = 6371;

  // Convert latitude and longitude from degrees to radians
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c; // Distance in kilometers

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Tractor Detail Modal Component
function TractorDetailModal({
  isOpen,
  onClose,
  tractor,
  onBookNow,
}: {
  isOpen: boolean;
  onClose: () => void;
  tractor: any;
  onBookNow: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = tractor?.tractor_image_files || tractor?.tractor_image || [];
  const imageArray = Array.isArray(images) ? images : [images];
  const hasVideo = tractor?.tractor_video && tractor.tractor_video.length > 0;

  const nextImage = () => {
    if (imageArray.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imageArray.length);
    }
  };

  const prevImage = () => {
    if (imageArray.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    }
  };

  const isAvailable = tractor?.status === "available";

  return (
    <ChakraModal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={{ base: "2xl", md: "2xl" }}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent 
        maxH={{ base: "95vh", md: "90vh" }}
        display="flex" 
        flexDirection="column"
        position={{ base: "fixed", md: "relative" }}
        bottom={{ base: 0, md: "auto" }}
        mb={{ base: 0, md: "auto" }}
        borderRadius={{ base: "20px 20px 0 0", md: "8px" }}
        margin={{ base: 0, md: "auto" }}
        maxW={{ base: "100%", md: "672px" }}
      >
        <ModalHeader borderBottom="1px solid #ECECEC" pt={{ base: 4, md: 4 }}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize={{ base: "16px", md: "18px" }} fontWeight={600} color="#929292">
              Tractor Details
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody overflowY="auto" p={{ base: 4, md: 6 }}>
          <VStack align="stretch" spacing={4}>
            {/* Image Carousel */}
            {imageArray.length > 0 && (
              <Box position="relative" width="100%" height={{ base: "220px", md: "280px" }} borderRadius="8px" overflow="hidden">
                <Image
                  src={
                    imageArray[currentImageIndex]?.startsWith("https")
                      ? imageArray[currentImageIndex]
                      : "https://res.cloudinary.com/tractrac-global/image/upload/v1746446723/man-with-tractor_dxf5ly.svg"
                  }
                  alt={`Tractor image ${currentImageIndex + 1}`}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />

                {/* Image Counter */}
                {imageArray.length > 1 && (
                  <Box
                    position="absolute"
                    bottom="12px"
                    right="12px"
                    bgColor="rgba(0, 0, 0, 0.7)"
                    color="white"
                    px="12px"
                    py="4px"
                    borderRadius="7px"
                    fontSize="12px"
                    fontWeight={700}
                  >
                    {currentImageIndex + 1}/{imageArray.length}
                  </Box>
                )}

                {/* Available/Booked Badge */}
                <Box
                  position="absolute"
                  top="12px"
                  right="12px"
                  bgColor={isAvailable ? "#27AE60" : "#FF0000"}
                  color="white"
                  px="17px"
                  py="4px"
                  borderRadius="10px"
                  fontSize="14px"
                  fontWeight={700}
                >
                  {isAvailable ? "Available" : "Booked"}
                </Box>

                {/* Video Button */}
                {hasVideo && (
                  <Box
                    position="absolute"
                    bottom="12px"
                    left="12px"
                    bgColor="rgba(0, 0, 0, 0.7)"
                    color="white"
                    px="12px"
                    py="4px"
                    borderRadius="7px"
                    cursor="pointer"
                    _hover={{ bgColor: "rgba(0, 0, 0, 0.85)" }}
                  >
                    <Flex align="center" gap="6px">
                      <Icon viewBox="0 0 24 24" boxSize="16px">
                        <path
                          fill="currentColor"
                          d="M8 5v14l11-7z"
                        />
                      </Icon>
                      <Text fontSize="12px" fontWeight={600}>
                        View Video
                      </Text>
                    </Flex>
                  </Box>
                )}

                {/* Navigation Arrows */}
                {imageArray.length > 1 && (
                  <>
                    <Button
                      position="absolute"
                      left="12px"
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      size="sm"
                      colorScheme="whiteAlpha"
                      bgColor="rgba(255, 255, 255, 0.9)"
                      color="#323232"
                      _hover={{ bgColor: "white" }}
                    >
                      ‹
                    </Button>
                    <Button
                      position="absolute"
                      right="12px"
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      size="sm"
                      colorScheme="whiteAlpha"
                      bgColor="rgba(255, 255, 255, 0.9)"
                      color="#323232"
                      _hover={{ bgColor: "white" }}
                    >
                      ›
                    </Button>
                  </>
                )}

                {/* Dot Indicators */}
                {imageArray.length > 1 && (
                  <Flex
                    position="absolute"
                    bottom="12px"
                    left="0"
                    right="0"
                    justifyContent="center"
                    gap="4px"
                  >
                    {imageArray.map((_, index) => (
                      <Box
                        key={index}
                        w="6px"
                        h="6px"
                        borderRadius="full"
                        bg={currentImageIndex === index ? "white" : "rgba(255, 255, 255, 0.4)"}
                        cursor="pointer"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </Flex>
                )}
              </Box>
            )}

            {/* Tractor Details Section */}
            <Box>
              <Text fontSize={{ base: "16px", md: "18px" }} fontWeight={600} mb={3} color="#323232">
                Tractor Details
              </Text>
              <Box
                p={{ base: "16px", md: "20px" }}
                bgColor="rgba(250, 148, 17, 0.05)"
                borderRadius="10px"
                border="1px solid rgba(250, 148, 17, 0.2)"
              >
                <VStack spacing={4} align="stretch">
                  <TractorDetailRow
                    label="Tractor Name"
                    value={tractor?.name || "N/A"}
                  />
                  <TractorDetailRow
                    label="Tractor Capacity"
                    value={tractor?.horsepower ? `${tractor.horsepower} HP` : "N/A"}
                  />
                  <TractorDetailRow
                    label="Tractor Brand"
                    value={tractor?.brand || "N/A"}
                  />
                  <TractorDetailRow
                    label="Tractor Type"
                    value={tractor?.tractor_type || "N/A"}
                  />
                  <TractorDetailRow
                    label="Tractor Location"
                    value={tractor?.current_address || `${tractor?.lga}, ${tractor?.state}` || "N/A"}
                  />
                </VStack>
              </Box>
            </Box>
          </VStack>
        </ModalBody>

        {/* Book Now Button */}
        <Box
          borderTop="1px solid #ECECEC"
          p={{ base: 4, md: 6 }}
          bgColor="white"
          pb={{ base: 6, md: 6 }}
        >
          <Button
            colorScheme="orange"
            bgColor="#FA9411"
            color="white"
            w="100%"
            py={{ base: 5, md: 6 }}
            fontSize={{ base: "16px", md: "18px" }}
            fontWeight={600}
            onClick={onBookNow}
            _hover={{
              bgColor: "#e67e00",
            }}
          >
            {isAvailable ? "Book Now" : "Book Ahead"}
          </Button>
        </Box>
      </ModalContent>
    </ChakraModal>
  );
}

// Helper component for detail rows
function TractorDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justifyContent="space-between" alignItems="flex-start" gap={2}>
      <Text fontSize={{ base: "13px", md: "14px" }} fontWeight={400} color="#323232" width={{ base: "110px", md: "140px" }} flexShrink={0}>
        {label}
      </Text>
      <Text fontSize={{ base: "13px", md: "14px" }} fontWeight={600} color="#323232" textAlign="right" flex="1">
        {value}
      </Text>
    </Flex>
  );
}

// Implement Selection Modal Component
function ImplementSelectionModal({
  isOpen,
  onClose,
  tractor,
  onProceed,
}: {
  isOpen: boolean;
  onClose: () => void;
  tractor: any;
  onProceed: (implementsList: string[]) => void;
}) {
  const [localSelectedImplements, setLocalSelectedImplements] = useState<string[]>([]);

  // Separate farm implements from farm_carrier
  const farmImplements = implementTypes.filter((impl) => impl.value !== "farm_carrier");
  const farmCarrier = implementTypes.filter((impl) => impl.value === "farm_carrier");

  const handleImplementToggle = (implementValue: string) => {
    if (implementValue === "farm_carrier") {
      // If farm_carrier is selected, clear all other implements
      if (localSelectedImplements.includes("farm_carrier")) {
        setLocalSelectedImplements([]);
      } else {
        setLocalSelectedImplements(["farm_carrier"]);
      }
    } else {
      // If a farm implement is selected, remove farm_carrier and toggle the implement
      setLocalSelectedImplements((prev) => {
        const withoutCarrier = prev.filter((impl) => impl !== "farm_carrier");
        if (withoutCarrier.includes(implementValue)) {
          return withoutCarrier.filter((impl) => impl !== implementValue);
        } else {
          return [...withoutCarrier, implementValue];
        }
      });
    }
  };

  const handleProceed = () => {
    if (localSelectedImplements.length > 0) {
      onProceed(localSelectedImplements);
      onClose();
      setLocalSelectedImplements([]);
    }
  };

  const handleClose = () => {
    setLocalSelectedImplements([]);
    onClose();
  };

  return (
    <ChakraModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size={{ base: "full", md: "md" }}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        position={{ base: "fixed", md: "relative" }}
        bottom={{ base: 0, md: "auto" }}
        mb={{ base: 0, md: "auto" }}
        borderRadius={{ base: "20px 20px 0 0", md: "8px" }}
        margin={{ base: 0, md: "auto" }}
        maxH={{ base: "90vh", md: "auto" }}
      >
        <ModalHeader pt={{ base: 4, md: 4 }}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize={{ base: "16px", md: "18px" }} fontWeight={600}>
              Select Implements
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={{ base: 4, md: 6 }} overflowY="auto">
          <VStack align="stretch" spacing={4}>
            {/* Farm Implements Section */}
            {farmImplements.length > 0 && (
              <Box>
                <Text fontSize={{ base: "13px", md: "14px" }} fontWeight={600} color="#929292" mb={3}>
                  Farm Implements
                </Text>
                <VStack align="stretch" spacing={2}>
                  {farmImplements.map((implement) => (
                    <Checkbox
                      key={implement.value}
                      isChecked={localSelectedImplements.includes(implement.value)}
                      onChange={() => handleImplementToggle(implement.value)}
                      colorScheme="orange"
                    >
                      <Text fontSize={{ base: "13px", md: "14px" }} color="#929292">
                        {implement.label}
                      </Text>
                    </Checkbox>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Divider between sections */}
            {farmImplements.length > 0 && farmCarrier.length > 0 && (
              <Divider borderColor="#ECECEC" />
            )}

            {/* Transport Service Section */}
            {farmCarrier.length > 0 && (
              <Box>
                <Text fontSize={{ base: "13px", md: "14px" }} fontWeight={600} color="#929292" mb={1}>
                  Transport Service
                </Text>
                <Text fontSize={{ base: "11px", md: "12px" }} color="#92929299" mb={3}>
                  Cannot be combined with farm implements
                </Text>
                <VStack align="stretch" spacing={2}>
                  {farmCarrier.map((implement) => (
                    <Checkbox
                      key={implement.value}
                      isChecked={localSelectedImplements.includes(implement.value)}
                      onChange={() => handleImplementToggle(implement.value)}
                      colorScheme="orange"
                    >
                      <Text fontSize={{ base: "13px", md: "14px" }} color="#929292">
                        {implement.label}
                      </Text>
                    </Checkbox>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Proceed Button */}
            <Button
              colorScheme="orange"
              bgColor="#FA9411"
              color="white"
              w="100%"
              mt={4}
              py={{ base: 5, md: 6 }}
              fontSize={{ base: "16px", md: "16px" }}
              isDisabled={localSelectedImplements.length === 0}
              onClick={handleProceed}
              _hover={{
                bgColor: "#e67e00",
              }}
            >
              Proceed
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}

function TractorCard({
  name,
  image,
  location,
  tractor_type,
  setTractorId,
  id,
  status,
  coordinates,
  userCoordinates,
  onCardClick,
  tractorData
}: ITractorCard) {

  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();

  // Calculate distance when user coordinates are available
  useEffect(() => {
    if (!coordinates || !userCoordinates) {
      setDistance(null);
      return;
    }

    try {
      const calculatedDistance = calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        coordinates.latitude,
        coordinates.longitude
      );
      setDistance(calculatedDistance);
    } catch (error) {
      console.log("Error calculating distance:", error);
      setError("Unable to calculate distance");
    }
  }, [coordinates, userCoordinates]);

  const handleCardClick = () => {
    if (onCardClick && tractorData) {
      onCardClick(tractorData);
    } else {
      router.push(`/home/hire-tractor/${id}`);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (Array.isArray(image) && image.length > 1) {
      setShowImageGallery(true);
    }
  };

  const nextImage = () => {
    if (Array.isArray(image)) {
      setCurrentImageIndex((prev) => (prev + 1) % image.length);
    }
  };

  const prevImage = () => {
    if (Array.isArray(image)) {
      setCurrentImageIndex((prev) => (prev - 1 + image.length) % image.length);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showImageGallery) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case 'Escape':
          event.preventDefault();
          setShowImageGallery(false);
          break;
      }
    };

    if (showImageGallery) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showImageGallery, image]);

  return (
    <>
      <Box
        boxShadow="md"
        borderRadius="4px"
        onClick={handleCardClick}
        cursor="pointer"
      >
        <Box h="200px" position="relative">
        {Array.isArray(image) && image.length > 0 ? (
          // Multiple images - show first image with indicator
          <>
            <Image
              borderTopRadius="4px"
              src={
                image[0]?.startsWith("https") ? image[0] : "https://res.cloudinary.com/tractrac-global/image/upload/v1746446723/man-with-tractor_dxf5ly.svg"
              }
              alt="Tractor image"
              height="100%"
              width="100%"
              objectFit="cover"
              onClick={handleImageClick}
              cursor={image.length > 1 ? "pointer" : "default"}
            />
            {image.length > 1 && (
              <Box
                bgColor="rgba(0, 0, 0, 0.7)"
                borderRadius="6px"
                py="2px"
                px="8px"
                position="absolute"
                top="4"
                right="2"
              >
                <Text fontSize="12px" color="white">
                  +{image.length - 1} more
                </Text>
              </Box>
            )}
          </>
        ) : (
          // Single image or fallback
          <Image
            borderTopRadius="4px"
            src={
              typeof image === 'string' && image[0]?.startsWith("https") ? image[0] : "https://res.cloudinary.com/tractrac-global/image/upload/v1746446723/man-with-tractor_dxf5ly.svg"
            }
            alt="Tractor image"
            height="100%"
            width="100%"
            objectFit="cover"
          />
        )}
        {distance && (
          <Box
            bgColor="#FA9411"
            borderRadius="6px"
            py="2px"
            px="8px"
            position="absolute"
            bottom="4"
            right="2"
          >
            <Text fontSize="12px" color="white">
              {distance}KM Away
            </Text>
          </Box>
        )}
        {error && process.env.NODE_ENV === 'development' && (
          <Box
            bgColor="#F04438"
            borderRadius="6px"
            py="2px"
            px="8px"
            position="absolute"
            bottom="4"
            right="2"
          >
            <Text fontSize="12px" color="white">
              {error}
            </Text>
          </Box>
        )}
      </Box>

      <Box p="12px" bgColor="white" borderRadius="4px">
        <Text
          fontSize="13px"
          color="#FA9411"
          fontWeight={500}
          lineHeight="14.52px"
        >
          {name}
        </Text>
        <Text
          fontSize="12px"
          color="#323232"
          fontWeight={700}
          mt="8px"
          lineHeight="12.1px"
        >
          Tractor Type:{" "}
          <Box fontWeight={500} as="span">
            {tractor_type}
          </Box>
        </Text>

        <Box fontWeight={500} fontSize="12px" mt="8px" as="span" noOfLines={2}>
          <Box fontWeight={700} as="span">
            Location:
          </Box>{" "}
          {location.length < 2 ? "N/a" : location}
        </Box>
        <Box fontWeight={500} fontSize="12px" mt="8px" as="span" noOfLines={2}>
          <Box fontWeight={700} as="span">
            Status:
          </Box>{" "}
          {statusTypes[status]?.title}
        </Box>

        {statusTypes[status]?.color && (
          <Box
            mt="10px"
            bgColor={statusTypes[status]?.color}
            py="2px"
            textAlign="center"
            borderRadius="4px"
            w="111px"
          >
            <Text fontSize="14px" color="white">
              {status === "available"
                ? "Book now"
                : status === "in_use"
                  ? "Book ahead"
                  : status === "maintenance"
                    ? "Maintenance"
                    : "Book ahead"}
            </Text>
          </Box>
        )}
      </Box>
    </Box>

      {/* Image Gallery Modal */}
      {showImageGallery && Array.isArray(image) && image.length > 1 && (
        <ChakraModal
          isOpen={showImageGallery}
          onClose={() => setShowImageGallery(false)}
          size="xl"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justifyContent="space-between" alignItems="center">
                <Text>{name} - Images</Text>
                <Button
                  size="sm"
                  onClick={() => setShowImageGallery(false)}
                  variant="ghost"
                >
                  ✕
                </Button>
              </Flex>
            </ModalHeader>
            <ModalBody pb={6}>
              <Box position="relative" textAlign="center">
                <Image
                  src={
                    image[currentImageIndex]?.startsWith("https") 
                      ? image[currentImageIndex] 
                      : "https://res.cloudinary.com/tractrac-global/image/upload/v1746446723/man-with-tractor_dxf5ly.svg"
                  }
                  alt={`Tractor image ${currentImageIndex + 1}`}
                  maxH="400px"
                  mx="auto"
                  objectFit="contain"
                />
                
                {image.length > 1 && (
                  <>
                    <Button
                      position="absolute"
                      left="2"
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={prevImage}
                      size="sm"
                      colorScheme="orange"
                      variant="solid"
                    >
                      ‹
                    </Button>
                    <Button
                      position="absolute"
                      right="2"
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={nextImage}
                      size="sm"
                      colorScheme="orange"
                      variant="solid"
                    >
                      ›
                    </Button>
                  </>
                )}
                
                <Flex justifyContent="center" mt={4} gap={2}>
                  {image.map((_, index) => (
                    <Box
                      key={index}
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={index === currentImageIndex ? "#FA9411" : "#E2E8F0"}
                      cursor="pointer"
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </Flex>
                
                <Text fontSize="sm" color="gray.600" mt={2}>
                  {currentImageIndex + 1} of {image.length}
                </Text>
              </Box>
            </ModalBody>
          </ModalContent>
        </ChakraModal>
      )}
    </>
  );
}



function EmptyDataPlaceholder({ isSearch }: { isSearch: boolean }) {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box bgColor="white" width="100%" p="60px" textAlign="center" mt="20px">
        {/* <Box bgColor="white" width="400px" p="60px" textAlign="center" mt="40px"> */}
        <Center>
          <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446712/empty-state_tytpqr.svg" alt="Empty state image icon" />
        </Center>
        <Text color="#323232" fontWeight="700" fontSize="20px" mt="57px">
          {isSearch ? "Search result is empty" : " Tractors list is empty"}
        </Text>

        <Text color="#323232" fontWeight="400" fontSize="18px">
          Available tractors will be listed on this page
        </Text>
      </Box>
    </Flex>
  );
}

function SelectComponent({
  options,
  onSelected,
}: {
  options: any;
  onSelected: any;
}) {
  const [value, setValue] = useState();

  const updateValue = ({ target }: { target: any }) => {
    alert(`before->${value}`);
    setValue(target.value);
    if (onSelected) onSelected(target.value);
    alert(`after->${value}`);
  };

  return (
    <>
      {/* <label htmlFor={optionList.id}>{optionList.label}</label> */}
      <Select
        id="1"
        // id={optionList.id}
        // name={optionList.name}
        value={value}
        onChange={updateValue}
      >
        {options.map((option: any) => (
          <option value={option.toLowerCase()} key={option}>
            {option}
          </option>
        ))}
      </Select>
      {/* <button>{optionList.buttonLabel}</button> */}
    </>
  );
}



const brands = ["case_ih", "sonalika", "john_deere", "mahindra", "others"];

// const tractorTypes = ["Harrower", "Ridger", "Plough", "Planter", "Sprayer"];



