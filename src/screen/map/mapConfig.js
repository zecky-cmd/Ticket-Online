import L from 'leaflet';

// Bornes nationales de la Côte d'Ivoire — vue initiale & réinitialisation de la carte
export const CI_BOUNDS = L.latLngBounds([4.3, -8.6], [10.7, -2.5]);

// Seuil au-delà duquel un cluster devient un "macro-cluster" régional (rouge) — Phase 3
export const MACRO_CLUSTER_THRESHOLD = 8;
