import { Layers, FileText, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Étape 3 : Choix de la prestation (Liste déroulante contextuelle)
 * 
 * @param {Object} props
 * @param {any[]} [props.prestations]
 * @param {string} props.selectedPrestationId
 * @param {(id: string) => void} props.onSelectPrestationId
 * @param {string} [props.serviceName]
 * @param {() => void} props.onBack
 * @param {() => void} props.onNext
 * @param {any} [props.theme]
 */
export default function StepPrestation({
  prestations = /** @type {any[]} */ ([]),
  selectedPrestationId,
  onSelectPrestationId,
  serviceName,
  onBack,
  onNext,
  theme,
}) {
  const currentPrestation = prestations.find((p) => p.id === selectedPrestationId) || prestations[0];

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="prestation-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Sélectionnez votre opération spécifique
          </label>
          <span className="text-[11px] text-[#008056] font-bold">
            Pôle : {serviceName}
          </span>
        </div>

        <div className="relative">
          <Layers className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            id="prestation-select"
            value={currentPrestation?.id || ''}
            onChange={(e) => onSelectPrestationId(e.target.value)}
            className="w-full pl-11 pr-10 min-h-[52px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-[#008056] rounded-2xl text-base sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#008056]/20 cursor-pointer transition-colors shadow-2xs"
          >
            {prestations.map((prestation) => (
              <option key={prestation.id} value={prestation.id}>
                {prestation.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rappel des documents / pièces nécessaires */}
      {currentPrestation && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
            <FileText className="w-4 h-4 text-[#008056] shrink-0" />
            <span>Documents utiles pour cette opération :</span>
          </div>

          <p className="text-xs text-slate-700 pl-6 leading-relaxed">
            {currentPrestation.documents || "Pièce d'identité originale en cours de validité."}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-emerald-700 pt-1 border-t border-emerald-200/50">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Présentez-vous 5 minutes avant le début de votre créneau.</span>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
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
          Valider la prestation
        </Button>
      </div>
    </div>
  );
}

