// ============================================================================
// DONNÉES DES AGENCES BANCAIRES & TEMPS D'ATTENTE (MOCK)
// ============================================================================
export const AGENCIES_MOCK = [
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

export const AGENCIES = AGENCIES_MOCK;
