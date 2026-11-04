/**
 * Configuration des Endpoints Serveur S2Q / GFA
 * Adapté pour l'environnement de développement Synapse et la production BNI.
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
  SOCID: import.meta.env.S2Q_SOCID || '',
  SOCCODE: import.meta.env.S2Q_SOCCODE || '',
};

const MODE_PROD = import.meta.env.MODE;

export const S2Q_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (MODE_PROD === 'development'
    ? `${SERVEUR.PROTOCOL}${SERVEUR.SYNAPSE}:${SERVEUR.PORT_GFA}/${SERVEUR.RACINE_API}/`
    : SERVEUR.ORIGINE.includes('apps.bni')
    ? `${SERVEUR.REVERSE_PROXY}/${SERVEUR.RACINE_API}/`
    : `${SERVEUR.PROTOCOL}${SERVEUR.HOSTNAME}:${SERVEUR.PORT_GFA}/${SERVEUR.RACINE_API}/`);

console.log('S2Q TICKET EN LIGNE - API BASE URL :', S2Q_BASE_URL);

// Identifiants société exposés
export const S2Q_SOCID = SERVEUR.SOCID;
export const S2Q_SOCCODE = SERVEUR.SOCCODE;

// Préfixes des micro-services backend S2Q
export const S2Q_SERVICES = {
  configuration: 'configuration-service',
  parametre: 'parametre-service',
  admin: 'admin-service',
};
