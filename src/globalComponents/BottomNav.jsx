import { Home, MapPin, Star, Ticket, MoreHorizontal } from 'lucide-react';

/**
 * Bottom Navigation Bar — Mobile First (Fidèle à la maquette)
 *
 * Visible uniquement sur mobile (md:hidden).
 * 5 onglets avec gestion de l'état actif et ouverture des modales Redux.
 */
export default function BottomNav({
  activeTab = 'home',
  onTabChange,
  onOpenMap,
  onOpenSatisfaction,
  onOpenTicket,
  primaryColor = '#00865D'
}) {
  const tabs = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      onClick: () => {
        if (onTabChange) onTabChange('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'agences',
      label: 'Agences',
      icon: MapPin,
      onClick: () => {
        if (onTabChange) onTabChange('agences');
        if (onOpenMap) onOpenMap();
      },
    },
    {
      id: 'avis',
      label: 'Avis',
      icon: Star,
      onClick: () => {
        if (onTabChange) onTabChange('avis');
        if (onOpenSatisfaction) onOpenSatisfaction();
      },
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Ticket,
      onClick: () => {
        if (onTabChange) onTabChange('tickets');
        if (onOpenTicket) onOpenTicket();
      },
    },
    {
      id: 'plus',
      label: 'Plus',
      icon: MoreHorizontal,
      onClick: () => {
        if (onTabChange) onTabChange('plus');
        alert("Services complémentaires : FAQ, assistance téléphonique et informations légales.");
      },
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-2 flex justify-around items-center safe-area-pb shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={tab.onClick}
            className="flex-1 flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer"
          >
            <Icon
              className="w-5 h-5 transition-transform active:scale-90"
              style={{
                color: isActive ? primaryColor : '#94A3B8',
              }}
            />
            <span
              className="text-[10px] font-bold mt-1 tracking-tight"
              style={{
                color: isActive ? primaryColor : '#64748B',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

