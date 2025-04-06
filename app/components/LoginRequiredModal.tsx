// Modal.tsx
import React, { Dispatch, SetStateAction } from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  Image,
  Text,
  Button,
  Flex,
  ModalBody,
} from "@chakra-ui/react";
import { RootState } from "@/redux/store";
import { closeModal } from "@/redux/features/modalSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

interface ModalProps {
  title: string;
  isOpen: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}

const LogoutRequiredModal: React.FC<ModalProps> = ({
  isOpen,
  setModalState,
}) => {
  const router = useRouter();
  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={() => setModalState(false)}
      //   closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      size="xs"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody textAlign="center" py="20px">
          <Flex flexDir="column" alignItems="center">
            <Image
              src="/images/error.svg"
              width="120px"
              alt="Error image icon"
            />
            <Text fontSize="16px" fontWeight={600}>
              Error
            </Text>
            <Text my="8px" fontSize="14px">
              Login to access this feature
            </Text>
            <Button
              mb="4px"
              onClick={() => {
                setModalState(false);
                router.replace("/login");
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
              Login <ArrowForwardIcon ml="8px" />
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export default LogoutRequiredModal;
