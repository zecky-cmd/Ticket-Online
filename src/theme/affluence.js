// ============================================================================
// CONFIGURATION CENTRALISÉE DE L'AFFLUENCE — S2Q (Synapse Queue System)
// Conforme aux 3 états réels retournés par str_ageaffluence :
// - fluide  : attente estimée ≤ 10 min
// - moyenne : attente 11 à 25 min
// - forte   : attente > 25 min
// ============================================================================

export const AFFLUENCE = {
  fluide: {
    key: 'fluide',
    label: 'Fluide (≤ 10 min)',
    shortLabel: 'Fluides',
    color: '#008056',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  moyenne: {
    key: 'moyenne',
    label: 'Moyenne (11 à 25 min)',
    shortLabel: 'Moyennes',
    color: '#f59e0b',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  forte: {
    key: 'forte',
    label: 'Forte (> 25 min)',
    shortLabel: 'Fortes',
    color: '#ef4444',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  indisponible: {
    key: 'indisponible',
    label: 'Non renseignée',
    shortLabel: 'Indisponibles',
    color: '#94a3b8',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
  },
};

// Alias de compatibilité
AFFLUENCE.moderee = AFFLUENCE.moyenne;
AFFLUENCE.saturee = AFFLUENCE.forte;

/**
 * Retourne la configuration d'affluence (retombe sur "fluide" ou "indisponible").
 * @param {string} [key]
 */
export const getAffluence = (key) => {
  if (!key) return AFFLUENCE.fluide;
  const normalized = String(key).trim().toLowerCase();
  return AFFLUENCE[normalized] || AFFLUENCE.indisponible;
};
