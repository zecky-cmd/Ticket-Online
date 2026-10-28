import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Ticket, X, AlertCircle } from 'lucide-react';
import { AGENCIES_MOCK } from '../../mocks/agenciesMock';
import { ticketService } from '../../services/ticketService';
import { setCreatedTicket as setReduxTicket } from '../../features/ticketSlice';
import TicketForm from './components/TicketForm';
import TicketReceipt from './components/TicketReceipt';

/**
 * Screen / Modal Prise de Ticket
 * Mode Mobile Optimal : Se comporte comme une Bottom Sheet tactile sur mobile
 * et comme une modale centrée élégante sur desktop/tablette.
 */
export default function TicketScreen({ isOpen, onClose, theme, agencies = AGENCIES_MOCK }) {
  const dispatch = useDispatch();
  const reduxSelectedAgency = useSelector((state) => state.agency.selectedAgency);

  const [step, setStep] = useState(1);
  const [agency, setAgency] = useState(agencies[0]?.name || 'Agence Centrale - Plateau');
  const [serviceCategory, setServiceCategory] = useState('reclamation');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdTicket, setCreatedTicket] = useState(null);

  useEffect(() => {
    if (reduxSelectedAgency?.name) {
      setAgency(reduxSelectedAgency.name);
    }
  }, [reduxSelectedAgency]);

  if (!isOpen) return null;

  const handleGenerateTicket = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const ticket = await ticketService.createTicket({
        agency,
        serviceCategory,
        fullName,
        phoneNumber,
      });

      setCreatedTicket(ticket);
      dispatch(setReduxTicket(ticket));
      setStep(2);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        'Impossible de joindre le serveur S2Q. Veuillez réessayer.';
      setErrorMessage(msg);
      console.error('Erreur lors de la création du ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAll = () => {
    setStep(1);
    setCreatedTicket(null);
    setFullName('');
    setPhoneNumber('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      {/* Conteneur Hybride : Bottom Sheet sur mobile / Modal centrée sur desktop */}
      <div className="bg-white w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden border-t sm:border border-slate-100 animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">
        
        {/* Poignée tactile de glissement (visible uniquement sur mobile) */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

        {/* En-tête de la vue / modale */}
        <div 
          className="px-6 py-4 sm:py-5 flex items-center justify-between text-white flex-shrink-0"
          style={{ backgroundColor: theme?.colors?.primary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs flex-shrink-0">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-snug">Prise de Ticket en Ligne</h3>
              <p className="text-xs text-white/85">Génération instantanée de ticket prioritaire</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={resetAll}
            className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Corps défilable avec inertie tactile native (overscroll-contain) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 ? (
            <TicketForm
              agency={agency}
              setAgency={setAgency}
              agencies={agencies}
              serviceCategory={serviceCategory}
              setServiceCategory={setServiceCategory}
              fullName={fullName}
              setFullName={setFullName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              isSubmitting={isSubmitting}
              onSubmit={handleGenerateTicket}
              theme={theme}
            />
          ) : (
            <TicketReceipt
              ticket={createdTicket}
              theme={theme}
              onDone={resetAll}
            />
          )}
        </div>
      </div>
    </div>
  );
}
