import { useState, useMemo } from 'react';
import { X, Send, Loader2, SkipForward } from 'lucide-react';
import useSatisfactionFlow from './hooks/useSatisfactionFlow';
import SatisfactionStepContext from './components/SatisfactionStepContext';
import SatisfactionStepRating from './components/SatisfactionStepRating';
import SatisfactionStepNps from './components/SatisfactionStepNps';
import SatisfactionStepClientInfo from './components/SatisfactionStepClientInfo';
import SatisfactionSuccess from './components/SatisfactionSuccess';
import TicketSidebarStepper from '../ticket/components/TicketSidebarStepper';
import TicketFeedbackBanner from '../ticket/components/TicketFeedbackBanner';
import Modal from '../../globalComponents/ui/Modal';

const STEPS = [
  { id: 1, label: 'Contexte' },
  { id: 2, label: 'Votre avis' },
  { id: 3, label: 'Recommandation' },
  { id: 4, label: 'Vos coordonnées' },
];

/**
 * Screen / Modal Évaluation de la Satisfaction Client
 * Architecture 2 colonnes unifiée (identique au parcours Ticket)
 * 
 * - Sidebar collapsible avec stepper dynamique à gauche
 * - Carte blanche intérieure pour le contenu de l'étape
 * - Zone bleue (Currently Selected ou Erreur) sous la carte
 * - Boutons Back & Next en bas à droite
 */
export default function SatisfactionScreen({
  isOpen,
  isClosing = false,
  onClose,
  theme,
  agencies = [],
  agenciesLoading = false,
}) {
  const { step, submitted, secondsLeft, context, rating, survey, actions } = useSatisfactionFlow({
    isOpen,
    onClose,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const primaryColor = theme?.colors?.primary || '#008056';

  // Résumé d'étape pour la zone bleue
  const currentSummary = useMemo(() => {
    if (step === 1 && context.selectedAgencyId) {
      const ag = agencies.find((a) => String(a.id) === String(context.selectedAgencyId));
      const s = context.services.find((ser) => ser.id === context.selectedServiceId);
      return ag ? `${ag.name}${s ? ` • ${s.name}` : ''}` : null;
    }
    if (step === 2 && rating.selectedSatis) {
      const satisName = rating.selectedSatis.label || rating.selectedSatis.name || 'Avis enregistré';
      const justifName = rating.selectedJustificatif?.label ? ` — Motif : ${rating.selectedJustificatif.label}` : '';
      return `${satisName}${justifName}`;
    }
    if (step === 3 && survey.npsNote !== null) {
      return `Note de recommandation : ${survey.npsNote} / 10`;
    }
    if (step === 4) {
      const { nom, prenoms } = survey.clientInfo;
      return nom || prenoms ? `${nom} ${prenoms}`.trim() : 'Avis anonyme (coordonnées facultatives)';
    }
    return null;
  }, [step, context.selectedAgencyId, context.selectedServiceId, context.services, agencies, rating.selectedSatis, rating.selectedJustificatif, survey.npsNote, survey.clientInfo]);

  // Logique des boutons unifiés
  const canGoBack = step > 1 && !submitted;
  const isContextValid = Boolean(context.selectedAgencyId && context.selectedServiceId && context.selectedPrestationId);
  const isRatingValid = Boolean(rating.selectedSatis);
  const isNpsValid = survey.npsNote !== null;

  const isNextDisabled = useMemo(() => {
    if (step === 1) return !isContextValid;
    if (step === 2) return !isRatingValid;
    if (step === 3) return !isNpsValid;
    if (step === 4) return survey.isSubmitting;
    return false;
  }, [step, isContextValid, isRatingValid, isNpsValid, survey.isSubmitting]);

  const handleNext = () => {
    if (step === 1 && isContextValid) actions.goTo(2);
    else if (step === 2 && isRatingValid) actions.goTo(3);
    else if (step === 3 && isNpsValid) actions.goTo(4);
    else if (step === 4) actions.finish(true);
  };

  const handleBack = () => {
    if (step > 1) actions.goTo(step - 1);
  };

  return (
    <Modal
      isOpen={isOpen}
      isClosing={isClosing}
      onClose={actions.close}
      size="xl"
      className="p-0 overflow-hidden flex flex-col md:flex-row h-[94dvh] sm:h-[90vh] md:min-h-[640px] bg-[#fbfdfc]"
    >
      {/* ── COLONNE GAUCHE : SIDEBAR STEPPER (MASQUÉE SUR L'ÉCRAN DE SUCCÈS) ── */}
      {!submitted && (
        <TicketSidebarStepper
          steps={STEPS}
          activeStepId={step}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onStepClick={(stepId) => actions.goTo(Number(stepId))}
          primaryColor={primaryColor}
        />
      )}

      {/* ── COLONNE DROITE : CONTENEUR STRICT MAQUETTE ── */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden p-4 sm:p-5 bg-[#fbfdfc]">
        {/* Header avec bouton Fermer X discret */}
        <div className="flex items-center justify-between pb-2 shrink-0">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Satisfaction Client
            </span>
          </div>

          <button
            type="button"
            onClick={actions.close}
            className="p-1 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ── CARTE BLANCHE INTÉRIEURE ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
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
                  onNext={handleNext}
                  theme={theme}
                  hideActions={true}
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
                  onBack={handleBack}
                  onNext={handleNext}
                  theme={theme}
                  hideActions={true}
                />
              )}

              {step === 3 && (
                <SatisfactionStepNps
                  npsNote={survey.npsNote}
                  setNpsNote={actions.setNpsNote}
                  onBack={handleBack}
                  onNext={handleNext}
                  theme={theme}
                  hideActions={true}
                />
              )}

              {step === 4 && (
                <SatisfactionStepClientInfo
                  clientInfo={survey.clientInfo}
                  setClientInfo={actions.setClientInfo}
                  isSubmitting={survey.isSubmitting}
                  onFinish={actions.finish}
                  onBack={handleBack}
                  theme={theme}
                  hideActions={true}
                />
              )}
            </>
          )}
        </div>

        {/* ── ZONE BLEUE : BANDEAU FEEDBACK OU ERREUR (SOUS LA CARTE BLANCHE) ── */}
        {!submitted && (
          <div className="pt-2 shrink-0">
            <TicketFeedbackBanner
              errorMessage={survey.errorMessage}
              onClearError={() => actions.setErrorMessage?.('')}
              summary={currentSummary}
              summaryTitle="Votre sélection actuelle :"
            />
          </div>
        )}

        {/* ── BOUTONS D'ACTION (BACK, PASSER & NEXT) : ALIGNÉS EN BAS À DROITE ── */}
        {!submitted && (
          <div className="pt-2 flex items-center justify-end gap-2.5 shrink-0">
            {canGoBack && (
              <button
                type="button"
                onClick={handleBack}
                disabled={survey.isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs sm:text-sm tracking-tight border border-slate-200/60 shadow-2xs cursor-pointer transition-colors"
              >
                Back
              </button>
            )}

            {/* Bouton Passer (uniquement aux étapes 3 et 4 où c'est facultatif) */}
            {step === 3 && (
              <button
                type="button"
                onClick={() => actions.goTo(4)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 font-semibold text-xs sm:text-sm tracking-tight border border-slate-200/60 shadow-2xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Passer</span>
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={() => actions.finish(false)}
                disabled={survey.isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 font-semibold text-xs sm:text-sm tracking-tight border border-slate-200/60 shadow-2xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Passer et terminer</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-tight text-white shadow-md transition-all flex items-center gap-1.5 select-none ${
                isNextDisabled
                  ? 'opacity-50 cursor-not-allowed shadow-none'
                  : 'hover:opacity-95 active:scale-[0.98] cursor-pointer'
              }`}
              style={{
                backgroundColor: isNextDisabled ? '#94a3b8' : primaryColor,
              }}
            >
              {survey.isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Validation…</span>
                </>
              ) : step === 4 ? (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Valider mon avis</span>
                </>
              ) : (
                <span>Next</span>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
