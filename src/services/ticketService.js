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
   * @param {any} [payload.gestionnaire] - Objet Gestionnaire sélectionné
   * @param {any} [payload.timeslot] - { day, date, time }
   * @param {boolean} [payload.isClient] - Client existant ou non
   * @param {string} [payload.accountNumber] - Numéro de compte client
   * @param {string} [payload.fullName] - Nom complet du client
   * @param {string} [payload.lastName] - Nom de famille
   * @param {string} [payload.firstName] - Prénoms
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
      gestionnaire,
      timeslot,
      isClient = false,
      accountNumber = '',
      fullName,
      lastName,
      firstName,
      phoneNumber,
      email,
    } = payload;

    const resolvedFullName = fullName || [lastName, firstName].filter(Boolean).join(' ') || 'Client';

    if (!USE_MOCK) {
      // Appel API réel vers le backend S2Q
      const response = await s2qApiClient.post('/ticket/create', {
        agency,
        service: service || serviceCategory,
        prestation,
        gestionnaire,
        timeslot,
        isClient,
        accountNumber,
        fullName: resolvedFullName,
        lastName,
        firstName,
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

    const appointmentTime = timeslot?.date && timeslot?.time
      ? `${timeslot.day || timeslot.date} à ${timeslot.time}`
      : 'Créneau à confirmer';

    const gestionnaireObj = typeof gestionnaire === 'object' && gestionnaire !== null ? gestionnaire : null;
    const gestionnaireName = gestionnaireObj?.isAuto
      ? 'Premier disponible (Attribution auto)'
      : gestionnaireObj?.name || 'Guichetier S2Q';

    return {
      id: `TKT-${Date.now()}`,
      code: `${prefix}-${randNum}`,
      agency: agencyName,
      serviceCategory: serviceCat,
      serviceName: sName,
      prestationName: pName,
      gestionnaire: gestionnaireName,
      isClient: Boolean(isClient),
      accountNumber: isClient ? accountNumber : '',
      timeslot: timeslot || { day: '', date: '', time: '' },
      appointmentTime,
      fullName: resolvedFullName,
      phoneNumber: phoneNumber || '',
      email: email || '',
      date: dateNow.toLocaleDateString('fr-FR'),
      time: dateNow.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      estimatedWait: 'Créneau réservé',
      queuePosition: 1,
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
