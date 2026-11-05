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
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-105"
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
    <div className={`group flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none focus:outline-hidden ${className}`}>
      {/* Logo */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center text-white shadow-xs transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
        {renderLogoVisual()}
      </div>

      {/* Nom de l'entreprise */}
      <div className="flex flex-col justify-center leading-tight text-left">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black tracking-tight text-white block leading-none">
            {entreprise}
          </span>
          {tag && (
            <span className="text-[9px] font-black uppercase tracking-wider rounded-md bg-white/20 text-white px-1.5 py-0.5 border border-white/30">
              {tag}
            </span>
          )}
        </div>
      </div>
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
