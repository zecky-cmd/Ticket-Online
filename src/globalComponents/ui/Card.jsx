import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from './Link';

/**
 * Composant Card Universel & Paramétrable
 * 
 * @param {React.ReactNode} icon - Icône principale (composant Lucide ou JSX)
 * @param {string} title - Titre de la carte
 * @param {string|React.ReactNode} description - Texte descriptif
 * @param {string|React.ReactNode} badge - Badge optionnel en haut à droite (ex: 'Prioritaire', '4.8 / 5')
 * @param {string} badgeBg - Couleur de fond du badge
 * @param {string} badgeColor - Couleur du texte du badge
 * @param {string} actionText - Libellé du bouton / lien d'action en bas (ex: 'Prendre mon ticket')
 * @param {React.ReactNode} actionIcon - Icône d'action (par défaut flèche ArrowRight)
 * @param {string} primaryColor - Couleur principale dynamique pour l'accentuation
 * @param {string} hoverBorder - Classe CSS ou couleur de bordure au survol
 * @param {'sm'|'md'|'lg'} size - Taille de la carte ('sm', 'md', 'lg')
 * @param {'white'|'dark'|'outline'} variant - Style de fond de la carte
 * @param {function} onClick - Fonction déclenchée au clic
 * @param {string} href - Lien éventuel (transforme en <a>)
 * @param {string} className - Classes CSS conteneur
 * @param {React.ReactNode} children - Contenu libre personnalisé
 */
export default function Card({
  icon: Icon,
  title,
  description,
  badge,
  badgeBg,
  badgeColor,
  actionText,
  actionIcon: ActionIcon = ArrowRight,
  primaryColor = '#008056',
  hoverBorder = 'hover:border-primary-400',
  size = 'md',
  variant = 'white',
  onClick,
  href,
  className = '',
  children
}) {
  // Échelles selon le prop 'size'
  const sizeStyles = {
    sm: {
      padding: 'p-4 sm:p-5',
      iconBox: 'w-10 h-10 rounded-xl',
      iconSize: 'w-5 h-5',
      title: 'text-base font-bold mb-1',
      desc: 'text-xs',
      badge: 'text-[10px] px-2.5 py-0.5',
      action: 'mt-4 pt-3 text-xs',
    },
    md: {
      padding: 'p-6 sm:p-7',
      iconBox: 'w-14 h-14 rounded-2xl',
      iconSize: 'w-7 h-7',
      title: 'text-lg sm:text-xl font-black mb-2',
      desc: 'text-xs sm:text-sm',
      badge: 'text-[11px] font-extrabold px-3 py-1',
      action: 'mt-6 pt-4 text-xs font-bold',
    },
    lg: {
      padding: 'p-8 sm:p-10',
      iconBox: 'w-16 h-16 rounded-3xl',
      iconSize: 'w-8 h-8',
      title: 'text-xl sm:text-2xl font-black mb-3',
      desc: 'text-sm sm:text-base',
      badge: 'text-xs font-extrabold px-3.5 py-1.5',
      action: 'mt-8 pt-5 text-sm font-bold',
    }
  }[size] || {
    padding: 'p-6 sm:p-7',
    iconBox: 'w-14 h-14 rounded-2xl',
    iconSize: 'w-7 h-7',
    title: 'text-lg sm:text-xl font-black mb-2',
    desc: 'text-xs sm:text-sm',
    badge: 'text-[11px] font-extrabold px-3 py-1',
    action: 'mt-6 pt-4 text-xs font-bold',
  };

  // Variantes visuelles
  const variantStyles = {
    white: 'bg-white border-slate-200/60 shadow-xl text-slate-900',
    dark: 'bg-slate-800/90 border-slate-700/80 shadow-2xl text-white',
    outline: 'bg-transparent border-slate-300 shadow-sm text-slate-800'
  }[variant] || 'bg-white border-slate-200/60 shadow-xl text-slate-900';

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    if (typeof Icon === 'function') {
      return <Icon className={sizeStyles.iconSize} />;
    }
    return null;
  };

  const cardContent = (
    <>
      <div>
        {/* En-tête de carte : Icône + Badge */}
        {(Icon || badge) && (
          <div className="flex items-center justify-between mb-4">
            {Icon && (
              <div
                className={`${sizeStyles.iconBox} flex items-center justify-center text-white shadow-md transition-transform duration-200 group-hover:scale-110 flex-shrink-0`}
                style={{ backgroundColor: primaryColor }}
              >
                {renderIcon()}
              </div>
            )}

            {badge && (
              <span
                className={`${sizeStyles.badge} uppercase rounded-full tracking-wide inline-flex items-center gap-1 shadow-2xs`}
                style={{
                  backgroundColor: badgeBg || `${primaryColor}15`,
                  color: badgeColor || primaryColor
                }}
              >
                {badge}
              </span>
            )}
          </div>
        )}

        {/* Titre */}
        {title && (
          <h3 className={`${sizeStyles.title} tracking-tight group-hover:opacity-90 transition-opacity`}>
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className={`${sizeStyles.desc} text-slate-600 leading-relaxed`}>
            {description}
          </p>
        )}

        {/* Contenu personnalisé libre */}
        {children}
      </div>

      {/* Pied de carte : Action / Bouton */}
      {actionText && (
        <div
          className={`${sizeStyles.action} border-t border-slate-100 flex items-center justify-between font-bold`}
          style={{ color: primaryColor }}
        >
          <span>{actionText}</span>
          {ActionIcon && (
            <ActionIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5 flex-shrink-0" />
          )}
        </div>
      )}
    </>
  );

  const commonClasses = `group text-left rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 focus:outline-hidden flex flex-col justify-between ${
    onClick || href ? 'cursor-pointer' : ''
  } ${sizeStyles.padding} ${variantStyles} ${hoverBorder} ${className}`;

  if (href) {
    return (
      <Link to={href} onClick={onClick} className={commonClasses}>
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClasses}>
        {cardContent}
      </button>
    );
  }

  return (
    <div className={commonClasses}>
      {cardContent}
    </div>
  );
}
