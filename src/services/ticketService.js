import { s2qApiClient } from './api';

// Basculer sur false pour appeler l'API S2Q réelle
let USE_MOCK = true;

/**
 * Service Métier : Gestion des Tickets Digitaux en ligne S2Q
 */
export const ticketService = {
  /**
   * Crée un ticket en ligne.
   * Route réelle attendue : POST /ticket/create
   * 
   * @param {Object} [payload] 
   * @param {any} [payload.agency] - Nom ou objet Agence
   * @param {any} [payload.service] - ID ou objet Service
   * @param {string} [payload.serviceCategory] - 'reclamation' | 'commercial' | 'caisse' | 'conseil' | 'entreprises'
   * @param {any} [payload.prestation] - ID ou objet Prestation
   * @param {any} [payload.timeslot] - { type: 'immediate' | 'scheduled', day, time, dayFormatted }
   * @param {string} [payload.fullName] - Nom complet du client
   * @param {string} [payload.phoneNumber] - Téléphone du client
   * @param {string} [payload.email] - Email du client
   * @returns {Promise<any>} Fiche ticket créée
   */
  async createTicket(payload = {}) {
    const {
      agency,
      service,
      serviceCategory,
      prestation,
      timeslot,
      fullName,
      phoneNumber,
      email,
    } = payload;

    if (!USE_MOCK) {
      // Appel API réel vers le backend S2Q
      const response = await s2qApiClient.post('/ticket/create', {
        agency,
        service: service || serviceCategory,
        prestation,
        timeslot,
        fullName,
        phoneNumber,
        email,
      });
      return response.data?.data || response.data;
    }

    // --- LOGIQUE MOCK RÉALISTE ---
    await new Promise((resolve) => setTimeout(resolve, 350));

    const agencyObj = typeof agency === 'object' && agency !== null ? agency : null;
    const agencyName = agencyObj?.name || (typeof agency === 'string' ? agency : 'Agence Centrale - Plateau');

    const serviceObj = typeof service === 'object' && service !== null ? service : null;
    const serviceCat = serviceObj?.id || serviceCategory || 'caisse';

    /** @type {Record<string, string>} */
    const prefixes = {
      caisse: 'CAI',
      conseil: 'CPT',
      commercial: 'CPT',
      entreprises: 'PRO',
      reclamation: 'REC',
    };
    const prefix = serviceObj?.codePrefix || (serviceCat ? prefixes[serviceCat] : '') || 'TKT';
    const randNum = Math.floor(100 + Math.random() * 900);
    const waitMinutes = agencyObj?.waitMinutes ?? Math.floor(5 + Math.random() * 15);
    const dateNow = new Date();

    /** @type {Record<string, string>} */
    const serviceLabels = {
      caisse: 'Opérations de Caisse & Règlements',
      conseil: 'Conseil Particuliers & Comptes',
      commercial: 'Conseil Client & Nouveaux Contrats',
      entreprises: 'Espace Professionnels & Entreprises',
      reclamation: 'Réclamations & Cartes Bancaires',
    };

    const sName = serviceObj?.name || (serviceCat ? serviceLabels[serviceCat] : '') || 'Accueil Général';
    const prestationObj = typeof prestation === 'object' && prestation !== null ? prestation : null;
    const pName = prestationObj?.name || (typeof prestation === 'string' ? prestation : 'Accueil Général');

    const appointmentTime = timeslot?.type === 'scheduled' 
      ? `${timeslot.dayFormatted || 'Aujourd’hui'} à ${timeslot.time}`
      : 'Passage immédiat';

    return {
      id: `TKT-${Date.now()}`,
      code: `${prefix}-${randNum}`,
      agency: agencyName,
      serviceCategory: serviceCat,
      serviceName: sName,
      prestationName: pName,
      timeslot: timeslot || { type: 'immediate', label: 'Immédiat' },
      appointmentTime,
      fullName: fullName || '',
      phoneNumber: phoneNumber || '',
      email: email || '',
      date: dateNow.toLocaleDateString('fr-FR'),
      time: dateNow.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      estimatedWait: timeslot?.type === 'scheduled' ? 'Sans attente (créneau réservé)' : `${waitMinutes} min`,
      queuePosition: timeslot?.type === 'scheduled' ? 1 : Math.max(1, Math.floor(waitMinutes / 3)),
      status: 'WAITING',
      createdAt: dateNow.toISOString(),
    };
  },

  /**
   * Vérifie le statut d'un ticket en cours.
   * Route réelle attendue : GET /ticket/:code/status
   * 
   * @param {string} ticketCode 
   * @returns {Promise<any>}
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
   * @returns {Promise<any>}
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
