import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { SLIDES } from '../mocks/slidesMock';

/**
 * Composant Carousel Flottant & Bannières
 * 
 * Fidèle à la maquette :
 * - Carte flottante aux coins très arrondis (rounded-[28px])
 * - Masque dégradé sombre à gauche pour lisibilité optimale
 * - Badge contexte + Titre + Description + Bouton blanc avec flèche '→'
 * - Contrôles intégrés en bas à droite (précédent, points, suivant, compteur 1/3)
 * - Hauteur calibrée pour l'équilibre zéro-scroll
 */
export default function Carousel({
  slides = SLIDES,
  currentSlide = 0,
  setCurrentSlide,
  handlePrevSlide,
  handleNextSlide,
  setIsPaused,
  onSlideAction,
  className = ''
}) {
  const currentSlideData = slides[currentSlide] || slides[0];

  const handleAction = (e) => {
    if (onSlideAction) {
      onSlideAction(currentSlideData, currentSlide, e);
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-[24px] overflow-hidden shadow-md select-none h-[140px] xs:h-[155px] sm:h-[180px] md:h-[195px] lg:h-[210px] bg-slate-900 group ${className}`}
      onMouseEnter={() => setIsPaused && setIsPaused(true)}
      onMouseLeave={() => setIsPaused && setIsPaused(false)}
    >
      {/* 1. Images de fond des slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title || 'Slide'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}

      {/* 2. Masque sombre dégradé sur le côté gauche */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/90 via-black/60 sm:via-black/45 to-transparent flex items-center">
        <div className="p-3.5 sm:p-5 md:p-6 max-w-sm sm:max-w-md md:max-w-lg text-left">
          {/* Badge de contexte */}
          {currentSlideData?.tag && (
            <div className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs border border-white/25 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-white shadow-2xs mb-1 sm:mb-1.5">
              {currentSlideData.tag}
            </div>
          )}

          {/* Titre percutant */}
          <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-white leading-snug drop-shadow-sm">
            {currentSlideData?.title}
          </h2>

          {/* Sous-titre */}
          {currentSlideData?.subtitle && (
            <p className="text-[10px] sm:text-[11px] md:text-xs text-white/80 mt-0.5 sm:mt-1 line-clamp-2 leading-tight">
              {currentSlideData.subtitle}
            </p>
          )}

          {/* Bouton CTA d'action blanc */}
          {currentSlideData?.buttonText && (
            <div className="mt-2 sm:mt-2.5">
              <button
                type="button"
                onClick={handleAction}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-[11px] sm:text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>{currentSlideData.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Contrôles de navigation bas-droite (← ● ● ● → 3/3) */}
      <div className="absolute right-3 sm:right-6 bottom-3 sm:bottom-4 z-30 flex items-center gap-2 sm:gap-2.5 bg-black/40 backdrop-blur-sm border border-white/20 px-2.5 sm:px-3 py-1.5 rounded-full shadow-md">
        {/* Précédent */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Slide précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Indicateurs points (dots) */}
        <div className="flex items-center gap-1.5 px-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                idx === currentSlide
                  ? 'w-4 sm:w-5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Aller à la slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Suivant */}
        <button
          type="button"
          onClick={handleNextSlide}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Slide suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Compteur 1/3 (visible desktop) */}
        <span className="hidden sm:inline-block text-[11px] font-bold text-white/85 pl-1 font-mono">
          {currentSlide + 1}/{slides.length}
        </span>
      </div>
    </div>
  );
}
