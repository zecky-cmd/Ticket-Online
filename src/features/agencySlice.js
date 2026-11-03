import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAgency: null,
  searchQuery: '',
};

const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    setSelectedAgency: (state, action) => {
      state.selectedAgency = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSelectedAgency, setSearchQuery } = agencySlice.actions;
export default agencySlice.reducer;
