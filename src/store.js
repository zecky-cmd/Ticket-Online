import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/themeSlice';
import modalReducer from './features/modalSlice';
import ticketReducer from './features/ticketSlice';
import agencyReducer from './features/agencySlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    modal: modalReducer,
    ticket: ticketReducer,
    agency: agencyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
