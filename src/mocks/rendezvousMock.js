// ============================================================================
// MOCK — RÉPONSE DE CRÉATION DE TICKET (POST admin-service/public/rendezvous)
//
// ⚠️ Données de démonstration : utilisées uniquement quand USE_MOCK = true.
//    Génère une réponse identique au contrat backend (lg_ticid, str_ticnumero…)
//    afin que le reçu (TicketReceipt) soit testé tel qu'il le sera en réel.
// ============================================================================

import { MOCK_DELAY } from '../services/serveur';

/**
 * Simule la réponse du backend à la création d'un rendez-vous.
 * @param {Object} payload - Payload du parcours (agency, prestation, timeslot…)
 * @returns {Promise<Object>} Fiche ticket brute (forme backend)
 */
export async function buildMockTicketResponse(payload = {}) {
  await MOCK_DELAY(700);

  const now = new Date();
  const code = `T-${String(Math.floor(1000 + Math.random() * 9000))}`;

  return {
    lg_ticid: `tic-${Date.now()}`,
    lg_rdvid: `rdv-${Date.now()}`,
    str_ticnumero: code,
    str_agedescription: payload.agency?.name || '',
    str_sername: payload.service?.name || '',
    str_presname: payload.prestation?.name || '',
    str_rdvstatut: 'pending',
    dt_created: now.toISOString(),
  };
}
