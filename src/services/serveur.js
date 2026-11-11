/**
 * ⚠️ MODE DÉMONSTRATION — le backend n'est pas disponible.
 *
 * true  → tous les services retournent des données mock locales
 *         (aucun appel réseau ; sources dans src/mocks/).
 * false → appels réels vers l'API (backend requis).
 *
 * À repasser sur false dès que le backend est de nouveau joignable.
 */
export const USE_MOCK = true;

/** Simule la latence réseau des appels mock (ms). */
export const MOCK_DELAY = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Configuration des Endpoints Serveur / GFA
 * Adapté pour le développement Synapse et le déploiement client.
 */
const SERVEUR = {
  ORIGINE: typeof window !== 'undefined' ? window.location.origin : '',
  HOSTNAME: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  PROTOCOL: typeof window !== 'undefined' ? window.location.protocol + '//' : 'http://',
  SYNAPSE: 'SYNAPSEPCDEV07',
  REVERSE_PROXY: 'https://gfadiffuseur-backend.apps.bni',
  PORT_GFA: '9081',
  RACINE_API: 's2q',
  // Identifiants société (client) — à configurer dans le fichier .env
  socId: import.meta.env.SOC_ID || '',

};

const MODE_PROD = import.meta.env.MODE;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (MODE_PROD === 'development'
    ? `${SERVEUR.PROTOCOL}${SERVEUR.SYNAPSE}:${SERVEUR.PORT_GFA}/${SERVEUR.RACINE_API}/`
    : SERVEUR.ORIGINE.includes('apps.bni')
    ? `${SERVEUR.REVERSE_PROXY}/${SERVEUR.RACINE_API}/`
    : `${SERVEUR.PROTOCOL}${SERVEUR.HOSTNAME}:${SERVEUR.PORT_GFA}/${SERVEUR.RACINE_API}/`);

console.log('API BASE URL :', API_BASE_URL);

// Identifiants société exposés
export const SOC_ID = SERVEUR.socId;


// Préfixes des micro-services backend
export const API_SERVICES = {
  configuration: 'configuration-service',
  parametre: 'parametre-service',
  admin: 'admin-service',
};
