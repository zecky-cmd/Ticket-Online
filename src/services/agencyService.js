import { apiClient } from './api';
import { SOC_ID, API_SERVICES, USE_MOCK, MOCK_DELAY } from './serveur';
import { MOCK_AGENCIES } from '../mocks/agenciesMock';

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
 * Détermine l'état d'affluence selon la spécification S2Q (str_ageaffluence / int_agewaitminutes) :
 * - fluide  : attente estimée ≤ 10 min
 * - moyenne : attente 11 à 25 min
 * - forte   : attente > 25 min
 */
function computeAffluence(strAffluence, waitMinutes) {
  const raw = String(strAffluence || '').trim().toLowerCase();
  if (raw === 'fluide' || raw === 'moyenne' || raw === 'forte') {
    return raw;
  }
  if (raw === 'moderee' || raw === 'moyen') return 'moyenne';
  if (raw === 'saturee' || raw === 'elevee' || raw === 'fort') return 'forte';

  // Si str_ageaffluence n'est pas explicite, calcul selon le temps estimé S2Q
  if (waitMinutes != null && Number.isFinite(Number(waitMinutes))) {
    const min = Number(waitMinutes);
    if (min <= 10) return 'fluide';
    if (min <= 25) return 'moyenne';
    return 'forte';
  }

  return raw || 'fluide';
}

/**
 * Normalise une agence brute de l'API S2Q (agencesLive) vers le modèle du frontend.
 * @param {any} a
 */
function normalizeAgency(a) {
  const waitMin = a.int_agewaitminutes != null && a.int_agewaitminutes !== '' ? Number(a.int_agewaitminutes) : null;
  const affluence = computeAffluence(a.str_ageaffluence, waitMin);

  return {
    id: String(a.lg_ageid ?? ''),
    name: a.str_agedescription || '',
    district: a.str_agedistrict || '',
    commune: a.str_agecommune || '',
    address: a.str_agelocalisation || null,
    hours: a.str_agehours || '',
    openUntil: a.str_ageopenuntil || null,
    phone: a.str_agephone || '',
    status: a.str_agestatus || 'Ouvert',
    // Données temps réel : personnes en attente et durée estimée (source : agencesLive)
    waitingClients: a.int_agetotalwaiting ?? 0,       // int_agetotalwaiting — nombre de personnes en attente
    waitMinutes:    waitMin,                          // int_agewaitminutes   — temps estimé en minutes
    currentWaitTime: a.str_agecurrentwaittime || (waitMin != null ? `${waitMin} min` : '0 min'),
    countersActive: a.int_agecountersactive ?? 0,
    affluence,
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
    // ── MODE DÉMONSTRATION : backend indisponible → données locales ──
    if (USE_MOCK) {
      await MOCK_DELAY(450);
      const normalized = MOCK_AGENCIES.map(normalizeAgency);
      const term = String(searchValue || '').trim().toLowerCase();
      const filtered = term
        ? normalized.filter((a) =>
            [a.name, a.commune, a.district, a.address].some(
              (v) => v && String(v).toLowerCase().includes(term)
            )
          )
        : normalized;
      return filtered.slice(start, start + length);
    }

    const response = await apiClient.get(`/${API_SERVICES.admin}/public/agencesLive`, {
      params: {
        lg_socid: SOC_ID,
        search_value: searchValue || undefined,
        start,
        length,
      },
    });
    const list = response.data?.data || response.data || [];
    return (Array.isArray(list) ? list : [list]).map(normalizeAgency);
  },
};
