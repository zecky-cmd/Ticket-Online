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

// ============================================================================
// DONNÉES DU CARROUSEL PUBLICITAIRE & AGENCES
// Chaque slide peut contenir un "link" et un "linkText"
// Si aucun "link" n'est défini, aucun bouton ne sera affiché.
// ============================================================================
export const SLIDES = [
  {
    id: 1,
    tag: "Promotion & Modernité",
    title: "Votre temps est précieux, nous le respectons",
    subtitle: "Découvrez notre écosystème digital conçu pour faciliter vos démarches en agence et à distance sans attente inutile.",
    image: "/BNI1.jpg",
    link: "https://www.bni.ci",
    linkText: "En savoir plus",
    linkTarget: "_blank"
  },
  {
    id: 2,
    tag: "Qualité & Écoute",
    title: "Bâtissons ensemble une expérience d'exception",
    subtitle: "Votre avis oriente nos innovations quotidiennes. Partagez votre satisfaction ou vos recommandations en quelques secondes.",
    image: "/BNI2.jpg",
    link: "#satisfaction",
    linkText: "Donner mon avis"
  },
  {
    id: 3,
    tag: "Réseau de Proximité",
    title: "Toujours à vos côtés, partout dans le pays",
    subtitle: "Consultez nos 25 agences en direct avec visibilité sur l'affluence, les horaires et les conseillers disponibles.",
    image: "/BNI3.jpg"
    // Pas de link : aucun bouton n'apparaît sur ce slide
  }
];

export const AGENCIES = [
  {
    id: 1,
    name: "Agence Centrale - Plateau",
    commune: "Plateau, Abidjan",
    address: "Boulevard de la République, Face BCEAO",
    hours: "Lun - Ven: 08h00 - 17h30 | Sam: 09h00 - 13h00",
    phone: "+225 27 20 22 10 01",
    status: "Ouvert",
    currentWaitTime: "6 min",
    countersActive: 8,
    lat: "5.3200",
    lng: "-4.0150"
  },
  {
    id: 2,
    name: "Agence Riviera Palmeraie",
    commune: "Cocody, Abidjan",
    address: "Boulevard François Mitterrand, Carrefour Palmeraie",
    hours: "Lun - Ven: 08h30 - 18h00 | Sam: 09h00 - 14h00",
    phone: "+225 27 22 44 20 02",
    status: "Ouvert",
    currentWaitTime: "12 min",
    countersActive: 5,
    lat: "5.3550",
    lng: "-3.9700"
  },
  {
    id: 3,
    name: "Agence Zone 4 - Rue Lumière",
    commune: "Marcory, Abidjan",
    address: "Angle Rue Pierre et Marie Curie",
    hours: "Lun - Ven: 08h00 - 17h00 | Sam: Fermé",
    phone: "+225 27 21 35 40 03",
    status: "Fermeture à 17h",
    currentWaitTime: "4 min",
    countersActive: 6,
    lat: "5.2900",
    lng: "-3.9850"
  },
  {
    id: 4,
    name: "Agence Yopougon - Horizon",
    commune: "Yopougon, Abidjan",
    address: "Carrefour Siporex, Immeuble Grand Siècle",
    hours: "Lun - Ven: 08h00 - 17h30 | Sam: 09h00 - 13h00",
    phone: "+225 27 23 50 15 04",
    status: "Ouvert",
    currentWaitTime: "15 min",
    countersActive: 7,
    lat: "5.3350",
    lng: "-4.0750"
  }
];
