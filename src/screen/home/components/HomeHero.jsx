import { ArrowRight, Play, Ticket } from 'lucide-react';

/**
 * Hero Section — Conforme à la maquette BNI Synapse
 *
 * Desktop : Disposition 2 colonnes (Accroche + CTA à gauche / Photo conseillère à droite)
 * Mobile : Titre, sous-titre, CTA pleine largeur, puis visuel
 */
export default function HomeHero({ onOpenTicket, primaryColor = '#00865D' }) {
  return (
    <section className="relative pt-4 sm:pt-6 md:pt-8 pb-4 md:pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* ── Colonne Gauche : Accroche & Boutons d'Action ── */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.08]">
            Votre agence,<br />
            <span style={{ color: primaryColor }}>à votre rythme.</span>
          </h1>

          <p className="mt-3 sm:mt-4 text-slate-600 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
            Prenez votre ticket en ligne, trouvez une agence et gagnez du temps en toute sérénité.
          </p>

          {/* Boutons d'action */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* CTA Principal : Prendre un ticket */}
            <button
              type="button"
              onClick={onOpenTicket}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-full text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-900/15 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold rounded-full hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 bg-white">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </span>
              <span>Voir comment ça marche</span>
              <span className="text-slate-400 font-normal text-xs">| 2 min</span>
            </button>
          </div>
        </div>

        {/* ── Colonne Droite : Photographie Agence BNI ── */}
        <div className="lg:col-span-6 xl:col-span-5">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-emerald-50 aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:h-[380px] xl:h-[420px]">
            <img
              src="/image.jpg"
              alt="Accueil en agence BNI"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                // Fallback si l'image n'est pas trouvée
                e.currentTarget.src = '/img/img1.jpg';
              }}
            />
            {/* Dégradé doux en bas d'image pour l'intégration visuelle */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
