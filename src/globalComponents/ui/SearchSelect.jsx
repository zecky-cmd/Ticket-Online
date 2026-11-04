import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, ChevronLeft, Check, X } from 'lucide-react';

/**
 * SearchSelect — Dropdown custom avec recherche intégrée
 *
 * Comportement :
 * - Desktop : fermé, le trigger affiche la valeur ou le placeholder ;
 *   ouvert, il se transforme en champ de recherche inline, la liste
 *   s'ouvre en dessous.
 * - Mobile  : à l'ouverture, la recherche passe en overlay plein écran
 *   (pattern Airbnb / Google Maps) via portail React — la liste reste
 *   pleinement exploitable au-dessus du clavier virtuel.
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

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  // Détection mobile : overlay plein écran au lieu du dropdown inline
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches
  );

  const containerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const listRef = useRef(/** @type {HTMLUListElement|null} */ (null));

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

  // Suivi du breakpoint mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const handler = (/** @type {MediaQueryListEvent} */ e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

  // Fermer au clic extérieur (inactif en overlay mobile : retour/annuler gèrent)
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const handler = (/** @type {MouseEvent} */ e) => {
      if (containerRef.current && !containerRef.current.contains(/** @type {Node} */ (e.target))) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, isMobile, close]);

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

  const handleInputChange = (/** @type {string} */ val) => {
    setQuery(val);
    setHighlighted(0);
  };

  // ── Rendu de la liste des options (commune desktop / mobile) ────────────
  const renderOptions = (/** @type {boolean} */ inOverlay) => (
    <ul
      ref={listRef}
      role="listbox"
      aria-label={label || 'Options'}
      className={
        inOverlay
          ? 'flex-1 overflow-y-auto overscroll-contain py-1 bg-white'
          : 'max-h-52 overflow-y-auto overscroll-contain py-1'
      }
    >
      {filtered.length === 0 ? (
        <li className="px-4 py-3 text-sm text-slate-400 text-center select-none">
          Aucun résultat{query ? ` pour « ${query} »` : ''}
        </li>
      ) : (
        filtered.map((opt, idx) => {
          const optLabel = getLabel(opt);
          const isSelected = opt[valueKey] === value;
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
                ${isSelected ? 'font-semibold' : 'font-normal'}
              `}
            >
              <span className="flex-1 truncate">{optLabel}</span>
              {isSelected && <Check className="w-4 h-4 text-primary-500 shrink-0" />}
            </li>
          );
        })
      )}
    </ul>
  );

  // ── Overlay mobile plein écran (via portail React) ──────────────────────
  const mobileOverlay = isOpen && isMobile
    ? createPortal(
        <div className="fixed inset-x-0 top-0 h-[100dvh] z-[90] bg-slate-50 flex flex-col">
          {/* Barre de recherche */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-200 bg-white shrink-0">
            <button
              type="button"
              onClick={close}
              className="p-2 -ml-1 rounded-full hover:bg-slate-100 text-slate-600 shrink-0 cursor-pointer"
              aria-label="Fermer la recherche"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 flex items-center gap-2 px-3 min-h-[44px] bg-slate-100 rounded-xl border border-transparent focus-within:border-primary-500 focus-within:bg-white transition-colors">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                id={`${inputId}-overlay`}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                aria-haspopup="listbox"
                aria-expanded={true}
                className="flex-1 min-w-0 text-base font-medium text-slate-800 placeholder:text-slate-400 bg-transparent outline-hidden appearance-none border-0 shadow-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('');
                    inputRef.current?.focus();
                  }}
                  className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
                  aria-label="Effacer la recherche"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={close}
              className="text-sm font-semibold text-primary-500 px-1 shrink-0 cursor-pointer"
            >
              Annuler
            </button>
          </div>

          {/* Titre du contexte */}
          {label && (
            <p className="px-4 pt-2.5 pb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              {label}
            </p>
          )}

          {renderOptions(true)}
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {mobileOverlay}

      {/* Label optionnel */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
        >
          {label}
        </label>
      )}

      {/* ── Zone trigger / recherche inline (desktop) ─────────────────────── */}
      <div
        className={`
          flex items-center gap-2 px-4 min-h-[52px] w-full
          bg-white border rounded-xl transition-all duration-150
          ${isOpen && !isMobile
            ? 'border-primary-500 ring-2 ring-primary-500/15 shadow-sm'
            : 'border-slate-200 hover:border-slate-300 shadow-xs'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Icône loupe visible uniquement quand ouvert (desktop) */}
        {isOpen && !isMobile && <Search className="w-4 h-4 text-primary-500 shrink-0" />}

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
            className="flex-1 text-left text-sm font-medium truncate bg-transparent outline-hidden cursor-pointer"
          >
            {selectedOption
              ? <span className="text-slate-800">{getLabel(selectedOption)}</span>
              : <span className="text-slate-400">{placeholder}</span>}
          </button>
        )}

        {/* ── OUVERT (desktop) : champ de recherche inline ── */}
        {isOpen && !isMobile && (
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label="Rechercher"
            aria-haspopup="listbox"
            aria-expanded={true}
            className="flex-1 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent outline-hidden appearance-none border-0 shadow-none"
          />
        )}

        {/* ── OUVERT (mobile) : affichage statique, la saisie est dans l'overlay ── */}
        {isOpen && isMobile && (
          <button
            type="button"
            onClick={close}
            aria-haspopup="listbox"
            aria-expanded={true}
            className="flex-1 text-left text-sm font-medium truncate bg-transparent outline-hidden cursor-pointer"
          >
            {selectedOption
              ? <span className="text-slate-800">{getLabel(selectedOption)}</span>
              : <span className="text-slate-400">{placeholder}</span>}
          </button>
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

        {/* Effacer la recherche (desktop, ouvert et query non vide) */}
        {isOpen && !isMobile && query && (
          <button
            type="button"
            onClick={() => { handleInputChange(''); inputRef.current?.focus(); }}
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
            className={`w-4 h-4 transition-transform duration-200 ${isOpen && !isMobile ? 'rotate-180 text-primary-500' : ''}`}
          />
        </button>
      </div>

      {/* ── Liste des options (dropdown desktop) ──────────────────────────── */}
      {isOpen && !isMobile && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {renderOptions(false)}
        </div>
      )}
    </div>
  );
}
