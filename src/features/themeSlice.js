import { createSlice } from '@reduxjs/toolkit';
import { THEMES } from '../theme/themes';

const initialThemeKey = 'vertBlanc';

const initialState = {
  currentThemeKey: initialThemeKey,
  theme: THEMES[initialThemeKey],
  availableThemes: THEMES,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const key = action.payload;
      if (state.availableThemes[key]) {
        state.currentThemeKey = key;
        state.theme = state.availableThemes[key];
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
