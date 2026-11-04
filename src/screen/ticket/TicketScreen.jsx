import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, X } from 'lucide-react';
import { catalogService } from '../../services/catalogService';
import { gestionnaireService } from '../../services/gestionnaireService';
import { ticketService } from '../../services/ticketService';
import { setCreatedTicket as setReduxTicket } from '../../features/ticketSlice';
import { setSelectedAgency as setReduxAgency } from '../../features/agencySlice';

import TicketStepperHeader from './components/TicketStepperHeader';
import StepAgency from './components/StepAgency';
import StepService from './components/StepService';
import StepPrestation from './components/StepPrestation';
import StepTimeslot from './components/StepTimeslot';
import StepCustomerInfo from './components/StepCustomerInfo';
import TicketReceipt from './components/TicketReceipt';

/** Formate une date ISO (YYYY-MM-DD) en libellé lisible fr. */
function formatDateLabel(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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
 * Screen / Modal Prise de Ticket Multi-Étapes S2Q (5 Étapes)
 * Flux : Agence -> Service -> Prestation & Gestionnaire -> Créneau -> Vos infos -> Reçu
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {any} [props.theme]
 * @param {any[]} [props.agencies]
 */
export default function TicketScreen({ isOpen, onClose, theme, agencies = [], agenciesLoading = false }) {
  const dispatch = useDispatch();
  const reduxSelectedAgency = useSelector((state) => /** @type {any} */ (state)?.agency?.selectedAgency);

  // Navigation (1: Agence, 2: Service, 3: Prestation, 4: Créneau, 5: Vos infos, 6: Reçu)
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Agence
  const [selectedAgencyIdOverride, setSelectedAgencyIdOverride] = useState(/** @type {string | null} */ (null));
  const selectedAgencyId = selectedAgencyIdOverride ?? reduxSelectedAgency?.id ?? null;

  // 2. Catalogue services + prestations (chargé depuis l'API pour l'agence)
  const [services, setServices] = useState(/** @type {any[]} */ ([]));
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(/** @type {string | null} */ (null));

  // 3. Prestation + Gestionnaire
  const [selectedPrestationId, setSelectedPrestationId] = useState(/** @type {string | null} */ (null));
  const [gestionnaires, setGestionnaires] = useState(/** @type {any[]} */ ([]));
  const [gestionnairesLoading, setGestionnairesLoading] = useState(false);
  const [selectedGestionnaireId, setSelectedGestionnaireId] = useState('auto');

  // 4. Créneau (date + heure simples)
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // 5. Coordonnées & Statut Client (nplan.md)
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

  const currentTimeslotText = selectedDate && selectedTime
    ? `${formatDateLabel(selectedDate)} à ${selectedTime}`
    : 'À définir';

  // Chargement du catalogue à la validation de l'agence (étape 1 → 2)
  const handleAgencyValidated = async () => {
    if (!selectedAgencyId) return;
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

  // Changement de service : réinitialise prestation + gestionnaires (aucune pré-sélection)
  const handleSelectService = (/** @type {string} */ serviceId) => {
    setSelectedServiceId(serviceId);
    setSelectedPrestationId(null);
    setSelectedGestionnaireId('auto');
    setGestionnaires([]);
  };

  // Chargement des gestionnaires pour une prestation (si type gestionnaire)
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

  // Changement de prestation : réinitialise le gestionnaire et recharge la liste
  const handleSelectPrestation = (/** @type {string} */ id) => {
    setSelectedPrestationId(id);
    setSelectedGestionnaireId('auto');
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

  // Soumission finale
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

  // Règle React : Condition d'affichage placée APRÈS l'ensemble des hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      {/* Conteneur Hybride : Bottom Sheet tactile sur mobile / Modale centrée sur desktop */}
      <div className="bg-white w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[94dvh] sm:max-h-[90vh] md:min-h-[520px] flex flex-col overflow-hidden border-t sm:border border-slate-100 animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">
        
        {/* Poignée tactile mobile */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* En-tête Stepper conforme à la maquette (Étapes 1 à 5) */}
        {currentStep <= 5 && (
          <TicketStepperHeader
            currentStep={currentStep}
            onStepClick={(stepId) => setCurrentStep(stepId)}
            onClose={handleReset}
          />
        )}

        {/* Bouton fermer discret pour l'écran de reçu final (Étape 6) */}
        {currentStep === 6 && (
          <div className="px-6 pt-4 flex justify-end shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Corps défilable avec inertie tactile fluide */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Étape 1 : Choix Agence */}
          {currentStep === 1 && (
            <StepAgency
              agencies={agencies}
              selectedAgencyId={selectedAgencyId}
              isLoading={agenciesLoading}
              onSelectAgencyId={(id) => {
                setSelectedAgencyIdOverride(id);
                const a = agencies.find((ag) => String(ag.id) === String(id));
                if (a) dispatch(setReduxAgency(a));
              }}
              onNext={handleAgencyValidated}
              theme={theme}
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
              onNext={() => {
                setCurrentStep(3);
                loadGestionnaires(selectedPrestationId);
              }}
              theme={theme}
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
              onNext={() => setCurrentStep(4)}
              theme={theme}
            />
          )}

          {/* Étape 4 : Choix Créneau */}
          {currentStep === 4 && (
            <StepTimeslot
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              onBack={() => setCurrentStep(3)}
              onNext={() => setCurrentStep(5)}
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
              timeslotText={currentTimeslotText}
              isSubmitting={isSubmitting}
              onSubmit={handleGenerateTicket}
              onBack={() => setCurrentStep(4)}
              theme={theme}
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
      </div>
    </div>
  );
}
