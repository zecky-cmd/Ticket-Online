import { AFFLUENCE } from '../../../theme/affluence';

// Conforme aux 3 valeurs réelles de str_ageaffluence (fluide, moyenne, forte)
const FILTERS = ['toutes', 'fluide', 'moyenne', 'forte'];

/**
 * Barre de filtres affluence temps réel S2Q (Toutes, Fluides, Moyennes, Fortes)
 */
export default function AgencyFilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f;
        const config = AFFLUENCE[f];
        return (
          <button
            key={f}
            type="button"
            onClick={() => onFilterChange(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {config && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
            )}
            {f === 'toutes' ? 'Toutes' : config?.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
