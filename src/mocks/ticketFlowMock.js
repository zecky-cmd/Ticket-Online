// ============================================================================
// DONNÉES DU FLUX DE PRISE DE TICKET S2Q (SERVICES, PRESTATIONS, GESTIONNAIRES, CRÉNEAUX)
// ============================================================================

export const SERVICES_LIST = [
  {
    id: 'caisse',
    name: 'Opérations de Caisse & Règlements',
    shortName: 'Caisse',
    serviceType: 'caisse', // 'caisse' | 'gestionnaire'
    codePrefix: 'CAI',
    description: 'Versements, retraits, change, remises et encaissements de chèques.',
    avgDuration: '10 min',
    prestations: [
      { id: 'vers-especes', name: "Versement d'espèces", documents: "Pièce d'identité, numéro de compte" },
      { id: 'retrait-guichet', name: 'Retrait d’espèces au guichet', documents: "Pièce d'identité, chéquier ou carte" },
      { id: 'remise-cheque', name: 'Dépôt / Remise de chèque', documents: "Bordereau de remise, chèque endossé" },
      { id: 'retrait-chequier', name: 'Retrait de chéquier ou carte bancaire', documents: "Pièce d'identité originale" },
      { id: 'change-devises', name: 'Opérations de change de devises', documents: "Passeport / CNI, justificatif d'origine des fonds" },
    ],
  },
  {
    id: 'conseil',
    name: 'Conseil Particuliers & Comptes',
    shortName: 'Conseil',
    serviceType: 'gestionnaire',
    codePrefix: 'CPT',
    description: 'Ouverture de compte, crédits personnels, épargne et gestion quotidienne.',
    avgDuration: '25 min',
    prestations: [
      { id: 'ouv-compte', name: 'Ouverture de compte bancaire', documents: "CNI/Passeport, 2 photos, certificat de résidence, bulletin de paie" },
      { id: 'credit-perso', name: 'Demande de crédit à la consommation / immobilier', documents: "3 derniers bulletins de paie, CNI, relevés de compte" },
      { id: 'epargne-placement', name: 'Souscription plan d’épargne / DAT', documents: "Pièce d'identité, justificatif de domicile" },
      { id: 'commande-carte', name: 'Souscription ou renouvellement carte bancaire', documents: "Pièce d'identité valide" },
      { id: 'point-conseiller', name: 'Point gestion de compte avec un conseiller', documents: "Numéro de compte, CNI" },
    ],
  },
  {
    id: 'entreprises',
    name: 'Espace Professionnels & Entreprises',
    shortName: 'Entreprises',
    serviceType: 'gestionnaire',
    codePrefix: 'PRO',
    description: 'Comptes pro, financement d’exploitation, TPE et services corporatifs.',
    avgDuration: '30 min',
    prestations: [
      { id: 'ouv-compte-pro', name: 'Ouverture de compte société / entreprise', documents: "Registre de commerce (RCCM), statuts, CNI des gérants, DFE" },
      { id: 'financement-pro', name: 'Demande de facilité de caisse / crédit d’équipement', documents: "États financiers, prévisionnel de trésorerie" },
      { id: 'equipement-tpe', name: 'Demande / SAV Terminal de paiement électronique (TPE)', documents: "Contrat commerçant, CNI signataire" },
      { id: 'commerce-international', name: 'Crédit documentaire & virements internationaux', documents: "Facture proforma, titre d'importation" },
    ],
  },
  {
    id: 'reclamation',
    name: 'Réclamations & Cartes Bancaires (SAV)',
    shortName: 'SAV / Réclamations',
    serviceType: 'gestionnaire',
    codePrefix: 'REC',
    description: 'Litiges opérations, carte avalée/bloquée, contestation de débit.',
    avgDuration: '15 min',
    prestations: [
      { id: 'carte-bloquee', name: 'Déblocage de carte / Code PIN oublié', documents: "Pièce d'identité, carte concernée" },
      { id: 'contestation-debit', name: 'Contestation d’opération ou débit frauduleux', documents: "Relevé avec l'opération entourée, formulaire de réclamation" },
      { id: 'mise-a-jour-dossier', name: 'Mise à jour des données personnelles (KYC)', documents: "Nouvelle CNI, nouveau justificatif de domicile" },
      { id: 'litige-virement', name: 'Suivi ou recherche de virement émis/reçu', documents: "Avis d'opéré, RIB émetteur/bénéficiaire" },
    ],
  },
];

// Gestionnaires par agence
/** @type {Record<number, Array<{ id: string, name: string, role: string, waitTime: string }>>} */
export const GESTIONNAIRES_BY_AGENCY = {
  1: [
    { id: 'g-101', name: 'Awa Coulibaly', role: 'Conseillère Particuliers', waitTime: 'Rapide' },
    { id: 'g-102', name: 'Jean-Marc Koffi', role: 'Chargé d’Affaires PME & Pros', waitTime: 'Modéré' },
    { id: 'g-103', name: 'Kouamé Béranger', role: 'Gestionnaire de Patrimoine', waitTime: 'Disponible' },
  ],
  2: [
    { id: 'g-201', name: 'Sandrine Touré', role: 'Conseillère Particuliers', waitTime: 'Rapide' },
    { id: 'g-202', name: 'Yves-Alain Konan', role: 'Chargé d’Affaires Entreprises', waitTime: 'Disponible' },
  ],
  3: [
    { id: 'g-301', name: 'Marcelle N’Guessan', role: 'Conseillère Clientèle Premium', waitTime: 'Disponible' },
    { id: 'g-302', name: 'David Bakayoko', role: 'Conseiller Professionnels', waitTime: 'Modéré' },
  ],
  4: [
    { id: 'g-401', name: 'Estelle Dago', role: 'Conseillère Particuliers', waitTime: 'Disponible' },
    { id: 'g-402', name: 'Stéphane Bamba', role: 'Conseiller Clientèle', waitTime: 'Rapide' },
  ],
  5: [
    { id: 'g-501', name: 'Fatou Diomandé', role: 'Conseillère Particuliers & TPE', waitTime: 'Disponible' },
    { id: 'g-502', name: 'Moussa Fofana', role: 'Conseiller Commercial', waitTime: 'Rapide' },
  ],
};

/**
 * Récupère les gestionnaires disponibles pour une agence avec l'option aléatoire / auto
 * @param {number|string} agencyId 
 * @returns {Array<{ id: string, name: string, role: string, isAuto?: boolean }>}
 */
export function getGestionnairesForAgency(agencyId) {
  const numericId = Number(agencyId) || 1;
  const list = GESTIONNAIRES_BY_AGENCY[numericId] || GESTIONNAIRES_BY_AGENCY[1];
  
  return [
    {
      id: 'auto',
      name: 'Sans préférence (Premier gestionnaire disponible)',
      role: 'Attribution automatique pour un passage plus rapide',
      isAuto: true,
    },
    ...list,
  ];
}
