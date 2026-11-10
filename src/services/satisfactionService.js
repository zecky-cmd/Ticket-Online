import { apiClient } from './api';
import { API_BASE_URL, SOC_ID, API_SERVICES } from './serveur';

// Les endpoints satisfaction sont désormais publics → appels réels
const USE_MOCK = false;

/**
 * Émoticônes de repli (identiques au fallback de la borne) si l'API
 * ne retourne aucune émoticône configurée.
 */
export const FALLBACK_SATISFACTIONS = [
  { id: 'f1', label: 'Très insatisfait', image: '', color: '#c0392b', colorSec: '#fdecea', order: 1, note: 1 },
  { id: 'f2', label: 'Insatisfait', image: '', color: '#e67e22', colorSec: '#fef5e7', order: 2, note: 2 },
  { id: 'f3', label: 'Neutre', image: '', color: '#95a5a6', colorSec: '#f8fafc', order: 3, note: 3 },
  { id: 'f4', label: 'Satisfait', image: '', color: '#2980b9', colorSec: '#eaf2f8', order: 4, note: 4 },
  { id: 'f5', label: 'Très satisfait', image: '', color: '#27ae60', colorSec: '#eafaf1', order: 5, note: 5 },
];

/** Justificatifs de repli contextuels (dictionnaire de la borne), index 1..5 = ordre de l'émoticône. */
export const FALLBACK_JUSTIFICATIFS_MAP = {
  1: ['Temps d\'attente trop long', 'Problème non résolu', 'Manque de courtoisie', 'Information erronée', 'Guichet fermé sans explications', 'Autre'],
  2: ['Temps de traitement long', 'Explications peu claires', 'Personnel peu disponible', 'Système informatique ralenti', 'Autre'],
  3: ['Attente moyenne', 'Service correct sans plus', 'Rien à signaler (RAS)', 'Prestation standard', 'Autre'],
  4: ['Bon accueil', 'Personnel souriant', 'Explications claires', 'Service efficace', 'Prise en charge rapide', 'Autre'],
  5: ['Accueil chaleureux', 'Service ultra rapide', 'Conseiller à l\'écoute', 'Prise en charge claire', 'Professionnalisme exemplaire', 'Autre'],
};

/**
 * Construit l'URL d'image d'une émoticône :
 * 1. `str_satisimg_url` si l'API la fournit ;
 * 2. sinon reconstruction depuis le nom de fichier `str_satisimg` via medias/getFile (comme la borne).
 */
function buildEmoticonImageUrl(item) {
  if (item.str_satisimg_url) return item.str_satisimg_url;
  if (item.str_satisimg) {
    return `/parametre-service/medias/getFile?filename=${encodeURIComponent(item.str_satisimg)}`;
  }
  return '';
}

function normalizeSatisfaction(item) {
  return {
    id: String(item.lg_satisid ?? item.id ?? ''),
    label: item.str_satislib || item.label || '',
    image: buildEmoticonImageUrl(item),
    color: item.str_satiscolor || '#64748b',
    colorSec: item.str_satiscolorsec || '#f8fafc',
    order: Number(item.int_satisordre ?? item.order) || 0,
    note: Number(item.int_satisnote ?? item.note) || 0,
  };
}

function normalizeJustificatif(j) {
  const label = j.str_jusdescription || j.label || '';
  return {
    id: String(j.lg_jusid ?? j.id ?? ''),
    label,
    isAutre: j.str_jusestautre === 'enable' || label.toLowerCase().trim() === 'autre',
    order: Number(j.int_jusordre ?? j.order) || 0,
  };
}

/** Construit les justificatifs de repli pour un ordre d'émoticône (1..5) */
export function buildFallbackJustificatifs(order = 5) {
  const list = FALLBACK_JUSTIFICATIFS_MAP[Number(order)] || FALLBACK_JUSTIFICATIFS_MAP[5];
  return list.map((text, idx) => ({
    id: `fallback-${order}-${idx + 1}`,
    label: text,
    isAutre: text.toLowerCase().trim() === 'autre',
    order: idx + 1,
  }));
}

/** Résout l'URL complète d'une image d'émoticône retournée par l'API */
export function resolveSatisfactionImageUrl(rawUrl) {
  if (!rawUrl) return '';
  if (/^(https?:|\/\/|data:|blob:)/i.test(rawUrl)) return rawUrl;
  const base = (API_BASE_URL || '').replace(/\/+$/, '');
  const cleanPath = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl;
  return `${base}/${cleanPath}`;
}

export const satisfactionService = {
  /**
   * Liste des émoticônes de satisfaction du groupe actif.
   * Route réelle : GET parametre-service/satisfaction/listSatisfaction
   */
  async getSatisfactions() {
    if (!USE_MOCK) {
      const response = await apiClient.get(`/${API_SERVICES.parametre}/satisfaction/listSatisfaction`, {
        params: { lg_socid: SOC_ID, search_value: '', start: 0, length: 100, active_group: true },
      });
      const list = response.data?.data || response.data || [];
      const normalized = (Array.isArray(list) ? list : []).map(normalizeSatisfaction).sort((a, b) => a.order - b.order);
      if (normalized.length > 0) return normalized;
    }
    return FALLBACK_SATISFACTIONS;
  },

  /**
   * Liste des justificatifs d'une émoticône.
   * Route réelle : GET parametre-service/justificatif/listJustificatif
   */
  async getJustificatifs(lgSatisid, satisOrder = 5) {
    if (!USE_MOCK) {
      const response = await apiClient.get(`/${API_SERVICES.parametre}/justificatif/listJustificatif`, {
        params: { lg_socid: SOC_ID, lg_satisid: String(lgSatisid), length: 10000 },
      });
      const list = response.data?.data || response.data || [];
      const normalized = (Array.isArray(list) ? list : []).map(normalizeJustificatif);
      if (normalized.length > 0) return normalized.sort((a, b) => a.order - b.order);
    }
    return buildFallbackJustificatifs(satisOrder);
  },

  /**
   * Enregistre (ou met à jour via lg_satvid) le vote de satisfaction.
   * Route réelle : POST parametre-service/satisfaction/saveVote
   *
   * @param {Object} payload
   * @param {string} payload.lg_ageid - Agence choisie (obligatoire pour SERVICE_PRESTATION)
   * @param {string} payload.lg_serid
   * @param {string} payload.lg_presid
   * @param {string} payload.lg_satisid
   * @param {number} payload.int_satisnote - note 1-5 cachée derrière l'émoticône
   * @param {number} [payload.int_npsnote] - note de recommandation 0-10
   * @param {string} [payload.lg_jusid] - justificatif unique
   * @param {string} [payload.str_satvautre] - commentaire libre
   * @param {string} [payload.lg_satvid] - ID du vote à mettre à jour
   * @param {Object} [payload.clientInfo] - { nom, prenoms, tel, email }
   */
  async saveVote(payload = {}) {
    const body = {
      str_satvsource: 'SERVICE_PRESTATION',
      lg_socid: SOC_ID,
      lg_ageid: payload.lg_ageid || undefined,
      lg_serid: payload.lg_serid || undefined,
      lg_presid: payload.lg_presid || undefined,
      lg_satisid: payload.lg_satisid || undefined,
      int_satisnote: payload.int_satisnote,
    };

    if (payload.int_npsnote !== null && payload.int_npsnote !== undefined) {
      body.int_npsnote = Number(payload.int_npsnote);
    }
    if (payload.lg_jusid) body.lg_jusid = payload.lg_jusid;
    if (payload.str_satvautre && payload.str_satvautre.trim()) body.str_satvautre = payload.str_satvautre.trim();
    if (payload.lg_satvid) body.lg_satvid = payload.lg_satvid;

    const ci = payload.clientInfo || {};
    if (ci.nom) body.str_nomcli = ci.nom;
    if (ci.prenoms) body.str_prenomcli = ci.prenoms;
    if (ci.tel) body.str_telcli = ci.tel;
    if (ci.email) body.str_emailcli = ci.email;

    if (!USE_MOCK) {
      const response = await apiClient.post(`/${API_SERVICES.parametre}/satisfaction/saveVote`, body);
      const data = response.data?.data || response.data;
      return {
        success: true,
        voteId: data?.lg_satvid || payload.lg_satvid || null,
        data,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      success: true,
      voteId: payload.lg_satvid || `VOTE-${Date.now()}`,
      data: body,
    };
  },
};
