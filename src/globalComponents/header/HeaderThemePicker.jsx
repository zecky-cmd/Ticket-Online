import { useState, useRef, useEffect } from 'react';
import { Palette, CheckCircle2 } from 'lucide-react';
import { THEMES } from '../../theme/themes';

export default function HeaderThemePicker({
  currentThemeKey = 'vertBlanc',
  onThemeChange,
  themes = THEMES,
  primaryColor
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Fermeture automatique au clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeColor = primaryColor || themes[currentThemeKey]?.colors?.primary || '#059669';

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        title="Changer le jeu de couleur"
      >
        <Palette className="w-4 h-4" style={{ color: activeColor }} />
        <span className="hidden sm:inline">Thème</span>
        <span 
          className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-2xs"
          style={{ backgroundColor: activeColor }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="text-[10px] font-extrabold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
            Nuancier de l'Application
          </div>
          {Object.entries(themes).map(([key, thm]) => {
            const isSelected = currentThemeKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (onThemeChange) onThemeChange(key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-4 h-4 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: thm.colors.primary }}
                  />
                  <span>{thm.name}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4" style={{ color: activeColor }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
