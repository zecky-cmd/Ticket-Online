import { s2qApiClient } from './api';

const USE_MOCK = true; // Basculer sur false pour appeler l'API S2Q réelle

/**
 * Service Métier : Avis et Satisfaction Client
 * 
 * Contrat de données Enquête :
 * {
 *   rating: number (1 à 5),
 *   criterion: 'accueil' | 'rapidite' | 'ecoute' | 'clarte',
 *   comment: string
 * }
 */
export const satisfactionService = {
  /**
   * Transmet l'évaluation du client au backoffice S2Q.
   * Route réelle attendue : POST /satisfaction/submit
   * 
   * @param {Object} payload 
   * @param {number} payload.rating - Note de 1 à 5
   * @param {string} payload.criterion - Critère principal
   * @param {string} payload.comment - Commentaire textuel
   * @returns {Promise<Object>}
   */
  async submitSatisfaction({ rating, criterion, comment }) {
    if (!USE_MOCK) {
      const response = await s2qApiClient.post('/satisfaction/submit', {
        rating,
        criterion,
        comment,
      });
      return response.data?.data || response.data;
    }

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
