// ============================================================================
// CONFIGURATION CENTRALE DU SITE — IDENTITÉ, CONTACT & PIED DE PAGE
//
// SEUL fichier à modifier pour adapter le template à un nouveau client
// (logo, nom, sous-titre, numéro d'assistance, slogan du footer).
// Les variables d'environnement (S2Q_SOCID, S2Q_PHONE…) restent dans .env
// ============================================================================

export const SITE_CONFIG = {
  brand: {
    entreprise: 'Synapse',
    logo: '/img/logo-beni.png',
    logoAlt: 'Synapse',
  },
  contact: {
    // label: "Besoin d'aide ?",
    phone: import.meta.env.S2Q_PHONE || '+225 27 20 00 08',
  },
  footer: {
    suffix: '· S2Q',
    tagline: 'Un accueil plus fluide, à votre rythme.',
  },
};
