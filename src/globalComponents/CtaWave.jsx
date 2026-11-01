import { ArrowRight } from 'lucide-react';
import Link from './ui/Link';

/**
 * Composant CtaWave (Bandeau vert inférieur avec découpe asymétrique)
 * 
 * Conforme fidèlement à la maquette et aux spécifications du designer (nplan.md) :
 * - Arc asymétrique doux et tendu (viewBox 0 0 1440 20), mesuré au pixel près sur la maquette :
 *   épaules douces aux extrémités (y=13), sommet élégant au-dessus du radar (y=0),
 *   plateau central quasi-horizontal (y=2.5), et crête légère au-dessus du bouton (y=0).
 * - Pastille .contact-mark et .contact-mark__dot en CSS pur (sans SVG ni image).
 * - Bouton responsive : bouton pilule "Nous contacter →" sur desktop, squircle flèche sur mobile.
 * - Fond vert officiel Synapse S2Q (#008056).
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
      {/* 1. Découpe supérieure asymétrique mesurée au pixel près sur la maquette */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-2.5 sm:h-3.5 md:h-4.5 block"
        >
          <path
            d="M 0,13 C 70,7 140,1 215,0 C 280,0 340,2.5 420,2.5 L 1010,2.5 C 1090,2.5 1150,0 1225,0 C 1310,0 1380,7 1440,13 L 1440,20 L 0,20 Z"
            fill={primaryColor}
          />
        </svg>
      </div>

      {/* 2. Corps du bandeau vert officiel (#008056) */}
      <div
        className="w-full text-white px-4 sm:px-8 lg:px-12 pt-0 pb-2 sm:pb-2.5 transition-colors duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Côté gauche : Pastille CSS pur (.contact-mark) + Textes */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-left">
            {/* Pastille radar spécifiée par le designer dans nplan.md */}
            <span className="contact-mark" aria-hidden="true">
              <span className="contact-mark__dot" />
            </span>

            {/* Titre & Sous-titre */}
            <div className="flex flex-col justify-center leading-tight">
              <h4 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white">
                {title}
              </h4>
              <p className="text-[11px] sm:text-xs text-white/85 mt-0.5 line-clamp-1 font-medium">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Côté droit : Bouton contact conforme maquette desktop & mobile */}
          <div>
            <Link
              to={contactHref}
              onClick={onContactClick}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-full bg-transparent hover:bg-white/10 active:scale-95 border border-white/40 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all duration-200 cursor-pointer"
            >
              <span className="hidden sm:inline">{buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
