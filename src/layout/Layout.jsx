import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../globalComponents/Header';
import Footer from '../globalComponents/Footer';

/**
 * Composant Layout Global
 *
 * Rôle :
 * - Cadre général 100vh sans scroll (h-screen overflow-hidden)
 * - Header vert officiel en haut
 * - Contenu principal fluide au centre
 * - Footer minimaliste en bas
 * - Synchronise les tokens CSS Tailwind avec le thème Redux actif
 */
export default function Layout({ children }) {
  const theme = useSelector((state) => state.theme.theme);

  // Synchronise les tokens CSS Tailwind avec le thème actif (multi-client runtime)
  useEffect(() => {
    const root = document.documentElement;
    const c = theme?.colors || {};
    const tokens = {
      '--color-primary-50': c.primaryLight,
      '--color-primary-100': c.primaryMuted,
      '--color-primary-200': c.primaryBorder,
      '--color-primary-400': c.accent,
      '--color-primary-500': c.primary,
      '--color-primary-600': c.primaryHover,
      '--color-primary-700': c.primaryActive,
    };
    Object.entries(tokens).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <div className="h-screen max-h-screen h-[100dvh] w-full bg-white text-slate-900 font-sans flex flex-col justify-between overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* 1. Header vert signature */}
      <Header theme={theme} />

      {/* 2. Corps de page : occupe exactement l'espace restant dans les 100vh */}
      <main className="flex-1 min-h-0 w-full flex flex-col justify-between overflow-hidden">
        {children}
      </main>

      {/* 3. Footer épuré 1 ligne toujours visible à l'écran sans scroll */}
      <Footer />
    </div>
  );
}
