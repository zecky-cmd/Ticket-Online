import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

/**
 * SearchSelect — Dropdown custom avec recherche intégrée inline
 *
 * Comportement :
 * - Fermé  : affiche le texte sélectionné (ou placeholder) + chevron
 * - Ouvert : le trigger SE TRANSFORME en champ de recherche sur place,
 *            la liste des options apparaît en dessous (pas de décalage)
 *
 * @param {Object}   props
 * @param {string}   [props.id]
 * @param {string}   [props.label]
 * @param {string}   [props.placeholder]         Placeholder du trigger ET de la recherche
 * @param {any[]}    props.options
 * @param {string}   [props.valueKey='id']
 * @param {string}   [props.labelKey='name']
 * @param {(opt: any) => string} [props.renderLabel]
 * @param {any}      props.value
 * @param {(val: any) => void} props.onChange
 * @param {string}   [props.className]
 * @param {boolean}  [props.disabled]
 */
export default function SearchSelect({
  id: idProp,
  label,
  placeholder = 'Sélectionner…',
  options = [],
  valueKey = 'id',
  labelKey = 'name',
  renderLabel,
  value,
  onChange,
  className = '',
  disabled = false,
}) {
  const autoId = useId();
  const inputId = idProp || autoId;

  const [isOpen, setIsOpen]           = useState(false);
  const [query, setQuery]             = useState('');
  const [highlighted, setHighlighted] = useState(0);

  const containerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const inputRef     = useRef(/** @type {HTMLInputElement|null} */ (null));
  const listRef      = useRef(/** @type {HTMLUListElement|null} */ (null));

  const selectedOption = options.find((o) => o[valueKey] === value) || null;

  const getLabel = (/** @type {any} */ opt) =>
    renderLabel ? renderLabel(opt) : String(opt[labelKey] ?? '');

  const filtered = query.trim()
    ? options.filter((o) => getLabel(o).toLowerCase().includes(query.toLowerCase()))
    : options;

  // ── Ouvrir ──────────────────────────────────────────────────────────────
  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setQuery('');
    setHighlighted(0);
  }, [disabled]);

  // ── Fermer ──────────────────────────────────────────────────────────────
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  // ── Sélectionner ────────────────────────────────────────────────────────
  const select = useCallback((/** @type {any} */ opt) => {
    onChange(opt[valueKey]);
    close();
  }, [onChange, valueKey, close]);

  // Focus auto sur l'input quand on ouvre
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Scroll auto de l'item surligné
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-option]');
    items[highlighted]?.scrollIntoView({ block: 'nearest' });
  }, [highlighted, isOpen]);

  // Fermer au clic extérieur
  useEffect(() => {
    if (!isOpen) return;
    const handler = (/** @type {MouseEvent} */ e) => {
      if (containerRef.current && !containerRef.current.contains(/** @type {Node} */ (e.target))) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  // Navigation clavier
  const onKeyDown = (/** @type {React.KeyboardEvent} */ e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        open();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[highlighted]) select(filtered[highlighted]);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>

      {/* Label optionnel */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
        >
          {label}
        </label>
      )}

      {/* ── Zone trigger / recherche inline ─────────────────────────────── */}
      <div
        className={`
          flex items-center gap-2 px-4 min-h-[52px] w-full
          bg-white border rounded-xl transition-all duration-150
          ${isOpen
            ? 'border-primary-500 ring-2 ring-primary-500/15 shadow-sm'
            : 'border-slate-200 hover:border-slate-300 shadow-xs'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Icône loupe visible uniquement quand ouvert */}
        {isOpen && <Search className="w-4 h-4 text-primary-500 shrink-0" />}

        {/* ── FERMÉ : bouton placeholder/valeur ── */}
        {!isOpen && (
          <button
            id={inputId}
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={false}
            onClick={open}
            onKeyDown={onKeyDown}
            className="flex-1 text-left text-sm font-medium truncate bg-transparent outline-none cursor-pointer"
          >
            {selectedOption
              ? <span className="text-slate-800">{getLabel(selectedOption)}</span>
              : <span className="text-slate-400">{placeholder}</span>
            }
          </button>
        )}

        {/* ── OUVERT : champ de recherche inline ── */}
        {isOpen && (
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label="Rechercher"
            aria-haspopup="listbox"
            aria-expanded={true}
            className="flex-1 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
          />
        )}

        {/* Effacer (seulement si valeur sélectionnée et fermé) */}
        {!isOpen && selectedOption && !disabled && (
          <button
            type="button"
            aria-label="Effacer la sélection"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Effacer la recherche (quand ouvert et query non vide) */}
        {isOpen && query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setHighlighted(0); inputRef.current?.focus(); }}
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Chevron — ferme/ouvre au clic */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => (isOpen ? close() : open())}
          className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
          aria-label={isOpen ? 'Fermer' : 'Ouvrir'}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-500' : ''}`}
          />
        </button>
      </div>

      {/* ── Liste des options (dropdown) ────────────────────────────────── */}
      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 slide-in-from-top-1 duration-150">
          <ul
            ref={listRef}
            role="listbox"
            aria-label={label || 'Options'}
            className="max-h-52 overflow-y-auto overscroll-contain py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-400 text-center select-none">
                Aucun résultat{query ? ` pour « ${query} »` : ''}
              </li>
            ) : (
              filtered.map((opt, idx) => {
                const optLabel    = getLabel(opt);
                const isSelected  = opt[valueKey] === value;
                const isHighlight = idx === highlighted;

                return (
                  <li
                    key={opt[valueKey]}
                    role="option"
                    data-option
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlighted(idx)}
                    onClick={() => select(opt)}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer select-none transition-colors
                      ${isHighlight ? 'bg-primary-500/8 text-primary-500' : 'text-slate-700 hover:bg-slate-50'}
                      ${isSelected  ? 'font-semibold' : 'font-normal'}
                    `}
                  >
                    <span className="flex-1 truncate">{optLabel}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary-500 shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
