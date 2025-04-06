// Modal.tsx
import React from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";
import { RootState } from "@/redux/store";
import { closeModal } from "@/redux/features/modalSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";

interface ModalProps {
  title: string;
  modalType: string;
  children: React.ReactNode;
}

const TracTracPageModal: React.FC<ModalProps> = ({
  modalType,
  title,
  children,
}) => {
  const isOpen = useAppSelector(
    (state: RootState) =>
      state.modal.isOpen && state.modal.currentModal === modalType
  );
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay
        bgImage="url('images/modal-bg.jpg')"
        bgRepeat="no-repeat"
        bgPosition="right bottom"
        bgSize="cover"
      />
      <ModalContent
        mr={{ base: "12px", md: "150px" }}
        ml={{ base: "12px" }}
        margin="auto"
      >
        <ModalHeader>{title}</ModalHeader>
        {/* <ModalCloseButton /> */}
        {children}
      </ModalContent>
    </ChakraModal>
  );
};

export default TracTracPageModal;
