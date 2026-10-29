import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { THEMES } from '../theme/themes';
import { setTheme } from '../features/themeSlice';
import Header from '../globalComponents/Header';
import Footer from '../globalComponents/Footer';

/**
 * Composant Layout Global
 * 
 * Rôle :
 * - Cadre général 100vh sans scroll (h-screen overflow-hidden)
 * - Header vert officiel en haut
 * - Contenu principal fluide au centre
 * - Footer blanc minimaliste en bas
 */
export default function Layout({
  children,
  theme: themeProp,
  currentThemeKey: currentThemeKeyProp,
  onThemeChange,
  themes = THEMES,
  headerProps = {},
  footerProps = {}
}) {
  const dispatch = useDispatch();
  
  const reduxTheme = useSelector((state) => state.theme.theme);
  const reduxCurrentThemeKey = useSelector((state) => state.theme.currentThemeKey);
  
  const theme = themeProp || reduxTheme;
  const currentThemeKey = currentThemeKeyProp || reduxCurrentThemeKey;
  
  const handleThemeChange = (key) => {
    if (onThemeChange) {
      onThemeChange(key);
      return;
    }
    dispatch(setTheme(key));
  };
  
  return (
    <div className="h-screen max-h-screen w-full bg-white text-slate-900 font-sans flex flex-col justify-between overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* 1. Header vert signature */}
      <Header
        theme={theme}
        currentThemeKey={currentThemeKey}
        onThemeChange={handleThemeChange}
        themes={themes}
        {...headerProps}
      />
      
      {/* 2. Corps de page plein écran sans scroll */}
      <main className="flex-1 flex flex-col justify-between min-h-0 w-full overflow-hidden">
        {children}
      </main>
      
      {/* 3. Footer épuré 1 ligne */}
      <Footer {...footerProps} />
    </div>
  );
}
