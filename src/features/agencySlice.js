import { createSlice } from '@reduxjs/toolkit';
import { AGENCIES_MOCK } from '../mocks/agenciesMock';

const initialState = {
  agencies: AGENCIES_MOCK,
  selectedAgency: AGENCIES_MOCK[0] || null,
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
