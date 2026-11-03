import { QrCode, Printer, CheckCircle2, Calendar, MapPin, Layers } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Reçu de Ticket Virtuel
 * 
 * @param {Object} props
 * @param {any} props.ticket
 * @param {any} [props.theme]
 * @param {() => void} props.onDone
 */
export default function TicketReceipt({ ticket, theme, onDone }) {
  return (
    <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
      {/* Carte Ticket Réaliste avec crans latéraux façon billet */}
      <div
        className="border-2 border-dashed rounded-3xl p-4 sm:p-6 bg-slate-50/90 relative overflow-hidden text-left shadow-xs"
        style={{ borderColor: theme?.colors?.primary || '#008056' }}
      >
        {/* En-tête billet */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary-500" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
              E-TICKET OFFICIEL S2Q
            </span>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${ticket?.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-500'}`}
          >
            {ticket?.status === 'pending' ? 'En attente' : 'Confirmé'}
          </span>
        </div>

        {/* Corps du ticket : Numéro géant */}
        <div className="my-3 text-center">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            Votre Numéro de Passage
          </div>
          <div
            className="text-5xl sm:text-6xl font-black tracking-tight my-1 select-all"
            style={{ color: theme?.colors?.primary || '#008056' }}
          >
            {ticket?.code}
          </div>
          <div className="text-sm font-bold text-slate-900">{ticket?.prestationName || ticket?.serviceName}</div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            <span>{ticket?.agency}</span>
          </div>
        </div>

        {/* QR Code Virtuel Stylisé pour scan à la borne d'accueil */}
        <div className="flex items-center justify-center py-1">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs inline-flex flex-col items-center">
            <QrCode className="w-24 h-24 sm:w-28 sm:h-28 text-slate-900" />
            <span className="text-[10px] text-slate-400 font-mono mt-1 font-bold">SCAN BORNE EN AGENCE</span>
          </div>
        </div>

        {/* Détails du rendez-vous sous forme de tuiles */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
          <div className="p-2.5 bg-white rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-primary-500" /> Créneau
            </span>
            <b className="text-slate-900 text-xs font-extrabold block truncate mt-0.5">
              {ticket?.appointmentTime || 'Passage immédiat'}
            </b>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Layers className="w-3 h-3 text-primary-500" /> Service
            </span>
            <b className="text-slate-900 text-xs font-extrabold block truncate mt-0.5">
              {ticket?.serviceName}
            </b>
          </div>

          {ticket?.gestionnaire && (
            <div className="col-span-2 p-2 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Conseiller affecté</span>
              <b className="text-slate-800 text-xs font-bold">{ticket.gestionnaire}</b>
            </div>
          )}

          {ticket?.isClient && ticket?.accountNumber && (
            <div className="col-span-2 p-2 bg-primary-50/50 rounded-xl border border-primary-100 flex items-center justify-between text-primary-700">
              <span className="text-[10px] uppercase font-bold">Compte client</span>
              <b className="text-xs font-mono">{ticket.accountNumber}</b>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 px-2 leading-relaxed">
        Un SMS de confirmation et de suivi en temps réel a été envoyé au{' '}
        <b className="text-slate-800">{ticket?.phoneNumber}</b>.
      </p>

      {/* Actions */}
      <div className="flex gap-2.5 pt-1">
        <Button
          variant="outline"
          size="md"
          iconStart={Printer}
          onClick={() => window.print()}
          className="flex-1 min-h-[48px] font-bold"
        >
          Imprimer
        </Button>
        <Button
          variant="primary"
          size="md"
          primaryColor={theme?.colors?.primary || '#008056'}
          onClick={onDone}
          className="flex-1 min-h-[48px] font-bold"
        >
          Terminer
        </Button>
      </div>
    </div>
  );
}
