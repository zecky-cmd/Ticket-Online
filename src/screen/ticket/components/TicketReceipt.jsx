import React from 'react';
import { QrCode, Printer, CheckCircle2 } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Reçu de Ticket Virtuel
 * Présentation au format "Boarding Pass / Apple Wallet" ultra-lisible sur mobile.
 */
export default function TicketReceipt({ ticket, theme, onDone }) {
  return (
    <div className="space-y-5 text-center">
      {/* Carte Ticket Réaliste avec crans latéraux façon billet */}
      <div 
        className="border-2 border-dashed rounded-3xl p-5 sm:p-6 bg-slate-50/90 relative overflow-hidden text-left shadow-xs"
        style={{ borderColor: theme?.colors?.primary }}
      >
        {/* En-tête billet */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
              E-TICKET OFFICIEL S2Q
            </span>
          </div>
          <span 
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: theme?.colors?.badgeBg, color: theme?.colors?.badgeText }}
          >
            Actif
          </span>
        </div>

        {/* Corps du ticket : Numéro géant */}
        <div className="my-4 text-center">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            Votre Numéro de Passage
          </div>
          <div 
            className="text-5xl sm:text-6xl font-black tracking-tight my-1.5 select-all" 
            style={{ color: theme?.colors?.primary }}
          >
            {ticket?.code}
          </div>
          <div className="text-sm font-bold text-slate-800">{ticket?.serviceName}</div>
          <div className="text-xs text-slate-500 mt-0.5">{ticket?.agency}</div>
        </div>

        {/* QR Code Virtuel Stylisé pour scan rapide en agence */}
        <div className="flex items-center justify-center py-2">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs inline-flex flex-col items-center">
            <QrCode className="w-28 h-28 sm:w-24 sm:h-24 text-slate-900" />
            <span className="text-[10px] text-slate-400 font-mono mt-1">SCAN AU GUICHET</span>
          </div>
        </div>

        {/* Détails d'attente sous forme de tuiles */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
          <div className="p-2.5 bg-white rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Attente estimée</span>
            <b className="text-slate-900 text-sm font-extrabold">{ticket?.estimatedWait}</b>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rang dans la file</span>
            <b className="text-slate-900 text-sm font-extrabold">{ticket?.queuePosition}e position</b>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 px-2 leading-relaxed">
        Un SMS contenant votre lien de suivi en temps réel vient d'être envoyé au{' '}
        <b className="text-slate-800">{ticket?.phoneNumber}</b>.
      </p>

      {/* Actions tactiles */}
      <div className="flex gap-2.5 pt-1">
        <Button
          variant="outline"
          size="md"
          iconStart={Printer}
          onClick={() => window.print()}
          className="flex-1 min-h-[48px]"
        >
          Imprimer
        </Button>
        <Button
          variant="primary"
          size="md"
          primaryColor={theme?.colors?.primary}
          onClick={onDone}
          className="flex-1 min-h-[48px]"
        >
          Terminer
        </Button>
      </div>
    </div>
  );
}
