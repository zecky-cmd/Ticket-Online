import { Ticket, MessageSquareHeart, MapPin } from 'lucide-react';
import { THEMES } from '../data/onlineData';

export default function OnlineFooter({
  theme,
  currentThemeKey,
  setCurrentThemeKey,
  themes = THEMES,
  onSelectService
}) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          
          {/* Logo Footer */}
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-black text-xl text-white tracking-tight">
              SERVI<span style={{ color: theme.colors.primary }}>PRO</span>
            </span>
          </div>

          {/* Raccourcis Directs vers les 3 Services */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
            <button 
              onClick={() => onSelectService('ticket')} 
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" style={{ color: theme.colors.accent }} /> E-Ticket
            </button>
            <button 
              onClick={() => onSelectService('satisfaction')} 
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" style={{ color: theme.colors.accent }} /> Avis Client
            </button>
            <button 
              onClick={() => onSelectService('map')} 
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: theme.colors.accent }} /> Carte Réseau
            </button>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="text-slate-400">Lun - Sam : 08h00 - 18h00</span>
          </div>

          {/* Pastilles de changement rapide de thème */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Thème :</span>
            {Object.entries(themes).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setCurrentThemeKey(key)}
                title={item.name}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                  currentThemeKey === key ? 'border-white scale-110 ring-2 ring-white/30' : 'border-transparent opacity-70'
                }`}
                style={{ backgroundColor: item.colors.primary }}
              />
            ))}
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} SERVIPRO Entreprise. Tous droits réservés.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Portail Agences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
