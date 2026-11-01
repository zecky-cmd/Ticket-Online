/**
 * Composant Section Universel & Paramétrable
 * 
 * @param {string|React.ReactNode} tag - Sur-titre / badge optionnel (ex: 'Services Disponibles')
 * @param {string} badgeBg - Couleur de fond du badge
 * @param {string} badgeColor - Couleur du texte du badge
 * @param {string|React.ReactNode} title - Titre principal de la section
 * @param {string|React.ReactNode} subtitle - Sous-titre ou description
 * @param {'center'|'left'|'right'} align - Alignement de l'en-tête ('center', 'left', 'right')
 * @param {'dark'|'light'|'transparent'} background - Thème de fond de la section
 * @param {string} maxWidth - Conteneur max-width ('max-w-7xl', 'max-w-6xl', etc.)
 * @param {string} className - Classes CSS additionnelles
 * @param {React.ReactNode} children - Contenu de la section (grille, cartes, etc.)
 */
export default function Section({
  tag,
  badgeBg,
  badgeColor,
  title,
  subtitle,
  align = 'center',
  background = 'dark',
  maxWidth = 'max-w-7xl',
  className = '',
  children
}) {
  const bgStyles = {
    dark: 'bg-slate-900/95 border-t border-slate-800/80 text-white',
    light: 'bg-slate-50 border-t border-slate-200/80 text-slate-900',
    transparent: 'bg-transparent text-slate-900'
  }[background] || 'bg-slate-900/95 border-t border-slate-800/80 text-white';

  const alignStyles = {
    center: 'text-center mx-auto',
    left: 'text-left',
    right: 'text-right ml-auto'
  }[align] || 'text-center mx-auto';

  return (
    <section className={`w-full py-10 sm:py-16 ${bgStyles} ${className}`}>
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
        {/* En-tête de section (si tag, title ou subtitle sont fournis) */}
        {(tag || title || subtitle) && (
          <div className={`mb-8 sm:mb-10 max-w-2xl ${alignStyles}`}>
            {tag && (
              <span
                className="text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-2 shadow-xs"
                style={{
                  backgroundColor: badgeBg || '#d1fae5',
                  color: badgeColor || '#065f46'
                }}
              >
                {tag}
              </span>
            )}

            {title && (
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Contenu principal */}
        {children}
      </div>
    </section>
  );
}
