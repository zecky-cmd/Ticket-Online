import { s2qApiClient } from './api';
import { S2Q_SERVICES } from './serveur';
import { SERVICES_LIST } from '../mocks/ticketFlowMock';

// Basculer sur true pour utiliser le catalogue local (démo / hors-ligne)
const USE_MOCK = false;

/**
 * Résout le type de service/prestation : "1" = caisse, sinon gestionnaire.
 * @param {string|number} [strPrestype]
 */
function resolveType(strPrestype) {
  return String(strPrestype) === '1' ? 'caisse' : 'gestionnaire';
}

function normalizePrestation(p) {
  return {
    id: String(p.lg_presid ?? p.id ?? ''),
    name: p.str_presname || p.name || '',
    description: p.str_presdescription || p.description || p.documents || '',
    image: p.urlImage || null,
    serviceType: resolveType(p.str_prestype ?? p.serviceType),
  };
}

function normalizeService(s) {
  return {
    id: String(s.lg_serid ?? s.id ?? ''),
    name: s.str_sername || s.name || '',
    description: s.str_serdescription || s.description || '',
    image: s.urlImage || null,
    serviceType: resolveType(s.str_prestype ?? s.serviceType),
    prestations: (s.prestations || []).map(normalizePrestation),
  };
}

export const catalogService = {
  /**
   * Récupère le catalogue (services + prestations) d'une agence.
   * Route réelle : GET parametre-service/public/agenceprestations
   *
   * @param {number|string} lgAgeid
   * @returns {Promise<Array>}
   */
  async getAgencyPrestations(lgAgeid) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/${S2Q_SERVICES.parametre}/public/agenceprestations`, {
        params: { lg_ageid: String(lgAgeid), lang: 'fr' },
      });
      const list = response.data?.data || response.data || [];
      return (Array.isArray(list) ? list : []).map((group) => ({
        ...normalizeService(group.service || {}),
        prestations: (group.prestations || []).map(normalizePrestation),
      }));
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    return SERVICES_LIST.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description || '',
      image: null,
      serviceType: s.serviceType,
      prestations: (s.prestations || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.documents || '',
        image: null,
        serviceType: s.serviceType,
      })),
    }));
  },
};
