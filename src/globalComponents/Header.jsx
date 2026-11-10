import { useDispatch } from 'react-redux';
import HeaderBrand from './header/HeaderBrand';
import HeaderContact from './header/HeaderContact';
import { openModal } from '../features/modalSlice';
import { DEFAULT_THEME } from '../theme/themes';

// ── Configuration déclarative du menu central (module-level : créée une seule fois) ──
// Pour ajouter une entrée, ajouter un objet ici — aucun JSX à dupliquer.
//   type 'modal' : ouvre une modale existante via modalSlice
//   type 'info'  : provisoire — message informatif en attendant la vraie page
const NAV_ITEMS = [
  { id: 'agences', label: 'Agences', type: 'modal', value: 'map' },
  { id: 'tickets', label: 'Tickets', type: 'modal', value: 'ticket' },
  { id: 'avis', label: 'Avis', type: 'modal', value: 'satisfaction' },
  {
    id: 'faq',
    label: 'FAQ',
    type: 'info',
    message:
      "Besoin d'aide ? Contactez notre assistance téléphonique ou adressez-vous directement à votre agence.",
  },
];

// Style unique des boutons du menu central
const NAV_BUTTON_CLASS =
  'px-3 py-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer';

/**
 * Composant Header — Template Synapse S2Q
 *
 * - Gauche : Identité de Marque (Logo entreprise + Synapse)
 * - Centre (Desktop) : Menu de navigation (Agences, Mes tickets, Avis, FAQ)
 * - Droite : Bouton téléphone d'assistance
 */
export default function Header({ theme }) {
  const dispatch = useDispatch();
  const primaryColor = theme?.colors?.primary || DEFAULT_THEME.colors.primary;

  /** Résout l'action d'une entrée du menu central */
  const handleNav = (item) => {
    if (item.type === 'modal') dispatch(openModal(item.value));
    else if (item.type === 'info') alert(item.message);
  };

  return (
    <header
      className="sticky top-0 z-40 text-white shadow-xs transition-colors duration-300"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-4">
        {/* ── Identité de Marque Gauche ── */}
        <HeaderBrand />

        {/* ── Menu Central (Desktop uniquement) ── */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2" aria-label="Navigation principale">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item)}
              className={NAV_BUTTON_CLASS}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* ── Pilule d'assistance Droite ── */}
        <HeaderContact />
      </div>
    </header>
  );
}
