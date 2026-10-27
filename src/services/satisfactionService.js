/**
 * Service Mock pour les Avis et Enquêtes de Satisfaction
 */
export const satisfactionService = {
  /**
   * Enregistre l'avis d'un client
   * @param {Object} payload { rating, criterion, comment }
   * @returns {Promise<Object>}
   */
  async submitSatisfaction({ rating, criterion, comment }) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return {
      success: true,
      id: `AVIS-${Date.now()}`,
      rating,
      criterion,
      comment,
      submittedAt: new Date().toISOString(),
      message: 'Votre avis a été enregistré avec succès.'
    };
  }
};
