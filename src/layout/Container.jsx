/**
 * Composant Container de mise en page
 * 
 * Rôle :
 * - Cadrage et centrage horizontal du contenu (maxWidth mx-auto).
 * - Marges de sécurité latérales sur mobile/tablette (px-4 sm:px-6 lg:px-8).
 * - Support du mode pleine largeur (fullWidth = true) pour les bannières / sliders.
 * 
 * @param {React.ReactNode} children - Contenu enfant
 * @param {string} className - Classes CSS additionnelles
 * @param {string|React.ElementType} as - Balise HTML cible ('div', 'section', 'article'...)
 * @param {string} maxWidth - Limite de largeur ('max-w-7xl', 'max-w-5xl', etc.)
 * @param {boolean} fullWidth - Occupe 100% de la largeur sans limitation max-w
 * @param {boolean} padding - Applique les paddings horizontaux de sécurité
 */
export default function Container({
  children,
  className = '',
  as: Component = 'section',
  maxWidth = 'max-w-7xl',
  fullWidth = false,
  padding = true
}) {
  const baseClasses = fullWidth ? 'w-full' : `${maxWidth} mx-auto w-full`;
  const paddingClasses = padding ? 'px-3 sm:px-6 lg:px-8' : '';

  return (
    <Component className={`${baseClasses} ${paddingClasses} ${className}`}>
      {children}
    </Component>
  );
}
