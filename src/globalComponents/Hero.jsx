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

export default function OnlineHero({
  theme,
  slides = SLIDES,
  currentSlide = 0,
  setCurrentSlide,
  handlePrevSlide,
  handleNextSlide,
  setIsPaused,
  // Props pour la gestion des liens & boutons
  slideLinks, // Objet ou fonction fournissant des liens optionnels par slide : { [slideId]: 'https://...' }
  onSlideAction, // Callback au clic sur le bouton d'action du slide
  defaultButtonText = "En savoir plus",
  // Options d'affichage
  showSlideText = true, // Affichage discret du texte si renseigné
  aspectRatio = "aspect-[21/9] sm:aspect-[16/5] md:aspect-[4/1] min-h-[220px] max-h-[480px]",
  imageFit = "cover" // "cover" ou "contain" pour préserver le ratio natif sans déformation
}) {
  const currentSlideData = slides[currentSlide] || slides[0];

  // Résolution du lien rattaché à la slide active (soit dans slide.link, soit via la prop slideLinks)
  const resolvedLink =
    currentSlideData?.link ||
    currentSlideData?.url ||
    (typeof slideLinks === 'function'
      ? slideLinks(currentSlideData, currentSlide)
      : slideLinks?.[currentSlideData?.id] || slideLinks?.[currentSlide]);

  const buttonLabel =
    currentSlideData?.linkText ||
    currentSlideData?.buttonText ||
    defaultButtonText;

  const isExternal =
    resolvedLink && (resolvedLink.startsWith('http://') || resolvedLink.startsWith('https://'));

  const handleButtonClick = (e) => {
    if (onSlideAction) {
      onSlideAction(currentSlideData, currentSlide, e);
    }
  };

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

      {/* Bouton d'action si l'image est rattachée à un lien (Prop requise) */}
      {resolvedLink && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
          <a
            href={resolvedLink}
            target={currentSlideData?.linkTarget || (isExternal ? '_blank' : '_self')}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            onClick={handleButtonClick}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 focus:outline-none cursor-pointer group backdrop-blur-xs"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <span>{buttonLabel}</span>
            {isExternal ? (
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </a>
        </div>
      )}

      {/* Légende textuelle discrète en bas à gauche (uniquement si demandée et renseignée) */}
      {showSlideText && (currentSlideData?.title || currentSlideData?.tag) && (
        <div className="hidden sm:flex absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 max-w-sm md:max-w-md bg-slate-950/75 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 text-white shadow-xl flex-col items-start pointer-events-none">
          {currentSlideData.tag && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Sparkles className="w-3 h-3 text-white" />
              {currentSlideData.tag}
            </span>
          )}
          {currentSlideData.title && (
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug line-clamp-2">
              {currentSlideData.title}
            </h3>
          )}
        </div>
      )}

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
