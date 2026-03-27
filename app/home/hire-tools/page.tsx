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
  VStack,
  List,
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
  Divider,
  HStack,
  Collapse,
  ListItem,
  TagCloseButton,
  TagLabel,
  Tag
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../../components/Sidenav";
import { Formik, Form, Field } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { AddIcon, ArrowForwardIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/utils/errorUtils";
import { Select as MultiSelect } from "chakra-react-select";
import * as nigerianStates from "nigerian-states-and-lgas";
import { ArrowDown2, Filter } from "iconsax-react";
import {
  useLazyGetTractorsQuery,
  useHireTractorMutation,
  useLazyGetSearchTractorsQuery,
} from "@/redux/services/tractorApi";
import dynamic from "next/dynamic";
import moment from "moment";
import Link from "next/link";
import { states } from "@/app/utils/states";
import { filterTools, getToolBookedDates, getApprovedTools, hireTool } from "@/app/apis/tools";
import { getgroups } from "process";
import { getGroups, getGroupsMembers } from "@/app/apis/user";
const ToolMap = dynamic(() => import("@/app/components/ToolMap"), { ssr: false });

const fileTypes = ["JPG", "PNG", "JPEG"];

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })
const tractorTypes = [
  { value: "solar_sprayer", label: "Solar Sprayer" },
  { value: "fertilizer_applicator", label: "Fertilizer Applicator" },
  { value: "soil_testing_kit", label: "Soil Testing Kit" },
  { value: "multi_seed_thresher", label: "Multi Seed Thresher" },
  { value: "water_pump", label: "Water Pump" },
  { value: "irrigation_system", label: "Irrigation System" },
  { value: "crop_dryer", label: "Crop Dryer" },
  { value: "harvesting_tools", label: "Harvesting Tools" },
  { value: "other", label: "Other" }
];

const conditionOptions = [
  { value: "new", label: "New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "needs_repair", label: "Needs Repair" }
];

const powerSourceOptions = [
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "petrol", label: "Petrol" },
  { value: "solar_energy", label: "Solar Energy" },
  { value: "manual", label: "Manual" },
  { value: "battery", label: "Battery" },
  { value: "animal_power", label: "Animal Power" }
];

interface ICoordinates {
  latitude: number;
  longitude: number;
}

interface ITractorCard {
  id: string;
  groupId: string;
  name: string;
  image: string;
  capacity: string;
  location: string;
  status: string;
  addon_type: string;
  setTractorId: Dispatch<SetStateAction<string | null>>;
  setGroupId: Dispatch<SetStateAction<string | null>>;
  coordinates: ICoordinates;
  distance?: number;
}

interface Group {
  id: string;
  name: string;
  description: string;
}


const statusTypes: Record<string, { title: string; color: string }> = {
  booked: { title: "Booked", color: "#FA9411" },
  available: { title: "Available", color: "#27AE60" },
  maintenance: { title: "Maintenance", color: "#FF0000" },
  in_use: { title: "In Use", color: "#FA9411" },
};

export default function HireTractor() {
  const { userToken } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const groupDropdownRef = useRef<HTMLDivElement>(null);
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
  const [group, setGroup] = useState("");
  const [groupId, setGroupId] = useState("");
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState<boolean>(false);
  const [groupSearchTerm, setGroupSearchTerm] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedToolType, setSelectedToolType] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedPowerSource, setSelectedPowerSource] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // const [getTractors, result] = useLazyGetTractorsQuery();
  const [result] = useLazyGetTractorsQuery();
  const [trigger, searchResult] = useLazyGetSearchTractorsQuery({});

  // Redirect to specific tool page when a tool is selected
  useEffect(() => {
    if (tractorId) {
      router.push(`/home/hire-tools/${tractorId}`);
    }
  }, [tractorId, router]);

  const handleGetTractors = async (page: number = currentPage, limit: number = itemsPerPage) => {
    setLoading(true);
    try {
      if (typeof userToken === "string") {
        const skip = (page - 1) * limit;
        // Assuming your API supports pagination parameters
        const response = await getApprovedTools(userToken, skip, limit);
        console.log("getApprovedTools", response);
        
        setTractors(response?.data?.data || response?.data || []);
        
        // Handle pagination info from response
        if (response?.data?.total !== undefined) {
          setTotalItems(response.data.total);
          setTotalPages(Math.ceil(response.data.total / limit));
        } else if (response?.data?.pagination) {
          setTotalItems(response.data.pagination.total);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          // If no pagination info is returned, calculate based on response length
          const dataLength = response?.data?.length || 0;
          if (dataLength === limit) {
            // There might be more pages
            setTotalPages(page + 1);
          } else {
            setTotalPages(page);
          }
        }
        
        console.log("getApprovedTools", response);
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
    handleGetTractors(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchFilteredTractors = async () => {
      setLoading(true);
      console.log("change", state, selectedToolType, lga, selectedGroup, selectedCondition, selectedPowerSource);

      // Build query parameters
      const queryParams = new URLSearchParams();

      // Only add parameters that have values
      if (state) queryParams.append("state", state);
      if (lga) queryParams.append("local_government_area", lga);
      if (selectedToolType) queryParams.append("addon_type", selectedToolType);
      if (selectedCondition) queryParams.append("condition", selectedCondition);
      if (selectedPowerSource) queryParams.append("power_source", selectedPowerSource);
      if (selectedGroup) queryParams.append("group_id", selectedGroup);
      
      // Add pagination parameters
      const skip = (currentPage - 1) * itemsPerPage;
      queryParams.append("skip", skip.toString());
      queryParams.append("limit", itemsPerPage.toString());

      // Convert URLSearchParams to string
      const queryString = queryParams.toString();

      if (queryString && (state || lga || selectedToolType || selectedCondition || selectedPowerSource || selectedGroup)) {
        console.log("query parameters:", queryString);

        try {
          // Now we can use await properly inside the async function
          const response = await filterTools(
            queryString,
            userToken as string
          );
          console.log("filterTractors", response);
          
          setTractors(response?.data?.data || response?.data || []);
          
          // Handle pagination info from filtered response
          if (response?.data?.total !== undefined) {
            setTotalItems(response.data.total);
            setTotalPages(Math.ceil(response.data.total / itemsPerPage));
          } else if (response?.data?.pagination) {
            setTotalItems(response.data.pagination.total);
            setTotalPages(response.data.pagination.totalPages);
          }

          // Assuming response has a data property
          // setSearchData(response?.data || []);
        } catch (error) {
          console.log("Search error:", error);
          setSearchData([]);
        } finally {
          setLoading(false);
        }
      } else if (!state && !lga && !tractorType && !selectedGroup) {
        // If no filters are applied, get regular tractors with pagination
        handleGetTractors(currentPage, itemsPerPage);
      } else {
        setLoading(false);
      }
    };

    // Call the async function
    fetchFilteredTractors();
  }, [state, lga, selectedToolType, selectedCondition, selectedPowerSource, selectedGroup, userToken, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const clearFilters = () => {
    setState(null);
    setLga(null);
    setTractorType(null);
    setSelectedToolType(null);
    setSelectedCondition(null);
    setSelectedPowerSource(null);
    setGroup("");
    setCurrentPage(1); // Reset to first page when clearing filters
    handleGetTractors(1, itemsPerPage);
  }

  async function search() {
    // alert(state);
    try {
      let param = "";
      if (state && brand && implement) {
        param = `${implement}/${brand}/${state}`;
      } else if (state && !brand && !implement) {
        param = state;
      } else if (!state && brand && implement) {
        param = `${implement}/${brand}`;
      } else if (!state && !brand && implement) {
        param = implement;
      } else if (!state && brand && !implement) {
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

  function snakeToCamelWithSpaces(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }






  const handleGetGroups = async () => {
    try {
      const response = await getGroups(userToken as string);
      console.log("getGroups", response);
      setGroups(response?.data || []);
    } catch (err) {
      const error = err as any;
      console.log("Error getting groups", error);
      // toast({
      //   title: "Error",
      //   description:
      //     error?.response?.data?.detail || "Failed to load groups",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };
  useEffect(() => {
    handleGetGroups();
  }, []);

    // Handle click outside to close dropdowns
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
       
        if (
          groupDropdownRef.current &&
          !groupDropdownRef.current.contains(event.target as Node)
        ) {
          setIsGroupDropdownOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
// Handle group selection
const handleGroupSelect = (groupId: string): void => {
  setSelectedGroup(groupId.toString());
  setIsGroupDropdownOpen(false);
  setGroupSearchTerm("");

  // Fetch members for the selected group
  // handleGetGroupMembers(groupId);
};
  const toggleGroupDropdown = (): void => {
    setIsGroupDropdownOpen(!isGroupDropdownOpen);
    // if (!isGroupDropdownOpen) {
    //   setIsUserDropdownOpen(false);
    // }
  };

  // Get selected group name for display
  const getSelectedGroupName = (): string => {
    const group = groups.find((g) => g.id === selectedGroup);
    console.log("yooop", {
      selectedGroup,
      groups,
      group
    });
    return group ? group.name : "";
  };

  // Handle group input focus - close user dropdown when group dropdown opens
  const handleGroupInputFocus = (): void => {
    setIsGroupDropdownOpen(true);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setter(e.target.value);
  };
    // Filter groups based on search term
    const filteredGroups: Group[] = groups.filter(
      (group: Group) =>
        group?.name?.toLowerCase()?.includes(groupSearchTerm.toLowerCase()) ||
        group?.description?.toLowerCase()?.includes(groupSearchTerm.toLowerCase())
    );


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
              Hire Agro Tools
            </Text>
            {loading ? (
              <Skeleton
                mt="12px"
                height="360px"
                borderRadius="4px"
              // w="111px"
              />
            ) : (
              <ToolMap
              coordinates={tractors.map((item: any) => ({
                lat: item?.current_location_lat,
                lng: item?.current_location_lng,
                title: item?.name
              }))}
            />
            )}
            {/* <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446725/map_punpe8.svg" alt="map image" /> */}
          </Stack>

          {/* Pagination Info and Items Per Page Selector */}
          <Flex
            justifyContent="space-between"
            alignItems="center"
            py="10px"
            mt="20px"
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="14px" color="gray.600">
              {/* {totalItems > 0 
                ? `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} tools`
                : "No tools found"
              } */}
            </Text>
            
            <HStack spacing={2}>
              <Text fontSize="14px" color="gray.600">Items per page:</Text>
              <Select
                size="sm"
                width="80px"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </HStack>
          </Flex>

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
              >
               Clear filters
              </Button>}
            </Flex>

            {/* Collapsible Filter Section */}
            <Collapse in={showFilters} animateOpacity>
              <Box>
              <SimpleGrid display={"flex"} gap={"20px"} flexWrap={"wrap"} width={"fit-content"} mb={"20px"} alignItems={"start"}>
              <Box>
                    <Text fontSize="12px" color="#323232" mb="6px" fontWeight={700}>State</Text>
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
                    setState(e?.currentTarget?.value);
                    setCurrentPage(1); // Reset to first page when filter changes
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
                    setCurrentPage(1);
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
                    <Text fontSize="12px" color="#323232" mb="6px" fontWeight={700}>Local Government Area</Text>
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
                    setCurrentPage(1); // Reset to first page when filter changes
                    // search();
                  } else {
                    setLga(null);
                    setCurrentPage(1);
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
                  <Box maxWidth={"700px"}>
                    <Text fontSize="12px" color="#323232" mb="6px" fontWeight={700}>Tool Type</Text>
                    <Flex gap="8px" wrap="wrap" align="center">
                      {tractorTypes.map((toolType) => (
                        <Button
                          key={toolType.value}
                          size="sm"
                          variant={selectedToolType === toolType.value ? "solid" : "outline"}
                          colorScheme={selectedToolType === toolType.value ? "orange" : "gray"}
                          bgColor={selectedToolType === toolType.value ? "#FA9411" : "transparent"}
                          color={selectedToolType === toolType.value ? "white" : "#FA9411"}
                borderColor="#FA9411"
                          borderRadius="20px"
                          fontSize="12px"
                          fontWeight="500"
                          px="16px"
                          py="8px"
                          height="32px"
                          _hover={{
                            bgColor: selectedToolType === toolType.value ? "#e67e00" : "#FA941110",
                          }}
                          _active={{
                            bgColor: selectedToolType === toolType.value ? "#e67e00" : "#FA941120",
                          }}
                          onClick={() => {
                            setSelectedToolType(
                              selectedToolType === toolType.value ? null : toolType.value
                            );
                    setCurrentPage(1); // Reset to first page when filter changes
                          }}
                        >
                          {toolType.label}
                        </Button>
                      ))}
                    </Flex>
                  </Box>

                {/* Condition Filter Pills */}
                <Box>
                  <Text fontSize="12px" color="#323232" mb="6px" fontWeight={700}>Condition</Text>
                  <Flex gap="8px" wrap="wrap" align="center">
                    {conditionOptions.map((condition) => (
                      <Button
                        key={condition.value}
                        size="sm"
                        variant={selectedCondition === condition.value ? "solid" : "outline"}
                        colorScheme={selectedCondition === condition.value ? "orange" : "gray"}
                        bgColor={selectedCondition === condition.value ? "#FA9411" : "transparent"}
                        color={selectedCondition === condition.value ? "white" : "#FA9411"}
                        borderColor="#FA9411"
                        borderRadius="20px"
                        fontSize="12px"
                        fontWeight="500"
                        px="16px"
                        py="8px"
                        height="32px"
                        _hover={{
                          bgColor: selectedCondition === condition.value ? "#e67e00" : "#FA941110",
                        }}
                        _active={{
                          bgColor: selectedCondition === condition.value ? "#e67e00" : "#FA941120",
                        }}
                        onClick={() => {
                          setSelectedCondition(
                            selectedCondition === condition.value ? null : condition.value
                          );
                          setCurrentPage(1); // Reset to first page when filter changes
                        }}
                      >
                        {condition.label}
                      </Button>
                    ))}
                  </Flex>
                </Box>

                {/* Power Source Filter Pills */}
                {/* <Box>
                  <Text fontSize="12px" color="#323232" mb="6px" fontWeight={700}>Power Source</Text>
                  <Flex gap="8px" wrap="wrap" align="center">
                    {powerSourceOptions.map((powerSource) => (
                      <Button
                        key={powerSource.value}
                        size="sm"
                        variant={selectedPowerSource === powerSource.value ? "solid" : "outline"}
                        colorScheme={selectedPowerSource === powerSource.value ? "orange" : "gray"}
                        bgColor={selectedPowerSource === powerSource.value ? "#FA9411" : "transparent"}
                        color={selectedPowerSource === powerSource.value ? "white" : "#FA9411"}
                        borderColor="#FA9411"
                        borderRadius="20px"
                        fontSize="12px"
                        fontWeight="500"
                        px="16px"
                        py="8px"
                        height="32px"
                        _hover={{
                          bgColor: selectedPowerSource === powerSource.value ? "#e67e00" : "#FA941110",
                        }}
                        _active={{
                          bgColor: selectedPowerSource === powerSource.value ? "#e67e00" : "#FA941120",
                        }}
                        onClick={() => {
                          setSelectedPowerSource(
                            selectedPowerSource === powerSource.value ? null : powerSource.value
                          );
                          setCurrentPage(1); // Reset to first page when filter changes
                        }}
                      >
                        {powerSource.label}
                      </Button>
                    ))}
                  </Flex>
                </Box> */}
            </SimpleGrid>

                {/* Group Selection */}
              </Box>
            </Collapse>
                <FormControl 
                  padding={"24px 0"}
                >
              <Flex justify="space-between" align="center" mb={3}>
                <FormLabel fontSize="12px" color="#323232" mb={0}>
                  Select Group
                </FormLabel>
               
              </Flex>

              {/* Selected Group Display */}
              {selectedGroup && (
                <Box mb={3}>
                  <Text fontSize="12px" color="#666" mb={2}>
                    Selected Group:
                  </Text>
                  <Tag size="md" colorScheme="green" variant="solid">
                    <TagLabel>{getSelectedGroupName()}</TagLabel>
                    <TagCloseButton onClick={() => setSelectedGroup("")} />
                  </Tag>
                </Box>
              )}

              {/* Groups Dropdown */}
              <Box position="relative" ref={groupDropdownRef}>
                <Input
                  value={groupSearchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setGroupSearchTerm)
                  }
                  onFocus={handleGroupInputFocus}
                  placeholder="Search and select a group..."
                  bgColor="#3232320D"
                  fontSize="12px"
                  color="#323232"
                />

                <Button
                  position="absolute"
                  right={0}
                  top={0}
                  h="100%"
                  bg="transparent"
                  onClick={toggleGroupDropdown}
                  _hover={{ bg: "transparent" }}
                >
                  {isGroupDropdownOpen ? (
                    <ChevronUpIcon />
                  ) : (
                    <ChevronDownIcon />
                  )}
                </Button>

                <Collapse in={isGroupDropdownOpen}>
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    zIndex={10}
                    bg="white"
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                    maxH="200px"
                    overflowY="auto"
                    mt={1}
                    boxShadow="md"
                  >
                    <List>
                      {filteredGroups.length > 0 ? (
                        filteredGroups.map((group: Group) => (
                          <ListItem key={group.id}>
                            <Box
                              p={3}
                              cursor="pointer"
                              _hover={{ bg: "gray.50" }}
                              onClick={() => handleGroupSelect(group.id)}
                              bg={
                                selectedGroup === group.id.toString()
                                  ? "blue.50"
                                  : "white"
                              }
                            >
                              <VStack align="start" spacing={0}>
                                <HStack justify="space-between" w="100%">
                                  <Text fontSize="14px" fontWeight="medium">
                                    {group.name}
                                  </Text>
                                  {/* <Button
                                    size="xs"
                                    bg="transparent"
                                    p={1}
                                    minW="auto"
                                    h="auto"
                                    // onClick={(e) => handleCopyGroupId(group.id, group.name, e)}
                                    _hover={{ bg: "gray.200" }}
                                    _focus={{ bg: "gray.200" }}
                                    title={`Copy Group ID: ${group.id}`}
                                  >
                                    <CopyIcon boxSize="12px" color="gray.600" />
                                  </Button> */}
                                </HStack>
                                <Text fontSize="12px" color="gray.500">
                                  {group.description}
                                </Text>
                                <Text fontSize="10px" color="gray.400" mt={1}>
                                  ID: {group.id}
                                </Text>
                              </VStack>
                            </Box>
                          </ListItem>
                        ))
                      ) : (
                        <ListItem p={3}>
                          <Text fontSize="14px" color="gray.500">
                            No groups found
                          </Text>
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Collapse>
              </Box>
            </FormControl>

            {
              // searchResult?.isFetching ||
              loading ? (
                <SimpleGrid
                  columns={{ base: 1, md: 4 }}
                  spacingX="20px"
                  spacingY="15px"
                  mt="30px"
                >
                  {Array.from({ length: itemsPerPage }, (_, index) => (
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
                    </Box>
                  ))}
                </SimpleGrid>
              ) : tractors?.length < 1 ? (
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
                      setGroupId={setGroupId}
                      id={tractor?.id}
                      groupId={tractor?.group_id}
                      name={`${tractor?.name}`}
                      image={tractor?.image_urls}
                      capacity=" 105 to 135 HP"
                      location={`${tractor?.local_government_area},${tractor?.state}`}
                      // location={tractor?.address}
                      // distance={"10"}
                      distance={tractor?.distance}
                      addon_type={tractor?.addon_type}
                      status={tractor?.status}
                      coordinates={{
                        latitude: tractor?.current_location_lat,
                        longitude: tractor?.current_location_lng
                      }}
                    />
                  ))}
                </SimpleGrid>
              )
            }

            {/* Pagination Controls */}
            {!loading && tractors.length > 0 && totalPages > 1 && (
              <Box py="20px" borderTop="1px solid" borderColor="gray.200" mt="20px">
                <Flex justifyContent="center" alignItems="center">
                  <HStack spacing={2}>
                    {/* Previous Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      isDisabled={currentPage === 1}
                      leftIcon={<ChevronLeftIcon />}
                    >
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    {generatePageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={currentPage === pageNum ? "solid" : "outline"}
                        bgColor={currentPage === pageNum ? "#FA9411" : "transparent"}
                        color={currentPage === pageNum ? "white" : "#FA9411"}
                        borderColor="#FA9411"
                        onClick={() => handlePageChange(pageNum)}
                        _hover={{
                          bgColor: currentPage === pageNum ? "#FA9411" : "#FFF5E6",
                        }}
                      >
                        {pageNum}
                      </Button>
                    ))}

                    {/* Show ellipsis and last page if needed */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <Text>...</Text>
                        <Button
                          size="sm"
                          variant="outline"
                          borderColor="#FA9411"
                          color="#FA9411"
                          onClick={() => handlePageChange(totalPages)}
                          _hover={{ bgColor: "#FFF5E6" }}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}

                    {/* Next Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      isDisabled={currentPage === totalPages}
                      rightIcon={<ChevronRightIcon />}
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            )}
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
    addon_type,
    setTractorId,
    setGroupId,
    id,
    groupId,
    status,
    coordinates
  }: ITractorCard) {
  
    const [userCoordinates, setUserCoordinates] = useState<ICoordinates | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
  
    // Get user's location on component mount
    useEffect(() => {
      console.log("coordinates", coordinates);
  
      if (!coordinates) return;
  
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserCoordinates(userCoords);
  
            // Calculate distance once we have user coordinates
            const calculatedDistance = calculateDistance(
              userCoords.latitude,
              userCoords.longitude,
              coordinates.latitude,
              coordinates.longitude
            );
            setDistance(calculatedDistance);
          },
          (error) => {
            console.log("Error getting user location:", error);
            setError("Unable to get your location");
          }
        );
      } else {
        setError("Geolocation is not supported by your browser");
      }
    }, [coordinates]);
  
    return (
      <Box
        boxShadow="md"
        borderRadius="4px"
        onClick={() => router.push(`/home/hire-tools/${id}?group_id=${groupId}`)}
        cursor="pointer"
      >
        <Box h="200px" position="relative">
          <Image
            borderTopRadius="4px"
             src={
            image?.startsWith("https")
              ? image
              : "https://res.cloudinary.com/tractrac-global/image/upload/v1746446723/man-with-tractor_dxf5ly.svg"
          }
            alt="Tractor image"
            height="100%"
            width="100%"
            objectFit="cover"
          />
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
            Tool Type:{" "}
            <Box fontWeight={500} as="span">
            {addon_type?.split("_")?.join(" ")}
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
                    : "Book ahead"}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
  
  // HireTractorForm function removed - now handled by [id] page
  
  function EmptyDataPlaceholder({ isSearch }: { isSearch: boolean }) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Box bgColor="white" width="100%" p="60px" textAlign="center" mt="20px">
          {/* <Box bgColor="white" width="400px" p="60px" textAlign="center" mt="40px"> */}
          <Center>
            <Image src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446712/empty-state_tytpqr.svg" alt="Empty state image icon" />
          </Center>
          <Text color="#323232" fontWeight="700" fontSize="20px" mt="57px">
            {isSearch ? "Search result is empty" : "Agro Tools list is empty"}
          </Text>
  
          <Text color="#323232" fontWeight="400" fontSize="18px">
            Available Agro Tools will be listed on this page
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
  
  const brands = ["case_ih", "sonalika", 
    // "john_deere",
     "mahindra", "others"];
  
  // const tractorTypes = ["Harrower", "Ridger", "Plough", "Planter", "Sprayer"];
  
  const implementTypes = [
    {
      label: "Harrow",
      value: "harrow",
      // colorScheme: "red", // This is allowed because of the key in the `OptionBase` type
    },
    {
      label: "Plow",
      value: "plow",
    },
    {
      label: "Ridger",
      value: "ridger",
    },
    {
      label: "Harvester",
      value: "harvester",
    },
    {
      label: "Seeder",
      value: "seeder",
    },
    {
      label: "Plough",
      value: "plough",
    },
    {
      label: "Planter",
      value: "planter",
    },
    {
      label: "Sprayer",
      value: "sprayer",
    },
    // ,
    // {
    //   label: "Other",
    //   value: "other",
    // },
  ];
  
  const landMeasurementUnits = [
    {
      label: "Square Meter",
      value: "square_meter",
    },
    {
      label: "Acre",
      value: "acre",
    },
    {
      label: "Hectare",
      value: "hectare",
    },
  
    {
      label: "Square Foot",
      value: "square_foot",
    },
    {
      label: "Square Mile",
      value: "square_mile",
    },
    {
      label: "Square Kilometer",
      value: "square_kilometer",
    },
    {
      label: "Other",
      value: "other",
    },
  ];
  
  
  const ageBrackets = [
    "18-35",
    "36 & above"
  ];
  