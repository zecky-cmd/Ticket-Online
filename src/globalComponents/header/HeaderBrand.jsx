import React, { useState } from 'react';
import Link from '../ui/Link';

/**
 * Composant HeaderBrand (Identité de Marque)
 * 
 * @param {string|React.ReactNode} logo - Chemin d'image (ex: '/CLIENT_LOGO.png') ou composant SVG/React
 * @param {string} logoAlt - Texte alternatif pour l'image
 * @param {string} abbreviation - Titre court ou acronyme (ex: 'BNI', 'S2Q')
 * @param {string} definition - Libellé complet ou sous-titre explicatif (ex: "Banque Nationale d'Investissement")
 * @param {string} tag - Badge ou étiquette contextuelle optionnelle (ex: 'Online', 'v3', 'Portail')
 * @param {string} primaryColor - Couleur dynamique du thème pour l'accentuation
 * @param {string} href - Lien de destination (ex: '/')
 * @param {'sm'|'md'|'lg'} size - Échelle visuelle du logo et texte ('sm', 'md', 'lg')
 * @param {function} onClick - Action au clic (si non fourni et sans href, scroll en haut par défaut)
 * @param {string} className - Classes CSS conteneur personnalisées
 */
export default function HeaderBrand({
  logo = '/CLIENT_LOGO.png',
  logoAlt,
  abbreviation = 'Synapse',
  definition = "S2Q - Tickets en Ligne",
  tag,
  primaryColor = '#00843D',
  href,
  size = 'md',
  onClick,
  className = ''
}) {
  const [imgError, setImgError] = useState(false);

  // Configuration des tailles selon le prop 'size'
  const sizeClasses = {
    sm: {
      box: 'w-9 h-9 rounded-xl',
      img: 'w-6 h-6',
      title: 'text-xl',
      definition: 'text-[9px]',
      badge: 'text-[9px] px-1.5 py-0.5'
    },
    md: {
      box: 'w-11 h-11 rounded-2xl',
      img: 'w-8 h-8',
      title: 'text-2xl',
      definition: 'text-[10px]',
      badge: 'text-[10px] px-2 py-0.5'
    },
    lg: {
      box: 'w-14 h-14 rounded-2xl',
      img: 'w-10 h-10',
      title: 'text-3xl',
      definition: 'text-xs',
      badge: 'text-xs px-2.5 py-0.5'
    }
  }[size] || {
    box: 'w-11 h-11 rounded-2xl',
    img: 'w-8 h-8',
    title: 'text-2xl',
    definition: 'text-[10px]',
    badge: 'text-[10px] px-2 py-0.5'
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (!href) {
      e?.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Rendu du visuel logo (image, React node ou initiales de secours)
  const renderLogoVisual = () => {
    if (typeof logo === 'string' && !imgError) {
      return (
        <img
          src={logo}
          alt={logoAlt || abbreviation || 'Logo'}
          onError={() => setImgError(true)}
          className={`${sizeClasses.img} object-contain transition-transform group-hover:scale-105`}
        />
      );
    }

    if (React.isValidElement(logo)) {
      return logo;
    }

    // Fallback élégant : première lettre de l'abréviation
    return (
      <span className="font-black text-white text-lg">
        {abbreviation ? abbreviation.charAt(0).toUpperCase() : 'B'}
      </span>
    );
  };

  if (href) {
    return (
      <Link
        to={href}
        onClick={handleClick}
        className={`group flex items-center gap-3 cursor-pointer select-none focus:outline-hidden ${className}`}
      >
        {/* Conteneur de l'icône/logo */}
        <div
          className={`${sizeClasses.box} flex items-center justify-center text-white shadow-md transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg flex-shrink-0`}
          style={{ backgroundColor: primaryColor }}
        >
          {renderLogoVisual()}
        </div>

        {/* Titre (Abréviation) & Sous-titre (Définition/Libellé) */}
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-2">
            <span className={`${sizeClasses.title} font-black tracking-tight text-slate-900 block leading-none`}>
              <span style={{ color: primaryColor }}>{abbreviation}</span>
            </span>

            {tag && (
              <span 
                className={`${sizeClasses.badge} font-black uppercase tracking-wider rounded-md border`}
                style={{
                  color: primaryColor,
                  backgroundColor: `${primaryColor}15`,
                  borderColor: `${primaryColor}30`
                }}
              >
                {tag}
              </span>
            )}
          </div>

          {definition && (
            <span className={`${sizeClasses.definition} font-bold uppercase tracking-widest text-slate-400 mt-0.5 line-clamp-1`}>
              {definition}
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={`group flex items-center gap-3 cursor-pointer select-none focus:outline-hidden ${className}`}
    >
      {/* Conteneur de l'icône/logo */}
      <div
        className={`${sizeClasses.box} flex items-center justify-center text-white shadow-md transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg flex-shrink-0`}
        style={{ backgroundColor: primaryColor }}
      >
        {renderLogoVisual()}
      </div>

      {/* Titre (Abréviation) & Sous-titre (Définition/Libellé) */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-2">
          <span className={`${sizeClasses.title} font-black tracking-tight text-slate-900 block leading-none`}>
            <span style={{ color: primaryColor }}>{abbreviation}</span>
          </span>

          {/* Badge ou Tag optionnel (ex: Online, v3, E-Ticket) */}
          {tag && (
            <span 
              className={`${sizeClasses.badge} font-black uppercase tracking-wider rounded-md border`}
              style={{
                color: primaryColor,
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}30`
              }}
            >
              {tag}
            </span>
          )}
        </div>

        {definition && (
          <span className={`${sizeClasses.definition} font-bold uppercase tracking-widest text-slate-400 mt-0.5 line-clamp-1`}>
            {definition}
          </span>
        )}
      </div>
    </div>
  );
}
