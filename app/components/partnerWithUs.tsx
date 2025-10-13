"use client";
import {
  Grid,
  GridItem,
  Input,
  Text,
  Box,
  HStack,
  Icon,
  Textarea,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormControl,
  Select as ChakraSelect,
  Button,
} from "@chakra-ui/react";
import Image from "./Image";
import { useState } from "react";
import { ChakraWrapper } from "../chakraUIWrapper";
import lookup from "country-code-lookup";
import { RightLongArrow } from "./Icons";
import { toast } from "react-toastify";

export default function PartnerWithUs() {
  const initialDataState = {
      name: "",
      email: "",
      organization: "",
      positionInOrganization: "",
      phoneNumber: "",
    message: "",
    type: "support",
  };

  const [data, setData] = useState(initialDataState);
  let [countryCode, setCountryCode] = useState("234");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

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

  const handleSubmit = () => {
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

        
        if (!emailRegex.test(data.email)) {
          toast.error("Please enter a valid email");
          return;
        }
        // const response = await contact({
        //   ...data,
        //   phoneNumber: `${countryCode}${data?.phoneNumber}`
        // }).unwrap();

        setTimeout(() => {
            
        }, 2000);

        // if (response.status == "success") {
        //   toast.success(
        //     response.message ??
        //       "Received, thanks for contacting us!"
        //   );
        //   setData({
        //     ...data,
        //     email: "",
        //     name: "",
        //     message: "",
        //   });
        //   setSuccess(true);
        // } else {
        //   toast.error("An unknown error occured");
        // }
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
  }

  return (
    <ChakraWrapper>

    <Box
      width={"100%"}
      maxW={"1131px"}
      margin={"0 auto"}
      padding={{base: "20px", md: "84px 49px"}}
      borderWidth={{base: "0", md: "3px 0px 0px 3px"}}
      borderStyle={"solid"}
      borderColor={"#FA9411"}
      borderRadius={{base: "0", md:"10px"}}
      mt={{base: "0px", lg: "-60px"}}
      zIndex={1}
      position={"relative"}
      bg={"#FFF"}
      mb={"72px"}
      id="partner-with-us"
    >
      <Grid templateColumns={{base: "1fr", md: "0.9fr 1fr"}} gap={"38px"}>
        <GridItem  height={"100%"} position={"relative"} display={{base: "none", md: "initial"}}>
          <Image borderRadius={"10px"} objectFit="cover" height="100%" src="https://res.cloudinary.com/tractrac-global/image/upload/v1760200495/Frame_23_l7x6lm.jpg" />
        </GridItem>

        <GridItem>
          <Text fontSize={"20px"} mb={"20px"} fontWeight={600}>For Partnerships & Demonstrations</Text>
          <form onSubmit={handleSubmit}>

          <Box mb="20px">
            <Text mb="8px" fontSize={"14px"} color="#323232" fontWeight={400}>
              Name
            </Text>
            <Input
              name="name"
              border="1px solid #323232"
              bgColor="#F9F9F9"
              _focus={{
                bg: "white",
                borderColor: "#FA9411",
                boxShadow: "0 0 0 1px #FA9411",
              }}
              value={data.name}
              required
              onChange={handleInputChange}
            />
          </Box>
          <Box  mb="20px">
            <Text
              color="#323232"
              fontSize="14px"
              fontWeight={400}
              letterSpacing="0.6px"
            >
              Email
            </Text>
            <Input
              name="email"
              border="1px solid #323232"
              bgColor="#F9F9F9"
              type="email"
              _focus={{
                bg: "white",
                borderColor: "#FA9411",
                boxShadow: "0 0 0 1px #FA9411",
              }}
              value={data.email}
              required
              onChange={handleInputChange}
            />
          </Box>
          <Box mb="20px">
            <Text mb="8px" fontSize={"14px"} color="#323232" fontWeight={400}>
            Organization
            </Text>
            <Input
              name="organization"
              border="1px solid #323232"
              bgColor="#F9F9F9"
              _focus={{
                bg: "white",
                borderColor: "#FA9411",
                boxShadow: "0 0 0 1px #FA9411",
              }}
              value={data.organization}
              required
              onChange={handleInputChange}
            />
          </Box>
          <Box mb="20px">
            <Text mb="8px" fontSize={"14px"} color="#323232" fontWeight={400}>
            Position in the Organisation
            </Text>
            <Input
              name="positionInOrganization"
              border="1px solid #323232"
              bgColor="#F9F9F9"
              _focus={{
                bg: "white",
                borderColor: "#FA9411",
                boxShadow: "0 0 0 1px #FA9411",
              }}
              value={data.positionInOrganization}
              required
              onChange={handleInputChange}
            />
          </Box>
          <Box mb="20px">
           
            <Text mb="8px" fontSize={"14px"} color="#323232" fontWeight={400}>
            Phone Number
            </Text>
            <FormControl
                          >
                           
                            <InputGroup>
                              <InputLeftElement width="5rem">
                                <ChakraSelect
                                  top="0"
                                  left="0"
                                  zIndex={1}
                                  bottom={0}
                                  ml="8px"
                                  // opacity={0}
                                  height="100%"
                                  variant="unstyled"
                                  // position="absolute"
                                  value={countryCode}
                                  required
                                  onChange={(v) => {
                                    // alert(v?.currentTarget?.value)
                                    setCountryCode(v?.currentTarget?.value);
                                  }}
                                >
                                  {/* <option value="" /> */}
                                  {lookup.countries
                                    .map(({ country, isoNo }) => ({
                                      label: country,
                                      value: isoNo,
                                    }))
                                    .map((option) => (
                                      <option
                                        value={option.value}
                                        key={option.value}
                                      >
                                        +{option.value}
                                      </option>
                                    ))}
                                </ChakraSelect>
                              </InputLeftElement>
                              <Input
                                pl="68px"
                                name="phoneNumber"
                                // placeholder="Enter your phone number"
                                bgColor="#3232320D"
                                // type="number"
                                value={data.phoneNumber}
                                required
                                onChange={handleInputChange}
                              />
                            </InputGroup>

                         
                          </FormControl>
          </Box>
          <Box mb="20px">
            <Text mb="8px" fontSize={"14px"} color="#323232" fontWeight={400}>
            How do you want to support
            </Text>
            <Textarea
              minH="165px"
              name="message"
              border="1px solid #323232"
              bgColor="#F9F9F9"
              placeholder="Message"
              _focus={{
                bg: "white",
                borderColor: "#FA9411",
                boxShadow: "0 0 0 1px #FA9411",
              }}
              value={data.message}
              required
              onChange={handleInputChange}
            />
          </Box>

          <Button
                bgColor="#FA9411"
                _hover={{ bg: "#e88305" }}
                _active={{ bg: "#cf7604" }}
                color="white"
                borderRadius="6px"
                height="50px"
                width="100%"
                disabled={success}
                isLoading={loading}
                display={"flex"}
                alignItems={"center"}
                gap={"8px"}
                type="submit"
               
              >
                Submit <RightLongArrow stroke="#FFF" />
              </Button>
          </form>
        </GridItem>
      </Grid>
    </Box>
    </ChakraWrapper>

  );
}
