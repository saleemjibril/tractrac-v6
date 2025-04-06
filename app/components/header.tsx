"use client";

import {
  Box,
  ButtonGroup,
  List,
  ListIcon,
  ListItem,
  Stack,
  Flex,
  Text,
  Link,
  Button,
  IconButton,
  useColorModeValue,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Input,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Drawer,
  useDisclosure,
  DrawerContent,
  FlexProps,
  CloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  useMediaQuery,
  // NavItem,
} from "@chakra-ui/react";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import { useStateManager } from "chakra-react-select";
import { openModal } from "@/redux/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SidebarContent } from "./sidebar";
import { ChakraWrapper } from "../chakraUIWrapper";

export default function Header() {
  const dispatch = useAppDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
//   const [show, setShow] = useStateManager<boolean>(true);
  const [show, setShow] = useState<boolean>(true);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const showModal = (type: string) => {
    dispatch(openModal(type));
  };
  useEffect(() => {
    setShow(true);
    console.log(isMobile);
  }, [isMobile]);
  return (
    <ChakraWrapper>
      <Navbar onOpen={onOpen} />

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {show && isMobile && (
        <div
          className="notice"
          style={{
            width: "95%",
            marginLeft: "auto",
            marginRight: "auto",
            background: "white",
            position: "fixed",
            bottom: "10px",
            transform: "translateX(2.5%)",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              fontSize: "12px",
              alignItems: "center",
              position: "relative",
            }}
          >
            <span>
              {/* <img src="images/tractor-icon-avatar.svg" alt="logo-image" /> */}
              <Image src="images/tractor-icon-avatar.svg" alt="logo-image" />
            </span>
            <div>
              <h4 style={{ fontWeight: "bold" }}>Download TracTrac App</h4>
              <span>
                For better mobile experience, <br /> get our mobile app.
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              // justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                position: "relative",
              }}
            >
              <a href="https://play.google.com/store/apps/details?id=com.tractrac.trac_trac&hl=en_GB">
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    // border: "1px solid red",
                    color: "white",
                    background: "#FA9411",
                  }}
                >
                  Download
                </button>
              </a>
              <span
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-25px",
                  background: "white",
                  padding: "3px",
                  borderRadius: "100px",
                  height: "25px",
                  width: "25px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => setShow(false)}
              >
                <CloseButton size="sm" />
              </span>
            </div>
          </div>
        </div>
      )}
    </ChakraWrapper>
  );
}
