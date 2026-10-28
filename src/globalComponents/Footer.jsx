import { Ticket, MessageSquareHeart, MapPin } from 'lucide-react';
import { THEMES } from '../theme/themes';
import HeaderBrand from './header/HeaderBrand';

export default function Footer({
  theme,
  currentThemeKey,
  setCurrentThemeKey,
  themes = THEMES,
  onSelectService
}) {
  const primaryColor = theme?.colors?.primary || '#00843D';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          
          {/* Identité de Marque Footer (utilise HeaderBrand unifié) */}
          <HeaderBrand
            logo="/CLIENT_LOGO.png"
            abbreviation="Synapse"
            definition="S2Q - Tickets en Ligne"
            primaryColor={primaryColor}
            size="sm"
            className="text-white"
          />

          {/* Raccourcis Directs vers les 3 Services */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
            <button 
              type="button"
              onClick={() => onSelectService && onSelectService('ticket')} 
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" style={{ color: theme?.colors?.accent || primaryColor }} /> E-Ticket
            </button>
            <button 
              type="button"
              onClick={() => onSelectService && onSelectService('satisfaction')} 
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" style={{ color: theme?.colors?.accent || primaryColor }} /> Avis Client
            </button>
            <button 
              type="button"
              onClick={() => onSelectService && onSelectService('map')} 
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: theme?.colors?.accent || primaryColor }} /> Carte Réseau
            </button>
          </div>

          {/* Pastilles de changement rapide de thème */}
          {/* <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Thème :</span>
            {Object.entries(themes).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCurrentThemeKey && setCurrentThemeKey(key)}
                title={item.name}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                  currentThemeKey === key ? 'border-white scale-110 ring-2 ring-white/30' : 'border-transparent opacity-70'
                }`}
                style={{ backgroundColor: item.colors.primary }}
              />
            ))}
          </div> */}

        </div>


      </div>
    </footer>
  );
}
