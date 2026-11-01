import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, X } from 'lucide-react';
import { AGENCIES_MOCK } from '../../mocks/agenciesMock';
import { SERVICES_LIST, AVAILABLE_DAYS, TIME_SLOTS } from '../../mocks/ticketFlowMock';
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

/**
 * Screen / Modal Prise de Ticket Multi-Étapes S2Q
 * Flux complet : Agence -> Service -> Prestation -> Créneau -> Vos infos -> Reçu
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {any} [props.theme]
 * @param {any[]} [props.agencies]
 */
export default function TicketScreen({ isOpen, onClose, theme, agencies = AGENCIES_MOCK }) {
  const dispatch = useDispatch();
  const reduxSelectedAgency = useSelector((state) => /** @type {any} */ (state)?.agency?.selectedAgency);

  // État de navigation (1: Agence, 2: Service, 3: Prestation, 4: Créneau, 5: Vos infos, 6: Reçu)
  const [currentStep, setCurrentStep] = useState(1);

  // Données de formulaire (Typage explicite sans cascading effect)
  const [selectedAgencyIdOverride, setSelectedAgencyIdOverride] = useState(/** @type {number | null} */ (null));
  const selectedAgencyId = selectedAgencyIdOverride ?? reduxSelectedAgency?.id ?? agencies[0]?.id ?? 1;

  const [selectedServiceId, setSelectedServiceId] = useState(SERVICES_LIST[0].id);
  const [selectedPrestationId, setSelectedPrestationId] = useState(SERVICES_LIST[0].prestations[0].id);

  // Changement de service avec réinitialisation immédiate de la prestation
  const handleSelectService = (/** @type {string} */ serviceId) => {
    setSelectedServiceId(serviceId);
    const serviceObj = SERVICES_LIST.find((s) => s.id === serviceId);
    if (serviceObj && serviceObj.prestations && serviceObj.prestations.length > 0) {
      setSelectedPrestationId(serviceObj.prestations[0].id);
    }
  };

  // Créneau
  const [timeslotMode, setTimeslotMode] = useState(/** @type {'immediate' | 'scheduled'} */ ('immediate'));
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedTime, setSelectedTime] = useState('09:00');

  // Coordonnées client
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // États réseau & résultat
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdTicket, setCreatedTicket] = useState(/** @type {any} */ (null));

  // Objets résolus
  const currentAgency = agencies.find((a) => a.id === Number(selectedAgencyId)) || agencies[0];
  const currentService = SERVICES_LIST.find((s) => s.id === selectedServiceId) || SERVICES_LIST[0];
  const currentPrestation = (currentService && currentService.prestations.find((p) => p.id === selectedPrestationId)) || currentService?.prestations?.[0];

  const currentTimeslotText = timeslotMode === 'immediate'
    ? 'Passage immédiat'
    : `${AVAILABLE_DAYS.find((d) => d.id === selectedDay)?.label || 'Aujourd’hui'} à ${selectedTime}`;

  // Réinitialisation complète
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedAgencyIdOverride(null);
    setCreatedTicket(null);
    setErrorMessage('');
    onClose();
  };

  // Soumission finale
  const handleGenerateTicket = async (/** @type {any} */ e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!fullName.trim() || !phoneNumber.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet et votre numéro de téléphone.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const ticketPayload = {
        agency: currentAgency,
        service: currentService,
        prestation: currentPrestation,
        timeslot: {
          type: timeslotMode,
          day: selectedDay,
          dayFormatted: AVAILABLE_DAYS.find((d) => d.id === selectedDay)?.label,
          time: selectedTime,
        },
        fullName: fullName.trim(),
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
      <div className="bg-white w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl sm:max-w-xl max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden border-t sm:border border-slate-100 animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">
        
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
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7">
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
              onSelectAgencyId={(id) => {
                setSelectedAgencyIdOverride(id);
                const a = agencies.find((ag) => ag.id === id);
                if (a) dispatch(setReduxAgency(a));
              }}
              onNext={() => setCurrentStep(2)}
              theme={theme}
            />
          )}

          {/* Étape 2 : Choix Service */}
          {currentStep === 2 && (
            <StepService
              services={SERVICES_LIST}
              selectedServiceId={selectedServiceId}
              onSelectServiceId={handleSelectService}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
              theme={theme}
            />
          )}

          {/* Étape 3 : Choix Prestation */}
          {currentStep === 3 && (
            <StepPrestation
              prestations={currentService?.prestations || []}
              selectedPrestationId={selectedPrestationId}
              onSelectPrestationId={(id) => setSelectedPrestationId(id)}
              serviceName={currentService?.shortName || currentService?.name}
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
              theme={theme}
            />
          )}

          {/* Étape 4 : Choix Créneau */}
          {currentStep === 4 && (
            <StepTimeslot
              timeslotMode={timeslotMode}
              setTimeslotMode={setTimeslotMode}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              days={AVAILABLE_DAYS}
              timeSlots={TIME_SLOTS}
              onBack={() => setCurrentStep(3)}
              onNext={() => setCurrentStep(5)}
              theme={theme}
            />
          )}

          {/* Étape 5 : Coordonnées Client & Validation */}
          {currentStep === 5 && (
            <StepCustomerInfo
              fullName={fullName}
              setFullName={setFullName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              email={email}
              setEmail={setEmail}
              agency={currentAgency}
              service={currentService}
              prestation={currentPrestation}
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
