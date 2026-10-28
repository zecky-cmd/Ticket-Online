import { s2qApiClient } from './api';
import { AGENCIES_MOCK } from '../mocks/agenciesMock';

const USE_MOCK = true; // Basculer sur false pour appeler l'API S2Q réelle

/**
 * Service Métier : Agences et Affluence en direct
 * 
 * Contrat de données Agence :
 * {
 *   id: number,
 *   name: string,
 *   commune: string,
 *   address: string,
 *   hours: string,
 *   phone: string,
 *   status: string,
 *   currentWaitTime: string,
 *   countersActive: number,
 *   lat: string,
 *   lng: string
 * }
 */
export const agencyService = {
  /**
   * Récupère la liste de toutes les agences et leur affluence.
   * Route réelle attendue : GET /agencies
   * 
   * @returns {Promise<Array>}
   */
  async getAgencies() {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get('/agencies');
      return response.data?.data || response.data;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    return AGENCIES_MOCK;
  },

  /**
   * Recherche des agences par mot-clé (nom, commune, adresse).
   * Route réelle attendue : GET /agencies/search?q=...
   * 
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async searchAgencies(query = '') {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get('/agencies/search', {
        params: { q: query },
      });
      return response.data?.data || response.data;
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    const term = query.toLowerCase().trim();
    if (!term) return AGENCIES_MOCK;
    
    return AGENCIES_MOCK.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        a.address.toLowerCase().includes(term) ||
        a.commune.toLowerCase().includes(term)
    );
  },

  /**
   * Récupère le détail d'une agence par son identifiant.
   * Route réelle attendue : GET /agencies/:id
   * 
   * @param {number|string} id 
   * @returns {Promise<Object|null>}
   */
  async getAgencyById(id) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/agencies/${id}`);
      return response.data?.data || response.data;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    return AGENCIES_MOCK.find((a) => a.id === Number(id)) || null;
  }
};
