import { s2qApiClient } from './api';
import { S2Q_SERVICES } from './serveur';

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
    const response = await s2qApiClient.get(`/${S2Q_SERVICES.admin}/public/gestionnaires`, {
      params: { lg_ageid: String(lgAgeid), lg_presid: String(lgPresid) },
    });
    const list = response.data?.data || response.data || [];
    return (Array.isArray(list) ? list : []).map(normalizeGestionnaire);
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
