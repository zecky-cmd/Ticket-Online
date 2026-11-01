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
  title = "L'agence, sans l'attente.",
  subtitle = 'Préparez votre visite, trouvez une agence ou partagez votre expérience en quelques instants.',
  className = ''
}) {
  return (
    <div className={`text-center pt-1 sm:pt-2 md:pt-3 pb-0.5 sm:pb-1 px-4 select-none ${className}`}>
      {/* 1. Badge Eyebrow avec pastille ambre */}
      {/* {tag && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-700 shadow-2xs mb-1 sm:mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-xs inline-block animate-pulse" />
          <span>{tag}</span>
        </div>
      )} */}

      {/* 2. Grand Titre percutant calibré 100vh */}
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto">
        {title}
      </h1>

      {/* 3. Sous-titre aéré */}
      {subtitle && (
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 mt-1 sm:mt-1.5 max-w-lg mx-auto leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
