// ============================================================================
// DONNÉES DU FLUX DE PRISE DE TICKET S2Q (SERVICES, PRESTATIONS, CRÉNEAUX)
// ============================================================================

export const SERVICES_LIST = [
  {
    id: 'caisse',
    name: 'Opérations de Caisse & Règlements',
    shortName: 'Caisse',
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

// Créneaux horaires types par période
export const AVAILABLE_DAYS = [
  { id: 'today', label: "Aujourd'hui", dateFormatted: new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) },
  {
    id: 'tomorrow',
    label: 'Demain',
    dateFormatted: new Date(Date.now() + 86400000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
  },
  {
    id: 'after_tomorrow',
    label: 'Après-demain',
    dateFormatted: new Date(Date.now() + 172800000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
  },
];

export const TIME_SLOTS = [
  { time: '08:30', status: 'available' },
  { time: '09:00', status: 'available' },
  { time: '09:30', status: 'busy' }, // Complet
  { time: '10:00', status: 'available' },
  { time: '10:30', status: 'available' },
  { time: '11:00', status: 'available' },
  { time: '11:30', status: 'almost_full' }, // 1 place
  { time: '14:00', status: 'available' },
  { time: '14:30', status: 'available' },
  { time: '15:00', status: 'busy' },
  { time: '15:30', status: 'available' },
  { time: '16:00', status: 'available' },
];

