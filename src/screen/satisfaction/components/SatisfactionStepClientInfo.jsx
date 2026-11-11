import { User, Phone, Mail, ArrowLeft, Send, SkipForward } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import FormField from '../../../globalComponents/ui/FormField';

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
  hideActions = false,
}) {
  const update = (/** @type {string} */ key) => (/** @type {React.ChangeEvent<HTMLInputElement>} */ e) => {
    setClientInfo((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const fieldClass = 'pr-3 min-h-[48px] bg-white';

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Vos coordonnées{' '}
          <span className="text-slate-400 font-normal normal-case">(optionnel — pour être recontacté)</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            id="sat-nom"
            label="Nom"
            icon={User}
            placeholder="Ex: Bamba"
            value={clientInfo.nom}
            onChange={update('nom')}
            className={fieldClass}
          />

          <FormField
            id="sat-prenoms"
            label="Prénoms"
            icon={User}
            placeholder="Ex: Ali"
            value={clientInfo.prenoms}
            onChange={update('prenoms')}
            className={fieldClass}
          />

          <FormField
            id="sat-tel"
            label="Téléphone"
            icon={Phone}
            type="tel"
            placeholder="Ex: 0101010101"
            value={clientInfo.tel}
            onChange={update('tel')}
            className={fieldClass}
          />

          <FormField
            id="sat-email"
            label="Email"
            icon={Mail}
            type="email"
            placeholder="Ex: alibamba@exemple.com"
            value={clientInfo.email}
            onChange={update('email')}
            className={fieldClass}
          />
        </div>
      </div>

      {/* Actions */}
      {!hideActions && (
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
      )}
    </div>
  );
}
