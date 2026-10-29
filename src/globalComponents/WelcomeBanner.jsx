import React from 'react';

/**
 * Composant WelcomeBanner (Zone d'accroche principale)
 * 
 * Fidèle à la maquette :
 * - Eyebrow avec pastille ambre : ● VOTRE ACCUEIL, EN PLUS SIMPLE
 * - Grand titre : "L'agence, sans l'attente."
 * - Sous-titre descriptif
 * - Espacements calibrés pour aérer l'interface
 */
export default function WelcomeBanner({
  tag = 'VOTRE ACCUEIL, EN PLUS SIMPLE',
  title = "L'agence, sans l'attente.",
  subtitle = 'Préparez votre visite, trouvez une agence ou partagez votre expérience en quelques instants.',
  className = ''
}) {
  return (
    <div className={`text-center pt-2 sm:pt-4 md:pt-6 pb-2 px-4 select-none ${className}`}>
      {/* 1. Badge Eyebrow avec pastille ambre */}
      {tag && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700 shadow-2xs mb-2 sm:mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs inline-block animate-pulse" />
          <span>{tag}</span>
        </div>
      )}

      {/* 2. Grand Titre percutant */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto">
        {title}
      </h1>

      {/* 3. Sous-titre aéré */}
      {subtitle && (
        <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-2 sm:mt-2.5 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
