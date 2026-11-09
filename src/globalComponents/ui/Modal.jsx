/**
 * Modal universelle — Bottom Sheet sur mobile / modale centrée sur desktop.
 *
 * Shell unique pour toutes les modales du projet (Ticket, Satisfaction, Agences…).
 * L'ouverture/fermeture reste gérée par l'appelant (ex: activeModal Redux).
 *
 * @param {boolean} [isOpen=false]
 * @param {boolean} [isClosing=false] - Fermeture en cours (animation de sortie)
 * @param {() => void} [onClose]
 * @param {'md'|'lg'|'xl'} [size='md'] - Gabarit de largeur/hauteur
 * @param {string} [maxWidth] - Surcharge des classes de largeur max
 * @param {string} [height] - Surcharge des classes de hauteur
 * @param {boolean} [showDragHandle=true] - Poignée tactile mobile
 * @param {boolean} [closeOnBackdrop=false] - Fermer au clic sur l'overlay
 * @param {string} [className] - Classes additionnelles du conteneur
 */
const SIZES = {
  md: { maxWidth: 'sm:max-w-xl', height: 'max-h-[94dvh] sm:max-h-[90vh]' },
  lg: {
    maxWidth: 'sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
    height: 'max-h-[94dvh] sm:max-h-[90vh] md:min-h-[520px]',
  },
  xl: { maxWidth: 'md:max-w-4xl', height: 'h-[94dvh] md:h-[88vh]' },
};

export default function Modal({
  isOpen = false,
  isClosing = false,
  onClose,
  children,
  size = 'md',
  maxWidth,
  height,
  showDragHandle = true,
  closeOnBackdrop = false,
  className = '',
}) {
  if (!isOpen) return null;

  const preset = SIZES[size] || SIZES.md;
  const maxW = maxWidth || preset.maxWidth;
  const h = height || preset.height;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all ${
        isClosing ? 'animate-out fade-out-0 duration-200 fill-mode-forwards' : ''
      }`}
      onClick={closeOnBackdrop && onClose ? onClose : undefined}
    >
      <div
        className={`relative bg-white w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl ${maxW} ${h} flex flex-col overflow-hidden border-t sm:border border-slate-100 ${
          isClosing
            ? 'animate-out fade-out-0 slide-out-to-bottom-4 sm:zoom-out-95 duration-200 fill-mode-forwards'
            : 'animate-in fade-in-0 slide-in-from-bottom duration-300 sm:zoom-in-95'
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showDragHandle && (
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />
        )}
        {children}
      </div>
    </div>
  );
}
