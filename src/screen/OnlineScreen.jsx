import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { THEMES } from '../theme/themes';
import { SLIDES } from '../mocks/slidesMock';
import { AGENCIES } from '../mocks/agenciesMock';
import { openModal, closeModal } from '../features/modalSlice';
import Layout from '../layout/Layout';
import Container from '../layout/Container';

import WelcomeBanner from '../globalComponents/WelcomeBanner';
import Carousel from '../globalComponents/Carousel';
import ServiceCards from '../globalComponents/ServiceCards';
import CtaWave from '../globalComponents/CtaWave';

import TicketScreen from './ticket/TicketScreen';
import SatisfactionScreen from './satisfaction/SatisfactionScreen';
import AgencyMapScreen from './map/AgencyMapScreen';

export { THEMES, SLIDES, AGENCIES };

/**
 * Screen Principal : Portail Client En Ligne (S2Q)
 * 
 * Conforme aux maquettes au pixel près :
 * - Vert officiel Synapse S2Q (#008056)
 * - Trait / arc vert inférieur fidèle à la maquette
 * - Espacements équilibrés et aérés
 * - Zéro Scroll (tout visible sur un seul écran)
 */
export default function OnlineScreen({
  slides = SLIDES,
  slideLinks,
  onSlideAction
}) {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.theme);
  const currentThemeKey = useSelector((state) => state.theme.currentThemeKey);
  const activeModal = useSelector((state) => state.modal.activeModal);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Défilement automatique du carrousel toutes les 6 secondes
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleSlideClick = (slide, index, e) => {
    if (onSlideAction) {
      onSlideAction(slide, index, e);
      return;
    }

    const targetLink = slide?.link || slide?.url || (slideLinks && slideLinks[slide?.id]);
    if (targetLink === '#ticket') {
      e?.preventDefault();
      dispatch(openModal('ticket'));
    } else if (targetLink === '#satisfaction') {
      e?.preventDefault();
      dispatch(openModal('satisfaction'));
    } else if (targetLink === '#map') {
      e?.preventDefault();
      dispatch(openModal('map'));
    }
  };

  return (
    <Layout theme={theme} currentThemeKey={currentThemeKey} themes={THEMES}>
      {/* ─── CORPS CENTRAL (Strictement 100vh sans scroll, footer toujours visible à l'écran) ─── */}
      <div className="flex-1 min-h-0 flex flex-col justify-between pt-1 sm:pt-1.5 md:pt-2 w-full overflow-hidden">
        <Container 
          maxWidth="max-w-5xl" 
          padding={true} 
          className="flex-1 min-h-0 flex flex-col justify-between w-full gap-1.5 sm:gap-2 md:gap-2.5 pb-1 sm:pb-2"
        >
          {/* 1. Bloc d'Accroche Centré ("L'agence, sans l'attente.") */}
          <WelcomeBanner />

          {/* 2. Carrousel Flottant & Bannières */}
          <Carousel
            theme={theme}
            slides={slides}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            handlePrevSlide={handlePrevSlide}
            handleNextSlide={handleNextSlide}
            setIsPaused={setIsPaused}
            onSlideAction={handleSlideClick}
          />

          {/* 3. Section des 3 Actions (Ticket, Avis, Agences) */}
          <ServiceCards
            theme={theme}
            onSelectService={(service) => dispatch(openModal(service))}
          />
        </Container>

        {/* ─── 4. BANDEAU VERT INFÉRIEUR AVEC ARC DOUX FIDÈLE ─── */}
        <CtaWave
          theme={theme}
          title="Votre temps compte."
          subtitle="Nous facilitons chaque étape de votre accueil en agence."
          buttonText="Nous contacter"
          contactHref="tel:+22527200000"
        />
      </div>

      {/* ─── 5. ÉCRANS MODAUX & BOTTOM SHEETS TACTILES ─── */}
      <TicketScreen
        isOpen={activeModal === 'ticket'}
        onClose={() => dispatch(closeModal())}
        theme={theme}
        agencies={AGENCIES}
      />

      <SatisfactionScreen
        isOpen={activeModal === 'satisfaction'}
        onClose={() => dispatch(closeModal())}
        theme={theme}
      />

      <AgencyMapScreen
        isOpen={activeModal === 'map'}
        onClose={() => dispatch(closeModal())}
        theme={theme}
        agencies={AGENCIES}
      />
    </Layout>
  );
}
