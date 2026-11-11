import axios from 'axios';
import { API_BASE_URL, USE_MOCK } from './serveur';

/**
 * Instance Axios configurée pour communiquer avec le backend.
 * Le développeur n'a qu'à ajuster les interceptors ou les headers si besoin.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Garde-fou : en mode démonstration, aucun appel réseau ne doit partir.
// Si un service oublie de vérifier USE_MOCK, sa requête est bloquée ici
// avec un message explicite au lieu d'attendre un timeout.
if (USE_MOCK) {
  apiClient.interceptors.request.use((config) => {
    console.warn(
      '[MOCK] Requête API bloquée (backend indisponible) :',
      (config.method || 'GET').toUpperCase(),
      config.url
    );
    return Promise.reject(new Error('Mode démonstration : le backend n’est pas disponible.'));
  });
}

// Intercepteur pour attacher des tokens de session ou headers spécifiques
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Instance configurée exportée
export default apiClient;
