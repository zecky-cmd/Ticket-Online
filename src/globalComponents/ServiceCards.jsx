import { Ticket, MessageSquareHeart, MapPin, Star, ArrowRight } from 'lucide-react';

export default function OnlineServiceCards({ theme, onSelectService }) {
  return (
    <section className="w-full bg-slate-900/95 py-10 sm:py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre de la section de services */}
        <div className="text-center mb-8 sm:mb-10">
          <span 
            className="text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-2 shadow-xs"
            style={{ backgroundColor: theme.colors.badgeBg, color: theme.colors.badgeText }}
          >
            Services Disponibles
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Accédez à vos démarches en ligne
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
            Sélectionnez une option pour réserver votre passage, noter la qualité de notre service ou localiser une agence.
          </p>
        </div>

        {/* Grille des 3 Cartes de Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARTE 1 : PRISE DE TICKET EN LIGNE */}
          <button
            type="button"
            onClick={() => onSelectService('ticket')}
            className={`group text-left p-6 sm:p-7 rounded-3xl bg-white hover:bg-white border border-slate-200/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 focus:outline-none flex flex-col justify-between cursor-pointer ${theme.colors.cardHoverBorder}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Ticket className="w-7 h-7" />
                </div>
                <span 
                  className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wide"
                  style={{ backgroundColor: theme.colors.badgeBg, color: theme.colors.badgeText }}
                >
                  Prioritaire
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                Prise de Ticket en Ligne
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Réservez votre numéro digital, évitez l'attente physique et suivez votre position en direct.
              </p>
            </div>

            <div 
              className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold" 
              style={{ color: theme.colors.primary }}
            >
              <span>Prendre mon ticket</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* CARTE 2 : ENQUÊTE DE SATISFACTION */}
          <button
            type="button"
            onClick={() => onSelectService('satisfaction')}
            className={`group text-left p-6 sm:p-7 rounded-3xl bg-white hover:bg-white border border-slate-200/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 focus:outline-none flex flex-col justify-between cursor-pointer ${theme.colors.cardHoverBorder}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <MessageSquareHeart className="w-7 h-7" />
                </div>
                <span 
                  className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wide flex items-center gap-1"
                  style={{ backgroundColor: theme.colors.badgeBg, color: theme.colors.badgeText }}
                >
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 4.8 / 5
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                Satisfaction Client
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Votre expérience est essentielle. Notez nos conseillers et aidez-nous à enrichir nos services.
              </p>
            </div>

            <div 
              className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold" 
              style={{ color: theme.colors.primary }}
            >
              <span>Donner mon avis</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* CARTE 3 : VOIR LES AGENCES SUR LA CARTE */}
          <button
            type="button"
            onClick={() => onSelectService('map')}
            className={`group text-left p-6 sm:p-7 rounded-3xl bg-white hover:bg-white border border-slate-200/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 focus:outline-none flex flex-col justify-between cursor-pointer ${theme.colors.cardHoverBorder}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <MapPin className="w-7 h-7" />
                </div>
                <span 
                  className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wide"
                  style={{ backgroundColor: theme.colors.badgeBg, color: theme.colors.badgeText }}
                >
                  25 Agences
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                Nos Agences sur la Carte
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Localisez l'agence la plus proche de chez vous, découvrez les horaires et l'affluence en temps réel.
              </p>
            </div>

            <div 
              className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold" 
              style={{ color: theme.colors.primary }}
            >
              <span>Trouver une agence</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

        </div>
      </div>
    </section>
  );
}
