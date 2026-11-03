import { ChevronRight } from 'lucide-react';

/**
 * Card horizontale d'agence — style maquette
 * Affiche : nom, quartier, flèche
 */
export default function AgencyCard({ agency, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 border rounded-2xl transition-all cursor-pointer text-left ${
        isSelected
          ? 'bg-primary-50/60 border-primary-500/40 shadow-sm ring-1 ring-primary-500/20'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Infos agence */}
      <div className="min-w-0">
        <p className="font-bold text-slate-900 text-sm leading-snug truncate">
          {agency.name}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {agency.commune}
        </p>
      </div>

      {/* Flèche */}
      <div className="flex items-center flex-shrink-0 ml-3">
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </button>
  );
}
