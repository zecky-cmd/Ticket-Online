import Link from './ui/Link';
import { SITE_CONFIG } from '../config/siteConfig';

/**
 * Composant Footer (Pied de page minimaliste blanc)
 * 
 * Conforme à la maquette :
 * - Fond blanc pur
 * - Gauche : "Synapse" en vert officiel (#008056) + "· S2Q" + "Un accueil plus fluide, à votre rythme."
 * - Droite : Liens "Confidentialité", "Assistance", "© 2026 Synapse"
 */
export default function Footer({
  brandName = SITE_CONFIG.brand.entreprise,
  brandSuffix = SITE_CONFIG.footer.suffix,
  tagline = SITE_CONFIG.footer.tagline,
  year = new Date().getFullYear(),
  className = ''
}) {
  return (
    <footer className={`w-full bg-surface-light border-t border-slate-200 text-slate-500 py-1.5 sm:py-2.5 px-4 sm:px-8 lg:px-12 select-none ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[11px] sm:text-xs">
        {/* Côté gauche : Marque en vert + Suffixe + Slogan */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-black text-primary-500 text-sm tracking-tight">
            {brandName}
          </span>
          {brandSuffix && (
            <span className="font-bold text-slate-400">
              {brandSuffix}
            </span>
          )}
          {tagline && (
            <span className="text-slate-400 hidden sm:inline ml-3 font-medium">
              {tagline}
            </span>
          )}
        </div>

        {/* Côté droit : Liens légaux & Copyright */}
        <div className="flex items-center gap-3 sm:gap-5 text-slate-500">
          <Link to="/confidentialite" className="hover:text-slate-800 transition-colors">
            Confidentialité
          </Link>
          <Link to="/assistance" className="hover:text-slate-800 transition-colors">
            Assistance
          </Link>
          <span className="text-slate-200">|</span>
          <span className="text-slate-400">
            © {year} {brandName}
          </span>
        </div>
      </div>
    </footer>
  );
}
