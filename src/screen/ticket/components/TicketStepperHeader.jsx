import { X } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Agence' },
  { id: 2, label: 'Service' },
  { id: 3, label: 'Prestation' },
  { id: 4, label: 'Créneau' },
  { id: 5, label: 'Vos infos' },
];

/**
 * En-tête Stepper pour la prise de ticket
 * 
 * @param {Object} props
 * @param {number} props.currentStep
 * @param {(stepId: number) => void} props.onStepClick
 * @param {() => void} props.onClose
 */
export default function TicketStepperHeader({ currentStep, onStepClick, onClose }) {
  return (
    <div className="px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-slate-100 bg-white shrink-0">
      {/* Ligne haute : Eyebrow + Bouton Fermer */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#008056]/90">
            Votre rendez-vous en quelques étapes
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#008056] tracking-tight mt-1">
            Prendre un ticket
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Un parcours simple pour préparer votre visite en agence.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer -mr-1"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Stepper horizontal : 5 barres au-dessus des labels */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-5 pt-1">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = isCompleted; // On peut revenir aux étapes déjà validées

          return (
            <div
              key={step.id}
              onClick={() => isClickable && onStepClick?.(step.id)}
              className={`flex flex-col gap-1.5 select-none transition-colors ${
                isClickable ? 'cursor-pointer group' : 'cursor-default'
              }`}
            >
              {/* Barre horizontale de progression */}
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#008056]'
                    : isCompleted
                    ? 'bg-[#008056]/70 group-hover:bg-[#008056]'
                    : 'bg-slate-200'
                }`}
              />

              {/* Libellé de l'étape */}
              <span
                className={`text-[11px] sm:text-xs truncate font-bold transition-colors ${
                  isActive
                    ? 'text-[#008056]'
                    : isCompleted
                    ? 'text-slate-700 group-hover:text-[#008056]'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

