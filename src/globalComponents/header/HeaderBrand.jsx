import React, { useState } from 'react';
import Link from '../ui/Link';
import { SITE_CONFIG } from '../../config/siteConfig';

/**
 * Composant HeaderBrand (Identité de marque dans l'en-tête)
 *
 * Affiche le logo de l'entreprise + son nom.
 * Les valeurs par défaut proviennent de src/config/siteConfig.js
 * et peuvent être surchargées par props.
 *
 * @param {string|React.ReactNode} logo - Image de logo ou composant React
 * @param {string} logoAlt - Texte alternatif du logo
 * @param {string} entreprise - Nom de l'entreprise (ex: 'Synapse')
 * @param {string} tag - Badge optionnel à côté du nom
 * @param {string} href - Lien éventuel de redirection
 * @param {function} onClick - Événement de clic
 * @param {string} className - Classes CSS additionnelles
 */
export default function HeaderBrand({
  logo = SITE_CONFIG.brand.logo,
  logoAlt = SITE_CONFIG.brand.logoAlt,
  entreprise = SITE_CONFIG.brand.entreprise,
  tag,
  href,
  onClick,
  className = ''
}) {
  const [imgError, setImgError] = useState(false);

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

  const renderLogoVisual = () => {
    if (typeof logo === 'string' && !imgError) {
      return (
        <img
          src={logo}
          alt={logoAlt || entreprise || 'Logo'}
          onError={() => setImgError(true)}
          className="h-9 sm:h-10 md:h-11 w-auto max-w-[140px] sm:max-w-[170px] object-contain transition-transform duration-200 group-hover:scale-102 shrink-0 drop-shadow-xs"
        />
      );
    }

    if (React.isValidElement(logo)) {
      return logo;
    }

    // Pas de logo disponible
    return null;
  };

  const brandContent = (
    <div className={`group flex items-center gap-3 sm:gap-3.5 cursor-pointer select-none focus:outline-hidden ${className}`}>
      {/* Logo affiché naturellement sans encadrement */}
      {renderLogoVisual()}

      {/* Nom de l'entreprise */}
      {entreprise && (
        <div className="flex items-center gap-2 leading-none">
          <span className="text-xl sm:text-2xl md:text-[26px] font-black tracking-tight text-white block">
            {entreprise}
          </span>
          {tag && (
            <span className="text-[10px] font-black uppercase tracking-wider rounded-md bg-white/20 text-white px-1.5 py-0.5 border border-white/30">
              {tag}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} onClick={handleClick} className="focus:outline-hidden">
        {brandContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-transparent border-0 p-0 text-left focus:outline-hidden cursor-pointer"
    >
      {brandContent}
    </button>
  );
}
