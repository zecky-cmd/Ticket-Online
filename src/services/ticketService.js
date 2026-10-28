import { s2qApiClient } from './api';

const USE_MOCK = true; // Basculer sur false pour appeler l'API S2Q réelle

/**
 * Service Métier : Gestion des Tickets Digitaux en ligne
 * 
 * Contrat de données Ticket :
 * {
 *   id: string,
 *   code: string (ex: 'REC-304'),
 *   agency: string,
 *   serviceCategory: 'reclamation' | 'commercial' | 'caisse',
 *   serviceName: string,
 *   fullName: string,
 *   phoneNumber: string,
 *   date: string,
 *   time: string,
 *   estimatedWait: string,
 *   queuePosition: number,
 *   status: 'WAITING' | 'CALLED' | 'PROCESSED' | 'CANCELLED'
 * }
 */
export const ticketService = {
  /**
   * Crée un ticket en ligne.
   * Route réelle attendue : POST /ticket/create
   * 
   * @param {Object} payload 
   * @param {string} payload.agency - Nom ou ID de l'agence
   * @param {string} payload.serviceCategory - 'reclamation' | 'commercial' | 'caisse'
   * @param {string} payload.fullName - Nom complet du client
   * @param {string} payload.phoneNumber - Téléphone du client
   * @returns {Promise<Object>} Fiche ticket créée
   */
  async createTicket({ agency, serviceCategory, fullName, phoneNumber }) {
    if (!USE_MOCK) {
      // Appel API réel vers le backend S2Q
      const response = await s2qApiClient.post('/ticket/create', {
        agency,
        serviceCategory,
        fullName,
        phoneNumber,
      });
      return response.data?.data || response.data;
    }

    // --- LOGIQUE MOCK RÉALISTE ---
    await new Promise((resolve) => setTimeout(resolve, 350));

    const prefixes = {
      reclamation: 'REC',
      commercial: 'COM',
      caisse: 'CAI',
    };
    const prefix = prefixes[serviceCategory] || 'TKT';
    const randNum = Math.floor(100 + Math.random() * 900);
    const waitMinutes = Math.floor(5 + Math.random() * 15);
    const dateNow = new Date();

    const serviceLabels = {
      reclamation: 'Service Réclamations & SAV',
      commercial: 'Conseil Client & Nouveaux Contrats',
      caisse: 'Opérations de Caisse & Règlements',
    };

    return {
      id: `TKT-${Date.now()}`,
      code: `${prefix}-${randNum}`,
      agency: agency || 'Agence Centrale - Plateau',
      serviceCategory,
      serviceName: serviceLabels[serviceCategory] || 'Accueil Général',
      fullName,
      phoneNumber,
      date: dateNow.toLocaleDateString('fr-FR'),
      time: dateNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWait: `${waitMinutes} min`,
      queuePosition: Math.max(1, Math.floor(waitMinutes / 3)),
      status: 'WAITING',
      createdAt: dateNow.toISOString(),
    };
  },

  /**
   * Vérifie le statut d'un ticket en cours.
   * Route réelle attendue : GET /ticket/:code/status
   * 
   * @param {string} ticketCode 
   * @returns {Promise<Object>}
   */
  async checkTicketStatus(ticketCode) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.get(`/ticket/${ticketCode}/status`);
      return response.data?.data || response.data;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      code: ticketCode,
      status: 'WAITING',
      message: 'Votre ticket est en attente dans la file prioritaire.'
    };
  },

  /**
   * Annule un ticket pris en ligne.
   * Route réelle attendue : POST /ticket/:code/cancel
   * 
   * @param {string} ticketCode 
   */
  async cancelTicket(ticketCode) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.post(`/ticket/${ticketCode}/cancel`);
      return response.data;
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    return { success: true, message: 'Ticket annulé avec succès' };
  }
};
