import { Clock, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import SearchSelect from '../../../globalComponents/ui/SearchSelect';

/**
 * Étape 2 : Choix du service (Liste déroulante)
 *
 * @param {Object} props
 * @param {any[]} props.services
 * @param {string} props.selectedServiceId
 * @param {(id: string) => void} props.onSelectServiceId
 * @param {boolean} [props.isLoading]
 * @param {() => void} props.onBack
 * @param {() => void} props.onNext
 * @param {any} [props.theme]
 */
export default function StepService({
  services,
  selectedServiceId,
  onSelectServiceId,
  isLoading = false,
  onBack,
  onNext,
  theme,
  hideActions = false,
}) {
  const currentService = services.find((s) => s.id === selectedServiceId) || null;
  const prestationCount = currentService?.prestations?.length || 0;

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      <div>
        <SearchSelect
          id="service-select"
          label="2. Sélectionnez le service souhaité"
          placeholder={isLoading ? 'Chargement des services…' : 'Sélectionner un service…'}
          options={services}
          valueKey="id"
          labelKey="name"
          renderLabel={(s) => `${s.name} — ${s.serviceType === 'caisse' ? 'Caisse' : 'Gestionnaire'}`}
          value={currentService?.id ?? null}
          onChange={(id) => id !== null && onSelectServiceId(id)}
          disabled={isLoading}
        />
      </div>

      {/* Fiche récapitulative du service */}
      {currentService && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{currentService.name}</h4>
              {currentService.description && (
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {currentService.description}
                </p>
              )}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500 shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {currentService.serviceType === 'caisse' ? 'Caisse' : 'Gestionnaire'}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-100 text-xs">
            <Clock className="w-4 h-4 text-primary-500 shrink-0" />
            <span className="text-slate-500 font-medium">
              {prestationCount} prestation{prestationCount > 1 ? 's' : ''} disponible{prestationCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Boutons d'action : Précédent & Suivant */}
      {!hideActions && (
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            iconStart={ArrowLeft}
            onClick={onBack}
            className="min-h-[50px] font-bold text-sm sm:text-base cursor-pointer px-4 sm:px-6"
          >
            Retour
          </Button>
          <Button
            type="button"
            size="lg"
            variant="primary"
            primaryColor={theme?.colors?.primary || '#008056'}
            iconEnd={ArrowRight}
            onClick={onNext}
            disabled={!currentService || isLoading}
            className="flex-1 min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
          >
            Valider le service
          </Button>
        </div>
      )}
    </div>
  );
}
