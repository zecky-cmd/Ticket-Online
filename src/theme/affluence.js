// ============================================================================
// CONFIGURATION CENTRALISÉE DE L'AFFLUENCE — S2Q (Synapse Queue System)
//
// Source unique de vérité pour les états d'affluence des agences.
// Couleurs sémantiques "feu tricolore" (vert / ambre / rouge), volontairement
// indépendantes de la couleur de marque du client.
// ============================================================================

export const AFFLUENCE = {
  fluide: {
    key: 'fluide',
    label: 'Fluide (< 10 min)',
    shortLabel: 'Fluides',
    color: '#008056',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  moderee: {
    key: 'moderee',
    label: 'Modérée (10-25 min)',
    shortLabel: 'Modérées',
    color: '#f59e0b',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  saturee: {
    key: 'saturee',
    label: 'Saturée (> 25 min)',
    shortLabel: 'Saturées',
    color: '#ef4444',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
};

/**
 * Retourne la configuration d'affluence (retombe sur "fluide" si inconnue).
 * @param {string} [key]
 */
export const getAffluence = (key) => AFFLUENCE[key] || AFFLUENCE.fluide;
