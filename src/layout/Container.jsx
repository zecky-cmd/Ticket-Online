import React from 'react';

/**
 * Composant Container de mise en page
 * 
 * Rôle :
 * - Cadrage et centrage horizontal du contenu (max-w-7xl mx-auto).
 * - Marges de sécurité latérales sur mobile/tablette (px-4 sm:px-6 lg:px-8).
 * - Support du mode pleine largeur (fullWidth = true) pour les bannières / sliders.
 * 
 * @param {React.ReactNode} children - Contenu enfant
 * @param {string} className - Classes CSS additionnelles
 * @param {string|React.ElementType} as - Balise HTML cible ('div', 'section', 'article'...)
 * @param {boolean} fullWidth - Occupe 100% de la largeur sans limitation max-w
 * @param {boolean} padding - Applique les paddings horizontaux de sécurité
 */
export default function Container({
  children,
  className = '',
  as: Component = 'section',
  fullWidth = true,
  padding = false
}) {
  const baseClasses = fullWidth ? 'w-full' : 'max-w-7xl mx-auto w-full';
  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <Component className={`${baseClasses} ${paddingClasses} ${className}`}>
      {children}
    </Component>
  );
}
