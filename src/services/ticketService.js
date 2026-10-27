/**
 * Service Mock pour la génération et la gestion des Tickets en ligne (S2Q)
 */
export const ticketService = {
  /**
   * Génère un nouveau ticket digital
   * @param {Object} payload { agency, serviceCategory, fullName, phoneNumber }
   * @returns {Promise<Object>}
   */
  async createTicket({ agency, serviceCategory, fullName, phoneNumber }) {
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

    const newTicket = {
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
      status: 'WAITING', // WAITING | CALLED | PROCESSED | CANCELLED
      createdAt: dateNow.toISOString(),
    };

    return newTicket;
  },

  /**
   * Vérifie le statut d'un ticket en cours
   * @param {string} ticketCode 
   * @returns {Promise<Object>}
   */
  async checkTicketStatus(ticketCode) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      code: ticketCode,
      status: 'WAITING',
      message: 'Votre ticket est en attente dans la file prioritaire.'
    };
  }
};
