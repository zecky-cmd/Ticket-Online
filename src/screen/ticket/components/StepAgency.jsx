import { MapPin, Phone, ArrowRight } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import SearchSelect from '../../../globalComponents/ui/SearchSelect';

/**
 * Étape 1 : Choix de l'agence (Liste déroulante)
 *
 * @param {Object} props
 * @param {any[]} props.agencies
 * @param {any} props.selectedAgencyId
 * @param {(id: string) => void} props.onSelectAgencyId
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
  const currentAgency = agencies.find((a) => String(a.id) === String(selectedAgencyId)) || null;

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
          renderLabel={(a) => (a.commune ? `${a.name} — ${a.commune}` : a.name)}
          value={currentAgency?.id ?? null}
          onChange={(id) => id !== null && onSelectAgencyId(id)}
        />
      </div>

      {/* Fiche récapitulative de l'agence sélectionnée */}
      {currentAgency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{currentAgency.name}</h4>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>{currentAgency.address || currentAgency.commune}</span>
            </p>
          </div>

          {currentAgency.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
              <Phone className="w-4 h-4 text-primary-500 shrink-0" />
              <span className="font-medium">{currentAgency.phone}</span>
            </div>
          )}
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
