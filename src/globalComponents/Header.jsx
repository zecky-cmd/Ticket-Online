import HeaderBrand from './header/HeaderBrand';
import HeaderContact from './header/HeaderContact';
import { DEFAULT_THEME } from '../theme/themes';

/**
 * Composant Header (En-tête de page)
 *
 * Orchestrateur fin :
 * - Gauche : identité de marque (HeaderBrand)
 * - Droite : pilule d'assistance téléphonique (HeaderContact)
 *
 * Les valeurs par défaut (logo, nom, numéro…) proviennent de
 * src/config/siteConfig.js — à modifier UNIQUEMENT là-bas.
 */
export default function Header({ theme }) {
  const primaryColor = theme?.colors?.primary || DEFAULT_THEME.colors.primary;

  return (
    <header
      className="sticky top-0 z-40 text-white shadow-2xs transition-colors duration-300"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Identité de Marque Gauche */}
        <HeaderBrand />

        {/* Pilule d'assistance Droite */}
        <HeaderContact />
      </div>
    </header>
  );
}
