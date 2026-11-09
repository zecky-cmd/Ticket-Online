import { Zap, MapPin, BarChart3, Star } from 'lucide-react';

/**
 * Barre des Accès Rapides — 4 Piliers Synapse
 *
 * Desktop : 4 colonnes horizontales avec séparateurs
 * Mobile : Grille 2x2 tactile
 */
export default function HomeQuickAccess({
  onOpenTicket,
  onOpenMap,
  onOpenSatisfaction,
  onFollowTicket,
  primaryColor = '#00865D'
}) {
  const items = [
    {
      id: 'ticket',
      icon: Zap,
      title: 'Prise de ticket rapide',
      desc: 'En quelques clics',
      onClick: onOpenTicket,
    },
    {
      id: 'map',
      icon: MapPin,
      title: 'Trouvez une agence',
      desc: 'Carte et infos en temps réel',
      onClick: onOpenMap,
    },
    {
      id: 'follow',
      icon: BarChart3,
      title: 'Suivez votre ticket',
      desc: 'En temps réel',
      onClick: onFollowTicket || onOpenTicket,
    },
    {
      id: 'satisfaction',
      icon: Star,
      title: 'Donnez votre avis',
      desc: 'Améliorez notre service',
      onClick: onOpenSatisfaction,
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100/90 p-3 sm:p-4 md:p-5 mt-4 sm:mt-6 transition-all">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-0 lg:divide-x divide-slate-100">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 lg:px-4 rounded-xl hover:bg-slate-50/80 transition-all text-left cursor-pointer group"
            >
              {/* Cercle d'icône vert doux */}
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Textes */}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                  {item.title}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
