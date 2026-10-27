import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeModal: null, // 'ticket' | 'satisfaction' | 'map' | null
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
