import { Layers, FileText, CheckCircle2, UserCheck, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Étape 3 : Choix de la prestation et du gestionnaire (si service de type gestionnaire)
 * 
 * @param {Object} props
 * @param {any[]} [props.prestations]
 * @param {string} props.selectedPrestationId
 * @param {(id: string) => void} props.onSelectPrestationId
 * @param {any} [props.service]
 * @param {string} [props.serviceName]
 * @param {any[]} [props.gestionnaires]
 * @param {string} [props.selectedGestionnaireId]
 * @param {(id: string) => void} [props.onSelectGestionnaireId]
 * @param {() => void} props.onBack
 * @param {() => void} props.onNext
 * @param {any} [props.theme]
 */
export default function StepPrestation({
  prestations = /** @type {any[]} */ ([]),
  selectedPrestationId,
  onSelectPrestationId,
  service,
  serviceName,
  gestionnaires = /** @type {any[]} */ ([]),
  selectedGestionnaireId = 'auto',
  onSelectGestionnaireId,
  onBack,
  onNext,
  theme,
}) {
  const currentPrestation = prestations.find((p) => p.id === selectedPrestationId) || prestations[0];
  const isGestionnaireService = service?.serviceType === 'gestionnaire';
  const currentGestionnaire = gestionnaires.find((g) => g.id === selectedGestionnaireId) || gestionnaires[0];

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Sélection de la prestation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="prestation-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Sélectionnez votre opération
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
            className="w-full pl-11 pr-10 min-h-[50px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-[#008056] rounded-2xl text-base sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#008056]/20 cursor-pointer transition-colors shadow-2xs"
          >
            {prestations.map((prestation) => (
              <option key={prestation.id} value={prestation.id}>
                {prestation.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Choix du gestionnaire (affiché uniquement pour les services de type gestionnaire) */}
      {isGestionnaireService && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <label htmlFor="gestionnaire-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Choix du Conseiller / Gestionnaire
            </label>
            {selectedGestionnaireId !== 'auto' && onSelectGestionnaireId && (
              <button
                type="button"
                onClick={() => onSelectGestionnaireId('auto')}
                className="text-[11px] font-bold text-[#008056] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Mode aléatoire
              </button>
            )}
          </div>

          <div className="relative">
            <UserCheck className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              id="gestionnaire-select"
              value={selectedGestionnaireId}
              onChange={(e) => onSelectGestionnaireId?.(e.target.value)}
              className="w-full pl-11 pr-10 min-h-[48px] bg-white border border-slate-200 focus:border-[#008056] rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#008056]/20 cursor-pointer shadow-2xs"
            >
              {gestionnaires.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.isAuto ? `🎲 ${g.name}` : `${g.name} (${g.role})`}
                </option>
              ))}
            </select>
          </div>

          <p className="text-[11px] text-slate-500 pl-1 leading-snug">
            {currentGestionnaire?.isAuto
              ? 'L’agence vous affectera automatiquement le premier conseiller libre pour écourter votre attente.'
              : `Votre rendez-vous sera assigné en priorité à ${currentGestionnaire?.name}.`}
          </p>
        </div>
      )}

      {/* Rappel des documents utiles */}
      {currentPrestation && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <FileText className="w-4 h-4 text-[#008056] shrink-0" />
            <span>Documents utiles pour cette opération :</span>
          </div>

          <p className="text-xs text-slate-700 pl-6 leading-relaxed">
            {currentPrestation.documents || "Pièce d'identité originale en cours de validité."}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-emerald-700 pt-1 border-t border-emerald-200/50">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Présentez-vous 5 minutes avant le début de votre passage.</span>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex items-center gap-3 pt-1">
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
          Valider et choisir le créneau
        </Button>
      </div>
    </div>
  );
}
