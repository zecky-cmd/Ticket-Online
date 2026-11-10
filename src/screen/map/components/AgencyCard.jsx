import { ChevronRight, Navigation } from 'lucide-react';
import { getAffluence } from '../../../theme/affluence';
import { formatDistance } from '../utils/geoUtils';

/**
 * Card horizontale d'agence — style maquette
 * Affiche : pastille affluence, nom, quartier · horaire, distance GPS si géolocalisé, temps d'attente, flèche
 */
export default function AgencyCard({ agency, isSelected, onClick }) {
  const affluence = getAffluence(agency.affluence);
  const distanceFormatted = formatDistance(agency.distance);

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
      {/* Pastille + infos agence */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
          style={{ backgroundColor: affluence.color }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-900 text-sm leading-snug truncate">
              {agency.name}
            </p>
            {distanceFormatted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                <Navigation className="w-2.5 h-2.5" />
                <span>{distanceFormatted}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {agency.commune}
            {agency.openUntil && (
              <> · <span>ouverte jusqu'à {agency.openUntil}</span></>
            )}
          </p>
        </div>
      </div>

      {/* Temps d'attente + flèche */}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
        {agency.waitMinutes != null && (
          <span className="font-extrabold text-slate-900 text-sm">
            {agency.waitMinutes}
            <span className="font-normal text-slate-500 text-xs"> min</span>
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </button>
  );
}
