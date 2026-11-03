import { Clock, ArrowRight } from 'lucide-react';
import { SERVICES_MOCK } from '../mocks/servicesMock';

/**
 * Composant ServiceCards (Grille des 3 actions principales)
 * 
 * Conforme aux maquettes Desktop et Mobile :
 * - Desktop : 3 cartes horizontales blanches avec icône stylisée, titre, description et flèche '→'
 * - Mobile : 3 colonnes compactes (grid-cols-3)
 * - Couleurs conformes : Vert #008056 pour Ticket en ligne, Vert pâle #E6F5F0 pour les 2 autres
 */
export default function ServiceCards({
  theme,
  services = SERVICES_MOCK,
  onSelectService,
  title = "Que souhaitez-vous faire ?",
  hint = "Quelques clics suffisent",
  className = ''
}) {
  const primaryColor = theme?.colors?.primary || '#008056';
  const primaryLight = theme?.colors?.primaryLight || '#E6F5F0';

  return (
    <div className={`w-full select-none ${className}`}>
      {/* En-tête de section */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 px-1">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        {hint && (
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{hint}</span>
          </span>
        )}
      </div>

      {/* Grille des cartes */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          const isPrimaryIcon = service.iconBgType === 'primary';

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService && onSelectService(service.id)}
              className="group bg-white hover:bg-slate-50/80 active:scale-[0.98] border border-slate-200/80 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 md:p-3 text-left shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 cursor-pointer"
            >
              {/* Côté gauche : Icône + Textes */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left w-full sm:w-auto">
                {/* Boîte d'icône carrée */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs ${
                    isPrimaryIcon ? 'text-white' : ''
                  }`}
                  style={{
                    backgroundColor: isPrimaryIcon ? primaryColor : primaryLight,
                    color: isPrimaryIcon ? '#FFFFFF' : primaryColor
                  }}
                >
                  {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>

                {/* Textes (Titre + Description) */}
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
                    {service.title}
                  </span>
                  <span className="hidden sm:block text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {service.description}
                  </span>
                </div>
              </div>

              {/* Flèche droite verte (visible desktop) */}
              <div
                className="hidden sm:flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: primaryColor }}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
