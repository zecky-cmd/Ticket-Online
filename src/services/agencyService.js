import { s2qApiClient } from './api';
import { S2Q_SOCID, S2Q_SERVICES } from './serveur';

/**
 * Parse une coordonnée : null si absente, non numérique ou hors plage
 * (filtre les données de test absurdes du type lat=80000, lng=-2404).
 * @param {any} v - Valeur brute
 * @param {boolean} isLat - true = latitude (|v| <= 90), false = longitude (|v| <= 180)
 */
function parseCoord(v, isLat) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const max = isLat ? 90 : 180;
  return Math.abs(n) <= max ? n : null;
}

/**
 * Normalise une agence brute de l'API S2Q (agencesLive) vers le modèle du frontend.
 * @param {any} a
 */
function normalizeAgency(a) {
  return {
    id: String(a.lg_ageid ?? ''),
    name: a.str_agedescription || '',
    district: a.str_agedistrict || '',
    commune: a.str_agecommune || '',
    address: a.str_agelocalisation || null,
    hours: a.str_agehours || '',
    openUntil: a.str_ageopenuntil || null,
    phone: a.str_agephone || '',
    status: a.str_agestatus || '',
    waitMinutes: a.int_agewaitminutes ?? null,
    currentWaitTime: a.str_agecurrentwaittime || '',
    countersActive: a.int_agecountersactive ?? 0,
    affluence: a.str_ageaffluence || 'indisponible',
    lat: parseCoord(a.str_agelatitude, true),
    lng: parseCoord(a.str_agelongitude, false),
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
  },
};
