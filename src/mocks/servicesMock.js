import { Ticket, MessageSquareHeart, MapPin } from 'lucide-react';

/**
 * Liste des cartes de services en ligne
 */
export const SERVICES_MOCK = [
  {
    id: 'ticket',
    title: 'Prise de Ticket en Ligne',
    description: "Réservez votre numéro digital, évitez l'attente physique et suivez votre position en direct.",
    badge: 'Prioritaire',
    actionText: 'Prendre mon ticket',
    icon: Ticket,
  },
  {
    id: 'satisfaction',
    title: 'Satisfaction Client',
    description: 'Votre expérience est essentielle. Notez nos conseillers et aidez-nous à enrichir nos services.',
    badge: '★ 4.8 / 5',
    actionText: 'Donner mon avis',
    icon: MessageSquareHeart,
  },
  {
    id: 'map',
    title: 'Nos Agences sur la Carte',
    description: "Localisez l'agence la plus proche de chez vous, découvrez les horaires et l'affluence en temps réel.",
    badge: '25 Agences',
    actionText: 'Trouver une agence',
    icon: MapPin,
  },
];
