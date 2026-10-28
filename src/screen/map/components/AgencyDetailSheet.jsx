import React from 'react';
import { MapPin, Phone, Compass, Ticket } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import Link from '../../../globalComponents/ui/Link';

/**
 * Vue Carte Interactive et Fiche Détaillée de l'Agence
 */
export default function AgencyDetailSheet({
  selectedAgency,
  theme,
  onTakeTicket
}) {
  if (!selectedAgency) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-slate-400 text-sm">
        Sélectionnez une agence dans la liste pour voir sa position.
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Arrière-plan grille cartographique */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* Simulation de routes */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="w-full h-2 bg-slate-300 absolute top-1/3 -rotate-3" />
        <div className="w-full h-3 bg-white absolute top-2/3 rotate-2" />
        <div className="h-full w-2 bg-slate-300 absolute left-1/3" />
        <div className="h-full w-3 bg-white absolute right-1/4" />
      </div>

      {/* Fiche Flottante Agence */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full animate-in zoom-in-95 duration-200">
        <div 
          className="p-3.5 rounded-2xl text-white shadow-2xl flex items-center justify-center"
          style={{ backgroundColor: theme?.colors?.primary }}
        >
          <MapPin className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xl mt-3 text-center border border-slate-100 w-full">
          <span 
            className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block mb-1"
            style={{ backgroundColor: theme?.colors?.badgeBg, color: theme?.colors?.badgeText }}
          >
            {selectedAgency.commune}
          </span>
          <h4 className="text-base font-bold text-slate-900">{selectedAgency.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{selectedAgency.hours}</p>

          <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Guichets Actifs</span>
              <b className="text-slate-800 text-sm">{selectedAgency.countersActive} ouverts</b>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Temps Moyen</span>
              <b className="text-slate-800 text-sm">{selectedAgency.currentWaitTime}</b>
            </div>
          </div>

          {/* Boutons d'actions tactiles */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <Link
                to={`tel:${selectedAgency.phone}`}
                className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Appeler
              </Link>
              <Button
                variant="secondary"
                size="sm"
                iconStart={Compass}
                onClick={() => alert(`Lancement de l'itinéraire GPS vers : ${selectedAgency.name}`)}
                className="flex-1 min-h-[44px]"
              >
                Itinéraire
              </Button>
            </div>

            <Button
              variant="primary"
              size="sm"
              primaryColor={theme?.colors?.primary}
              iconStart={Ticket}
              onClick={() => onTakeTicket(selectedAgency)}
              className="w-full min-h-[46px] font-bold"
            >
              Prendre un ticket ici
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[10px] sm:text-[11px] text-slate-600 px-3 py-1 rounded-full border border-slate-200 shadow-xs font-medium">
        Simulation Réseau Géolocalisé
      </div>
    </div>
  );
}
