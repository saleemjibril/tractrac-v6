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
  Tooltip
} from "@chakra-ui/react";;
import Image from "@/app/components/Image";
import { SidebarWithHeader } from "../../../components/Sidenav";
import { Formik, Form, Field } from "formik";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
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
import Autocomplete from "react-google-autocomplete";

import {
  filterTractors,
  getApprovedTractors,
  getBookedDates,
  getTractor,
  getTractors,
  hireTractor,
  hireTractorWithoutFarmSize,
} from "@/app/apis/tractor";
import moment from "moment";
import Link from "next/link";
import { states } from "@/app/utils/states";

export default function HireTractorForm() {
    const [error, setError] = useState<string | null>(null);
    const { userToken } = useAppSelector((state) => state.auth);
    const [open, setOpen] = useState(false);
    const [ndcCalendar, setNdcCalendar] = useState(false);
    const [firstDate, setFirstDate] = useState(null);
    const [lastDate, setLastDate] = useState(null);
    const [lgas, setLgas] = useState<string[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [bookedDates, setBookedDates] = useState([]);
    const [tractorImplements, setTractorImplements] = useState([]);
  
    const [inRangeLoading, setInRangeLoading] = useState(false);
    const { profileInfo } = useAppSelector((state) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [farmId, setFarmId] = useState<string | null>(null);

  const { id } = useParams();
  
  
    console.log("profileInfo", profileInfo);
  
    const handleGetBookedDates = async () => {
      try {
        const response = await getBookedDates(id as string, userToken as string);
        console.log("getBookedDates", response);
        setBookedDates(response?.data?.booked_dates);
      } catch (error) {
        console.log("ERROR", error);
      }
      // if (response?.data?.statusCode === 200) {
      //   setBookedDates(response?.data?.message[2]?.values);
      // } else {
      //   toast.error(response?.data?.message);
      // }
  
      // Fetch data from backend or local storage and update state
      // Available dates
  
      // const events = [
      //   ...bookedDates.map((date) => ({
      //     start: new Date(date),
      //     end: new Date(date),
      //     title: "Available",
      //     isAvailable: true,
      //   })),
      //   ...bookedDates.map((date) => ({
      //     start: new Date(date),
      //     end: new Date(date),
      //     title: "Booked",
      //     isAvailable: false,
      //   })),
      // ];
  
      // setEvents(events);
    };
    const handleGetTractor = async () => {
      try {
        const response = await getTractor(id as string, userToken as string);
        console.log("getTractor", response);
        setTractorImplements(response?.data?.implement_types);
      } catch (error) {
        console.log("ERROR GETTING TRACTOR IMPLEMENTS", error);
      }
      // if (response?.data?.statusCode === 200) {
      //   setBookedDates(response?.data?.message[2]?.values);
      // } else {
      //   toast.error(response?.data?.message);
      // }
  
      // Fetch data from backend or local storage and update state
      // Available dates
  
      // const events = [
      //   ...bookedDates.map((date) => ({
      //     start: new Date(date),
      //     end: new Date(date),
      //     title: "Available",
      //     isAvailable: true,
      //   })),
      //   ...bookedDates.map((date) => ({
      //     start: new Date(date),
      //     end: new Date(date),
      //     title: "Booked",
      //     isAvailable: false,
      //   })),
      // ];
  
      // setEvents(events);
    };
  
  useEffect(() => {
    handleGetBookedDates();
    handleGetTractor();
  }, []);

  // Show success message when farm size is populated from measurement
  useEffect(() => {
    const farmSizeFromMeasurement = searchParams.get('farm_size');
    const measurementIdFromUrl = searchParams.get('measurement_id');
    const prefilledAddress = searchParams.get('address');
    if (measurementIdFromUrl) {
      setFarmId(measurementIdFromUrl);
    }
    if (farmSizeFromMeasurement) {
      toast.success(`Farm measurement completed! Area: ${farmSizeFromMeasurement} square meters`);
      
      // Clean up the URL by removing parameters after showing the message and capturing IDs
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('farm_size');
      if (measurementIdFromUrl) newUrl.searchParams.delete('measurement_id');
      if (prefilledAddress) newUrl.searchParams.delete('address');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);
  
    function validateEmpty(value: any) {
      let error;
      if (!value) {
        error = "This field is required";
      }
      return error;
    }
  
    const handleNdcCalendarClick = () => {
      setNdcCalendar(!ndcCalendar);
    };
  
    // Helper function to check if there are any booked dates in the given range
    const checkForBookedDatesInRange = (start: string, end: string) => {
      if (!bookedDates || bookedDates.length === 0) {
        return false;
      }
  
      const startDate = new Date(start);
      const endDate = new Date(end);
  
      // Go through each day between start and end to check if any are booked
      const currentDate = new Date(startDate);
  
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
        if (bookedDates.includes(dateString)) {
          return true; // Found a booked date in the range
        }
  
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return false; // No booked dates in the range
    };
  
  
    const handleDateRangeClick = (date: string) => {
      // Don't proceed if the date is booked
      if (bookedDates?.includes(date)) {
        return;
      }
  
      // Get today's date for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Parse the selected date
      const selectedDate = new Date(date);
  
      // Don't allow selection of today or past dates (additional safety check)
      if (selectedDate <= today) {
        return;
      }
  
      if (!firstDate) {
        // Set first date if none is selected yet
        setFirstDate(date);
      } else if (firstDate && !lastDate) {
        // Compare full dates instead of just the day part
        const firstDateObj = new Date(firstDate);
        const dateObj = new Date(date);
  
        if (firstDateObj > dateObj) {
          // If the selected date is before the first date, swap them
          setLastDate(firstDate);
          setFirstDate(date);
        } else {
          // Before setting the last date, check if there are any booked dates in the range
          const hasBookedDatesInRange = checkForBookedDatesInRange(firstDate, date);
  
          if (hasBookedDatesInRange) {
            // If there are booked dates in the range, reset the selection and use the new date as first date
            setFirstDate(date);
            setLastDate(null);
          } else {
            // Otherwise, set it as the last date
            setLastDate(date);
          }
        }
      } else if (firstDate && lastDate) {
        // Reset selection and start a new range
        setFirstDate(date);
        setLastDate(null);
      }
    };
  
  
    const renderCalendarGridRange = () => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const startDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
      // Get today's date for comparison
      const today = new Date();
      const currentDay = today.getDate();
      const currentRealMonth = today.getMonth();
      const currentRealYear = today.getFullYear();
  
      const rows = [];
      let calendarDay = 1;
  
      console.log("perimiter", new Date().getMonth());
      console.log("perimiter", new Date().getFullYear());
  
      // Create the calendar grid
      for (let i = 0; i < 6; i++) {
        const days = [];
  
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < startDay) {
            // Render empty cells for days before the first of the month
            days.push(<div key={`empty-${j}`} className="calendar-cell"></div>);
          } else if (calendarDay > daysInMonth) {
            // Finish rendering the calendar grid
            break;
          } else {
            // Render the date cell
            const dateString = `${currentYear}-${String(
              currentMonth + 1
            ).padStart(2, "0")}-${String(calendarDay).padStart(2, "0")}`;
  
            const isAvailable = !bookedDates?.includes(dateString);
            const isBooked = bookedDates?.includes(dateString);
  
            // const isPastOrToday = 
            // currentYear < currentRealYear || 
            // (currentYear === currentRealYear && currentMonth < currentRealMonth) || 
            // (currentYear === currentRealYear && currentMonth === currentRealMonth && calendarDay <= currentDay);
  
            const isPast =
              currentYear < currentRealYear ||
              (currentYear === currentRealYear && currentMonth < currentRealMonth) ||
              (currentYear === currentRealYear && currentMonth === currentRealMonth && calendarDay < currentDay);
  
  
  
            const cellClassName = `calendar-cell ndc-calendar-date${isAvailable && !isPast ? " available" : ""
              }${isBooked ? " booked" : ""}${isPast ? " disabled" : ""
              }`;
  
  
            days.push(
              <Tooltip
                label={
                  bookedDates?.includes(dateString)
                    ? "This tractor has been booked for this date"
                    : ""
                }
                aria-label="A tooltip"
              >
                <div
                  key={dateString}
                  className={
                    firstDate === dateString
                      ? `active-date ${cellClassName}`
                      : lastDate === dateString
                        ? `active-date ${cellClassName}`
                        : parseInt(firstDate?.split("-")[2]) <
                          parseInt(dateString?.split("-")[2]) &&
                          parseInt(lastDate?.split("-")[2]) >
                          parseInt(dateString?.split("-")[2])
                          ? `subsidiary-date ${cellClassName}`
                          : cellClassName
                  }
                  onClick={() => handleDateRangeClick(dateString)}
                >
                  {calendarDay}
                  {isBooked && (
                    <div className="booked-icon">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 3L3 9M3 3L9 9"
                          stroke="#DC2626"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Tooltip>
            );
            calendarDay++;
          }
        }
  
        rows.push(
          <div key={`row-${i}`} className="ndc-calendar-row">
            {days}
          </div>
        );
      }
  
      return (
        <div>
          <div className="calendar-grid">
            <div className="ndc-calendar-row calendar-header">
              {daysOfWeek.map((day, index) => (
                <div key={`header-${index}`} className="calendar-cell">
                  {day}
                </div>
              ))}
            </div>
            {rows}
          </div>
          
          {/* Calendar Indicators */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginTop: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#999',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '12px', color: '#666' }}>Past Date</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#DC2626',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '12px', color: '#666' }}>Booked Date</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#FA9411',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '12px', color: '#666' }}>Selected Date</span>
            </div>
          </div>
        </div>
      );
    };
  
    const handleIncrementMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };
  
    const handleDecrementMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };
  
    const clearDateSelection = () => {
      setFirstDate(null);
      setLastDate(null);
      setNdcCalendar(false);
    };
  
    const handleSetDate = () => {
      const checker = bookedDates?.filter(
        (date) =>
          parseInt(date?.split("-")[2]) > parseInt(firstDate?.split("-")[2]) &&
          parseInt(date?.split("-")[2]) < parseInt(lastDate?.split("-")[2])
      );
      if (checker?.length > 0) {
        toast.error(
          "Some if the dates selected have a;ready been booked. Please select a range of available dates"
        );
      } else {
        setNdcCalendar(false);
      }
  
      console.log({
        firstDate,
        lastDate,
      });
    };
    return (
        <SidebarWithHeader isAuth={true}>
          <Box
            pl={{ base: "20px", lg: "60px", xl: "60px" }}
            pr={{ base: "20px", lg: "150px", xl: "200px" }}
            py="40px"
            mt="15px"
            mx={{ base: "0", lg: "20px" }}
            bgColor="white"
          >
        <Text fontSize="24px" fontWeight={700} mb="10px" lineHeight="16px">
          Hire a Tractor
        </Text>
        <Text color="#323232" mb="20px">
          Please fill the form below to hire a tractor from TracTrac
        </Text>
        
        {/* Progress Indicator */}
        <Box mb="30px" p="16px" bg="#F9F9F9" borderRadius="8px" border="1px solid #E2E8F0">
          <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <Text fontSize="14px" fontWeight="600" color="#323232">
              Form Progress
            </Text>
            <Text fontSize="12px" color="#666">
              {searchParams.get('farm_size') ? '2/2 completed' : '1/2 completed'}
            </Text>
          </Flex>
          <Flex alignItems="center" gap="12px">
            <Box
              w="24px"
              h="24px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="#FA9411"
              color="white"
              fontSize="12px"
              fontWeight="600"
            >
              1
            </Box>
            <Text fontSize="12px" color="#FA9411">
              Form Details
            </Text>
            
            <Box w="40px" h="2px" bg="#E2E8F0" />
            
            <Box
              w="24px"
              h="24px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={searchParams.get('farm_size') ? '#FA9411' : '#E2E8F0'}
              color={searchParams.get('farm_size') ? 'white' : '#666'}
              fontSize="12px"
              fontWeight="600"
            >
              {searchParams.get('farm_size') ? '✓' : '2'}
            </Box>
            <Text fontSize="12px" color={searchParams.get('farm_size') ? '#FA9411' : '#666'}>
              Farm Measurement
            </Text>
          </Flex>
        </Box>
        <Formik
          initialValues={{
            state: "",
            local_government_area: "",
            community: "",
            implement_types: [],
            address: (typeof window !== 'undefined' ? (new URL(window.location.href).searchParams.get('address') || "") : ""),
            start_date: "",
            end_date: "",
            additional_info: "",
          }}
          enableReinitialize={true}
          onSubmit={async (values: any, { resetForm }) => {
            setError(null);

            // Check if farm measurement is completed (not needed for farm_carrier)
            const farmSize = searchParams.get('farm_size');
            const hasFarmCarrier = values.implement_types?.includes('farm_carrier');
            
            if (!farmSize && !hasFarmCarrier) {
              toast.error("Please measure your farm before submitting the form");
              return;
            }

            try {
              console.log("values", values);
              console.log("farm_size", farmSize);

              if (!firstDate || !lastDate) {
                toast.error("Please select a date range");
                return;
              }
              // Use different API based on implement type
              const hasFarmCarrier = values.implement_types?.includes('farm_carrier');
              const hireFunction = hasFarmCarrier ? hireTractorWithoutFarmSize : hireTractor;
              
              const response = await hireFunction(
                {
                  ...values,
                  farm_size: farmSize ? farmSize : 1,
                  start_date: firstDate,
                  end_date: lastDate,
                  tractor_id: id,
                  farm_id: farmId ? farmId : "farmId"
                },
                userToken as string
              );
  
              console.log("hireTractor", response);
              setOpen(true);
  
              // if (response.status == "success") {
              //   //   // router.replace("/login");
              //   //   resetForm();
              //   //   setSuccess(true);
              //   onOpen();
              // } else {
              //   setError("An unknown error occured");
              // }
            } catch (err) {
              const error = err as any;
              const errorMessage = getErrorMessage(error, "An unexpected error occurred");
              toast.error(errorMessage);
              console.log("Error hiring tractor", error);
            }
          }}
        >
          {(props) => (
            <Form>
              {error && (
                <Alert status="error" mb="12px">
                  <AlertIcon />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}
  
  
              <Flex
                direction={{ base: "column", md: "row" }}
                columnGap={{ base: "0", md: "30px" }}
                rowGap={{ base: "20px", md: "0" }}
                mt="20px"
                width="100%"
              >
                <Field name="state" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.state && form.touched.state}
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        State currently located
                      </FormLabel>
  
                      <Select
                        //   {...field}
                        bgColor="#3232320D"
                        fontSize="12px"
                        color="#323232"
                        placeholder="Select type"
                        onChange={(v) => {
                          const state = v.currentTarget.value || "";
                          form.setFieldValue(field.name, v.currentTarget.value);
                          // alert(props.values.state);
                          if (state.includes("abuja")) {
                            // Federal Capital Territory
                            setLgas(
                              nigerianStates.lgas("Federal Capital Territory") ??
                              []
                            );
                          } else {
                            setLgas(nigerianStates.lgas(state) ?? []);
                          }
                        }}
                      >
                        {states.map((state) => (
                          <option key={state} value={state.toLowerCase()}>
                            {state}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{form.errors.state}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>
  
              <Flex
                direction={{ base: "column", md: "row" }}
                columnGap={{ base: "0", md: "30px" }}
                rowGap={{ base: "20px", md: "0" }}
                mt="20px"
                width="100%"
              >
                <Field name="implement_types" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.implement_types &&
                        form.touched.implement_types
                      }
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Implement Type
                      </FormLabel>
                      <MultiSelect
                        // {...field}
                        name="Roles"
                        isMulti
                        options={(() => {
                          const currentValues = form.values.implement_types || [];
                          const hasFarmCarrier = currentValues.includes('farm_carrier');
                          const hasOtherImplements = currentValues.some((value: string) => value !== 'farm_carrier');
                          
                          // Filter options based on current selection
                          let filteredImplements = tractorImplements || [];
                          
                          if (hasFarmCarrier) {
                            // If farm_carrier is selected, only show farm_carrier
                            filteredImplements = filteredImplements.filter((implement: any) => implement === 'farm_carrier');
                          } else if (hasOtherImplements) {
                            // If other implements are selected, hide farm_carrier
                            filteredImplements = filteredImplements.filter((implement: any) => implement !== 'farm_carrier');
                          }
                          
                          return filteredImplements.map((implement: any) => ({
                            value: implement,
                            label: implement.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                          }));
                        })()}
                        placeholder="Select implements"
                        onChange={(option) => {
                          console.log(option.at(0));
                          const selectedValues = option.map((e: any) => e.value);
                          
                          // Check if farm_carrier is being added
                          const isAddingFarmCarrier = selectedValues.includes('farm_carrier');
                          
                          if (isAddingFarmCarrier) {
                            // If farm_carrier is being added, clear all other selections
                            form.setFieldValue(field.name, ['farm_carrier']);
                          } else {
                            // Normal selection
                            form.setFieldValue(field.name, selectedValues);
                          }
                        }}
                      // id="roles-select-field"
                      />
                      <FormErrorMessage>
                        {form.errors.implement_types}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
  
                <Field name="local_government_area" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      // my={4}
                      isInvalid={
                        form.errors.local_government_area &&
                        form.touched.local_government_area
                      }
                      mb="20px"
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Local Government Area
                      </FormLabel>
                      <Select
                        bgColor="#3232320D"
                        placeholder="Local Government Area"
                        fontSize="12px"
                        color="#323232"
                        _focusVisible={{
                          borderColor: "#929292",
                        }}
                        onChange={(v) => {
                          // const state = v.currentTarget.value || "";
                          form.setFieldValue(field.name, v.currentTarget.value);
                          // alert(props.values.state);
                          // setLgas(NaijaStates.lgas(state) ?? []);
                        }}
                      >
                        {lgas.map((state) => (
                          <option key={state} value={state.toLowerCase()}>
                            {state}
                          </option>
                        ))}
                      </Select>
                      {/* <Input
                          variant="flushed"
                          borderColor="orange"
                          {...field}
                          //  ref={initialRef}
                          placeholder="Enter your L.G.A."
                        /> */}
                      <FormErrorMessage>
                        {form.errors.local_government_area}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>
  
              {/* <Flex 
               direction={{ base: "column", md: "row" }}
    columnGap={{ base: "0", md: "30px" }}
    rowGap={{ base: "20px", md: "0" }}
    mt="20px"
    width="100%"
              >
                <Field name="community" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.community && form.touched.community}
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Community
                      </FormLabel>
                      <Input
                        {...field}
                        bgColor="#3232320D"
                        fontSize="12px"
                        color="#323232"
                      />
                      <FormErrorMessage>{form.errors.community}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex> */}
  
              <Flex
                direction={{ base: "column", md: "row" }}
                columnGap={{ base: "0", md: "30px" }}
                rowGap={{ base: "20px", md: "0" }}
                mt="20px"
                width="100%"
              >
                <Field name="community" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.community && form.touched.community}
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Community
                      </FormLabel>
                      <Input
                        {...field}
                        bgColor="#3232320D"
                        fontSize="12px"
                        color="#323232"
                      />
                      <FormErrorMessage>{form.errors.community}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="start_date">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.start_date && form.touched.start_date
                      }
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Start Date and End Date
                      </FormLabel>
  
                      <div className="ndclist-table__header__select-container">
                        <div
                          className="ndclist-table__header__select pointer"
                          onClick={handleNdcCalendarClick}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.60039 8.4C5.81256 8.4 6.01605 8.31571 6.16608 8.16569C6.31611 8.01566 6.40039 7.81217 6.40039 7.6C6.40039 7.38783 6.31611 7.18434 6.16608 7.03432C6.01605 6.88429 5.81256 6.8 5.60039 6.8C5.38822 6.8 5.18473 6.88429 5.03471 7.03432C4.88468 7.18434 4.80039 7.38783 4.80039 7.6C4.80039 7.81217 4.88468 8.01566 5.03471 8.16569C5.18473 8.31571 5.38822 8.4 5.60039 8.4ZM6.40039 10C6.40039 10.2122 6.31611 10.4157 6.16608 10.5657C6.01605 10.7157 5.81256 10.8 5.60039 10.8C5.38822 10.8 5.18473 10.7157 5.03471 10.5657C4.88468 10.4157 4.80039 10.2122 4.80039 10C4.80039 9.78783 4.88468 9.58434 5.03471 9.43432C5.18473 9.28429 5.38822 9.2 5.60039 9.2C5.81256 9.2 6.01605 9.28429 6.16608 9.43432C6.31611 9.58434 6.40039 9.78783 6.40039 10ZM8.00039 8.4C8.21256 8.4 8.41605 8.31571 8.56608 8.16569C8.71611 8.01566 8.80039 7.81217 8.80039 7.6C8.80039 7.38783 8.71611 7.18434 8.56608 7.03432C8.41605 6.88429 8.21256 6.8 8.00039 6.8C7.78822 6.8 7.58473 6.88429 7.43471 7.03432C7.28468 7.18434 7.20039 7.38783 7.20039 7.6C7.20039 7.81217 7.28468 8.01566 7.43471 8.16569C7.58473 8.31571 7.78822 8.4 8.00039 8.4ZM8.80039 10C8.80039 10.2122 8.71611 10.4157 8.56608 10.5657C8.41605 10.7157 8.21256 10.8 8.00039 10.8C7.78822 10.8 7.58473 10.7157 7.43471 10.5657C7.28468 10.4157 7.20039 10.2122 7.20039 10C7.20039 9.78783 7.28468 9.58434 7.43471 9.43432C7.58473 9.28429 7.78822 9.2 8.00039 9.2C8.21256 9.2 8.41605 9.28429 8.56608 9.43432C8.71611 9.58434 8.80039 9.78783 8.80039 10ZM10.4004 8.4C10.6126 8.4 10.816 8.31571 10.9661 8.16569C11.1161 8.01566 11.2004 7.81217 11.2004 7.6C11.2004 7.38783 11.1161 7.18434 10.9661 7.03432C10.816 6.88429 10.6126 6.8 10.4004 6.8C10.1882 6.8 9.98474 6.88429 9.83471 7.03432C9.68468 7.18434 9.60039 7.38783 9.60039 7.6C9.60039 7.81217 9.68468 8.01566 9.83471 8.16569C9.98474 8.31571 10.1882 8.4 10.4004 8.4ZM13.6004 4C13.6004 3.46957 13.3897 2.96086 13.0146 2.58579C12.6395 2.21071 12.1308 2 11.6004 2H4.40039C3.86996 2 3.36125 2.21071 2.98618 2.58579C2.6111 2.96086 2.40039 3.46957 2.40039 4V11.2C2.40039 11.7304 2.6111 12.2391 2.98618 12.6142C3.36125 12.9893 3.86996 13.2 4.40039 13.2H11.6004C12.1308 13.2 12.6395 12.9893 13.0146 12.6142C13.3897 12.2391 13.6004 11.7304 13.6004 11.2V4ZM3.20039 5.2H12.8004V11.2C12.8004 11.5183 12.674 11.8235 12.4489 12.0485C12.2239 12.2736 11.9187 12.4 11.6004 12.4H4.40039C4.08213 12.4 3.77691 12.2736 3.55186 12.0485C3.32682 11.8235 3.20039 11.5183 3.20039 11.2V5.2ZM4.40039 2.8H11.6004C11.9187 2.8 12.2239 2.92643 12.4489 3.15147C12.674 3.37652 12.8004 3.68174 12.8004 4V4.4H3.20039V4C3.20039 3.68174 3.32682 3.37652 3.55186 3.15147C3.77691 2.92643 4.08213 2.8 4.40039 2.8Z"
                              fill="#747474"
                            />
                          </svg>
  
                          <div>
                            {firstDate} - {lastDate}
                          </div>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.66732 6.66667L8.00065 10L11.334 6.66667"
                              stroke="#747474"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
  
                        {ndcCalendar && (
                          <div className="calendar-modal">
                            <div className="calendar-modal__flex">
                              {`${moment(
                                `${currentYear}-${currentMonth + 1}`,
                                "YYYY-M"
                              ).format("MMMM")} ${currentYear}`}
  
                              <div>
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="pointer"
                                  onClick={handleDecrementMonth}
                                >
                                  <rect
                                    x="0.25"
                                    y="0.25"
                                    width="11.5"
                                    height="11.5"
                                    rx="1.75"
                                    fill="white"
                                  />
                                  <rect
                                    x="0.25"
                                    y="0.25"
                                    width="11.5"
                                    height="11.5"
                                    rx="1.75"
                                    stroke="#E4E7EC"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    d="M4.68888 6.18123L7.47538 8.83623C7.52187 8.88055 7.58364 8.90527 7.64788 8.90527C7.71211 8.90527 7.77388 8.88055 7.82038 8.83623L7.82338 8.83323C7.846 8.81174 7.86401 8.78588 7.87631 8.75721C7.88862 8.72854 7.89497 8.69767 7.89497 8.66648C7.89497 8.63528 7.88862 8.60441 7.87631 8.57574C7.86401 8.54708 7.846 8.52121 7.82338 8.49973L5.19938 5.99973L7.82338 3.50073C7.846 3.47924 7.86401 3.45338 7.87631 3.42471C7.88862 3.39604 7.89497 3.36517 7.89497 3.33398C7.89497 3.30278 7.88862 3.27191 7.87631 3.24324C7.86401 3.21458 7.846 3.18871 7.82338 3.16723L7.82038 3.16423C7.77388 3.1199 7.71211 3.09518 7.64788 3.09518C7.58364 3.09518 7.52187 3.1199 7.47538 3.16423L4.68888 5.81923C4.66437 5.84257 4.64486 5.87066 4.63153 5.90177C4.6182 5.93288 4.61133 5.96638 4.61133 6.00023C4.61133 6.03407 4.6182 6.06757 4.63153 6.09868C4.64486 6.1298 4.66437 6.15788 4.68888 6.18123Z"
                                    fill="#667185"
                                  />
                                </svg>
  
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="pointer"
                                  onClick={handleIncrementMonth}
                                >
                                  <rect
                                    x="0.25"
                                    y="0.25"
                                    width="11.5"
                                    height="11.5"
                                    rx="1.75"
                                    fill="white"
                                  />
                                  <rect
                                    x="0.25"
                                    y="0.25"
                                    width="11.5"
                                    height="11.5"
                                    rx="1.75"
                                    stroke="#E4E7EC"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    d="M7.31112 5.81877L4.52462 3.16377C4.47813 3.11945 4.41636 3.09473 4.35212 3.09473C4.28789 3.09473 4.22612 3.11945 4.17962 3.16377L4.17662 3.16677C4.154 3.18826 4.13599 3.21412 4.12369 3.24279C4.11138 3.27146 4.10503 3.30233 4.10503 3.33352C4.10503 3.36472 4.11138 3.39559 4.12369 3.42426C4.13599 3.45292 4.154 3.47879 4.17662 3.50027L6.80062 6.00027L4.17662 8.49927C4.154 8.52076 4.13599 8.54662 4.12369 8.57529C4.11138 8.60396 4.10503 8.63483 4.10503 8.66602C4.10503 8.69722 4.11138 8.72809 4.12369 8.75676C4.13599 8.78542 4.154 8.81129 4.17662 8.83277L4.17962 8.83577C4.22612 8.8801 4.28789 8.90482 4.35212 8.90482C4.41636 8.90482 4.47813 8.8801 4.52462 8.83577L7.31112 6.18077C7.33563 6.15743 7.35514 6.12934 7.36847 6.09823C7.3818 6.06712 7.38867 6.03362 7.38867 5.99977C7.38867 5.96593 7.3818 5.93243 7.36847 5.90132C7.35514 5.8702 7.33563 5.84212 7.31112 5.81877Z"
                                    fill="#667185"
                                  />
                                </svg>
                              </div>
                            </div>
                            {renderCalendarGridRange()}
                            {firstDate && lastDate ? (
                              <div className="calendar-modal__button-group">
                                <button
                                  onClick={clearDateSelection}
                                  disabled={inRangeLoading}
                                >
                                  Cancel
                                </button>
                                <button
                                  // disabled={inRangeLoading}
                                  onClick={handleSetDate}
                                  type="button"
                                >
                                  {inRangeLoading ? "Loading..." : "Confirm"}
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  )}
                </Field>
                {/* <Field name="start_date" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.start_date && form.touched.start_date
                      }
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Start Date
                      </FormLabel>
                      <Input
                        {...field}
                        bgColor="#3232320D"
                        placeholder="Select year"
                        fontSize="12px"
                        color="#323232"
                        type="date"
                      />
                      <FormErrorMessage>
                        {form.errors.start_date}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field> */}
  
                {/* <Field name="end_date" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.end_date && form.touched.end_date}
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        End date
                      </FormLabel>
                      <Input
                        {...field}
                        bgColor="#3232320D"
                        placeholder="Select year"
                        fontSize="12px"
                        color="#323232"
                        type="date"
                      />
                      <FormErrorMessage>{form.errors.end_date}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field> */}
              </Flex>
  
              <Flex
                direction={{ base: "column", md: "row" }}
                columnGap={{ base: "0", md: "30px" }}
                rowGap={{ base: "20px", md: "0" }}
                my="40px"
                width="100%"
              >
                <Field name="address" validate={validateEmpty}>
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={form.errors.address && form.touched.address}
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Address
                      </FormLabel>
                      <Autocomplete
                        style={{
                          padding: "0px 10px 0px 10px",
                          borderRadius: "6px",
                          width: "100%",
                          fontSize: "12px",
                          color: "#929292",
                          height: "39px",
                          backgroundColor: "#3232320D",
                        }}
                        placeholder=""
                        apiKey={"AIzaSyBWo_tQ4rjQkZz1kN5WXfnemHCaF0gQ8BU"}
                        onChange={(e) => {
                          // alert(`Address: ${e.currentTarget?.value}`)
                          form.setFieldValue(field.name, e.currentTarget?.value);
                        }}
                        onPlaceSelected={(place) => {
                          console.log("Address:", place.formatted_address);
  
                          // Extract latitude and longitude
                          if (place.geometry && place.geometry.location) {
                            const current_location_lat =
                              place.geometry.location.lat();
                            const current_location_lng =
                              place.geometry.location.lng();
                            console.log("Latitude:", current_location_lat);
                            console.log("Longitude:", current_location_lng);
  
                            // Update form with address and coordinates
                            form.setFieldValue(
                              field.name,
                              place.formatted_address
                            );
                            form.setFieldValue(
                              "current_location_lat",
                              current_location_lat
                            );
                            form.setFieldValue(
                              "current_location_lng",
                              current_location_lng
                            );
                          }
                        }}
                        options={{
                          types: ["address"],
                          // types: ["(regions)"],
                          componentRestrictions: { country: "ng" },
                        }}
                      />
                      <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
  
                <Field name="additional_info">
                  {({ field, form }: { [x: string]: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.additional_info &&
                        form.touched.additional_info
                      }
                    >
                      <FormLabel fontSize="12px" color="#323232">
                        Additional Information / comment (optional)
                      </FormLabel>
                      <Input
                        {...field}
                        bgColor="#3232320D"
                        fontSize="12px"
                        color="#323232"
                      />
                      {/* <Select
                      bgColor="#3232320D"
                      placeholder="Select"
                      fontSize="12px"
                      color="#323232"
                    >
                      <option value="trc1">2 weeks</option>
                    </Select> */}
                      <FormErrorMessage>
                        {form.errors.additional_info}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>
  
              {/* Farm Measurement Section - Last Step */}
              {!props.values.implement_types?.includes('farm_carrier') && 
               props.values.state && 
               props.values.local_government_area && 
               props.values.community && 
               props.values.implement_types && 
               props.values.implement_types.length > 0 && 
               props.values.address && 
               firstDate && 
               lastDate && (
                <Flex
                  direction={{ base: "column", md: "row" }}
                  columnGap={{ base: "0", md: "30px" }}
                  rowGap={{ base: "20px", md: "0" }}
                  mt="20px"
                  width="100%"
                >
                  <Box width="100%">
                    <FormLabel fontSize="12px" color="#323232" mb="8px">
                      Farm Size Measurement (Required)
                    </FormLabel>
                    
                    {searchParams.get('farm_size') ? (
                      // Show measured farm size
                      <Box
                        border="1px solid"
                        borderColor="#FA9411"
                        borderRadius="6px"
                        p="12px"
                        bgColor="#FA941110"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Text fontSize="14px" fontWeight="600" color="#323232">
                            Measured Area: {searchParams.get('farm_size')} square meters
                          </Text>
                          <Text fontSize="12px" color="#666" mt="2px">
                            ✓ Farm measurement completed successfully
                          </Text>
                        </Box>
                        <Link
                          href={`/farm-measurement?tractorId=${id}`}
                          style={{
                            color: "#FA9411",
                            fontSize: "12px",
                            textDecoration: "underline",
                          }}
                        >
                          Re-measure
                        </Link>
                      </Box>
                    ) : (
                      // Show measurement requirement
                      <Box
                        border="1px solid"
                        borderColor="#FA9411"
                        borderRadius="6px"
                        p="12px"
                        bgColor="#FFF"
                        textAlign="center"
                      >
                        <Text fontSize="14px" color="#323232" mb="8px">
                          You need to measure your farm before proceeding
                        </Text>
                        <Button
                          as={Link}
                          href={`/farm-measurement?tractorId=${id}`}
                          bgColor="#FA9411"
                          color="white"
                          fontSize="14px"
                          height="40px"
                          px="20px"
                          _hover={{
                            bgColor: "#e67e00",
                          }}
                          leftIcon={
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          }
                        >
                          Measure Your Farm
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Flex>
              )}

              <Flex direction="column" alignItems="flex-end">
                {!searchParams.get('farm_size') && !props.values.implement_types?.includes('farm_carrier') && (
                  <Text fontSize="12px" color="#F04438" mb="8px" textAlign="right">
                    Please measure your farm to enable form submission
                  </Text>
                )}
                <Button
                  bgColor="#F8A730"
                  color="white"
                  width={{ base: "100%", md: "50%" }}
                  fontSize="16px"
                  fontWeight={600}
                  minH="40px"
                  isLoading={props.isSubmitting}
                  isDisabled={props.isSubmitting || (!searchParams.get('farm_size') && !props.values.implement_types?.includes('farm_carrier'))}
                  type="submit"
                  _disabled={{
                    bgColor: "#F8A73088",
                  }}
                  _hover={{
                    bgColor: (!searchParams.get('farm_size') && !props.values.implement_types?.includes('farm_carrier')) ? "#F8A73088" : "#F8A73088",
                  }}
                  _focus={{
                    bgColor: "#F8A73088",
                  }}
                >
                  <Box as="span" mr="8px">
                    Submit
                  </Box>
                  <ArrowForwardIcon boxSize="18px" />
                </Button>
              </Flex>
  
              {/* </Flex> */}
            </Form>
          )}
        </Formik>
  
        <ChakraModal
          isOpen={open}
          onClose={onClose}
          closeOnOverlayClick={false}
          closeOnEsc={false}
          isCentered
          size="xs"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalBody textAlign="center">
              <Flex flexDir="column" alignItems="center">
                <Image
                  src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446823/checkmark_jyuxnj.svg"
                  width="120px"
                  alt="Checkmark image icon"
                />
                <Text fontSize="16px" fontWeight={600}>
                  Tractor Request Completed
                </Text>
                <Text my="8px" fontSize="14px">
                  Thank you for providing us with this information, check your
                  profile for the status of your tractor
                </Text>
                <Button
                  mb="4px"
                  onClick={() => {
                    onClose();
                    router.replace("/dashboard/hired-tractors");
                  }}
                  width="100%"
                  height="45px"
                  bgColor="#FA9411"
                  _hover={{
                    bgColor: "#FA9411",
                  }}
                  mt="12px"
                  color="white"
                >
                  Go to Dashboard <ArrowForwardIcon ml="8px" />
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </ChakraModal>
          </Box>
        </SidebarWithHeader>
    );
  }