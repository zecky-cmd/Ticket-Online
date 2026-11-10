import { ArrowRight, Play, Ticket } from 'lucide-react';

/**
 * Hero Banner Immersive — Conforme au découpage de la maquette
 *
 * La photo de l'agence couvre toute la bannière en arrière-plan.
 * Un fond travaillé (dégradé blanc/lumière doux) à gauche assure
 * un contraste et une lisibilité parfaits pour le texte et les CTA.
 */
export default function HomeHero({ onOpenTicket, primaryColor = '#00865D' }) {
  return (
    <section className="relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden shadow-sm border border-slate-200/80 bg-white">
      {/* ── 1. Image de Fond Couvrant Toute la Bannière ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/image.jpg"
          alt="Accueil en agence"
          className="w-full h-full object-cover object-[75%_center] sm:object-[center_right]"
          onError={(e) => {
            e.currentTarget.src = '/img/img1.jpg';
          }}
        />

        {/* ── 2. Fond Travaillé / Dégradé Doux Multi-Couches ── */}
        {/* Desktop : Dégradé confiné au quart gauche — droite entièrement nette */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-white/98 via-white/50 via-28% to-transparent z-[1]" />

        {/* Voile vert d'eau très subtil à gauche uniquement — cohérence de marque */}
        <div
          className="hidden sm:block absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 10% 50%, rgba(229, 245, 239, 0.4) 0%, transparent 32%)',
          }}
        />

        {/* Mobile : Dégradé vertical pour contraster le texte sur smartphone */}
        <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 via-55% to-white/20 z-[1]" />
      </div>

      {/* ── 3. Contenu Textuel Superposé sur le Fond Travaillé ── */}
      <div className="relative z-10 px-6 sm:px-10 md:px-12 lg:px-16 pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24 max-w-2xl lg:max-w-3xl">
        {/* Titre Principal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight leading-[1.08]">
          Votre agence,<br />
          <span style={{ color: primaryColor }}>à votre rythme.</span>
        </h1>

        {/* Sous-titre */}
        <p className="mt-3.5 sm:mt-4 text-slate-600 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-normal">
          Prenez votre ticket en ligne, trouvez une agence et gagnez du temps en toute sérénité.
        </p>

        {/* Boutons d'Action */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
          {/* CTA Principal : Prendre un ticket */}
          <button
            type="button"
            onClick={onOpenTicket}
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/20 hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="p-1 rounded-md bg-white/20">
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <span>Prendre un ticket en ligne</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
          </button>

          {/* Bouton Secondaire : Voir comment ça marche */}
          <button
            type="button"
            onClick={() => alert("Synapse vous permet de choisir votre agence, réserver un créneau ou prendre un ticket en temps réel sans attendre.")}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 text-slate-800 hover:text-slate-950 text-xs sm:text-sm font-semibold rounded-full hover:bg-white/70 transition-colors cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 bg-white shadow-xs">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </span>
            <span>Voir comment ça marche</span>
            <span className="text-slate-400 font-normal text-xs">| 2 min</span>
          </button>
        </div>
      </div>
    </section>
  );
}
