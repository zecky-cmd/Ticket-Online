import { FileText, CheckCircle2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import SearchSelect from '../../../globalComponents/ui/SearchSelect';

/**
 * Étape 3 : Choix de la prestation et du gestionnaire (si prestation de type gestionnaire)
 *
 * @param {Object} props
 * @param {any[]} [props.prestations]
 * @param {string} props.selectedPrestationId
 * @param {(id: string) => void} props.onSelectPrestationId
 * @param {string} [props.serviceName]
 * @param {any[]} [props.gestionnaires]
 * @param {string} [props.selectedGestionnaireId]
 * @param {(id: string) => void} [props.onSelectGestionnaireId]
 * @param {boolean} [props.isLoadingGestionnaires]
 * @param {() => void} props.onBack
 * @param {() => void} props.onNext
 * @param {any} [props.theme]
 */
export default function StepPrestation({
  prestations = /** @type {any[]} */ ([]),
  selectedPrestationId,
  onSelectPrestationId,
  serviceName,
  gestionnaires = /** @type {any[]} */ ([]),
  selectedGestionnaireId = 'auto',
  onSelectGestionnaireId,
  isLoadingGestionnaires = false,
  onBack,
  onNext,
  theme,
}) {
  const currentPrestation = prestations.find((p) => p.id === selectedPrestationId) || null;
  const isGestionnaireService = currentPrestation?.serviceType === 'gestionnaire';
  const currentGestionnaire = gestionnaires.find((g) => g.id === selectedGestionnaireId) || gestionnaires[0];

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Sélection de la prestation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="prestation-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Sélectionnez votre opération
          </label>
          {serviceName && (
            <span className="text-[11px] text-primary-500 font-bold">
              Pôle : {serviceName}
            </span>
          )}
        </div>

        <SearchSelect
          id="prestation-select"
          placeholder="Sélectionner une opération…"
          options={prestations}
          valueKey="id"
          labelKey="name"
          value={currentPrestation?.id ?? null}
          onChange={(id) => id !== null && onSelectPrestationId(id)}
        />
      </div>

      {/* 2. Choix du gestionnaire (uniquement si la prestation est de type gestionnaire) */}
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
                className="text-[11px] font-bold text-primary-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Mode aléatoire
              </button>
            )}
          </div>

          <SearchSelect
            id="gestionnaire-select"
            placeholder={isLoadingGestionnaires ? 'Chargement des conseillers…' : 'Sélectionner un conseiller…'}
            options={gestionnaires}
            valueKey="id"
            labelKey="name"
            renderLabel={(g) => (g.isAuto ? `🎲 ${g.name}` : `${g.name} (${g.role})`)}
            value={selectedGestionnaireId}
            onChange={(id) => id !== null && onSelectGestionnaireId?.(id)}
            disabled={isLoadingGestionnaires}
          />

          {currentGestionnaire && (
            <p className="text-[11px] text-slate-500 pl-1 leading-snug">
              {currentGestionnaire.isAuto
                ? 'L’agence vous affectera automatiquement le premier conseiller libre pour écourter votre attente.'
                : `Votre rendez-vous sera assigné en priorité à ${currentGestionnaire.name}.`}
            </p>
          )}
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
          disabled={!currentPrestation || (isGestionnaireService && isLoadingGestionnaires)}
          className="flex-1 min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
        >
          Valider et choisir le créneau
        </Button>
      </div>
    </div>
  );
}
