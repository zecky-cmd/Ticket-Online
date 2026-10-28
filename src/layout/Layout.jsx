import { useDispatch, useSelector } from 'react-redux';
import { THEMES } from '../theme/themes';
import { setTheme } from '../features/themeSlice';
import { openModal } from '../features/modalSlice';
import Header from '../globalComponents/Header';
import Footer from '../globalComponents/Footer';

export default function Layout({
  children,
  theme: themeProp,
  currentThemeKey: currentThemeKeyProp,
  onThemeChange,
  themes = THEMES,
  headerProps = {},
  footerProps = {},
  onSelectService
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
  
  const handleSelectService = (service) => {
    if (onSelectService) {
      onSelectService(service);
      return;
    }
    if (service && typeof service === 'string') {
      dispatch(openModal(service));
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Header
        theme={theme}
        currentThemeKey={currentThemeKey}
        onThemeChange={handleThemeChange}
        themes={themes}
        {...headerProps}
      />
      
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      
      <Footer
        theme={theme}
        currentThemeKey={currentThemeKey}
        setCurrentThemeKey={handleThemeChange}
        themes={themes}
        onSelectService={handleSelectService}
        {...footerProps}
      />
    </div>
  );
}
