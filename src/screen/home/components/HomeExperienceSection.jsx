import { MessageSquareHeart, Ticket, Bell, Clock, ArrowRight } from 'lucide-react';

/**
 * Section "L'expérience Synapse, c'est aussi..."
 *
 * 3 Cartes de raccourcis + 1 Encart promotionnel BNI "Votre temps compte"
 */
export default function HomeExperienceSection({
  onOpenSatisfaction,
  onOpenTicket,
  primaryColor = '#00865D'
}) {
  return (
    <section className="mt-8 sm:mt-12 pb-8 sm:pb-12">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-4 sm:mb-6">
        L'expérience Synapse, c'est aussi...
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* ── Carte 1 : Donner mon avis ── */}
        <button
          type="button"
          onClick={onOpenSatisfaction}
          className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center gap-3.5 text-left hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
          >
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Donner mon avis
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span>Votre satisfaction compte</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </button>

        {/* ── Carte 2 : Mes tickets ── */}
        <button
          type="button"
          onClick={onOpenTicket}
          className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center gap-3.5 text-left hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
          >
            <Ticket className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Mes tickets
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span>Consultez vos passages</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </button>

        {/* ── Carte 3 : Notifications ── */}
        <button
          type="button"
          onClick={() => alert("Les notifications par SMS / WhatsApp sont activées dès la confirmation de votre ticket.")}
          className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center gap-3.5 text-left hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
          >
            <Bell className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Notifications
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span>Restez informé en temps réel</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </button>

        {/* ── Encart Promo Vert BNI ── */}
        <div
          className="lg:col-span-3 rounded-2xl p-4 sm:p-5 text-white flex items-center justify-between gap-3 shadow-md relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #006B4C 0%, #00865D 100%)',
          }}
        >
          <div className="min-w-0 z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-bold leading-tight">Votre temps compte.</p>
            <p className="text-xs text-white/80 mt-1 leading-snug line-clamp-2">
              Nous facilitons chaque étape de votre accueil en agence.
            </p>
          </div>
          {/* Vignette d'agence en incrustation */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-xs">
            <img
              src="/img/img1.jpg"
              alt="BNI Agence"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
