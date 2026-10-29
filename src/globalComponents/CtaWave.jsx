import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from './ui/Link';

/**
 * Composant CtaWave (Bandeau inférieur avec découpe en arc doux)
 * 
 * Fidèle à la maquette :
 * - Découpe supérieure : arc/colline douce et asymétrique (conforme à l'image)
 * - Fond vert officiel Synapse S2Q (#008056)
 * - Pastille radar ambre pulsée + "Votre temps compte. Nous facilitons..."
 * - Desktop : Bouton arrondi avec fine bordure "Nous contacter →"
 * - Mobile : Bouton carré arrondi tactile avec flèche '→'
 */
export default function CtaWave({
  theme,
  title = "Votre temps compte.",
  subtitle = "Nous facilitons chaque étape de votre accueil en agence.",
  buttonText = "Nous contacter",
  contactHref = "tel:+22527200000",
  onContactClick,
  className = ''
}) {
  const primaryColor = theme?.colors?.primary || '#008056';

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* 1. Découpe en arc doux supérieur (conforme au trait de la maquette) */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-5 sm:h-7 md:h-9 preserve-3d block"
        >
          {/* Courbe douce asymétrique : démarre à y=28, monte doucement à y=4 vers 25%, plateau fluide, descend à y=22 */}
          <path
            d="M0,28 C280,6 540,2 820,5 C1100,8 1300,16 1440,22 L1440,54 L0,54 Z"
            fill={primaryColor}
          />
        </svg>
      </div>

      {/* 2. Corps du bandeau vert officiel */}
      <div
        className="w-full text-white px-4 sm:px-8 lg:px-12 py-3.5 sm:py-5 md:py-6 transition-colors duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Côté gauche : Radar ambre + Textes */}
          <div className="flex items-center gap-3 sm:gap-4 text-left">
            {/* Cercle radar avec point ambre */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/15 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm inline-block animate-pulse" />
            </div>

            {/* Titre & Sous-titre */}
            <div className="flex flex-col justify-center leading-tight">
              <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                {title}
              </h4>
              <p className="text-xs sm:text-sm text-white/85 mt-0.5 line-clamp-1 font-medium">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Côté droit : Bouton "Nous contacter →" */}
          <div>
            <Link
              to={contactHref}
              onClick={onContactClick}
              className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-black/15 hover:bg-black/25 active:scale-95 border border-white/30 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all duration-200 cursor-pointer"
            >
              <span className="hidden sm:inline">{buttonText}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
