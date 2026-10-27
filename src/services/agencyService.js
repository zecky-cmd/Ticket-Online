import { AGENCIES_MOCK } from '../mocks/agenciesMock';

/**
 * Service Mock pour la gestion des Agences
 */
export const agencyService = {
  /**
   * Récupère la liste de toutes les agences
   * @returns {Promise<Array>}
   */
  async getAgencies() {
    // Simule une latence réseau réaliste
    await new Promise((resolve) => setTimeout(resolve, 200));
    return AGENCIES_MOCK;
  },

  /**
   * Recherche des agences selon une chaîne de caractères
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async searchAgencies(query = '') {
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
   * Récupère une agence par son identifiant
   * @param {number|string} id 
   * @returns {Promise<Object|null>}
   */
  async getAgencyById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return AGENCIES_MOCK.find((a) => a.id === Number(id)) || null;
  }
};
