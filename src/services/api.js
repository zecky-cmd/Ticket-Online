import axios from 'axios';
import { API_BASE_URL } from './serveur';

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
