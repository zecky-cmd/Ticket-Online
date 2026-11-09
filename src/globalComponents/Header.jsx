import { useDispatch } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import HeaderBrand from './header/HeaderBrand';
import HeaderContact from './header/HeaderContact';
import { openModal } from '../features/modalSlice';
import { DEFAULT_THEME } from '../theme/themes';

/**
 * Composant Header — Conforme à la maquette BNI Synapse
 *
 * - Gauche : Identité de Marque (Logo BNI + Synapse)
 * - Centre (Desktop) : Menu de navigation (Accueil, Agences, Mes tickets, Avis, FAQ)
 * - Droite : Bouton téléphone d'assistance
 */
export default function Header({ theme }) {
  const dispatch = useDispatch();
  const primaryColor = theme?.colors?.primary || DEFAULT_THEME.colors.primary;

  return (
    <header
      className="sticky top-0 z-40 text-white shadow-xs transition-colors duration-300"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-4">
        {/* ── Identité de Marque Gauche ── */}
        <HeaderBrand />

        {/* ── Menu Central (Desktop uniquement) ── */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {/* Accueil (actif) */}


          {/* Agences (avec chevron) */}
          <button
            type="button"
            onClick={() => dispatch(openModal('map'))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            Agences
        
          </button>

          {/* Mes tickets */}
          <button
            type="button"
            onClick={() => dispatch(openModal('ticket'))}
            className="px-3 py-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            Mes tickets
          </button>

          {/* Avis */}
          <button
            type="button"
            onClick={() => dispatch(openModal('satisfaction'))}
            className="px-3 py-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            Avis
          </button>

          {/* FAQ */}
          <button
            type="button"
            onClick={() => alert("Besoin d'aide ? Contactez notre assistance téléphonique ou adressez-vous directement à votre agence.")}
            className="px-3 py-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* ── Pilule d'assistance Droite ── */}
        <HeaderContact />
      </div>
    </header>
  );
}
