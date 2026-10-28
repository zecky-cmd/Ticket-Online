import Card from './ui/Card';
import Section from './ui/Section';
import { SERVICES_MOCK } from '../mocks/servicesMock';

/**
 * Section des Cartes de Services (orchestrée via Card et Section génériques)
 * 
 * @param {Object} theme - Thème actif (couleurs, badges, hover)
 * @param {Array} services - Liste des cartes de services à afficher
 * @param {function} onSelectService - Callback au clic sur une carte (reçoit service.id)
 * @param {'sm'|'md'|'lg'} cardSize - Échelle de taille des cartes
 * @param {'white'|'dark'|'outline'} cardVariant - Variante de style de fond
 * @param {string} sectionTitle - Titre de la section
 * @param {string} sectionTag - Badge de la section
 * @param {string} sectionSubtitle - Sous-titre de la section
 */
export default function ServiceCards({
  theme,
  services = SERVICES_MOCK,
  onSelectService,
  cardSize = 'md',
  cardVariant = 'white',
  sectionTitle = 'Accédez à vos démarches en ligne',
  // sectionTag = 'Services Disponibles',
  sectionSubtitle = 'Sélectionnez une option pour réserver votre passage, noter la qualité de notre service ou localiser une agence.'
}) {
  return (
    <Section
      // tag={sectionTag}
      title={sectionTitle}
      subtitle={sectionSubtitle}
      badgeBg={theme?.colors?.badgeBg}
      badgeColor={theme?.colors?.badgeText}
      background="dark"
    >
      {/* Grille de cartes générées avec le composant unique Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card
            key={service.id}
            icon={service.icon}
            title={service.title}
            description={service.description}
            badge={service.badge}
            badgeBg={theme?.colors?.badgeBg}
            badgeColor={theme?.colors?.badgeText}
            actionText={service.actionText}
            primaryColor={theme?.colors?.primary}
            hoverBorder={theme?.colors?.cardHoverBorder}
            size={cardSize}
            variant={cardVariant}
            onClick={() => onSelectService && onSelectService(service.id)}
          />
        ))}
      </div>
    </Section>
  );
}
