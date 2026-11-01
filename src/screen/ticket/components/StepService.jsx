import { Briefcase, Clock, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Étape 2 : Choix du service (Liste déroulante)
 * 
 * @param {Object} props
 * @param {any[]} props.services
 * @param {string} props.selectedServiceId
 * @param {(id: string) => void} props.onSelectServiceId
 * @param {() => void} props.onBack
 * @param {() => void} props.onNext
 * @param {any} [props.theme]
 */
export default function StepService({
  services,
  selectedServiceId,
  onSelectServiceId,
  onBack,
  onNext,
  theme,
}) {
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      <div>
        <label htmlFor="service-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          2. Sélectionnez le service souhaité
        </label>
        <div className="relative">
          <Briefcase className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            id="service-select"
            value={currentService?.id || ''}
            onChange={(e) => onSelectServiceId(e.target.value)}
            className="w-full pl-11 pr-10 min-h-[52px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-[#008056] rounded-2xl text-base sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#008056]/20 cursor-pointer transition-colors shadow-2xs"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} (Attente moy. ~{service.avgDuration})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fiche récapitulative du service */}
      {currentService && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{currentService.name}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {currentService.description}
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#008056]/10 text-[#008056] shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Série {currentService.codePrefix}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-100 text-xs">
            <Clock className="w-4 h-4 text-[#008056] shrink-0" />
            <span className="text-slate-500 font-medium">
              Durée moyenne de prise en charge : <strong className="text-slate-800">{currentService.avgDuration}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Boutons d'action : Précédent & Suivant */}
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
          className="flex-1 min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
        >
          Valider le service
        </Button>
      </div>
    </div>
  );
}

