"use client";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
  Box,
  Image,
  Flex,
  Text,
  Center,
  Table,
  Modal as ChakraModal,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Skeleton,
  SkeletonText,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Button,
  Icon,
  ButtonGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/services/adminApi";
import { AdminSidebarWithHeader } from "@/app/components/AdminSidenav";
import { Table as CTable, createColumn } from "react-chakra-pagination";
import { FiTrash2, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
};

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  avatar_url: string;
};

// Example list of users
// Generated using https://www.mockaroo.com/
const users: User[] = [
  {
    id: 10,
    name: "Alf Ibbotson",
    email: "aibbotson9@mozilla.com",
    phone: "(739) 4103240",
    birthday: "02/28/2007",
    avatar_url:
      "https://robohash.org/temporibussintmollitia.png?size=50x50&set=set1",
  },
  {
    id: 11,
    name: "Aurel McCamish",
    email: "amccamisha@soup.io",
    phone: "(352) 9149861",
    birthday: "03/13/1993",
    avatar_url: "https://robohash.org/laboreteneturut.png?size=50x50&set=set1",
  },
  {
    id: 12,
    name: "Jarrad Jerrans",
    email: "jjerransb@mail.ru",
    phone: "(568) 7793952",
    birthday: "05/25/1989",
    avatar_url:
      "https://robohash.org/voluptasoditrepellendus.png?size=50x50&set=set1",
  },
  {
    id: 13,
    name: "Adams Swyer-Sexey",
    email: "aswyersexeyc@meetup.com",
    phone: "(682) 4005822",
    birthday: "12/31/1984",
    avatar_url:
      "https://robohash.org/molestiaeatqueincidunt.png?size=50x50&set=set1",
  },
  {
    id: 14,
    name: "Gladi Coxhell",
    email: "gcoxhelld@sciencedaily.com",
    phone: "(321) 6811254",
    birthday: "10/21/2009",
    avatar_url:
      "https://robohash.org/perspiciatissitreprehenderit.png?size=50x50&set=set1",
  },
  {
    id: 15,
    name: "Felecia Yitzovicz",
    email: "fyitzovicze@cnet.com",
    phone: "(465) 9054540",
    birthday: "04/30/1982",
    avatar_url: "https://robohash.org/undevelitdolor.png?size=50x50&set=set1",
  },
  {
    id: 1,
    name: "Carlin Gwinn",
    email: "cgwinn0@buzzfeed.com",
    phone: "(684) 9842794",
    birthday: "04/11/2009",
    avatar_url:
      "https://robohash.org/assumendanihilodio.png?size=50x50&set=set1",
  },
  {
    id: 2,
    name: "Yetta Snape",
    email: "ysnape1@princeton.edu",
    phone: "(645) 8617506",
    birthday: "06/08/1989",
    avatar_url:
      "https://robohash.org/liberorationequasi.png?size=50x50&set=set1",
  },
];

export default function UsersPage() {
  const {
    data: result,
    error,
    // isFetching,
    isLoading,
    // } = useGetHiredTractorsQuery("3");
  } = useGetUsersQuery({});

  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const [search, setSearchInput] = useState("");
  const [processing, setProcessing] = useState(false);

  function filterUsers(users: any[], searchString: string): any[] {
    if (!users) return [];
    if (searchString.trim() === "") {
      return users; // If the search string is empty, return all farmers
    }

    const searchValue = searchString.trim();

    // Check if the search input is a valid number
    const isNumeric = !isNaN(parseFloat(searchValue)) && isFinite(+searchValue);

    return users.filter(
      (user) =>
        isNumeric
          ? user.phone.includes(searchValue) // Search by phone if it's a number
          : user.fname.toLowerCase().includes(searchValue.toLowerCase()) // Search by name if it's not a number
    );
  }

  const tableData = useMemo(() => {
    return filterUsers(result?.data, search).map((user: any) => ({
      fname: user.fname,
      lname: user.lname,
      phone: user.phone,
      gender: user.gender,
      email: user.email,
      state: user.state,
      interests: user.interests,
      action: (
        <ButtonGroup>
          <Button
            colorScheme="red"
            isDisabled={processing}
            onClick={async () => {
              const result = confirm(
                `Are you sure you want to delete ${
                  user.email || user.fname
                }'s account?`
              );
              if (result) {
                try {
                  setProcessing(true);
                  const response = await deleteUser({
                    user_id: user.id,
                  }).unwrap();

                  if (response.status == "success") {
                    toast.success(
                      response.message ?? "User deleted successfully"
                    );
                  } else {
                    toast.error("An unknown error occured");
                  }
                } catch (err) {
                  const error = err as any;
                  // alert('error')
                  if (error?.data?.errors) {
                    // setError(error?.data?.errors[0])
                  } else if (error?.data?.message) {
                    toast.error(error?.data?.message);
                  }
                  console.error("rejected", error);
                } finally {
                  setProcessing(false);
                }
              }
            }}
            size="sm"
          >
            Delete
          </Button>
          <Button
            colorScheme="yellow"
            isDisabled={processing}
            onClick={async () => {
              const message = user.role == "user" ? "an admin" : "a user";
              // const newRole = user.role == "user" ? "admin" : "user";
              const result = confirm(
                `Are you sure you want to make this user ${message}?`
              );
              if (result) {
                try {
                  setProcessing(true);
                  const response = await updateUserRole({
                    user_id: user.id,
                    role: message.split(" ")[1],
                  }).unwrap();

                  if (response.status == "success") {
                    toast.success(
                      response.message ?? "User role updated successfully"
                    );
                  } else {
                    toast.error("An unknown error occured");
                  }
                } catch (err) {
                  const error = err as any;
                  // alert('error')
                  if (error?.data?.errors) {
                    // setError(error?.data?.errors[0])
                  } else if (error?.data?.message) {
                    toast.error(error?.data?.message);
                  }
                  console.error("rejected", error);
                } finally {
                  setProcessing(false);
                }
              }
            }}
            size="sm"
          >
            {user.role == "user" ? "Admin" : "User"}
          </Button>
        </ButtonGroup>
      ),
    }));
  }, [result, search, processing, deleteUser, updateUserRole]);
  const formatPhoneNumber = (phoneNumber: string) => {
    // Format phone number as needed (e.g., adding dashes)
    return phoneNumber?.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  const handleExportCSV = () => {
    let tableData = filterUsers(result?.data, search);
    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "First Name",
          "Last Name",
          "Phone Number",
          "Gender",
          "Email",
          "State",
          "Interest",
        ],
        ...tableData.map((row) => [
          row.id,
          row.fname,
          row.lname,
          formatPhoneNumber(row.phone),
          row.gender,
          row.email,
          row.state,
          row.interests,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

    // Create a download link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "farmers_table_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Need pass type of `tableDate` for ts autocomplete
  const columnHelper = createColumn<any>();
  //   const columnHelper = createColumn<(typeof tableData)[0]>();

  const columns = [
    columnHelper.accessor("fname", {
      cell: (info) => info.getValue(),
      header: "First Name",
    }),
    columnHelper.accessor("lname", {
      cell: (info) => info.getValue(),
      header: "Last Name",
    }),
    columnHelper.accessor("phone", {
      cell: (info) => info.getValue(),
      header: "Phone Number",
    }),
    columnHelper.accessor("gender", {
      cell: (info) => info.getValue(),
      header: "Gender",
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: "Email",
    }),
    columnHelper.accessor("state", {
      cell: (info) => info.getValue(),
      header: "State",
    }),
    columnHelper.accessor("action", {
      cell: (info) => info.getValue(),
      header: "Actions",
    }),

    columnHelper.accessor("interests", {
      cell: (info) => info.getValue(),
      header: "Interests",
    }),
  ];

  return (
    <AdminSidebarWithHeader>
      <Box mx="20px" my="12px" py="12px">
        <Box bg="white" boxShadow="lg" borderRadius="4px">
          <Text
            px="32px"
            py="20px"
            color="#848484"
            fontSize="14px"
            fontWeight={400}
          >
            Users
          </Text>
          <Divider />

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
                  placeholder="Search user by phone no. or first name"
                  width="300px"
                  fontSize="13px"
                  onChange={(e) => setSearchInput(e?.currentTarget.value)}
                />
              </InputGroup>
              <Button
                borderWidth="1px"
                // borderColor="#FA9411"
                mb="12px"
                ml="20px"
                // height="42px"
                borderRadius="4px"
                // width="200px"
                _hover={{
                  opacity: 0.5,
                }}
                onClick={tableData && handleExportCSV}
              >
                <Text fontSize="14px">Export CSV</Text>
              </Button>
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
                <CTable
                  colorScheme="orange"
                  // Fallback component when list is empty
                  emptyData={{
                    icon: FiUser,
                    text: "Empty",
                  }}
                  // Control registers to show
                  // Exemple: show 10 registers of 15
                  totalRegisters={result?.data.length || 10}
                  itemsPerPage={50}
                  // Listen change page event and control the current page using state
                  onPageChange={(page: any) => console.log(page)}
                  columns={columns}
                  data={tableData}
                />
                {/* <Table variant="simple" bgColor="white">
                  <Thead color="#323232" bgColor="#E2E8F0">
                    <Tr>
                      <Th>First Name</Th>
                      <Th>Last Name</Th>
                      <Th>Phone Number</Th>
                      <Th>Gender</Th>
                      <Th>Email</Th>
                      <Th>State</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filterUsers(result?.data, search).map((user: any) => (
                      <Tr key={user?.id}>
                        <Td>{user?.fname ?? "N/a"}</Td>
                        <Td>{user?.lname ?? "N/a"}</Td>
                        <Td>{user?.phone}</Td>
                        <Td>{user?.gender}</Td>
                        <Td>{user?.email ?? "N/A"}</Td>
                        <Td>{user?.state ?? "N/a"}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table> */}
              </TableContainer>
            )}
          </Box>

          {/* Test */}
          {/* <Box mt="6">
            <CTable
              colorScheme="orange"
              // Fallback component when list is empty
              emptyData={{
                icon: FiUser,
                text: "Empty",
              }}
              // Control registers to show
              // Exemple: show 10 registers of 15
              totalRegisters={20}
              itemsPerPage={4}
              // Listen change page event and control the current page using state
              onPageChange={(page: any) => console.log(page)}
              columns={columns}
              data={tableData}
            />
          </Box> */}
        </Box>
      </Box>
    </AdminSidebarWithHeader>
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
          List is empty
        </Text>

        <Text color="#323232" fontWeight="400" fontSize="18px">
          All users will be listed in this page
        </Text>
      </Box>
    </Flex>
  );
}
