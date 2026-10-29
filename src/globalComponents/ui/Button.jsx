import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Composant Button Universel & Paramétrable
 * 
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} variant - Style visuel
 * @param {'sm'|'md'|'lg'} size - Taille du bouton ('sm', 'md', 'lg')
 * @param {boolean} isLoading - État de chargement avec animation spinner
 * @param {boolean} disabled - Désactivation du bouton
 * @param {React.ReactNode} iconStart - Icône affichée avant le texte
 * @param {React.ReactNode} iconEnd - Icône affichée après le texte
 * @param {string} primaryColor - Couleur dynamique du thème pour la variante 'primary'
 * @param {string} type - 'button' | 'submit' | 'reset'
 * @param {function} onClick - Événement au clic
 * @param {string} className - Classes CSS additionnelles
 * @param {React.ReactNode} children - Texte ou contenu du bouton
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  iconStart: IconStart,
  iconEnd: IconEnd,
  primaryColor = '#008056',
  type = 'button',
  onClick,
  className = '',
  children,
  ...props
}) {
  const sizeStyles = {
    sm: 'py-2 px-3.5 text-xs rounded-xl gap-1.5',
    md: 'py-3 px-5 text-sm rounded-2xl gap-2',
    lg: 'py-3.5 px-6 text-base rounded-2xl gap-2.5',
  }[size] || 'py-3 px-5 text-sm rounded-2xl gap-2';

  // Styles de variantes
  let variantStyles = '';
  let inlineStyle = {};

  switch (variant) {
    case 'primary':
      variantStyles = 'text-white shadow-md hover:opacity-95 active:scale-[0.98]';
      inlineStyle = { backgroundColor: primaryColor };
      break;
    case 'secondary':
      variantStyles = 'bg-slate-100 hover:bg-slate-200 text-slate-800';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent hover:bg-slate-100 text-slate-700';
      break;
    case 'danger':
      variantStyles = 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm';
      break;
    default:
      variantStyles = 'text-white shadow-md';
      inlineStyle = { backgroundColor: primaryColor };
  }

  const renderIcon = (IconComponent) => {
    if (!IconComponent) return null;
    if (React.isValidElement(IconComponent)) return IconComponent;
    if (typeof IconComponent === 'function') {
      return <IconComponent className="w-4 h-4 flex-shrink-0" />;
    }
    return null;
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={inlineStyle}
      className={`font-bold transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {renderIcon(IconStart)}
          <span>{children}</span>
          {renderIcon(IconEnd)}
        </>
      )}
    </button>
  );
}
