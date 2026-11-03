import { s2qApiClient } from './api';
import { S2Q_SERVICES } from './serveur';
import { getGestionnairesForAgency } from '../mocks/ticketFlowMock';

// Basculer sur true pour utiliser les gestionnaires locaux (démo / hors-ligne)
const USE_MOCK = false;

function normalizeGestionnaire(g) {
  return {
    id: String(g.lg_utiid ?? g.id ?? ''),
    usrid: String(g.lg_usrid ?? ''),
    name: g.str_utifirstlastname || g.name || '',
    role: g.str_rollibelle || g.role || '',
    typeRole: g.type_role_libelle || '',
    pic: g.str_utipic || null,
  };
}

export const gestionnaireService = {
  /**
   * Récupère la liste des gestionnaires disponibles pour une prestation d'une agence.
   * Route réelle : GET admin-service/public/gestionnaires
   *
   * @param {number|string} lgAgeid
   * @param {number|string} lgPresid
   * @returns {Promise<Array>}
   */
  async getGestionnaires(lgAgeid, lgPresid) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/${S2Q_SERVICES.admin}/public/gestionnaires`, {
        params: { lg_ageid: String(lgAgeid), lg_presid: String(lgPresid) },
      });
      const list = response.data?.data || response.data || [];
      return (Array.isArray(list) ? list : []).map(normalizeGestionnaire);
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    return getGestionnairesForAgency(lgAgeid)
      .filter((g) => !g.isAuto)
      .map((g) => ({
        id: String(g.id),
        usrid: `mock-${g.id}`,
        name: g.name,
        role: g.role,
        typeRole: '',
        pic: null,
      }));
  },

  /**
   * Liste des gestionnaires avec l'option "Sans préférence" (attribution automatique).
   *
   * @param {number|string} lgAgeid
   * @param {number|string} lgPresid
   * @returns {Promise<Array>}
   */
  async getGestionnairesWithAuto(lgAgeid, lgPresid) {
    const list = await this.getGestionnaires(lgAgeid, lgPresid);
    return [
      {
        id: 'auto',
        usrid: '',
        name: 'Sans préférence (Premier gestionnaire disponible)',
        role: 'Attribution automatique',
        typeRole: '',
        pic: null,
        isAuto: true,
      },
      ...list,
    ];
  },
};
