import React from 'react';
import { ChevronRight } from 'lucide-react';

const AFFLUENCE_COLOR = {
  fluide:  '#008056',
  moderee: '#f59e0b',
  saturee: '#ef4444',
};

/**
 * Card horizontale d'agence — style maquette
 * Affiche : pastille statut, nom, quartier · horaire, temps en minutes, flèche
 */
export default function AgencyCard({ agency, isSelected, onClick }) {
  const dotColor = AFFLUENCE_COLOR[agency.affluence] ?? '#94a3b8';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 border rounded-2xl transition-all cursor-pointer text-left ${
        isSelected
          ? 'bg-[#f0faf5] border-[#008056]/40 shadow-sm ring-1 ring-[#008056]/20'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Pastille + infos agence */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
          style={{ backgroundColor: dotColor }}
        />
        <div className="min-w-0">
          <p className="font-bold text-slate-900 text-sm leading-snug truncate">
            {agency.name}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {agency.district}
            {agency.openUntil && (
              <> · <span>ouverte jusqu'à {agency.openUntil}</span></>
            )}
          </p>
        </div>
      </div>

      {/* Temps d'attente + flèche */}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
        <span className="font-extrabold text-slate-900 text-sm">
          {agency.waitMinutes}
          <span className="font-normal text-slate-500 text-xs"> min</span>
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </button>
  );
}

