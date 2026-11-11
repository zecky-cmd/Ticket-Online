import { User, Phone, Mail, CreditCard, Ticket, ArrowLeft, CheckCircle2, Check, Sparkles } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import FormField from '../../../globalComponents/ui/FormField';

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
  isSubmitting,
  onSubmit,
  onBack,
  theme,
  hideActions = false,
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
            <FormField
              id="account-number-input"
              label="Numéro de compte bancaire"
              required={isClient}
              icon={CreditCard}
              placeholder="ex: CI092 01001 001234567890 12"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="pr-4 min-h-[46px] bg-white"
            />
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
        <FormField
          id="last-name-input"
          label="Nom de famille"
          required
          icon={User}
          placeholder="ex: Yao"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <FormField
          id="first-name-input"
          label="Prénoms"
          required
          icon={User}
          placeholder="ex: Koffi Jean"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      {/* Saisie Téléphone + Email (2 colonnes sur desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          id="phone-number-input"
          label="Téléphone (réception SMS)"
          required
          icon={Phone}
          type="tel"
          placeholder="07 00 00 00 00"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="pr-4 min-h-[48px] bg-slate-50"
        />

        <FormField
          id="email-input"
          label="Adresse E-mail"
          hint="(optionnel)"
          icon={Mail}
          type="email"
          placeholder="jean.yao@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pr-4 min-h-[48px] bg-slate-50"
        />
      </div>

      {/* Carte Récapitulative du Rendez-Vous */}


      {/* Actions */}
      {!hideActions && (
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
      )}

      <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-primary-500" />
        Votre ticket officiel S2Q sera généré immédiatement et sécurisé par QR Code.
      </p>
    </form>
  );
}
