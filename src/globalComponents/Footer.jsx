import React from 'react';
import Link from './ui/Link';

/**
 * Composant Footer (Pied de page minimaliste blanc)
 * 
 * Conforme à la maquette :
 * - Fond blanc / très clair épuré
 * - Gauche : Signature "Synapse · S2Q" + "Un accueil plus fluide, à votre rythme."
 * - Droite : Liens "Confidentialité | Assistance | © 2026 Synapse"
 * - Hauteur compacte pour garantir le Zéro-Scroll
 */
export default function Footer({
  brandName = 'Synapse · S2Q',
  tagline = 'Un accueil plus fluide, à votre rythme.',
  year = new Date().getFullYear(),
  className = ''
}) {
  return (
    <footer className={`w-full bg-white border-t border-slate-100 text-slate-500 py-2 sm:py-3 px-4 sm:px-6 lg:px-8 select-none ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-[11px] sm:text-xs">
        {/* Côté gauche : Marque & Slogan */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-extrabold text-slate-900 tracking-tight">
            {brandName}
          </span>
          {tagline && (
            <>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline font-medium">
                {tagline}
              </span>
            </>
          )}
        </div>

        {/* Côté droit : Liens légaux & Copyright */}
        <div className="flex items-center gap-3 sm:gap-4 text-slate-500">
          <Link to="/confidentialite" className="hover:text-slate-800 transition-colors">
            Confidentialité
          </Link>
          <span className="text-slate-200">|</span>
          <Link to="/assistance" className="hover:text-slate-800 transition-colors">
            Assistance
          </Link>
          <span className="text-slate-200">|</span>
          <span className="text-slate-400">
            © {year} Synapse
          </span>
        </div>
      </div>
    </footer>
  );
}
