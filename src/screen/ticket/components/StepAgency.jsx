import { Building2, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Étape 1 : Choix de l'agence (Liste déroulante)
 * 
 * @param {Object} props
 * @param {any[]} props.agencies
 * @param {any} props.selectedAgencyId
 * @param {(id: number) => void} props.onSelectAgencyId
 * @param {() => void} props.onNext
 * @param {any} [props.theme]
 */
export default function StepAgency({
  agencies,
  selectedAgencyId,
  onSelectAgencyId,
  onNext,
  theme,
}) {
  const currentAgency = agencies.find((a) => a.id === Number(selectedAgencyId)) || agencies[0];

  /** @type {Record<string, { label: string; bg: string; text: string; border: string }>} */
  const badges = {
    fluide: { label: 'Fluide (< 10 min)', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    moderee: { label: 'Modérée (10-25 min)', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    saturee: { label: 'Saturée (> 25 min)', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  };
  const affluenceKey = currentAgency?.affluence || 'fluide';
  const affluenceBadge = badges[affluenceKey] || badges.fluide;

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      <div>
        <label htmlFor="agency-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          1. Sélectionnez votre agence bancaire
        </label>
        <div className="relative">
          <Building2 className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            id="agency-select"
            value={currentAgency?.id || ''}
            onChange={(e) => onSelectAgencyId(Number(e.target.value))}
            className="w-full pl-11 pr-10 min-h-[52px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-[#008056] rounded-2xl text-base sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#008056]/20 cursor-pointer transition-colors shadow-2xs"
          >
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.id}>
                {agency.name} — {agency.district || agency.commune} ({agency.currentWaitTime} d'attente)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fiche récapitulative dynamique de l'agence sélectionnée */}
      {currentAgency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{currentAgency.name}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#008056] shrink-0" />
                <span>{currentAgency.address || currentAgency.commune}</span>
              </p>
            </div>
            <span
              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${affluenceBadge.bg} ${affluenceBadge.text} ${affluenceBadge.border}`}
            >
              {affluenceBadge.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#008056] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Horaires</span>
                <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                  Ferme à {currentAgency.openUntil || '17:30'}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#008056] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Guichets</span>
                <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                  {currentAgency.countersActive || 5} guichets actifs
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'action */}
      <div className="pt-2">
        <Button
          type="button"
          size="lg"
          variant="primary"
          primaryColor={theme?.colors?.primary || '#008056'}
          iconEnd={ArrowRight}
          onClick={onNext}
          className="w-full min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
        >
          Valider l'agence et continuer
        </Button>
      </div>
    </div>
  );
}

