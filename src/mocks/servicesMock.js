import { Ticket, MessageSquareQuote, MapPin } from 'lucide-react';

/**
 * Cartes d'actions rapides (alignées fidèlement sur la maquette)
 */
export const SERVICES_MOCK = [
  {
    id: 'ticket',
    title: 'Ticket en ligne',
    description: 'Préparez votre passage',
    icon: Ticket,
    iconBgType: 'primary', // fond vert primary
  },
  {
    id: 'satisfaction',
    title: 'Avis client',
    description: 'Partagez votre expérience',
    icon: MessageSquareQuote,
    iconBgType: 'light', // fond vert pâle
  },
  {
    id: 'map',
    title: 'Nos agences',
    description: 'Trouvez la plus proche',
    icon: MapPin,
    iconBgType: 'light', // fond vert pâle
  },
];
