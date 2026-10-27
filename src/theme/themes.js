// ============================================================================
// CONFIGURATION DU THÈME INTERCHANGEABLE (VERT & BLANC PAR DÉFAUT)
// ============================================================================
export const THEMES = {
  vertBlanc: {
    id: 'vertBlanc',
    name: 'Vert & Blanc (Corporate)',
    colors: {
      primary: '#059669', // Emerald 600
      primaryHover: '#047857', // Emerald 700
      primaryLight: '#ecfdf5', // Emerald 50
      primaryBorder: '#a7f3d0', // Emerald 200
      secondary: '#064e3b', // Vert forêt profond
      accent: '#10b981', // Emerald 500
      badgeBg: '#d1fae5',
      badgeText: '#065f46',
      heroGradient: 'from-emerald-950/90 via-slate-950/75 to-emerald-900/85',
      cardHoverBorder: 'hover:border-emerald-400',
    }
  },
  oceanBleu: {
    id: 'oceanBleu',
    name: 'Bleu Océan',
    colors: {
      primary: '#2563eb', // Blue 600
      primaryHover: '#1d4ed8', // Blue 700
      primaryLight: '#eff6ff',
      primaryBorder: '#bfdbfe',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      badgeBg: '#dbeafe',
      badgeText: '#1e40af',
      heroGradient: 'from-blue-950/90 via-slate-950/75 to-blue-900/85',
      cardHoverBorder: 'hover:border-blue-400',
    }
  },
  sunsetAmbre: {
    id: 'sunsetAmbre',
    name: 'Terre & Ambre',
    colors: {
      primary: '#d97706', // Amber 600
      primaryHover: '#b45309', // Amber 700
      primaryLight: '#fffbeb',
      primaryBorder: '#fde68a',
      secondary: '#78350f',
      accent: '#f59e0b',
      badgeBg: '#fef3c7',
      badgeText: '#92400e',
      heroGradient: 'from-amber-950/90 via-stone-950/75 to-amber-900/85',
      cardHoverBorder: 'hover:border-amber-400',
    }
  }
};

export const DEFAULT_THEME_KEY = 'vertBlanc';
export const DEFAULT_THEME = THEMES[DEFAULT_THEME_KEY];
