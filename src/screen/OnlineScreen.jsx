import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { THEMES } from '../theme/themes';
import { SLIDES } from '../mocks/slidesMock';
import { AGENCIES } from '../mocks/agenciesMock';
import { openModal, closeModal } from '../features/modalSlice';
import Layout from '../layout/Layout';
import Container from '../layout/Container';

import Carousel from '../globalComponents/Carousel';
import ServiceCards from '../globalComponents/ServiceCards';
import TicketScreen from './ticket/TicketScreen';
import SatisfactionScreen from './satisfaction/SatisfactionScreen';
import AgencyMapScreen from './map/AgencyMapScreen';

export { THEMES, SLIDES, AGENCIES };

/**
 * Screen Principal : Portail Client En Ligne (S2Q)
 * 
 * Encapsule l'ensemble de la page d'accueil en ligne :
 * - Carrousel promotionnel (Hero)
 * - Raccourcis des services (Ticket, Satisfaction, Agences)
 * - Modales / Bottom Sheets tactiles
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

  // Défilement automatique du carrousel
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
      {/* 1. Section Carrousel Promotionnel */}
      <Container fullWidth={true} padding={false}>
        <Carousel
          theme={theme}
          slides={slides}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          handlePrevSlide={handlePrevSlide}
          handleNextSlide={handleNextSlide}
          setIsPaused={setIsPaused}
          slideLinks={slideLinks}
          onSlideAction={handleSlideClick}
        />
      </Container>

      {/* 2. Section Raccourcis Services */}
      <Container fullWidth={true} padding={false}>
        <ServiceCards
          theme={theme}
          onSelectService={(service) => dispatch(openModal(service))}
        />
      </Container>

      {/* 3. Écrans Modaux / Bottom Sheets Mobile-First */}
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
