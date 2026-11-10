import { Zap, MapPin, Star } from 'lucide-react';

/**
 * Barre d'Accès Rapides Flottante — Conforme au découpage de la maquette
 *
 * Flotte à cheval entre la bannière Hero et la section Fluidité grâce à une marge négative.
 * Coins très arrondis, ombre portée douce et séparateurs verticaux élégants.
 */
export default function HomeQuickAccess({
  onOpenTicket,
  onOpenMap,
  onOpenSatisfaction,
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
    // {
    //   id: 'follow',
    //   icon: BarChart3,
    //   title: 'Suivez votre ticket',
    //   desc: 'En temps réel',
    //   onClick: onFollowTicket || onOpenTicket,
    // },
    {
      id: 'satisfaction',
      icon: Star,
      title: 'Donnez votre avis',
      desc: 'Améliorez notre service',
      onClick: onOpenSatisfaction,
    },
  ];

  return (
    <div className="relative  z-20 -mt-9 sm:-mt-12 md:-mt-14 px-3 sm:px-6 w-full max-w-6xl mx-auto">
      <div className="bg-white/98 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/8 border border-slate-200/90 p-3 sm:p-4 md:p-5 transition-all">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-0 lg:divide-x divide-slate-100">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 lg:px-5 rounded-2xl hover:bg-slate-50 transition-all text-left cursor-pointer group"
              >
                {/* Pastille d'icône verte douce */}
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-108"
                  style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
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
    </div>
  );
}
