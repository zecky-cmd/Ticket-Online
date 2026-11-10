import { MessageSquareHeart, Ticket, Bell, Clock, ArrowRight } from 'lucide-react';

/**
 * Section "L'expérience Synapse, c'est aussi..."
 *
 * 3 Cartes de raccourcis indépendantes + 1 Encart promotionnel
 * Chaque élément est strictement indépendant, avec coins très arrondis et ombre douce.
 */
export default function HomeExperienceSection({
  onOpenSatisfaction,
  onOpenTicket,
  primaryColor = '#00865D'
}) {
  return (
    <section className="mt-10 sm:mt-14 pb-8 sm:pb-14">
      {/* Titre de section */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-5 sm:mb-6">
        L'expérience Synapse, c'est aussi...
      </h2>

      {/* Grille des 4 blocs indépendants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* ── Bloc 1 : Donner mon avis ── */}
        <button
          type="button"
          onClick={onOpenSatisfaction}
          className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/80 flex items-center gap-4 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
          >
            <MessageSquareHeart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Donner mon avis
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Votre satisfaction compte</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </button>

        {/* ── Bloc 2 : Mes tickets ── */}
        <button
          type="button"
          onClick={onOpenTicket}
          className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/80 flex items-center gap-4 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
          >
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Mes tickets
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Consultez vos passages</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </button>

        {/* ── Bloc 3 : Notifications ── */}
        <button
          type="button"
          onClick={() => alert("Les notifications par SMS / WhatsApp sont activées dès la confirmation de votre ticket.")}
          className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/80 flex items-center gap-4 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: '#E5F5EF', color: primaryColor }}
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Notifications
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Restez informé en temps réel</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </button>

        {/* ── Bloc 4 : Encart Promotionnel ── */}
        <div
          className="lg:col-span-3 rounded-2xl sm:rounded-3xl p-5 text-white flex items-center justify-between gap-3 shadow-md relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, #004D34 100%)`,
          }}
        >
          <div className="min-w-0 z-10">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-2.5">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm sm:text-base font-black leading-tight">Votre temps compte.</p>
            <p className="text-xs text-white/85 mt-1 leading-snug line-clamp-2">
              Nous facilitons chaque étape de votre accueil en agence.
            </p>
          </div>

          {/* Vignette d'agence en incrustation */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-white/25 shadow-md">
            <img
              src="/img/img1.jpg"
              alt="Accueil en agence"
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
