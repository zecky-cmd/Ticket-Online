import { User, Phone, Mail, CreditCard, Ticket, ArrowLeft, CheckCircle2, Check, Sparkles } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Étape 5 : Vos infos personnelles et récapitulatif avant génération du ticket
 * Intègre la question client/nouveau client et le numéro de compte conditionnel (nplan.md)
 * 
 * @param {Object} props
 * @param {string} props.lastName
 * @param {(name: string) => void} props.setLastName
 * @param {string} props.firstName
 * @param {(name: string) => void} props.setFirstName
 * @param {string} props.phoneNumber
 * @param {(phone: string) => void} props.setPhoneNumber
 * @param {string} props.email
 * @param {(email: string) => void} props.setEmail
 * @param {boolean} props.isClient
 * @param {(isClient: boolean) => void} props.setIsClient
 * @param {string} props.accountNumber
 * @param {(acc: string) => void} props.setAccountNumber
 * @param {any} props.agency
 * @param {any} props.service
 * @param {any} props.prestation
 * @param {any} [props.gestionnaire]
 * @param {string} props.timeslotText
 * @param {boolean} props.isSubmitting
 * @param {(e: any) => void} props.onSubmit
 * @param {() => void} props.onBack
 * @param {any} [props.theme]
 */
export default function StepCustomerInfo({
  lastName,
  setLastName,
  firstName,
  setFirstName,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  isClient,
  setIsClient,
  accountNumber,
  setAccountNumber,
  agency,
  service,
  prestation,
  gestionnaire,
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

      {/* ─── Question Statut Client : Êtes-vous client de la banque ? ─── */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
        <label className="block text-xs font-extrabold text-slate-800">
          Êtes-vous déjà client de la banque ? <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsClient(true)}
            className={`min-h-[46px] px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isClient
                ? 'bg-primary-500 border-primary-500 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
            }`}
          >
            {isClient && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>Oui, je suis client</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsClient(false);
              setAccountNumber('');
            }}
            className={`min-h-[46px] px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              !isClient
                ? 'bg-primary-500 border-primary-500 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
            }`}
          >
            {!isClient && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>Non, 1ère visite</span>
          </button>
        </div>

        {/* Champ conditionnel : Numéro de compte bancaire si Oui */}
        {isClient ? (
          <div className="pt-2 animate-in fade-in-50 duration-150">
            <label htmlFor="account-number-input" className="block text-xs font-bold text-slate-700 mb-1">
              Numéro de compte bancaire <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="account-number-input"
                type="text"
                required={isClient}
                placeholder="ex: CI092 01001 001234567890 12"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full pl-10 pr-4 min-h-[46px] bg-white border border-slate-200 focus:border-primary-500 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs font-medium"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 pl-1">
              Permet au conseiller de préparer votre dossier avant votre arrivée.
            </p>
          </div>
        ) : (
          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-primary-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Bienvenue ! Vos démarches d'ouverture et d'orientation seront facilitées.</span>
          </div>
        )}
      </div>

      {/* Saisie Nom et Prénoms (deux champs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="last-name-input" className="block text-xs font-bold text-slate-700 mb-1">
            Nom de famille <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="last-name-input"
              type="text"
              required
              placeholder="ex: Yao"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full pl-10 pr-3 min-h-[48px] bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs font-medium"
            />
          </div>
        </div>

        <div>
          <label htmlFor="first-name-input" className="block text-xs font-bold text-slate-700 mb-1">
            Prénoms <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="first-name-input"
              type="text"
              required
              placeholder="ex: Koffi Jean"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full pl-10 pr-3 min-h-[48px] bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Saisie Téléphone */}
      <div>
        <label htmlFor="phone-number-input" className="block text-xs font-bold text-slate-700 mb-1">
          Numéro de Téléphone (réception du SMS & lien de file) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="phone-number-input"
            type="tel"
            required
            placeholder="07 00 00 00 00"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full pl-10 pr-4 min-h-[48px] bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* Saisie Email */}
      <div>
        <label htmlFor="email-input" className="block text-xs font-bold text-slate-700 mb-1">
          Adresse E-mail <span className="text-slate-400 font-normal">(optionnel — pour reçu PDF)</span>
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="email-input"
            type="email"
            placeholder="jean.yao@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 min-h-[48px] bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs font-medium"
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
            <strong className="text-primary-500 truncate block">{timeslotText}</strong>
          </div>
          {gestionnaire && (
            <div className="col-span-2 pt-1 border-t border-slate-200/50">
              <span className="text-slate-400 block text-[10px]">Conseiller / Gestionnaire :</span>
              <strong className="text-slate-900 truncate block">
                {gestionnaire?.isAuto ? 'Premier disponible (Attribution auto)' : `${gestionnaire?.name} (${gestionnaire?.role})`}
              </strong>
            </div>
          )}
          {isClient && accountNumber && (
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10px]">Compte client :</span>
              <strong className="text-slate-900 truncate block font-mono">{accountNumber}</strong>
            </div>
          )}
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
          className="min-h-[50px] font-bold text-sm sm:text-base cursor-pointer px-4 sm:px-6"
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
          className="flex-1 min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
        >
          {isSubmitting ? 'Génération en cours...' : 'Valider et Obtenir le Ticket'}
        </Button>
      </div>

      <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-primary-500" />
        Votre ticket officiel S2Q sera généré immédiatement et sécurisé par QR Code.
      </p>
    </form>
  );
}
