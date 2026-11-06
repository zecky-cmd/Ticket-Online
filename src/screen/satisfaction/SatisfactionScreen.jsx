import { useState, useEffect, useRef } from 'react';
import { MessageSquareHeart, X } from 'lucide-react';
import { catalogService } from '../../services/catalogService';
import { satisfactionService } from '../../services/satisfactionService';
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
 * Flux web (adapté de la borne) : Contexte → Avis → Recommandation (NPS) → Coordonnées → Merci.
 * - Sauvegarde silencieuse du vote dès la sélection de l'émoticône (anti-abandon).
 * - Mise à jour finale du vote (lg_satvid) à la validation.
 */
export default function SatisfactionScreen({
  isOpen,
  onClose,
  theme,
  agencies = [],
  agenciesLoading = false,
}) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const handleCloseRef = useRef(/** @type {(() => void) | null} */ (null));

  // 1. Contexte (Agence → Service → Prestation)
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);
  const [services, setServices] = useState(/** @type {any[]} */ ([]));
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedPrestationId, setSelectedPrestationId] = useState(null);

  // 2. Avis (émoticône + justificatif + commentaire)
  const [satisfactions, setSatisfactions] = useState(/** @type {any[]} */ ([]));
  const [satisfactionsLoading, setSatisfactionsLoading] = useState(true);
  const [selectedSatis, setSelectedSatis] = useState(/** @type {any} */ (null));
  const [justificatifs, setJustificatifs] = useState(/** @type {any[]} */ ([]));
  const [justificatifsLoading, setJustificatifsLoading] = useState(false);
  const [selectedJustificatif, setSelectedJustificatif] = useState(/** @type {any} */ (null));
  const [comment, setComment] = useState('');

  // 3. Recommandation (NPS 0-10)
  const [npsNote, setNpsNote] = useState(/** @type {number | null} */ (null));

  // 4. Coordonnées (optionnel)
  const [clientInfo, setClientInfo] = useState({ nom: '', prenoms: '', tel: '', email: '' });

  // Vote & réseau
  const [voteId, setVoteId] = useState(/** @type {string | null} */ (null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Objets résolus
  const currentService = services.find((s) => s.id === selectedServiceId) || null;
  const currentPrestation =
    currentService?.prestations?.find((p) => p.id === selectedPrestationId) || null;

  // Chargement des émoticônes à l'ouverture de la modale
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    satisfactionService
      .getSatisfactions()
      .then((list) => {
        if (active) setSatisfactions(list);
      })
      .catch((err) => {
        console.error('Chargement des émoticônes échoué.', err);
      })
      .finally(() => {
        if (active) setSatisfactionsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  // Fermeture automatique après soumission : compte à rebours + fermeture différée
  useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    const timeout = setTimeout(() => {
      handleCloseRef.current?.();
    }, 6500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [submitted]);

  // ── Contexte ────────────────────────────────────────────────────────────
  const handleSelectAgency = async (/** @type {string} */ id) => {
    setSelectedAgencyId(id);
    setSelectedServiceId(null);
    setSelectedPrestationId(null);
    setServices([]);
    setServicesLoading(true);
    setErrorMessage('');
    try {
      const list = await catalogService.getAgencyPrestations(id);
      setServices(list);
    } catch (err) {
      console.error('Chargement des services échoué.', err);
      setErrorMessage('Impossible de charger les services de cette agence.');
    } finally {
      setServicesLoading(false);
    }
  };

  const handleSelectService = (/** @type {string} */ id) => {
    setSelectedServiceId(id);
    setSelectedPrestationId(null);
  };

  // ── Avis ────────────────────────────────────────────────────────────────
  const handleSelectSatis = async (/** @type {any} */ satis) => {
    setSelectedSatis(satis);
    setSelectedJustificatif(null);
    setComment('');
    setJustificatifs([]);
    setErrorMessage('');

    // Sauvegarde silencieuse : le vote est créé dès le choix de l'émoticône (anti-abandon)
    try {
      const res = await satisfactionService.saveVote({
        lg_ageid: selectedAgencyId,
        lg_serid: currentService?.id,
        lg_presid: currentPrestation?.id,
        lg_satisid: satis.id,
        int_satisnote: satis.note,
      });
      if (res?.success) setVoteId(res.voteId || null);
    } catch (err) {
      console.warn('Sauvegarde silencieuse échouée.', err);
    }

    // Chargement des justificatifs associés à cette émoticône
    setJustificatifsLoading(true);
    try {
      const list = await satisfactionService.getJustificatifs(satis.id, satis.order);
      setJustificatifs(list);
    } catch (err) {
      console.warn('Chargement des justificatifs échoué.', err);
    } finally {
      setJustificatifsLoading(false);
    }
  };

  const handleSelectJustificatif = (/** @type {any} */ justif) => {
    setSelectedJustificatif(justif);
    // Le texte libre n'a de sens que pour le motif « Autre » : on le vide sinon
    if (!justif?.isAutre) {
      setComment('');
    }
  };

  // ── Finalisation ────────────────────────────────────────────────────────
  const handleFinish = async (/** @type {boolean} */ withClientInfo) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await satisfactionService.saveVote({
        lg_ageid: selectedAgencyId,
        lg_serid: currentService?.id,
        lg_presid: currentPrestation?.id,
        lg_satisid: selectedSatis?.id,
        int_satisnote: selectedSatis?.note,
        int_npsnote: npsNote,
        lg_jusid: selectedJustificatif?.id || undefined,
        str_satvautre: comment,
        lg_satvid: voteId || undefined,
        clientInfo: withClientInfo ? clientInfo : undefined,
      });
      if (res?.success) {
        setVoteId(res.voteId || voteId);
        setSecondsLeft(6);
        setSubmitted(true);
      } else {
        setErrorMessage("Impossible d'enregistrer votre avis. Veuillez réessayer.");
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'avis :', err);
      setErrorMessage('Impossible de joindre le serveur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Fermeture / reset ───────────────────────────────────────────────────
  const handleClose = () => {
    setStep(1);
    setSubmitted(false);
    setSelectedAgencyId(null);
    setServices([]);
    setSelectedServiceId(null);
    setSelectedPrestationId(null);
    setSelectedSatis(null);
    setJustificatifs([]);
    setSelectedJustificatif(null);
    setComment('');
    setNpsNote(null);
    setClientInfo({ nom: '', prenoms: '', tel: '', email: '' });
    setVoteId(null);
    setSecondsLeft(0);
    setErrorMessage('');
    onClose();
  };

  // Garde une référence à jour de handleClose pour le timer (évite les fermetures obsolètes)
  useEffect(() => {
    handleCloseRef.current = handleClose;
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
            onClick={handleClose}
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
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <span>{errorMessage}</span>
            </div>
          )}

          {submitted ? (
            <SatisfactionSuccess theme={theme} secondsLeft={secondsLeft} onClose={handleClose} />
          ) : (
            <>
              {step === 1 && (
                <SatisfactionStepContext
                  agencies={agencies}
                  agenciesLoading={agenciesLoading}
                  selectedAgencyId={selectedAgencyId}
                  onSelectAgencyId={handleSelectAgency}
                  services={services}
                  servicesLoading={servicesLoading}
                  selectedServiceId={selectedServiceId}
                  onSelectServiceId={handleSelectService}
                  selectedPrestationId={selectedPrestationId}
                  onSelectPrestationId={setSelectedPrestationId}
                  onNext={() => setStep(2)}
                  theme={theme}
                />
              )}

              {step === 2 && (
                <SatisfactionStepRating
                  satisfactions={satisfactions}
                  satisfactionsLoading={satisfactionsLoading}
                  selectedSatis={selectedSatis}
                  onSelectSatis={handleSelectSatis}
                  justificatifs={justificatifs}
                  justificatifsLoading={justificatifsLoading}
                  selectedJustificatif={selectedJustificatif}
                  onSelectJustificatif={handleSelectJustificatif}
                  comment={comment}
                  setComment={setComment}
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                  theme={theme}
                />
              )}

              {step === 3 && (
                <SatisfactionStepNps
                  npsNote={npsNote}
                  setNpsNote={setNpsNote}
                  onBack={() => setStep(2)}
                  onNext={() => setStep(4)}
                  theme={theme}
                />
              )}

              {step === 4 && (
                <SatisfactionStepClientInfo
                  clientInfo={clientInfo}
                  setClientInfo={setClientInfo}
                  isSubmitting={isSubmitting}
                  onFinish={handleFinish}
                  onBack={() => setStep(3)}
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
