import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Ticket, X, Building2, QrCode, AlertCircle, Printer } from 'lucide-react';
import Button from './ui/Button';
import { AGENCIES_MOCK } from '../mocks/agenciesMock';
import { ticketService } from '../services/ticketService';
import { setCreatedTicket as setReduxTicket } from '../features/ticketSlice';

export default function TicketModal({ isOpen, onClose, theme, agencies = AGENCIES_MOCK }) {
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
      const msg = error?.response?.data?.message || error.message || 'Impossible de joindre le serveur S2Q. Veuillez réessayer.';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div 
          className="px-6 py-5 flex items-center justify-between text-white"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">Prise de Ticket en Ligne</h3>
              <p className="text-xs text-white/85">Génération instantanée de ticket prioritaire</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={resetAll}
            className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleGenerateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Choisissez l'agence de passage
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <select
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  >
                    {agencies.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name} — ({a.currentWaitTime} d'attente)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Type d'opération souhaitée
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'reclamation', label: 'Réclamation' },
                    { id: 'commercial', label: 'Conseil' },
                    { id: 'caisse', label: 'Caisse' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setServiceCategory(cat.id)}
                      className={`text-xs py-2.5 px-2 rounded-xl font-bold transition-all border cursor-pointer ${
                        serviceCategory === cat.id
                          ? 'text-white border-transparent shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      style={{
                        backgroundColor: serviceCategory === cat.id ? theme.colors.primary : 'transparent'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nom & Prénoms
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Jean Koffi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Numéro de Téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07 00 00 00 00"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  primaryColor={theme.colors.primary}
                  iconStart={Ticket}
                  className="w-full"
                >
                  {isSubmitting ? 'Génération en cours...' : 'Valider et Générer le Ticket'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              {/* Carte Ticket Réaliste */}
              <div 
                className="border-2 border-dashed rounded-3xl p-6 bg-slate-50/80 relative overflow-hidden text-left shadow-xs"
                style={{ borderColor: theme.colors.primary }}
              >
                {/* Badge Ticket */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                    E-TICKET OFFICIEL
                  </span>
                  <span 
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: theme.colors.badgeBg, color: theme.colors.badgeText }}
                  >
                    Actif
                  </span>
                </div>

                <div className="my-4 text-center">
                  <div className="text-xs text-slate-500 uppercase font-semibold">Votre Numéro de Passage</div>
                  <div 
                    className="text-5xl font-black tracking-tight my-1" 
                    style={{ color: theme.colors.primary }}
                  >
                    {createdTicket?.code}
                  </div>
                  <div className="text-sm font-semibold text-slate-800">{createdTicket?.serviceName}</div>
                  <div className="text-xs text-slate-500 mt-1">{createdTicket?.agency}</div>
                </div>

                {/* QR Code Virtuel Stylisé */}
                <div className="flex items-center justify-center py-2">
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs inline-flex flex-col items-center">
                    <QrCode className="w-24 h-24 text-slate-900" />
                    <span className="text-[10px] text-slate-400 font-mono mt-1">SCAN AU GUICHET</span>
                  </div>
                </div>

                {/* Détails d'attente */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">Attente estimée :</span>
                    <b className="text-slate-800 text-sm">{createdTicket?.estimatedWait}</b>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Rang dans la file :</span>
                    <b className="text-slate-800 text-sm">{createdTicket?.queuePosition}e position</b>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Un SMS contenant votre lien de suivi vient d'être envoyé au <b>{createdTicket?.phoneNumber}</b>.
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  iconStart={Printer}
                  onClick={() => window.print()}
                  className="flex-1"
                >
                  Imprimer
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={resetAll}
                  className="flex-1"
                >
                  Terminer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
