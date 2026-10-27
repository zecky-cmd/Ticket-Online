import { Phone, Palette, CheckCircle2 } from 'lucide-react';
import { THEMES } from '../data/onlineData';

export default function OnlineHeader({
  theme,
  currentThemeKey,
  setCurrentThemeKey,
  showThemePicker,
  setShowThemePicker,
  themes = THEMES
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo Corporate */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {/* Emblème SVG élégant */}
            <img src="/CLIENT_LOGO.png" alt="BNI" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-tight text-slate-900 block leading-none">
              <span style={{ color: theme.colors.primary }}>BNI</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Banque Nationale d'Investissement
            </span>
          </div>
        </div>

        {/* Contact Direct & Sélecteur de Thème */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Badge Contact Rapide */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100/90 px-3.5 py-2 rounded-xl">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>Assistance : <b>+225 27 20 00 00</b></span>
          </div>

          {/* Sélecteur de thème interchangeable */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
              title="Changer le jeu de couleur"
            >
              <Palette className="w-4 h-4" style={{ color: theme.colors.primary }} />
              <span className="hidden sm:inline">Thème</span>
              <span 
                className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-2xs"
                style={{ backgroundColor: theme.colors.primary }}
              />
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] font-extrabold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Nuancier de l'Application
                </div>
                {Object.entries(themes).map(([key, thm]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentThemeKey(key);
                      setShowThemePicker(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
                      currentThemeKey === key ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: thm.colors.primary }}
                      />
                      <span>{thm.name}</span>
                    </div>
                    {currentThemeKey === key && (
                      <CheckCircle2 className="w-4 h-4" style={{ color: theme.colors.primary }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
