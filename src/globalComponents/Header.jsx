import HeaderBrand from './header/HeaderBrand';
import HeaderContact from './header/HeaderContact';
import HeaderThemePicker from './header/HeaderThemePicker';
import { THEMES } from '../theme/themes';

export default function Header({
  theme,
  currentThemeKey = 'vertBlanc',
  onThemeChange,
  themes = THEMES,
  // Propriétés de marque directes ou groupées
  logo,
  abbreviation,
  definition,
  tag,
  brandConfig,
  contactConfig,
  onLogoClick
}) {
  const primaryColor = theme?.colors?.primary;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Identité / Logo */}
        <HeaderBrand
          logo={logo}
          abbreviation={abbreviation}
          definition={definition}
          tag={tag}
          primaryColor={primaryColor}
          onClick={onLogoClick}
          {...brandConfig}
        />

        {/* Actions & Infos à droite */}
        <div className="flex items-center gap-3 sm:gap-4">
          <HeaderContact {...contactConfig} />

          <HeaderThemePicker
            currentThemeKey={currentThemeKey}
            onThemeChange={onThemeChange}
            themes={themes}
            primaryColor={primaryColor}
          />
        </div>
      </div>
    </header>
  );
}
