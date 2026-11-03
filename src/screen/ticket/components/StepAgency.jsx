import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import SearchSelect from '../../../globalComponents/ui/SearchSelect';
import { getAffluence } from '../../../theme/affluence';

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
  const currentAgency = agencies.find((a) => a.id === Number(selectedAgencyId)) || null;

  const affluenceBadge = getAffluence(currentAgency?.affluence);

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      <div>
        <SearchSelect
          id="agency-select"
          label="1. Sélectionnez votre agence bancaire"
          placeholder="Sélectionner une agence…"
          options={agencies}
          valueKey="id"
          labelKey="name"
          renderLabel={(a) => `${a.name} — ${a.district || a.commune} (${a.currentWaitTime} d'attente)`}
          value={currentAgency?.id ?? null}
          onChange={(id) => id !== null && onSelectAgencyId(Number(id))}
        />
      </div>

      {/* Fiche récapitulative dynamique de l'agence sélectionnée */}
      {currentAgency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{currentAgency.name}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
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
              <Clock className="w-4 h-4 text-primary-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Horaires</span>
                <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                  Ferme à {currentAgency.openUntil || '17:30'}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500 shrink-0" />
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
          disabled={!currentAgency}
          className={`w-full min-h-[50px] font-bold text-sm sm:text-base ${currentAgency ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
        >
          Valider l'agence et continuer
        </Button>
      </div>
    </div>
  );
}

