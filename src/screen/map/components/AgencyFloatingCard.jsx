import { MapPin, Phone, Clock, X, RotateCcw, Compass, Ticket, Navigation } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import Link from '../../../globalComponents/ui/Link';
import { SITE_CONFIG } from '../../../config/siteConfig';
import { formatDistance } from '../utils/geoUtils';

const BRAND_LETTER = (SITE_CONFIG.brand.entreprise || 'S').charAt(0).toUpperCase();

/**
 * Fiche flottante d'agence ancrée sur la carte
 * (bas-gauche sur desktop, bottom sheet sur mobile — sans occulter la carte).
 */
export default function AgencyFloatingCard({ agency, theme, onClose, onReset, onTakeTicket }) {
  const isOpen = agency?.status === 'Ouvert';

  return (
    <div className="absolute left-2 right-2 bottom-2 sm:left-3 sm:right-auto sm:bottom-3 sm:w-[360px] z-[1100] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 duration-200">

      {/* En-tête */}
      <div className="flex items-start gap-3 p-3.5 pb-2.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: theme?.colors?.primary }}
        >
          <span className="font-black text-sm">{BRAND_LETTER}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-sm text-slate-900 truncate">{agency.name}</h4>
          {agency.commune && <p className="text-xs text-slate-500 truncate">{agency.commune}</p>}
          <span
            className={`inline-flex items-center gap-1.5 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isOpen ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-primary-500' : 'bg-slate-400'}`} />
            {agency.status || 'Ouvert'}
          </span>
          {formatDistance(agency.distance) && (
            <span className="inline-flex items-center gap-1 mt-1 ml-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Navigation className="w-2.5 h-2.5" />
              <span>à {formatDistance(agency.distance)}</span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-400 hover:text-slate-600 shrink-0"
          aria-label="Fermer la fiche"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Informations */}
      <div className="px-3.5 pb-3 space-y-1.5 text-xs text-slate-600">
        {agency.address && (
          <p className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
            <span className="line-clamp-2">{agency.address}</span>
          </p>
        )}
        {agency.phone && (
          <p className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-primary-500 shrink-0" />
            <span>{agency.phone}</span>
          </p>
        )}
        {agency.hours && (
          <p className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary-500 shrink-0" />
            <span className="line-clamp-2">{agency.hours}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="px-3.5 pb-3.5 space-y-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          primaryColor={theme?.colors?.primary}
          iconStart={Ticket}
          onClick={() => onTakeTicket(agency)}
          className="w-full min-h-[44px] font-bold text-xs"
        >
          Prendre un ticket ici
        </Button>

        <div className="flex gap-2">
          <Link
            to={`https://www.google.com/maps/dir/?api=1&destination=${agency.lat},${agency.lng}`}
            className="flex-1 min-h-[40px] px-3 rounded-xl bg-white hover:bg-primary-50 text-primary-500 border border-primary-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            Itinéraire
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="min-h-[40px] px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Réinitialiser la carte"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
