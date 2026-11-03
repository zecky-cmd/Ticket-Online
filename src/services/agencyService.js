import { s2qApiClient } from './api';
import { S2Q_SOCID, S2Q_SERVICES } from './serveur';
import { AGENCIES_MOCK } from '../mocks/agenciesMock';

// Basculer sur true pour utiliser les données locales (repli hors-ligne / démo)
const USE_MOCK = false;

/**
 * Normalise une agence brute de l'API S2Q vers le modèle du frontend.
 * @param {any} a
 */
function normalizeAgency(a) {
  return {
    id: String(a.lg_ageid ?? a.id ?? ''),
    name: a.str_agedescription || a.name || '',
    commune: a.str_ageville || a.commune || '',
    address: a.str_agelocalisation || a.address || null,
    phone: a.str_agephone || a.phone || '',
    lat: Number(a.str_agelatitude ?? a.lat) || 0,
    lng: Number(a.str_agelongitude ?? a.lng) || 0,
  };
}

export const agencyService = {
  /**
   * Récupère la liste des agences.
   * Route réelle : GET configuration-service/public/agences
   *
   * @param {{ searchValue?: string, start?: number, length?: number }} [options]
   * @returns {Promise<Array>}
   */
  async getAgencies({ searchValue = '', start = 0, length = 100 } = {}) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/${S2Q_SERVICES.configuration}/public/agences`, {
        params: {
          lg_socid: S2Q_SOCID,
          search_value: searchValue || undefined,
          start,
          length,
        },
      });
      const list = response.data?.data || response.data || [];
      return list.map(normalizeAgency);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    return AGENCIES_MOCK;
  },

  /**
   * Recherche des agences par mot-clé (nom, commune, adresse).
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchAgencies(query = '') {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/${S2Q_SERVICES.configuration}/public/agences`, {
        params: { lg_socid: S2Q_SOCID, search_value: query || undefined },
      });
      const list = response.data?.data || response.data || [];
      return list.map(normalizeAgency);
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    const term = query.toLowerCase().trim();
    if (!term) return AGENCIES_MOCK;
    return AGENCIES_MOCK.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        (a.address || '').toLowerCase().includes(term) ||
        a.commune.toLowerCase().includes(term)
    );
  },

  /**
   * Récupère une agence par son identifiant.
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async getAgencyById(id) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/${S2Q_SERVICES.configuration}/public/agences`, {
        params: { lg_socid: S2Q_SOCID, length: 100 },
      });
      const list = response.data?.data || response.data || [];
      return list.map(normalizeAgency).find((a) => a.id === String(id)) || null;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    return AGENCIES_MOCK.find((a) => a.id === String(id)) || null;
  },
};
