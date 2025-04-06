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
  InputLeftElement,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/Sidenav";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";

import * as nigerianStates from "nigerian-states-and-lgas";
import { ArrowDown2, Filter } from "iconsax-react";
import {
  useLazyGetTractorsQuery,
  useHireTractorMutation,
  useLazyGetSearchTractorsQuery,
} from "@/redux/services/tractorApi";
import Map from "../../components/Map";

const fileTypes = ["JPG", "PNG", "JPEG"];

// const DynamicHeader = dynamic(() => import('../components/Sidenav'), {
//     loading: () => <p>Loading...</p>,
//   })

interface ITractorCard {
  id: string;
  name: string;
  image: string;
  capacity: string;
  location: string;
  distance: string;
  tractor_type: string;
  setTractorId: Dispatch<SetStateAction<string | null>>;
}

export default function HireTractor() {
  const [location, setLocation] = useState<any>(null);
  const [searchData, setSearchData] = useState<any>(null);
  const [tractorId, setTractorId] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [implement, setImplement] = useState<string | null>(null);
  const [getTractors, result] = useLazyGetTractorsQuery();
  const [trigger, searchResult] = useLazyGetSearchTractorsQuery({});

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      console.log("error->", "dd");
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          console.log("error->", coords);
          const { latitude, longitude } = coords;
          if (latitude && longitude) {
            // if (latitude && longitude && result.status !== "fulfilled") {
            setLocation({ latitude, longitude });
            getTractors(
              `${latitude.toString().replace(".", "_")}/${longitude
                .toString()
                .replace(".", "_")}`
            );
          } else {
            getTractors(null);
          }
        },
        (err) => {
          getTractors(null);
          console.log("err", err);
        }
      );
    } else {
      getTractors(null);
    }
    // return {getTractors}
  }, [getTractors]);

  useEffect(() => {
    let param = "";
    if (state && brand && implement) {
      param = `${implement}/${brand}/${state}`;
    } else if (state && implement && !brand) {
      // param = `${state}/${implement}`;
      param = `${implement}/${state}`;
    } else if (!state && brand && implement) {
      param = `${implement}/${brand}`;
    } else if (state && !brand && !implement) {
      param = state;
    } else if (!state && !brand && implement) {
      param = implement;
    } else if (!state && brand && !implement) {
      param = brand;
    }
    if (param.length > 1) {
      trigger(param)
        .unwrap()
        .then((result) => {
          setSearchData(result?.data || []);
        })
        .catch((_) => {
          setSearchData([]);
        });
    } else {
      setSearchData(null);
    }
  }, [trigger, state, brand, implement]);

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
  console.log(result);

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
  return (
    <SidebarWithHeader isAuth={true}>
      {tractorId ? (
        <HireTractorForm id={tractorId} />
      ) : (
        //
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
            {result?.isLoading || result.status === "uninitialized" ? (
              <Skeleton
                mt="12px"
                height="360px"
                borderRadius="4px"
                // w="111px"
              />
            ) : searchData ? (
              <Map addresses={searchData?.map((item: any) => item.address)} />
            ) : (
              <Map
                addresses={result?.data?.data.map((item: any) => item.address)}
              />
            )}
            {/* <Image src="/images/map.svg" alt="map image" /> */}
          </Stack>
          <Box mt="40px">
            <Stack direction="row" gap="20px">
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
                <InputLeftElement pointerEvents="none" width="4rem">
                  <Icon as={Filter} mr="20px" color="#FA9411" mb="1px" />
                </InputLeftElement>
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
                  if (e?.target?.value) {
                    setState(e?.currentTarget?.value);
                    // search();
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
                width="170px"
                placeholder="Implement Type"
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
                    setImplement(e?.target?.value);
                    // search();
                  } else {
                    setImplement(null);
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
              <Select
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
              </Select>
            </Stack>
            {
              // searchResult?.isFetching ||
              result?.isLoading || result.status === "uninitialized" ? (
                <SimpleGrid
                  columns={{ base: 2, md: 4 }}
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
              searchData ? (
                searchData?.length < 1 ? (
                  <EmptyDataPlaceholder isSearch={true} />
                ) : (
                  <SimpleGrid
                    columns={{ base: 2, md: 4 }}
                    spacingX="20px"
                    spacingY="15px"
                    mt="30px"
                  >
                    {searchData.map((tractor: any) => (
                      <TractorCard
                        key={tractor?.id}
                        setTractorId={setTractorId}
                        id={tractor?.id}
                        name={`${tractor?.brand} ${tractor?.model}`}
                        image={tractor?.image}
                        capacity=" 105 to 135 HP"
                        location={tractor?.address}
                        distance={tractor?.distance}
                        tractor_type={tractor?.tractor_type}
                      />
                    ))}
                  </SimpleGrid>
                )
              ) : result?.data?.data?.length < 1 ? (
                <EmptyDataPlaceholder isSearch={false} />
              ) : (
                <SimpleGrid
                  columns={{ base: 2, md: 4 }}
                  spacingX="20px"
                  spacingY="15px"
                  mt="30px"
                >
                  {result?.data?.data.map((tractor: any) => (
                    <TractorCard
                      key={tractor?.id}
                      setTractorId={setTractorId}
                      id={tractor?.id}
                      name={`${tractor?.brand} ${tractor?.model}`}
                      image={tractor?.image}
                      capacity=" 105 to 135 HP"
                      location={`${tractor?.lga},${tractor?.state}`}
                      // location={tractor?.address}
                      // distance={"10"}
                      distance={tractor?.distance}
                      tractor_type={tractor?.tractor_type}
                    />
                  ))}
                </SimpleGrid>
              )
              //   }
              // </SimpleGrid>
            }
          </Box>
        </Box>
      )}
    </SidebarWithHeader>
  );
}

function TractorCard({
  name,
  image,
  location,
  distance,
  tractor_type,
  setTractorId,
  id,
}: ITractorCard) {
  return (
    <Box
      boxShadow="md"
      borderRadius="4px"
      onClick={() => setTractorId(id)}
      cursor="pointer"
    >
      <Box h="200px" position="relative">
        <Image
          borderTopRadius="4px"
          src={
            image?.startsWith("https") ? image : "/images/man-with-tractor.svg"
          }
          alt="Tractor image"
          height="100%"
          width="100%"
          objectFit="cover"
        />
        {distance && distance != "0" && (
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
        {/* <Text
            fontSize="12px"
            color="#323232"
            fontWeight={700}
            mt="8px"
            lineHeight="12.1px"
          >
            Capacity:
            <Box fontWeight={500} as="span">
              {capacity}
            </Box>
          </Text> */}
        {/* <Text fontSize="12px" color="#323232" fontWeight={700} mt="8px"> */}
        {/* Location:  */}
        <Box fontWeight={500} fontSize="12px" mt="8px" as="span" noOfLines={2}>
          <Box fontWeight={700} as="span">
            Location:
          </Box>{" "}
          {location.length < 2 ? "N/a" : location}
        </Box>
        {/* </Text> */}
      </Box>
    </Box>
  );
}

function HireTractorForm({ id }: { id: string }) {
  const [error, setError] = useState<string | null>(null);

  function validateEmpty(value: any) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }
  const [lgas, setLgas] = useState<string[]>([]);

  const [hireTractor] = useHireTractorMutation();
  const { profileInfo } = useAppSelector((state) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <Box
      pl="60px"
      pr={{ base: "60px", lg: "150px", xl: "200px" }}
      py="40px"
      mt="15px"
      mx="20px"
      bgColor="white"
    >
      <Text fontSize="24px" fontWeight={700} mb="10px" lineHeight="16px">
        Hire a Tractor
      </Text>
      <Text color="#323232" mb="30px">
        Please fill the form below to hire a tractor from TracTrac
      </Text>
      <Formik
        initialValues={{
          note: "",
          state: "",
          farm_size: "",
          service: "",
          address: "",
          lga: "",
          start_date: "",
          end_date: "",
        }}
        onSubmit={async (values: any, { resetForm }) => {
          setError(null);

          // if (values?.insured == "yes") {
          //   if (!values?.insurance_company || !values?.insurance_expiry) {
          //     toast.error(
          //       "Please fill in insurance company and expiry if tractor is ensured!"
          //     );
          //     // alert(values?.insurance_company)
          //     return;
          //   }
          // }

          try {
            // alert('ss')
            console.log(values);

            const response = await hireTractor({
              ...values,
              user_id: profileInfo?.id,
              tractor_id: id,
            }).unwrap();

            if (response.status == "success") {
              //   // router.replace("/login");
              //   resetForm();
              //   setSuccess(true);
              onOpen();
            } else {
              setError("An unknown error occured");
            }
          } catch (err) {
            const error = err as any;
            // alert('error')
            if (error?.data?.errors) {
              // setError(error?.data?.errors[0])
            } else if (error?.data?.message) {
              setError(error?.data?.message);
            }
            console.error("rejected", error);
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

            <Flex mt="20px" columnGap="30px">
              <Field name="farm_size" validate={validateEmpty}>
                {({ field, form }: { [x: string]: any }) => (
                  <FormControl
                    isInvalid={form.errors.farm_size && form.touched.farm_size}
                  >
                    <FormLabel fontSize="12px" color="#323232">
                      Farm Size (in hectare)
                    </FormLabel>
                    <Input
                      {...field}
                      bgColor="#3232320D"
                      fontSize="12px"
                      color="#323232"
                    />
                    <FormErrorMessage>{form.errors.farm_size}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

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
                        setLgas(nigerianStates.lgas(state) ?? []);
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

            <Flex mt="20px" columnGap="30px">
              <Field name="service" validate={validateEmpty}>
                {({ field, form }: { [x: string]: any }) => (
                  <FormControl
                    isInvalid={form.errors.service && form.touched.service}
                  >
                    <FormLabel fontSize="12px" color="#323232">
                      Implement Type
                    </FormLabel>
                    <Select
                      {...field}
                      bgColor="#3232320D"
                      placeholder="Select"
                      fontSize="12px"
                      color="#323232"
                    >
                      {/* Harrower, Planter, Plough, Ridger, Sprayer) */}
                      <option value="harrower">Harrower</option>
                      <option value="plough">Plough</option>
                      <option value="llanter">Planter</option>
                      <option value="ridger">Ridger</option>
                      <option value="sprayer">Sprayer</option>
                    </Select>
                    <FormErrorMessage>{form.errors.service}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="lga" validate={validateEmpty}>
                {({ field, form }: { [x: string]: any }) => (
                  <FormControl
                    // my={4}
                    isInvalid={form.errors.lga && form.touched.lga}
                    mb="20px"
                  >
                    <FormLabel fontSize="12px" color="#323232">
                      Local Government Area
                    </FormLabel>
                    <Select
                      bgColor="#3232320D"
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
                    <FormErrorMessage>{form.errors.lga}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Flex>

            <Flex mt="20px" columnGap="30px">
              <Field name="start_date" validate={validateEmpty}>
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
              </Field>

              <Field name="end_date" validate={validateEmpty}>
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
              </Field>
            </Flex>

            <Flex my="40px" columnGap="30px">
              <Field name="address" validate={validateEmpty}>
                {({ field, form }: { [x: string]: any }) => (
                  <FormControl
                    isInvalid={form.errors.address && form.touched.address}
                  >
                    <FormLabel fontSize="12px" color="#323232">
                      Address
                    </FormLabel>
                    <Input
                      {...field}
                      bgColor="#3232320D"
                      fontSize="12px"
                      color="#323232"
                    />
                    <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="note">
                {({ field, form }: { [x: string]: any }) => (
                  <FormControl
                    isInvalid={form.errors.note && form.touched.note}
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
                    <FormErrorMessage>{form.errors.note}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Flex>

            <Flex>
              <Button
                bgColor="#F8A730"
                color="white"
                ml="auto"
                width={{ base: "100%", md: "50%" }}
                fontSize="16px"
                fontWeight={600}
                minH="40px"
                isLoading={props.isSubmitting}
                isDisabled={props.isSubmitting}
                type="submit"
                _disabled={{
                  bgColor: "#F8A73088",
                }}
                _hover={{
                  bgColor: "#F8A73088",
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
        isOpen={isOpen}
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
                src="/images/checkmark.svg"
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
  );
}

function EmptyDataPlaceholder({ isSearch }: { isSearch: boolean }) {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box bgColor="white" width="100%" p="60px" textAlign="center" mt="20px">
        {/* <Box bgColor="white" width="400px" p="60px" textAlign="center" mt="40px"> */}
        <Center>
          <Image src="/images/empty-state.svg" alt="Empty state image icon" />
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

const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const brands = ["case_ih", "sonalika", "john_deere", "mahindra", "others"];

const tractorTypes = ["Harrower", "Ridger", "Plough", "Planter", "Sprayer"];
