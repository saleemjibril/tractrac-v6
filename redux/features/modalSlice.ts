import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  currentModal: string | null;
}

const initialState: ModalState = {
  isOpen: false,
  currentModal: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
        state.isOpen = true;
        state.currentModal = action.payload;
      },
      closeModal: (state) => {
        state.isOpen = false;
        state.currentModal = null;
      },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
