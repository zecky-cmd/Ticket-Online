import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ArrowLeft, ArrowRight, Ticket, Loader2 } from 'lucide-react';
import { catalogService } from '../../services/catalogService';
import { gestionnaireService } from '../../services/gestionnaireService';
import { ticketService } from '../../services/ticketService';
import { setCreatedTicket as setReduxTicket } from '../../features/ticketSlice';
import { setSelectedAgency as setReduxAgency } from '../../features/agencySlice';

import TicketSidebarStepper from './components/TicketSidebarStepper';
import TicketFeedbackBanner from './components/TicketFeedbackBanner';
import StepAgency from './components/StepAgency';
import StepService from './components/StepService';
import StepPrestation from './components/StepPrestation';
import StepTimeslot from './components/StepTimeslot';
import StepCustomerInfo from './components/StepCustomerInfo';
import TicketReceipt from './components/TicketReceipt';
import Modal from '../../globalComponents/ui/Modal';

/** Formate une date ISO (YYYY-MM-DD) en libellé lisible fr (ex: Mercredi 12 Novembre). */
function formatDateLabel(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const text = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Calcule l'heure de fin à partir d'une heure de début et d'une durée (ex: 07:15 + 15 min = 07:30) */
function calculateEndTime(timeStr, durationMinutes = 15) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const totalMin = h * 60 + m + durationMinutes;
  const endH = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const endM = String(totalMin % 60).padStart(2, '0');
  return `${endH}:${endM}`;
}

/** Jour court pour le payload de rendez-vous (ex: "Mer"). */
function formatShortDay(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString('fr-FR', { weekday: 'short' })
    .replace('.', '');
}

/**
 * Screen / Modal Prise de Ticket S2Q — Layout Strict Conforme Maquette
 * 
 * - Sidebar collapsible avec stepper dynamique à gauche
 * - Carte blanche intérieure pour le contenu de l'étape
 * - Zone bleue (Currently Selected ou Erreur) sous la carte
 * - Boutons Back & Next en bas à droite
 */
export default function TicketScreen({
  isOpen,
  isClosing = false,
  onClose,
  theme,
  agencies = [],
  agenciesLoading = false,
}) {
  const dispatch = useDispatch();
  const reduxSelectedAgency = useSelector((state) => /** @type {any} */ (state)?.agency?.selectedAgency);

  // État de réduction de la sidebar gauche
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Navigation (1: Agence, 2: Service, 3: Prestation, 4: Créneau, 5: Vos infos, 6: Reçu)
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Agence
  const [selectedAgencyIdOverride, setSelectedAgencyIdOverride] = useState(/** @type {string | null} */ (null));
  const selectedAgencyId = selectedAgencyIdOverride ?? reduxSelectedAgency?.id ?? null;

  // 2. Catalogue services + prestations
  const [services, setServices] = useState(/** @type {any[]} */ ([]));
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(/** @type {string | null} */ (null));

  // 3. Prestation + Gestionnaire
  const [selectedPrestationId, setSelectedPrestationId] = useState(/** @type {string | null} */ (null));
  const [gestionnaires, setGestionnaires] = useState(/** @type {any[]} */ ([]));
  const [gestionnairesLoading, setGestionnairesLoading] = useState(false);
  const [selectedGestionnaireId, setSelectedGestionnaireId] = useState('auto');

  // 4. Créneau (date + heure)
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // 5. Coordonnées & Statut Client
  const [isClient, setIsClient] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // États réseau & résultat
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdTicket, setCreatedTicket] = useState(/** @type {any} */ (null));

  // Objets résolus
  const currentAgency = agencies.find((a) => String(a.id) === String(selectedAgencyId)) || null;
  const currentService = services.find((s) => s.id === selectedServiceId) || null;
  const currentPrestation = currentService?.prestations?.find((p) => p.id === selectedPrestationId) || null;
  const needsGestionnaire = currentPrestation?.serviceType === 'gestionnaire';
  const currentGestionnaire = gestionnaires.find((g) => g.id === selectedGestionnaireId) || gestionnaires[0] || null;

  // Étapes dynamiques épurées façon maquette (Service, Personal details, etc.)
  const steps = useMemo(() => {
    return [
      { id: 1, key: 'agency', label: 'Agence' },
      { id: 2, key: 'service', label: 'Service' },
      { id: 3, key: 'prestation', label: 'Prestation' },
      { id: 4, key: 'timeslot', label: 'Créneau' },
      { id: 5, key: 'customer', label: 'Vos informations' },
    ];
  }, []);

  // Chargement du catalogue à la validation de l'agence (étape 1 → 2)
  const handleAgencyValidated = async () => {
    if (!selectedAgencyId) {
      setErrorMessage('Veuillez sélectionner une agence avant de poursuivre.');
      return;
    }
    setErrorMessage('');
    setServicesLoading(true);
    try {
      const list = await catalogService.getAgencyPrestations(selectedAgencyId);
      setServices(list);
      setSelectedServiceId(null);
      setSelectedPrestationId(null);
      setGestionnaires([]);
      setSelectedGestionnaireId('auto');
      setCurrentStep(2);
    } catch (err) {
      console.error('Erreur de chargement du catalogue :', err);
      setErrorMessage('Impossible de charger les services de cette agence. Veuillez réessayer.');
    } finally {
      setServicesLoading(false);
    }
  };

  // Changement de service
  const handleSelectService = (/** @type {string} */ serviceId) => {
    setSelectedServiceId(serviceId);
    setSelectedPrestationId(null);
    setSelectedGestionnaireId('auto');
    setGestionnaires([]);
    setErrorMessage('');
  };

  // Chargement des gestionnaires pour une prestation
  const loadGestionnaires = async (/** @type {string} */ prestationId) => {
    if (!selectedAgencyId || !prestationId) return;
    const prestation = currentService?.prestations?.find((p) => p.id === prestationId);
    if (!prestation || prestation.serviceType !== 'gestionnaire') {
      setGestionnaires([]);
      return;
    }
    setGestionnairesLoading(true);
    setErrorMessage('');
    try {
      const list = await gestionnaireService.getGestionnairesWithAuto(selectedAgencyId, prestationId);
      setGestionnaires(list);
      setSelectedGestionnaireId('auto');
    } catch (err) {
      console.error('Erreur de chargement des gestionnaires :', err);
      setErrorMessage('Impossible de charger la liste des gestionnaires.');
    } finally {
      setGestionnairesLoading(false);
    }
  };

  // Changement de prestation
  const handleSelectPrestation = (/** @type {string} */ id) => {
    setSelectedPrestationId(id);
    setSelectedGestionnaireId('auto');
    setErrorMessage('');
    loadGestionnaires(id);
  };

  // Réinitialisation complète
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedAgencyIdOverride(null);
    setServices([]);
    setSelectedServiceId(null);
    setSelectedPrestationId(null);
    setGestionnaires([]);
    setSelectedGestionnaireId('auto');
    setSelectedDate('');
    setSelectedTime('');
    setCreatedTicket(null);
    setErrorMessage('');
    onClose();
  };

  // Soumission finale du ticket
  const handleGenerateTicket = async (/** @type {any} */ e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!currentAgency || !currentService || !currentPrestation) {
      setErrorMessage('Veuillez sélectionner une agence, un service et une opération.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setErrorMessage('Veuillez choisir la date et l\'heure de votre passage.');
      return;
    }

    if (!lastName.trim() || !firstName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom et vos prénoms.');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Veuillez renseigner votre numéro de téléphone pour la réception du SMS.');
      return;
    }

    if (isClient && !accountNumber.trim()) {
      setErrorMessage('En tant que client de la banque, veuillez renseigner votre numéro de compte.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const fullName = `${lastName.trim()} ${firstName.trim()}`;

      const ticketPayload = {
        agency: currentAgency,
        service: currentService,
        prestation: currentPrestation,
        gestionnaire: needsGestionnaire ? currentGestionnaire : null,
        timeslot: {
          day: formatShortDay(selectedDate),
          date: selectedDate,
          time: selectedTime,
        },
        isClient,
        accountNumber: isClient ? accountNumber.trim() : '',
        fullName,
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
      };

      const ticket = await ticketService.createTicket(ticketPayload);

      setCreatedTicket(ticket);
      dispatch(setReduxTicket(ticket));
      setCurrentStep(6);
    } catch (error) {
      const err = /** @type {any} */ (error);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Impossible de joindre le serveur S2Q. Veuillez réessayer.';
      setErrorMessage(msg);
      console.error('Erreur lors de la création du ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Résumé d'étape pour la zone bleue
  const currentSummary = useMemo(() => {
    if (currentStep === 4 && selectedDate && selectedTime) {
      const endTime = calculateEndTime(selectedTime, 15);
      return `${formatDateLabel(selectedDate)}, ${selectedTime} - ${endTime}`;
    }
    if (currentStep === 3 && currentPrestation) {
      return `${currentPrestation.name}${needsGestionnaire && currentGestionnaire ? ` (Conseiller : ${currentGestionnaire.name})` : ''}`;
    }
    if (currentStep === 2 && currentService) {
      return `Service : ${currentService.name}`;
    }
    if (currentStep === 1 && currentAgency) {
      return `Agence : ${currentAgency.name}`;
    }
    return null;
  }, [currentStep, selectedDate, selectedTime, currentPrestation, currentService, currentAgency, needsGestionnaire, currentGestionnaire]);

  // Logique de navigation unifiée (boutons Back et Next)
  const canGoBack = currentStep > 1 && currentStep <= 5;
  const isLastStep = currentStep === 5;

  const handleBack = () => {
    setErrorMessage('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setErrorMessage('');

    if (currentStep === 1) {
      handleAgencyValidated();
      return;
    }

    if (currentStep === 2) {
      if (!selectedServiceId) {
        setErrorMessage('Veuillez sélectionner un service pour continuer.');
        return;
      }
      setCurrentStep(3);
      loadGestionnaires(selectedPrestationId);
      return;
    }

    if (currentStep === 3) {
      if (!selectedPrestationId) {
        setErrorMessage('Veuillez sélectionner une prestation pour continuer.');
        return;
      }
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      if (!selectedDate || !selectedTime) {
        setErrorMessage('Veuillez sélectionner une date et un créneau horaire.');
        return;
      }
      setCurrentStep(5);
      return;
    }

    if (currentStep === 5) {
      handleGenerateTicket(null);
    }
  };

  const isNextDisabled = useMemo(() => {
    if (currentStep === 1) return !selectedAgencyId || servicesLoading;
    if (currentStep === 2) return !selectedServiceId;
    if (currentStep === 3) return !selectedPrestationId || (needsGestionnaire && gestionnairesLoading);
    if (currentStep === 4) return !selectedDate || !selectedTime;
    if (currentStep === 5) return isSubmitting;
    return false;
  }, [
    currentStep,
    selectedAgencyId,
    servicesLoading,
    selectedServiceId,
    selectedPrestationId,
    needsGestionnaire,
    gestionnairesLoading,
    selectedDate,
    selectedTime,
    isSubmitting,
  ]);

  const primaryColor = theme?.colors?.primary || '#008056';

  return (
    <Modal
      isOpen={isOpen}
      isClosing={isClosing}
      onClose={onClose}
      size="xl"
      className="p-0 overflow-hidden flex flex-col md:flex-row h-[94dvh] sm:h-[90vh] md:min-h-[640px] bg-[#fbfdfc]"
    >
      {/* ── COLONNE GAUCHE : SIDEBAR STEPPER COLLAPSIBLE (ÉTAPES 1 À 5) ── */}
      {currentStep <= 5 && (
        <TicketSidebarStepper
          steps={steps}
          activeStepId={currentStep}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onStepClick={(stepId) => {
            setErrorMessage('');
            setCurrentStep(Number(stepId));
          }}
          primaryColor={primaryColor}
        />
      )}

      {/* ── COLONNE DROITE : CONTENEUR STRICT MAQUETTE ── */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden p-4 sm:p-5 bg-[#fbfdfc]">
        {/* Header avec bouton Fermer X discret en haut à droite */}
        <div className="flex items-center justify-between pb-2 shrink-0">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {currentAgency ? currentAgency.name : 'Rendez-vous en ligne'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ── CARTE BLANCHE INTÉRIEURE (ZONE ENCADRÉE EN ROUGE DANS LA MAQUETTE) ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          {/* Étape 1 : Choix Agence */}
          {currentStep === 1 && (
            <StepAgency
              agencies={agencies}
              selectedAgencyId={selectedAgencyId}
              onSelectAgencyId={(id) => {
                setSelectedAgencyIdOverride(id);
                const ag = agencies.find((a) => String(a.id) === String(id));
                if (ag) dispatch(setReduxAgency(ag));
              }}
              isLoading={agenciesLoading}
              onNext={handleAgencyValidated}
              theme={theme}
              hideActions={true}
            />
          )}

          {/* Étape 2 : Choix Service */}
          {currentStep === 2 && (
            <StepService
              services={services}
              selectedServiceId={selectedServiceId}
              onSelectServiceId={handleSelectService}
              isLoading={servicesLoading}
              onBack={() => setCurrentStep(1)}
              onNext={handleNext}
              theme={theme}
              hideActions={true}
            />
          )}

          {/* Étape 3 : Choix Prestation & Gestionnaire */}
          {currentStep === 3 && (
            <StepPrestation
              prestations={currentService?.prestations || []}
              selectedPrestationId={selectedPrestationId}
              onSelectPrestationId={handleSelectPrestation}
              serviceName={currentService?.name}
              gestionnaires={gestionnaires}
              selectedGestionnaireId={selectedGestionnaireId}
              onSelectGestionnaireId={(id) => setSelectedGestionnaireId(id)}
              isLoadingGestionnaires={gestionnairesLoading}
              onBack={() => setCurrentStep(2)}
              onNext={handleNext}
              theme={theme}
              hideActions={true}
            />
          )}

          {/* Étape 4 : Choix Créneau (Nouvelle interface interactive) */}
          {currentStep === 4 && (
            <StepTimeslot
              selectedDate={selectedDate}
              setSelectedDate={(d) => {
                setSelectedDate(d);
                setErrorMessage('');
              }}
              selectedTime={selectedTime}
              setSelectedTime={(t) => {
                setSelectedTime(t);
                setErrorMessage('');
              }}
              theme={theme}
            />
          )}

          {/* Étape 5 : Coordonnées Client & Validation */}
          {currentStep === 5 && (
            <StepCustomerInfo
              lastName={lastName}
              setLastName={setLastName}
              firstName={firstName}
              setFirstName={setFirstName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              email={email}
              setEmail={setEmail}
              isClient={isClient}
              setIsClient={setIsClient}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              agency={currentAgency}
              service={currentService}
              prestation={currentPrestation}
              gestionnaire={needsGestionnaire ? currentGestionnaire : null}
              timeslotText={
                selectedDate && selectedTime
                  ? `${formatDateLabel(selectedDate)} à ${selectedTime}`
                  : 'À définir'
              }
              isSubmitting={isSubmitting}
              onSubmit={handleGenerateTicket}
              onBack={() => setCurrentStep(4)}
              theme={theme}
              hideActions={true}
            />
          )}

          {/* Étape 6 : Reçu & Confirmation du Ticket */}
          {currentStep === 6 && (
            <TicketReceipt
              ticket={createdTicket}
              theme={theme}
              onDone={handleReset}
            />
          )}
        </div>

        {/* ── ZONE BLEUE : BANDEAU FEEDBACK OU ERREUR (SOUS LA CARTE BLANCHE) ── */}
        {currentStep <= 5 && (
          <div className="pt-2 shrink-0">
            <TicketFeedbackBanner
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage('')}
              summary={currentSummary}
              summaryTitle="Currently Selected:"
            />
          </div>
        )}

        {/* ── BOUTONS D'ACTION (BACK & NEXT) : ALIGNÉS EN BAS À DROITE ── */}
        {currentStep <= 5 && (
          <div className="pt-2 flex items-center justify-end gap-2.5 shrink-0">
            {canGoBack && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs sm:text-sm tracking-tight border border-slate-200/60 shadow-2xs cursor-pointer transition-colors"
              >
                Back
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
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>En cours...</span>
                </>
              ) : isLastStep ? (
                <>
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Confirmer le ticket</span>
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
