import React from 'react';
import { LocateFixed } from 'lucide-react';

// Mapping statut affluence → couleur dot
const AFFLUENCE_CONFIG = {
  fluide:  { label: 'Fluides',   color: '#008056' },
  moderee: { label: 'Modérées',  color: '#f59e0b' },
  saturee: { label: 'Saturées',  color: '#ef4444' },
};

const FILTERS = ['toutes', 'fluide', 'moderee', 'saturee'];

/**
 * Barre de filtres affluence + bouton Me localiser
 */
export default function AgencyFilterBar({ activeFilter, onFilterChange, onLocate }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 flex-wrap gap-2">
      {/* Tabs Filtres */}
      <div className="flex items-center gap-1.5">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f;
          const config = AFFLUENCE_CONFIG[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => onFilterChange(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {config && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
              )}
              {f === 'toutes' ? 'Toutes' : config?.label}
            </button>
          );
        })}
      </div>

      {/* Bouton Me localiser */}
      <button
        type="button"
        onClick={onLocate}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:border-slate-400 transition-all cursor-pointer shadow-xs"
      >
        <LocateFixed className="w-3.5 h-3.5 text-slate-500" />
        Me localiser
      </button>
    </div>
  );
}

