// ============================================================================
// MOCK — CATALOGUE SERVICES / PRESTATIONS (forme brute de l'API agenceprestations)
//
// ⚠️ Données de démonstration : utilisées uniquement quand USE_MOCK = true.
//    str_prestype : '1' = caisse (guichet), autre = gestionnaire (conseiller).
// ============================================================================

export const MOCK_AGENCY_PRESTATIONS = [
  {
    service: {
      lg_serid: 'ser-caisse',
      str_sername: 'Opérations de caisse',
      str_serdescription: 'Dépôts, retraits et opérations courantes au guichet.',
      str_prestype: '1',
      urlImage: null,
    },
    prestations: [
      {
        lg_presid: 'pres-retrait',
        str_presname: 'Retrait d’espèces',
        str_presdescription: 'Retrait au guichet avec votre pièce d’identité.',
        str_prestype: '1',
      },
      {
        lg_presid: 'pres-depot-especes',
        str_presname: 'Dépôt d’espèces',
        str_presdescription: 'Dépôt en espèces sur votre compte.',
        str_prestype: '1',
      },
      {
        lg_presid: 'pres-depot-cheques',
        str_presname: 'Dépôt de chèques',
        str_presdescription: 'Remise de chèques à l’encaissement.',
        str_prestype: '1',
      },
      {
        lg_presid: 'pres-change',
        str_presname: 'Change de devises',
        str_presdescription: 'Achat et vente de devises au taux du jour.',
        str_prestype: '1',
      },
    ],
  },
  {
    service: {
      lg_serid: 'ser-comptes',
      str_sername: 'Ouverture de compte',
      str_serdescription: 'Ouvrez votre compte avec l’accompagnement d’un conseiller.',
      str_prestype: '0',
      urlImage: null,
    },
    prestations: [
      {
        lg_presid: 'pres-cc',
        str_presname: 'Compte courant',
        str_presdescription: 'Compte de dépôt pour vos opérations quotidiennes.',
        str_prestype: '0',
      },
      {
        lg_presid: 'pres-cep',
        str_presname: 'Compte épargne',
        str_presdescription: 'Constitution d’une épargne rémunérée.',
        str_prestype: '0',
      },
      {
        lg_presid: 'pres-cent',
        str_presname: 'Compte entreprise',
        str_presdescription: 'Compte dédié aux professionnels et PME.',
        str_prestype: '0',
      },
    ],
  },
  {
    service: {
      lg_serid: 'ser-credits',
      str_sername: 'Crédits & Financements',
      str_serdescription: 'Étudiez vos projets de financement avec un conseiller.',
      str_prestype: '0',
      urlImage: null,
    },
    prestations: [
      {
        lg_presid: 'pres-immobilier',
        str_presname: 'Crédit immobilier',
        str_presdescription: 'Financement de l’achat ou de la construction de votre logement.',
        str_prestype: '0',
      },
      {
        lg_presid: 'pres-conso',
        str_presname: 'Crédit consommation',
        str_presdescription: 'Financement de vos projets personnels.',
        str_prestype: '0',
      },
      {
        lg_presid: 'pres-pme',
        str_presname: 'Financement PME',
        str_presdescription: 'Solutions de financement pour les entreprises.',
        str_prestype: '0',
      },
    ],
  },
  {
    service: {
      lg_serid: 'ser-cartes',
      str_sername: 'Cartes bancaires',
      str_serdescription: 'Demande, activation et gestion de vos cartes.',
      str_prestype: '0',
      urlImage: null,
    },
    prestations: [
      {
        lg_presid: 'pres-carte-demande',
        str_presname: 'Demande de carte',
        str_presdescription: 'Souscription d’une nouvelle carte bancaire.',
        str_prestype: '0',
      },
      {
        lg_presid: 'pres-carte-activation',
        str_presname: 'Activation de carte',
        str_presdescription: 'Activation de votre carte en agence.',
        str_prestype: '0',
      },
      {
        lg_presid: 'pres-carte-opposition',
        str_presname: 'Opposition carte',
        str_presdescription: 'Blocage immédiat d’une carte perdue ou volée.',
        str_prestype: '1',
      },
    ],
  },
];
