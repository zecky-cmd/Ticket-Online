import React, { useState } from 'react';
import Link from '../ui/Link';

/**
 * Composant HeaderBrand (Identité de Marque)
 * 
 * Affichage haute fidélité conforme à la maquette :
 * - Carré arrondi vert contrasté avec lettre 'S' (ou logo personnalisé)
 * - Titre 'Synapse' en gras blanc
 * - Sous-titre 'S2Q · TICKETS EN LIGNE'
 * 
 * @param {string|React.ReactNode} logo - Image de logo ou composant React
 * @param {string} abbreviation - Nom principal (ex: 'Synapse')
 * @param {string} definition - Sous-titre (ex: 'S2Q · TICKETS EN LIGNE')
 * @param {string} primaryColor - Couleur dynamique du thème
 * @param {string} href - Lien éventuel de redirection
 * @param {function} onClick - Événement de clic
 */
export default function HeaderBrand({
  logo,
  logoAlt,
  abbreviation = 'Synapse',
  definition = 'S2Q · TICKETS EN LIGNE',
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
          alt={logoAlt || abbreviation || 'Logo'}
          onError={() => setImgError(true)}
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-105"
        />
      );
    }

    if (React.isValidElement(logo)) {
      return logo;
    }

    // Logo par défaut de la maquette : Carré arrondi avec 'S' blanc
    return (
      <span className="font-black text-white text-lg sm:text-xl tracking-tight select-none">
        {abbreviation ? abbreviation.charAt(0).toUpperCase() : 'S'}
      </span>
    );
  };

  const brandContent = (
    <div className={`group flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none focus:outline-hidden ${className}`}>
      {/* Carré Logo translucide avec 'S' blanc */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center text-white shadow-xs transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
        {renderLogoVisual()}
      </div>

      {/* Titre & Sous-titre */}
      <div className="flex flex-col justify-center leading-tight text-left">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black tracking-tight text-white block leading-none">
            {abbreviation}
          </span>
          {tag && (
            <span className="text-[9px] font-black uppercase tracking-wider rounded-md bg-white/20 text-white px-1.5 py-0.5 border border-white/30">
              {tag}
            </span>
          )}
        </div>

        {definition && (
          <span className="text-[8px] sm:text-[9.5px] font-semibold uppercase tracking-widest text-white/85 mt-1">
            {definition}
          </span>
        )}
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
