import axios from 'axios';
import { S2Q_BASE_URL } from './serveur';

/**
 * Instance Axios configurée pour communiquer avec le backend S2Q.
 * Le développeur n'a qu'à ajuster les interceptors ou les headers si besoin.
 */
export const s2qApiClient = axios.create({
  baseURL: S2Q_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Intercepteur pour attacher des tokens de session ou headers spécifiques
s2qApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('s2q_session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Instance configurée exportée
export default s2qApiClient;
