import { Check, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

/**
 * Composant Stepper Vertical Collapsible — Fidèle à la maquette
 * 
 * - Étape validée : cercle fin contour vert menthe avec fine coche Check (non plein !)
 * - Étape active : cercle plein couleur primaire avec numéro blanc
 * - Étape future : cercle neutre avec bordure fine et numéro gris clair
 * - Ligne connectrice continue verte/grise
 * 
 * @param {Object} props
 * @param {Array<{ id: string|number, label: string }>} props.steps - Liste dynamique des étapes
 * @param {string|number} props.activeStepId - Identifiant de l'étape active
 * @param {(stepId: string|number) => void} [props.onStepClick] - Clic sur une étape précédente
 * @param {boolean} [props.isCollapsed=false] - Sidebar réduite ou étendue
 * @param {() => void} [props.onToggleCollapse] - Callback pour réduire/déplier
 * @param {string} [props.primaryColor='#008056']
 * @param {string} [props.className='']
 */
export default function TicketSidebarStepper({
  steps = [],
  activeStepId,
  onStepClick,
  isCollapsed = false,
  onToggleCollapse,
  primaryColor = '#008056',
  className = '',
}) {
  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => String(s.id) === String(activeStepId))
  );

  return (
    <>
      {/* ── VERSION MOBILE (< md) : BANDEAU COMPACT HORIZONTAL ── */}
      <div className="md:hidden w-full bg-slate-50 border-b border-slate-100 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {activeIndex + 1}
            </span>
            <span className="font-bold text-slate-800 truncate">
              {steps[activeIndex]?.label || 'Étape en cours'}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 shrink-0">
            {activeIndex + 1} / {steps.length}
          </span>
        </div>

        <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((activeIndex + 1) / Math.max(steps.length, 1)) * 100}%`,
              backgroundColor: primaryColor,
            }}
          />
        </div>
      </div>

      {/* ── VERSION DESKTOP (md+) : SIDEBAR VERTICALE COLLAPSIBLE CONFORME À LA MAQUETTE ── */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 bg-[#fbfdfc] border-r border-slate-100/80 transition-all duration-300 ease-in-out relative select-none ${
          isCollapsed ? 'w-20 px-3 py-7 items-center' : 'w-64 lg:w-72 p-7'
        } ${className}`}
        aria-label="Progression du parcours"
      >
        {/* En-tête : Logo stylé + Bouton rétracter */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full gap-2`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 truncate">
              {/* Logo géométrique stylé façon maquette */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              </div>
              <div className="truncate">
                <p className="font-black text-base tracking-tight text-slate-900 truncate">S2Q Pass</p>
              </div>
            </div>
          )}

          {/* Bouton de Toggle Réduire / Déplier */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer shrink-0"
              title={isCollapsed ? 'Déplier' : 'Réduire'}
              aria-label={isCollapsed ? 'Déplier la barre latérale' : 'Réduire la barre latérale'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Corps : Stepper vertical avec ligne continue */}
        <div className="my-auto py-4 w-full">
          <nav className="flex flex-col gap-7 relative" aria-label="Étapes">
            {steps.map((step, index) => {
              const isCompleted = index < activeIndex;
              const isActive = index === activeIndex;
              const isFuture = index > activeIndex;
              const isClickable = isCompleted && Boolean(onStepClick);
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="relative flex items-center">
                  {/* Ligne connectrice verticale */}
                  {!isLast && (
                    <div
                      className={`absolute left-4 top-8 -bottom-7 w-[2px] -translate-x-1/2 transition-colors duration-300 pointer-events-none ${
                        isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Élément d'étape */}
                  <div
                    onClick={() => isClickable && onStepClick?.(step.id)}
                    className={`flex items-center gap-4 w-full text-left transition-all ${
                      isClickable ? 'cursor-pointer group' : isActive ? 'cursor-default' : 'cursor-not-allowed opacity-60'
                    }`}
                    title={step.label}
                  >
                    {/* Indicateur circulaire (Pastille) */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-200 ${
                        isCompleted
                          ? 'bg-emerald-50/70 border border-emerald-400 text-emerald-600 shadow-2xs group-hover:bg-emerald-100'
                          : isActive
                          ? 'text-white shadow-md ring-4 ring-emerald-500/15'
                          : 'bg-white border border-slate-300 text-slate-400'
                      }`}
                      style={{
                        backgroundColor: isActive ? primaryColor : undefined,
                      }}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Libellé pur et sobre façon maquette */}
                    {!isCollapsed && (
                      <p
                        className={`text-sm tracking-tight truncate transition-colors ${
                          isActive
                            ? 'font-extrabold text-slate-900'
                            : isCompleted
                            ? 'font-medium text-slate-700 group-hover:text-slate-900'
                            : 'font-normal text-slate-400'
                        }`}
                      >
                        {step.label}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Pied de sidebar : Besoin d'aide discret */}
        <div className={`w-full pt-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div
            className={`flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs select-none cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Besoin d'aide avec la réservation ?"
          >
            <HelpCircle className="w-4 h-4 shrink-0 stroke-[1.8]" />
            {!isCollapsed && (
              <span className="text-[11px] font-medium truncate">Besoin d'aide ?</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
