import { Phone, ArrowRight } from 'lucide-react';
import Link from '../ui/Link';

/**
 * Composant HeaderContact (Pilule d'Assistance Téléphonique)
 * 
 * Conforme aux maquettes Desktop et Mobile :
 * - Desktop : Icône téléphone + "Besoin d'aide ?" + Numéro en gras + Flèche '→'
 * - Mobile : Pilule compacte avec numéro en gras
 * - Cliquable direct via protocole tel:
 */
export default function HeaderContact({
  label = "Besoin d'aide ?",
  phone = '+225 27 20 00 00',
  className = ''
}) {
  if (!phone) return null;

  return (
    <Link
      to={`tel:${phone.replace(/\s+/g, '')}`}
      className={`group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-full bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/25 text-white transition-all shadow-2xs select-none ${className}`}
    >
      {/* Icône téléphone dans petit cercle */}
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <Phone className="w-3 h-3 text-white" />
      </div>

      {/* Textes Desktop */}
      <div className="hidden sm:flex flex-col text-left leading-none">
        <span className="text-[10px] text-white/85 font-medium">{label}</span>
        <span className="text-xs sm:text-sm font-black tracking-tight text-white mt-0.5">
          {phone}
        </span>
      </div>

      {/* Texte Mobile compact */}
      <span className="sm:hidden text-xs font-bold text-white tracking-tight">
        {phone}
      </span>

      {/* Flèche droite */}
      <ArrowRight className="w-3.5 h-3.5 text-white/85 transition-transform duration-200 group-hover:translate-x-0.5 flex-shrink-0" />
    </Link>
  );
}
