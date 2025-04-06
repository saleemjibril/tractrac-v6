"use client";
import { Dispatch, SetStateAction } from "react";
import {
  Box,
  Image,
  Flex,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Alert,
  AlertTitle,
  AlertIcon,
  Text,
  Button,
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
  Spacer,
  InputGroup,
  InputLeftElement,
  ModalBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ModalContent,
  ModalOverlay,
  IconButton,
  Avatar,
  AvatarBadge,
  Select,
} from "@chakra-ui/react";
import { createElement, useEffect, useState } from "react";
import PersonalOverview from "@/app/components/PersonalOverview";
import { ArrowRight, Edit, Edit2 } from "iconsax-react";
import {
  AddIcon,
  ArrowForwardIcon,
  CloseIcon,
  EditIcon,
  PlusSquareIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  useGetHiredTractorsQuery,
  useHireTractorMutation,
} from "@/redux/services/tractorApi";
import { useAppSelector } from "@/redux/hooks";
import {
  useUpdatePasswordMutation,
  useUpdateBioDataMutation,
} from "@/redux/services/userApi";
import router from "next/router";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { AdminSidebarWithHeader } from "@/app/components/AdminSidenav";
import { WomenInMechEntry } from "./women-in-mech";
import { CollaborateEntry } from "./collaborate";
import { AgentsEntry } from "./agents";
import { InvestmentsEntry } from "./investments";
import { VendorsEntry } from "./vendors";
import { ContactsEntry } from "./contact";
import { Operator } from "./operator";

const statusTypes: Record<string, { title: string; color: string }> = {
  pending: { title: "Pending", color: "#FA9411" },
  approved: { title: "Approved", color: "#27AE60" },
  completed: { title: "Completed", color: "#27AE60" },
  in_use: { title: "In Use", color: "#F03B13" },
  not_approved: { title: "Not Approved", color: "#FE391E" },
};

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  return (
    <AdminSidebarWithHeader>
      <Box mx="20px" my="12px" py="12px">
        <Box bg="white" boxShadow="lg" borderRadius="4px">
          <Tabs>
            <TabList pt="12px" px="36px" color="#323232">
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Women in Mechanization
              </Tab>
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Collaborate with us
              </Tab>
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Agent
              </Tab>
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Invest
              </Tab>
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Vendors
              </Tab>
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Operators
              </Tab>
              <Tab
                _selected={{
                  color: "#F8A730",
                  borderBottomColor: "#F8A730",
                }}
              >
                Contact Us
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <WomenInMechEntry />
              </TabPanel>

              <TabPanel>
                <CollaborateEntry />
              </TabPanel>

              <TabPanel>
                <AgentsEntry />
              </TabPanel>

              <TabPanel>
                <InvestmentsEntry />
              </TabPanel>

              <TabPanel>
                <VendorsEntry />
              </TabPanel>
              <TabPanel>
                <Operator />
              </TabPanel>

              <TabPanel>
                <ContactsEntry />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </AdminSidebarWithHeader>
  );
}
