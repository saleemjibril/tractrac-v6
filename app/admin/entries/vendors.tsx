"use client";
import {
  Box,
  Image,
  Flex,
  Text,
  Center,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Skeleton,
  SkeletonText,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { useGetEntriesQuery } from "@/redux/services/adminApi";

export function VendorsEntry() {
  const {
    data: results,
    error,
    isLoading,
  } = useGetEntriesQuery("vendor");

  const [search, setSearchInput] = useState("");

  function filterData(results: any[], searchString: string): any[] {
    console.log("FARRR", results);
    if (searchString.trim() === "") {
      return results; // If the search string is empty, return all results
    }

    const searchValue = searchString.trim();

    // Check if the search input is a valid number
    const isNumeric = !isNaN(parseFloat(searchValue)) && isFinite(+searchValue);

    return results.filter(
      (result) =>
        isNumeric
          ? result.phone.includes(searchValue) // Search by phone if it's a number
          : result.name.toLowerCase().includes(searchValue.toLowerCase()) // Search by name if it's not a number
    );
  }

  return (
    <Box px="32px" pb="32px">
      <Flex
        justifyContent="space-between"
        mt="24px"
        mb="24px"
        alignContent="center"
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            width="300px"
            fontSize="13px"
            onChange={(e) => setSearchInput(e?.currentTarget.value)}
          />
        </InputGroup>

        {/* <Spacer /> */}
      </Flex>

      {isLoading ? (
        <>
          <Skeleton height="80px" />
          <Box p="12px">
            <SkeletonText
              my="12px"
              noOfLines={8}
              spacing="3"
              skeletonHeight="24px"
            />
          </Box>
        </>
      ) : error ? (
        <EmptyDataPlaceholder />
      ) : (
        <TableContainer
          border="1px"
          borderColor="#32323220"
          borderRadius="12px"
        >
          <Table variant="simple" bgColor="white">
            <Thead color="#323232" bgColor="#E2E8F0">
              <Tr>
                <Th>Name</Th>
                <Th>Phone Number</Th>
                <Th>Email</Th>
                <Th>Organization</Th>
                <Th>Position</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filterData(results?.data, search).map((result: any) => (
                <Tr key={result?.id}>
                  <Td>{result?.name || "N/A"}</Td>
                  <Td>{result?.phone ?? "Nil"}</Td>
                  <Td>{result?.email ?? "N/A"}</Td>
                  <Td>{result?.organization}</Td>
                  <Td>{result?.position}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

function EmptyDataPlaceholder() {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box bgColor="white" width="100%" p="60px" textAlign="center" mt="20px">
        {/* <Box bgColor="white" width="400px" p="60px" textAlign="center" mt="40px"> */}
        <Center>
          <Image src="/images/empty-state.svg" alt="Empty state image icon" />
        </Center>
        <Text color="#323232" fontWeight="700" fontSize="20px" mt="57px">
          Entry is empty
        </Text>

        <Text color="#323232" fontWeight="400" fontSize="18px">
          All entries for this category will be listed on this page
        </Text>

        {/* <Button
          as="a"
          mt="50px"
          href="/home/enlist-tractor"
          height="56px"
          w="240px"
          bgColor="#FA9411"
          color="white"
        >
          Enlist your tractor
        </Button> */}
      </Box>
    </Flex>
  );
}
