import { MessageSquareHeart, X } from 'lucide-react';
import useSatisfactionFlow from './hooks/useSatisfactionFlow';
import SatisfactionStepContext from './components/SatisfactionStepContext';
import SatisfactionStepRating from './components/SatisfactionStepRating';
import SatisfactionStepNps from './components/SatisfactionStepNps';
import SatisfactionStepClientInfo from './components/SatisfactionStepClientInfo';
import SatisfactionSuccess from './components/SatisfactionSuccess';

const STEPS = [
  { id: 1, label: 'Contexte' },
  { id: 2, label: 'Avis' },
  { id: 3, label: 'Recommandation' },
  { id: 4, label: 'Coordonnées' },
];

/**
 * Screen / Modal Évaluation de la Satisfaction Client
 * Flux web  : Contexte → Avis → Recommandation (NPS) → Coordonnées → Merci.
 * Toute la logique métier vit dans hooks/useSatisfactionFlow.js — ici, que du rendu.
 */
export default function SatisfactionScreen({
  isOpen,
  onClose,
  theme,
  agencies = [],
  agenciesLoading = false,
}) {
  const { step, submitted, secondsLeft, context, rating, survey, actions } = useSatisfactionFlow({
    isOpen,
    onClose,
  });

  // Règle React : condition d'affichage APRÈS les hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      {/* Conteneur Hybride : Bottom Sheet mobile / Modale centrée desktop */}
      <div className="bg-white w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl sm:max-w-xl max-h-[94dvh] sm:max-h-[90vh] flex flex-col overflow-hidden border-t sm:border border-slate-100 animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">

        {/* Poignée tactile de glissement mobile */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

        {/* Header Modal */}
        <div
          className="px-6 py-4 sm:py-5 flex items-center justify-between text-white flex-shrink-0"
          style={{ backgroundColor: theme?.colors?.primary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs flex-shrink-0">
              <MessageSquareHeart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-snug">Satisfaction Client</h3>
              <p className="text-xs text-white/85">Votre avis compte — quelques clics suffisent</p>
            </div>
          </div>
          <button
            type="button"
            onClick={actions.close}
            className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Mini stepper (masqué sur l'écran de remerciement) */}
        {!submitted && (
          <div className="px-5 sm:px-8 py-3 border-b border-slate-100 bg-white shrink-0">
            <div className="grid grid-cols-4 gap-2">
              {STEPS.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                return (
                  <div key={s.id} className="flex flex-col gap-1.5">
                    <div
                      className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                        isActive ? 'bg-primary-500' : isCompleted ? 'bg-primary-500/70' : 'bg-slate-200'
                      }`}
                    />
                    <span
                      className={`text-[11px] sm:text-xs truncate font-bold transition-colors ${
                        isActive ? 'text-primary-500' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Corps défilable */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          {survey.errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <span>{survey.errorMessage}</span>
            </div>
          )}

          {submitted ? (
            <SatisfactionSuccess theme={theme} secondsLeft={secondsLeft} onClose={actions.close} />
          ) : (
            <>
              {step === 1 && (
                <SatisfactionStepContext
                  agencies={agencies}
                  agenciesLoading={agenciesLoading}
                  selectedAgencyId={context.selectedAgencyId}
                  onSelectAgencyId={actions.selectAgency}
                  services={context.services}
                  servicesLoading={context.servicesLoading}
                  selectedServiceId={context.selectedServiceId}
                  onSelectServiceId={actions.selectService}
                  selectedPrestationId={context.selectedPrestationId}
                  onSelectPrestationId={actions.selectPrestation}
                  onNext={() => actions.goTo(2)}
                  theme={theme}
                />
              )}

              {step === 2 && (
                <SatisfactionStepRating
                  satisfactions={rating.satisfactions}
                  satisfactionsLoading={rating.satisfactionsLoading}
                  selectedSatis={rating.selectedSatis}
                  onSelectSatis={actions.selectSatis}
                  justificatifs={rating.justificatifs}
                  justificatifsLoading={rating.justificatifsLoading}
                  selectedJustificatif={rating.selectedJustificatif}
                  onSelectJustificatif={actions.selectJustificatif}
                  comment={rating.comment}
                  setComment={actions.setComment}
                  onBack={() => actions.goTo(1)}
                  onNext={() => actions.goTo(3)}
                  theme={theme}
                />
              )}

              {step === 3 && (
                <SatisfactionStepNps
                  npsNote={survey.npsNote}
                  setNpsNote={actions.setNpsNote}
                  onBack={() => actions.goTo(2)}
                  onNext={() => actions.goTo(4)}
                  theme={theme}
                />
              )}

              {step === 4 && (
                <SatisfactionStepClientInfo
                  clientInfo={survey.clientInfo}
                  setClientInfo={actions.setClientInfo}
                  isSubmitting={survey.isSubmitting}
                  onFinish={actions.finish}
                  onBack={() => actions.goTo(3)}
                  theme={theme}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
