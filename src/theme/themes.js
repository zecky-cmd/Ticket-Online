// ============================================================================
// CONFIGURATION DES THÈMES INTERCHANGEABLES — S2Q (Synapse Queue System)
//
// Ce fichier est le SEUL endroit à modifier pour changer la couleur d'un client.
// Le thème "vertBlanc" est configuré avec la palette du client BNI (exemple).
// Pour un autre client, dupliquer un thème et changer les valeurs de couleur.
//
// Usage dans un composant :
//   import { THEMES, DEFAULT_THEME_KEY } from '../theme/themes';
//   const theme = THEMES['vertBlanc'];
//   style={{ backgroundColor: theme.colors.primary }}
// ============================================================================

export const THEMES = {

  // ─────────────────────────────────────────────────────────────────────────
  // THÈME 1 : Vert & Blanc — Client BNI (Banque Nationale d'Investissement)
  // Pour un autre client vert, dupliquer ce bloc et ajuster les hex.
  // ─────────────────────────────────────────────────────────────────────────
  vertBlanc: {
    id: 'vertBlanc',
    name: 'Vert Corporate',

    colors: {
      // Couleur principale — header, boutons, wave divider, icônes de carte
      primary:       '#00843D',
      primaryHover:  '#006B31',   // état hover
      primaryActive: '#00521F',   // état pressed

      // Déclinaisons — fonds, badges, bordures
      primaryLight:  '#E6F4EC',   // fond de badge, highlight section
      primaryBorder: '#85CAA0',   // bordure de card au survol
      primaryMuted:  '#C2E5CF',   // séparateurs, dividers légers

      // Accent vif — tags, indicateurs live
      secondary:     '#006B31',
      accent:        '#00A84F',

      // Badges
      badgeBg:       '#E6F4EC',
      badgeText:     '#00521F',

      // Hero section — dégradé sombre pour lisibilité sur image de fond
      heroGradient:  'from-green-950/90 via-slate-950/75 to-green-900/85',

      // Hover bordure carte — utilise le token CSS générique
      cardHoverBorder: 'hover:border-primary-400',

      // Texte sur fond coloré (ex: header)
      textOnPrimary:  '#FFFFFF',

      // Fonds de page
      pageBg:        '#FFFFFF',
      sectionBg:     '#F5F5F5',
    },

    // Classes Tailwind pré-composées par contexte.
    // Le développeur suivant les utilise directement — il n'écrit PAS de CSS.
    tw: {
      btnPrimary:    'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white',
      btnSecondary:  'bg-white hover:bg-primary-50 text-primary-500 border border-primary-500',
      btnOutline:    'border border-primary-500 text-primary-500 hover:bg-primary-50',
      cardBorder:    'border border-border-light hover:border-primary-400',
      badge:         'bg-primary-50 text-primary-700',
      headerBg:      'bg-primary-500',
      sectionAlt:    'bg-surface-light',
      focusRing:     'focus-visible:ring-2 focus-visible:ring-primary-500',
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // THÈME 2 : Bleu Océan — Client à palette bleue
  // ─────────────────────────────────────────────────────────────────────────
  oceanBleu: {
    id: 'oceanBleu',
    name: 'Bleu Océan',

    colors: {
      primary:       '#2563EB',
      primaryHover:  '#1D4ED8',
      primaryActive: '#1E40AF',
      primaryLight:  '#EFF6FF',
      primaryBorder: '#BFDBFE',
      primaryMuted:  '#DBEAFE',
      secondary:     '#1E3A8A',
      accent:        '#3B82F6',
      badgeBg:       '#DBEAFE',
      badgeText:     '#1E40AF',
      heroGradient:  'from-blue-950/90 via-slate-950/75 to-blue-900/85',
      cardHoverBorder: 'hover:border-primary-400',
      textOnPrimary:  '#FFFFFF',
      pageBg:        '#FFFFFF',
      sectionBg:     '#F5F5F5',
    },

    tw: {
      btnPrimary:    'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white',
      btnSecondary:  'bg-white hover:bg-blue-50 text-blue-600 border border-blue-600',
      btnOutline:    'border border-blue-600 text-blue-600 hover:bg-blue-50',
      cardBorder:    'border border-border-light hover:border-blue-400',
      badge:         'bg-blue-50 text-blue-700',
      headerBg:      'bg-blue-600',
      sectionAlt:    'bg-surface-light',
      focusRing:     'focus-visible:ring-2 focus-visible:ring-blue-600',
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // THÈME 3 : Terre & Ambre — Client à palette chaude
  // ─────────────────────────────────────────────────────────────────────────
  sunsetAmbre: {
    id: 'sunsetAmbre',
    name: 'Terre & Ambre',

    colors: {
      primary:       '#D97706',
      primaryHover:  '#B45309',
      primaryActive: '#92400E',
      primaryLight:  '#FFFBEB',
      primaryBorder: '#FDE68A',
      primaryMuted:  '#FEF3C7',
      secondary:     '#78350F',
      accent:        '#F59E0B',
      badgeBg:       '#FEF3C7',
      badgeText:     '#92400E',
      heroGradient:  'from-amber-950/90 via-stone-950/75 to-amber-900/85',
      cardHoverBorder: 'hover:border-primary-400',
      textOnPrimary:  '#FFFFFF',
      pageBg:        '#FFFFFF',
      sectionBg:     '#F5F5F5',
    },

    tw: {
      btnPrimary:    'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white',
      btnSecondary:  'bg-white hover:bg-amber-50 text-amber-600 border border-amber-600',
      btnOutline:    'border border-amber-600 text-amber-600 hover:bg-amber-50',
      cardBorder:    'border border-border-light hover:border-amber-400',
      badge:         'bg-amber-50 text-amber-700',
      headerBg:      'bg-amber-600',
      sectionAlt:    'bg-surface-light',
      focusRing:     'focus-visible:ring-2 focus-visible:ring-amber-600',
    }
  }
};

export const DEFAULT_THEME_KEY = 'vertBlanc';
export const DEFAULT_THEME    = THEMES[DEFAULT_THEME_KEY];

