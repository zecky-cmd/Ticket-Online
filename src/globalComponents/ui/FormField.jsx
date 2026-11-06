/**
 * Champ de formulaire standard — label + icône optionnelle + input.
 *
 * Centralise le pattern « label / icône / input » répété dans les formulaires
 * du projet (ticket, satisfaction…).
 *
 * Le style visuel (fond, hauteur minimale, padding droit) se règle via
 * `className`, qui REMPLACE le défaut « pr-3 min-h-[48px] bg-slate-50 »
 * (sémantique de paramètre par défaut → aucun conflit de classes Tailwind).
 *
 * @param {string} id
 * @param {string} [label]
 * @param {any} [icon] - Icône lucide affichée à gauche du champ
 * @param {string} [hint] - Mention discrète à côté du label (ex: "(optionnel)")
 * @param {boolean} [required=false]
 * @param {string} [type='text']
 * @param {string} [placeholder]
 * @param {any} value
 * @param {(e: any) => void} onChange
 * @param {number} [maxLength]
 * @param {string} [autoComplete]
 * @param {string} [inputMode]
 * @param {string} [min] - Valeur minimale (champs date)
 * @param {string} [className] - Style visuel de l'input (remplace le défaut)
 * @param {string} [labelClassName]
 */
const DEFAULT_FIELD_CLASS = 'pr-3 min-h-[48px] bg-slate-50';

export default function FormField({
  id,
  label,
  icon: Icon,
  hint,
  required = false,
  type = 'text',
  placeholder,
  value,
  onChange,
  maxLength,
  autoComplete,
  inputMode,
  min,
  className = DEFAULT_FIELD_CLASS,
  labelClassName = '',
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={`block text-xs font-bold text-slate-700 mb-1 ${labelClassName}`}>
          {label} {required && <span className="text-rose-500">*</span>}
          {hint && <span className="text-slate-400 font-normal"> {hint}</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        )}
        <input
          id={id}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          min={min}
          className={`w-full ${Icon ? 'pl-10' : 'px-3'} ${className} border border-slate-200 focus:border-primary-500 rounded-xl text-base sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs font-medium`}
        />
      </div>
    </div>
  );
}
