import { AlertCircle, Clock, X } from 'lucide-react';

/**
 * Composant Bandeau de Feedback & Erreur (La « Zone Bleue » de la maquette)
 * 
 * - Mode normal : Dégradé menthe délicat, libellé "Currently Selected:" et valeur
 * - Mode erreur : Alerte rose/rouge avec icône d'avertissement et message clair
 * 
 * @param {Object} props
 * @param {string|null} [props.errorMessage]
 * @param {() => void} [props.onClearError]
 * @param {string|React.ReactNode} [props.summary]
 * @param {string} [props.summaryTitle='Currently Selected:']
 * @param {any} [props.summaryIcon]
 * @param {string} [props.className='']
 */
export default function TicketFeedbackBanner({
  errorMessage = null,
  onClearError,
  summary = null,
  summaryTitle = 'Currently Selected:',
  summaryIcon: SummaryIcon = Clock,
  className = '',
}) {
  // Cas 1 : Alerte d'erreur bloquante
  if (errorMessage) {
    return (
      <div
        className={`w-full rounded-xl p-3 bg-rose-50/90 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-2.5 shadow-2xs animate-in fade-in-50 duration-200 ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-2 flex-1">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <span className="font-bold block text-rose-900 text-[10px] uppercase tracking-wider">Attention :</span>
            <p className="text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>

        {onClearError && (
          <button
            type="button"
            onClick={onClearError}
            className="p-1 rounded-md text-rose-400 hover:text-rose-700 hover:bg-rose-100/60 transition-colors cursor-pointer shrink-0"
            aria-label="Fermer l'alerte"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // Cas 2 : Récapitulatif sélection active (exactement conforme à la maquette)
  if (summary) {
    return (
      <div
        className={`w-full rounded-xl p-2.5 sm:p-3 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-emerald-50/30 border border-emerald-200/60 text-slate-800 text-xs flex flex-col justify-center shadow-2xs animate-in fade-in-50 duration-200 ${className}`}
      >
        <span className="text-[10px] font-medium text-slate-500 tracking-tight">
          {summaryTitle}
        </span>
        <div className="flex items-center gap-2 mt-0.5 text-slate-900 font-bold">
          <SummaryIcon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
          <span className="truncate">{summary}</span>
        </div>
      </div>
    );
  }

  return null;
}
