import { Users, Clock, ArrowRight, Check } from 'lucide-react';
import HomeMiniMap from './HomeMiniMap';

/**
 * Section Fluidité en Temps Réel
 *
 * Colonne 1 : Carte d'affluence temps réel de l'agence sélectionnée (Stats, Compteurs, Sparkline SVG)
 * Colonne 2 : Mini-carte géographique interactive avec agences et marqueurs
 */
export default function HomeFluiditySection({
  agencies = [],
  selectedAgency,
  onSelectAgency,
  onOpenMap,
  primaryColor = '#00865D'
}) {
  // Agence par défaut : celle sélectionnée ou Cocody / première agence
  const activeAgency = selectedAgency || agencies[0] || {
    id: 'cocody',
    name: 'Agence Cocody',
    commune: 'Cocody',
    affluence: 'faible',
    currentWaitTime: '08 min',
    waitingClients: 4,
  };

  const waitTime = activeAgency.currentWaitTime || '08 min';
  const waitingCount = activeAgency.waitingClients ?? 4;
  const isFluid = activeAgency.affluence !== 'elevee';

  return (
    <section className="mt-8 sm:mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Colonne Gauche : Carte Statistique de l'Agence ── */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            {/* Header : Badge Fluidité + Mis à jour */}
            <div className="flex items-center justify-between gap-2 flex-wrap pb-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide"
                style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
              >
                Fluidité en temps réel
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Mis à jour il y a 1 min
              </span>
            </div>

            {/* Nom de l'agence & Statut */}
            <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {activeAgency.name || 'Agence Cocody'}
              </h2>

              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: isFluid ? '#E5F5EF' : '#FEF3C7',
                  color: isFluid ? primaryColor : '#D97706',
                  borderColor: isFluid ? 'rgba(0, 134, 93, 0.2)' : 'rgba(217, 119, 6, 0.2)',
                }}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                {isFluid ? 'Fluide' : 'Affluence modérée'}
              </span>
            </div>

            {/* Deux Compteurs Clés */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Clients en attente */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>En attente</span>
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {String(waitingCount).padStart(2, '0')}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Clients en agence
                </div>
              </div>

              {/* Temps d'attente estimé */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Attente estimée</span>
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {waitTime}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Avant votre passage
                </div>
              </div>
            </div>

            {/* Courbe Sparkline SVG de fréquentation de la journée */}
            <div className="mt-6 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Fréquentation de la journée</span>
                <span className="font-semibold text-emerald-700">Pic estimé à 12h</span>
              </div>
              <div className="w-full h-18 sm:h-20 relative">
                <svg viewBox="0 0 400 90" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={primaryColor} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Zone de remplissage sous la courbe */}
                  <path
                    d="M 0 75 Q 70 65, 120 70 T 220 50 T 300 35 T 400 20 L 400 90 L 0 90 Z"
                    fill="url(#curveGradient)"
                  />
                  {/* Ligne principale de la courbe */}
                  <path
                    d="M 0 75 Q 70 65, 120 70 T 220 50 T 300 35 T 400 20"
                    fill="none"
                    stroke={primaryColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Points de données clés */}
                  <circle cx="0" cy="75" r="4.5" fill="white" stroke={primaryColor} strokeWidth="3" />
                  <circle cx="120" cy="70" r="4.5" fill="white" stroke={primaryColor} strokeWidth="3" />
                  <circle cx="220" cy="50" r="4.5" fill="white" stroke={primaryColor} strokeWidth="3" />
                  <circle cx="300" cy="35" r="4.5" fill="white" stroke={primaryColor} strokeWidth="3" />
                  <circle cx="400" cy="20" r="5" fill={primaryColor} stroke="white" strokeWidth="3" />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                <span>08h00</span>
                <span>10h00</span>
                <span>12h00</span>
                <span>14h00</span>
                <span>16h30</span>
              </div>
            </div>
          </div>

          {/* Bouton CTA Bas de Carte */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onOpenMap}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Voir le détail de l'agence</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* ── Colonne Droite : Mini-Carte Interactive ── */}
        <div className="lg:col-span-6 min-h-[320px] sm:min-h-[380px] lg:min-h-full">
          <HomeMiniMap
            agencies={agencies}
            selectedAgency={activeAgency}
            onSelectAgency={onSelectAgency}
            onOpenMap={onOpenMap}
            primaryColor={primaryColor}
          />
        </div>
      </div>
    </section>
  );
}

