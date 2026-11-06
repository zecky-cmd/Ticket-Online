import { User, Phone, Mail, ArrowLeft, Send, SkipForward } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Étape Coordonnées — champs optionnels (nom, prénoms, téléphone, email)
 * + « Valider mon avis » (envoi final avec coordonnées) ou « Passer et terminer »
 */
export default function SatisfactionStepClientInfo({
  clientInfo,
  setClientInfo,
  isSubmitting,
  onFinish,
  onBack,
  theme,
}) {
  const update = (/** @type {string} */ key) => (/** @type {React.ChangeEvent<HTMLInputElement>} */ e) => {
    setClientInfo((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const inputClass =
    'w-full pl-10 pr-3 min-h-[48px] bg-white border border-slate-200 focus:border-primary-500 rounded-xl text-base sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs font-medium';

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Vos coordonnées{' '}
          <span className="text-slate-400 font-normal normal-case">(optionnel — pour être recontacté)</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="sat-nom" className="block text-xs font-bold text-slate-700 mb-1">
              Nom
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="sat-nom"
                type="text"
                placeholder="Ex: Bamba"
                value={clientInfo.nom}
                onChange={update('nom')}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="sat-prenoms" className="block text-xs font-bold text-slate-700 mb-1">
              Prénoms
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="sat-prenoms"
                type="text"
                placeholder="Ex: Ali"
                value={clientInfo.prenoms}
                onChange={update('prenoms')}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="sat-tel" className="block text-xs font-bold text-slate-700 mb-1">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="sat-tel"
                type="tel"
                placeholder="Ex: 0101010101"
                value={clientInfo.tel}
                onChange={update('tel')}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="sat-email" className="block text-xs font-bold text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="sat-email"
                type="email"
                placeholder="Ex: alibamba@exemple.com"
                value={clientInfo.email}
                onChange={update('email')}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1 flex-wrap sm:flex-nowrap">
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

        <div className="flex items-center gap-2 ml-auto">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            iconStart={SkipForward}
            onClick={() => onFinish(false)}
            disabled={isSubmitting}
            className="min-h-[50px] font-bold text-sm sm:text-base cursor-pointer px-4"
          >
            Passer et terminer
          </Button>
          <Button
            type="button"
            size="lg"
            variant="primary"
            primaryColor={theme?.colors?.primary || '#008056'}
            iconStart={Send}
            isLoading={isSubmitting}
            onClick={() => onFinish(true)}
            className="min-h-[50px] font-bold text-sm sm:text-base cursor-pointer px-5"
          >
            {isSubmitting ? 'Validation…' : 'Valider mon avis'}
          </Button>
        </div>
      </div>
    </div>
  );
}
