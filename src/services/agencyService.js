import { s2qApiClient } from './api';
import { S2Q_SOCID, S2Q_SERVICES } from './serveur';
import { AGENCIES_MOCK } from '../mocks/agenciesMock';

// Basculer sur true pour utiliser les données locales (repli hors-ligne / démo)
const USE_MOCK = false;

/**
 * Normalise une agence brute de l'API S2Q (agencesLive) vers le modèle du frontend.
 * @param {any} a
 */
function normalizeAgency(a) {
  return {
    id: String(a.lg_ageid ?? a.id ?? ''),
    name: a.str_agedescription || a.name || '',
    district: a.str_agedistrict || a.district || '',
    commune: a.str_agecommune || a.commune || '',
    address: a.str_agelocalisation || a.address || null,
    hours: a.str_agehours || a.hours || '',
    openUntil: a.str_ageopenuntil || a.openUntil || null,
    phone: a.str_agephone || a.phone || '',
    status: a.str_agestatus || a.status || '',
    waitMinutes: a.int_agewaitminutes ?? a.waitMinutes ?? null,
    currentWaitTime: a.str_agecurrentwaittime || a.currentWaitTime || '',
    countersActive: a.int_agecountersactive ?? a.countersActive ?? 0,
    affluence: a.str_ageaffluence || a.affluence || 'indisponible',
    lat: Number(a.str_agelatitude ?? a.lat) || 0,
    lng: Number(a.str_agelongitude ?? a.lng) || 0,
  };
}

export const agencyService = {
  /**
   * Récupère la liste des agences avec leurs informations temps réel.
   * Route réelle : GET admin-service/public/agencesLive
   *
   * @param {{ searchValue?: string, start?: number, length?: number }} [options]
   * @returns {Promise<Array>}
   */
  async getAgencies({ searchValue = '', start = 0, length = 100 } = {}) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/${S2Q_SERVICES.admin}/public/agencesLive`, {
        params: {
          lg_socid: S2Q_SOCID,
          search_value: searchValue || undefined,
          start,
          length,
        },
      });
      const list = response.data?.data || response.data || [];
      return (Array.isArray(list) ? list : [list]).map(normalizeAgency);
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
      const response = await s2qApiClient.get(`/${S2Q_SERVICES.admin}/public/agencesLive`, {
        params: { lg_socid: S2Q_SOCID, search_value: query || undefined },
      });
      const list = response.data?.data || response.data || [];
      return (Array.isArray(list) ? list : [list]).map(normalizeAgency);
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
   * Récupère les informations temps réel d'une agence par son identifiant.
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async getAgencyById(id) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/${S2Q_SERVICES.admin}/public/agencesLive`, {
        params: { lg_socid: S2Q_SOCID, lg_ageid: String(id) },
      });
      const list = response.data?.data || response.data || [];
      const arr = Array.isArray(list) ? list : [list];
      return arr.map(normalizeAgency).find((a) => a.id === String(id)) || null;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    return AGENCIES_MOCK.find((a) => a.id === String(id)) || null;
  },
};
