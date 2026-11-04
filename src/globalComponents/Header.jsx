import HeaderBrand from './header/HeaderBrand';
import HeaderContact from './header/HeaderContact';
// import HeaderThemePicker from './header/HeaderThemePicker';

/**
 * Composant Header (En-tête de page)
 * 
 * - Pilule d'assistance téléphonique à droite
 * - Sélecteur de thème discret pour les démos multi-clients
 */
export default function Header({
  theme,
  logo,
  abbreviation = 'Synapse',
  definition = 'S2Q · TICKETS EN LIGNE',
  tag,
  brandConfig,
  contactConfig,
  onLogoClick
}) {
  const primaryColor = theme?.colors?.primary || '#008056';

  return (
    <header
      className="sticky top-0 z-40 text-white shadow-2xs transition-colors duration-300"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Identité de Marque Gauche (Synapse) */}
        <HeaderBrand
          logo={logo}
          abbreviation={abbreviation}
          definition={definition}
          tag={tag}
          primaryColor={primaryColor}
          onClick={onLogoClick}
          {...brandConfig}
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderContact {...contactConfig} />

          {/* <HeaderThemePicker
            currentThemeKey={currentThemeKey}
            onThemeChange={onThemeChange}
            themes={themes}
            primaryColor={primaryColor}
          /> */}
        </div>
      </div>
    </header>
  );
}
