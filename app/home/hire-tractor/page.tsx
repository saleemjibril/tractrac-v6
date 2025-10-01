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
  Image,
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
} from "@chakra-ui/react";
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

const fileTypes = ["JPG", "PNG", "JPEG"];

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })
const tractorTypes = ["small", "medium", "large", "specialized", "utility"];


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
  const [userCoordinates, setUserCoordinates] = useState<ICoordinates | null>(null);
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
    setLocationBasedState(); // Automatically set state and LGA based on user's location
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
  }, [state, lga, tractorType, tractorSearchTerm, userToken]);

  const clearFilters = async () => {
    setState(null);
    setLga(null);
    setTractorType(null);
    await handleGetTractors();
  }
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
          console.log(`Tractor ${tractor.name}: ${distance}km away`);
          return { ...tractor, distanceFromUser: distance };
        }
        console.log(`Tractor ${tractor.name}: no coordinates`);
        return { ...tractor, distanceFromUser: Infinity }; // Put tractors without coordinates at the end
      })
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
    
    console.log("Sorted tractors by distance:", sortedTractors.map(t => ({ name: t.name, distance: t.distanceFromUser })));
    return sortedTractors;
  };

  return (
    <SidebarWithHeader isAuth={true}>
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
              <Map />
            )}
            {/* <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446725/map_punpe8.svg" alt="map image" /> */}
          </Stack>
          <Box mt="40px">
            <SimpleGrid columns={{ base: 2, lg: 4 }} spacing="20px" width={"fit-content"} mb={"20px"}>
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


              <Button
                bgColor="#FA9411"
                height="42px"
                borderRadius="4px"
                width="170px"
                color="white"
                as="a"
                _hover={{
                  opacity: 0.8,
                }}
                onClick={clearFilters}
              >
                <Flex justifyContent="center" alignContent="center">
                  <Text fontSize="14px">Clear filters</Text>
                </Flex>
              </Button>



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
              // onFocus={handleUserInputFocus}
              placeholder="Type to search tractors by name, description, brand, model, location, etc."
              bgColor="#FFF"
              fontSize="12px"
              color="#323232"
            />
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


function TractorCard({
  name,
  image,
  location,
  tractor_type,
  setTractorId,
  id,
  status,
  coordinates,
  userCoordinates
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
    router.push(`/home/hire-tractor/${id}`);
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



