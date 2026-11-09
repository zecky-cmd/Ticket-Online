import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { THEMES } from '../theme/themes';
import { SLIDES } from '../mocks/slidesMock';
import { agencyService } from '../services/agencyService';
import { openModal, closeModal } from '../features/modalSlice';
import Layout from '../layout/Layout';
import Container from '../layout/Container';

// Composants de la nouvelle page d'accueil BNI Synapse
import HomeHero from './home/components/HomeHero';
import HomeQuickAccess from './home/components/HomeQuickAccess';
import HomeFluiditySection from './home/components/HomeFluiditySection';
import HomeExperienceSection from './home/components/HomeExperienceSection';
import BottomNav from '../globalComponents/BottomNav';

// Modales fonctionnelles
import TicketScreen from './ticket/TicketScreen';
import SatisfactionScreen from './satisfaction/SatisfactionScreen';
import AgencyMapScreen from './map/AgencyMapScreen';

export { THEMES, SLIDES };

/**
 * Screen Principal : Portail BNI Synapse (Refonte Maquette Officielle)
 *
 * Conforme aux maquettes au pixel près :
 * - Vert officiel BNI (#00865D)
 * - Hero avec photo cliente souriante et double CTA
 * - Barre des 4 piliers d'accès rapide
 * - Section Fluidité en direct (statistiques de l'agence Cocody + mini-carte Leaflet interactive)
 * - Section Expérience Synapse & Encart promotionnel
 * - Bottom Navigation Bar tactile sur Mobile (Accueil, Agences, Avis, Tickets, Plus)
 * - 100% connecté aux modales existantes (Ticket, Agences, Satisfaction)
 */
export default function OnlineScreen() {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.theme);
  const activeModal = useSelector((state) => state.modal.activeModal);

  const [agencies, setAgencies] = useState([]);
  const [agenciesLoading, setAgenciesLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [mobileTab, setMobileTab] = useState('home');

  // Fermeture différée des modales (animation de sortie ~200ms)
  const [closingModal, setClosingModal] = useState(/** @type {string | null} */ (null));
  const closeTimerRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));

  const handleOpenModal = (/** @type {string} */ modal) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setClosingModal(null);
    dispatch(openModal(modal));
  };

  const handleCloseModal = () => {
    if (!activeModal || closingModal) return;
    setClosingModal(activeModal);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setClosingModal(null);
      dispatch(closeModal());
    }, 200);
  };

  // Chargement des agences depuis l'API ou le mock
  useEffect(() => {
    let active = true;
    agencyService
      .getAgencies()
      .then((data) => {
        if (active && Array.isArray(data)) {
          setAgencies(data);
          // Agence par défaut : Cocody ou la première
          const cocody = data.find((a) => a.name?.toLowerCase().includes('cocody')) || data[0];
          setSelectedAgency(cocody || null);
        }
      })
      .catch((err) => {
        console.error('Chargement des agences échoué.', err);
      })
      .finally(() => {
        if (active) setAgenciesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const primaryColor = theme?.colors?.primary || '#00865D';

  return (
    <Layout>
      <div className="w-full">
        <Container maxWidth="max-w-7xl" padding={true} className="w-full">
          {/* 1. Hero Section (Accroche + CTA + Image BNI) */}
          <HomeHero
            onOpenTicket={() => handleOpenModal('ticket')}
            primaryColor={primaryColor}
          />

          {/* 2. Barre des 4 Accès Rapides */}
          <HomeQuickAccess
            onOpenTicket={() => handleOpenModal('ticket')}
            onOpenMap={() => handleOpenModal('map')}
            onOpenSatisfaction={() => handleOpenModal('satisfaction')}
            onFollowTicket={() => handleOpenModal('ticket')}
            primaryColor={primaryColor}
          />

          {/* 3. Section Fluidité en Temps Réel (Stats + Mini-Carte) */}
          <HomeFluiditySection
            agencies={agencies}
            selectedAgency={selectedAgency}
            onSelectAgency={setSelectedAgency}
            onOpenMap={() => handleOpenModal('map')}
            primaryColor={primaryColor}
          />

          {/* 4. Section Expérience Synapse (Avis, Tickets, Notifications, Encart Promo) */}
          <HomeExperienceSection
            onOpenSatisfaction={() => handleOpenModal('satisfaction')}
            onOpenTicket={() => handleOpenModal('ticket')}
            primaryColor={primaryColor}
          />
        </Container>
      </div>

      {/* ─── Navigation Inférieure Mobile (Fixe sur mobile) ─── */}
      <BottomNav
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        onOpenMap={() => handleOpenModal('map')}
        onOpenSatisfaction={() => handleOpenModal('satisfaction')}
        onOpenTicket={() => handleOpenModal('ticket')}
        primaryColor={primaryColor}
      />

      {/* ─── Modales Existantes (Ouverture / Fermeture Préservée) ─── */}
      {activeModal === 'ticket' && (
        <TicketScreen
          isOpen
          isClosing={closingModal === 'ticket'}
          onClose={handleCloseModal}
          theme={theme}
          agencies={agencies}
          agenciesLoading={agenciesLoading}
        />
      )}

      {activeModal === 'satisfaction' && (
        <SatisfactionScreen
          isOpen
          isClosing={closingModal === 'satisfaction'}
          onClose={handleCloseModal}
          theme={theme}
          agencies={agencies}
          agenciesLoading={agenciesLoading}
        />
      )}

      {activeModal === 'map' && (
        <AgencyMapScreen
          isOpen
          isClosing={closingModal === 'map'}
          onClose={handleCloseModal}
          theme={theme}
          agencies={agencies}
        />
      )}
    </Layout>
  );
}
