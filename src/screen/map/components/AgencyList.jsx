import { Search, MapPin, Clock } from 'lucide-react';

/**
 * Liste interactive des agences avec barre de recherche intégrée
 */
export default function AgencyList({
  agencies,
  searchTerm,
  setSearchTerm,
  selectedAgency,
  onSelectAgency,
  theme
}) {
  const filtered = agencies.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.commune.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Barre de recherche */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex-shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher (ex: Plateau, Cocody)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 min-h-[46px] text-base sm:text-sm bg-white rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Liste des cartes d'agences */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-2.5 bg-slate-50/50">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Aucune agence trouvée pour votre recherche.
          </div>
        ) : (
          filtered.map((agency) => {
            const isSelected = selectedAgency?.id === agency.id;
            return (
              <div
                key={agency.id}
                onClick={() => onSelectAgency(agency)}
                className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer border transition-all text-left select-none ${
                  isSelected
                    ? 'bg-white shadow-md border-primary-500 ring-2 ring-primary-500/20'
                    : 'bg-white/80 hover:bg-white border-slate-200/90'
                }`}
                style={{
                  borderColor: isSelected ? theme?.colors?.primary : undefined
                }}
              >
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{agency.name}</h4>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: theme?.colors?.badgeBg, color: theme?.colors?.badgeText }}
                  >
                    {agency.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="line-clamp-1">{agency.address}</span>
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Attente: <b className="text-slate-900">{agency.currentWaitTime}</b>
                  </span>
                  <span className="text-xs font-bold" style={{ color: theme?.colors?.primary }}>
                    Sélectionner →
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
