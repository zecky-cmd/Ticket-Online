import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { SLIDES } from '../mocks/slidesMock';

// Normalisation des chemins d'images (gère "public/...", "/...", URLs externes)
const getValidImageUrl = (src) => {
  if (!src) return '';
  if (src.startsWith('public/')) {
    return '/' + src.replace(/^public\//, '');
  }
  return src;
};

/**
 * Composant Carousel Promotionnel & Bannières
 * 
 * Gère le défilement automatique d'images, indicateurs de pagination,
 * navigation fléchée, pause au survol et boutons d'actions interactifs.
 */
export default function Carousel({
  theme,
  slides = SLIDES,
  currentSlide = 0,
  setCurrentSlide,
  handlePrevSlide,
  handleNextSlide,
  setIsPaused,

  aspectRatio = "aspect-[21/9] sm:aspect-[16/5] md:aspect-[4/1] min-h-[220px] max-h-[480px]",
  imageFit = "cover" // "cover" ou "contain" pour préserver le ratio natif sans déformation
}) {
  // const currentSlideData = slides[currentSlide] || slides[0];

  // Résolution du lien rattaché à la slide active (soit dans slide.link, soit via la prop slideLinks)

  return (
    <div
      className={`relative w-full overflow-hidden ${aspectRatio} bg-slate-950 select-none`}
      onMouseEnter={() => setIsPaused && setIsPaused(true)}
      onMouseLeave={() => setIsPaused && setIsPaused(false)}
    >
      {/* Slides d'images SANS AUCUN GRADIENT assombrissant */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const imageUrl = getValidImageUrl(slide.image);

        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={imageUrl}
              alt={slide.title || `Slide ${slide.id || index + 1}`}
              className={`w-full h-full ${
                imageFit === 'contain' ? 'object-contain' : 'object-cover'
              } object-center`}
            />
          </div>
        );
      })}

      {/* Flèches de navigation du carrousel (centrées verticalement) */}
      <button
        type="button"
        onClick={handlePrevSlide}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all focus:outline-none cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        aria-label="Publicité précédente"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={handleNextSlide}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all focus:outline-none cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        aria-label="Publicité suivante"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>


      {/* Indicateurs (Dots) du carrousel au centre */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Aller au slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
