import { User, Phone, Mail, Ticket, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Étape 5 : Vos infos personnelles et récapitulatif avant génération du ticket
 * 
 * @param {Object} props
 * @param {string} props.fullName
 * @param {(name: string) => void} props.setFullName
 * @param {string} props.phoneNumber
 * @param {(phone: string) => void} props.setPhoneNumber
 * @param {string} props.email
 * @param {(email: string) => void} props.setEmail
 * @param {any} props.agency
 * @param {any} props.service
 * @param {any} props.prestation
 * @param {string} props.timeslotText
 * @param {boolean} props.isSubmitting
 * @param {(e: any) => void} props.onSubmit
 * @param {() => void} props.onBack
 * @param {any} [props.theme]
 */
export default function StepCustomerInfo({
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  agency,
  service,
  prestation,
  timeslotText,
  isSubmitting,
  onSubmit,
  onBack,
  theme,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in-50 duration-200">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          5. Renseignez vos coordonnées
        </label>
      </div>

      {/* Saisie Nom et Prénoms */}
      <div>
        <label htmlFor="full-name-input" className="block text-xs font-bold text-slate-700 mb-1">
          Nom et Prénoms <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="full-name-input"
            type="text"
            required
            placeholder="ex: Yao Koffi Jean"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full pl-11 pr-4 min-h-[50px] bg-slate-50 border border-slate-200 focus:border-[#008056] rounded-2xl text-base sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#008056]/20 shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* Saisie Téléphone */}
      <div>
        <label htmlFor="phone-number-input" className="block text-xs font-bold text-slate-700 mb-1">
          Numéro de Téléphone (réception du SMS & lien de file) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="phone-number-input"
            type="tel"
            required
            placeholder="07 00 00 00 00"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full pl-11 pr-4 min-h-[50px] bg-slate-50 border border-slate-200 focus:border-[#008056] rounded-2xl text-base sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#008056]/20 shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* Saisie Email */}
      <div>
        <label htmlFor="email-input" className="block text-xs font-bold text-slate-700 mb-1">
          Adresse E-mail <span className="text-slate-400 font-normal">(optionnel — pour reçu PDF)</span>
        </label>
        <div className="relative">
          <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="email-input"
            type="email"
            placeholder="jean.koffi@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 min-h-[50px] bg-slate-50 border border-slate-200 focus:border-[#008056] rounded-2xl text-base sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#008056]/20 shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* Carte Récapitulative du Rendez-Vous */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
        <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
          Récapitulatif de votre rendez-vous :
        </span>
        <div className="grid grid-cols-2 gap-2 text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px]">Agence :</span>
            <strong className="text-slate-900 truncate block">{agency?.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Service :</span>
            <strong className="text-slate-900 truncate block">{service?.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Prestation :</span>
            <strong className="text-slate-900 truncate block">{prestation?.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Créneau :</span>
            <strong className="text-[#008056] truncate block">{timeslotText}</strong>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          size="lg"
          variant="secondary"
          iconStart={ArrowLeft}
          onClick={onBack}
          disabled={isSubmitting}
          className="min-h-[52px] font-bold text-sm sm:text-base cursor-pointer px-4 sm:px-6"
        >
          Retour
        </Button>
        <Button
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isSubmitting}
          primaryColor={theme?.colors?.primary || '#008056'}
          iconStart={Ticket}
          className="flex-1 min-h-[52px] font-bold text-sm sm:text-base cursor-pointer"
        >
          {isSubmitting ? 'Génération en cours...' : 'Valider et Obtenir le Ticket'}
        </Button>
      </div>

      <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#008056]" />
        Votre ticket officiel S2Q sera généré immédiatement et sécurisé par QR Code.
      </p>
    </form>
  );
}

