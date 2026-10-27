import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTicket: null,
  ticketHistory: [],
  isLoading: false,
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setCreatedTicket: (state, action) => {
      state.currentTicket = action.payload;
      if (action.payload) {
        state.ticketHistory.unshift(action.payload);
      }
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
});

export const { setCreatedTicket, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
