import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../globalComponents/Header';
import Footer from '../globalComponents/Footer';

/**
 * Composant Layout Global — Template Synapse S2Q
 *
 * Rôle :
 * - Header institutionnel sticky aux couleurs de la marque
 * - Fond de page #F8FAFC doux et contemporain
 * - Corps fluide et scrollable sur tous formats d'écran
 * - Footer épuré
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
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans flex flex-col justify-between selection:bg-primary-500 selection:text-white">
      {/* 1. Header vert signature sticky */}
      <Header theme={theme} />

      {/* 2. Corps de page scrollable avec marge inférieure pour la barre mobile */}
      <main className="flex-1 w-full pb-16 md:pb-6">
        {children}
      </main>

      {/* 3. Footer épuré */}
      <Footer />
    </div>
  );
}
