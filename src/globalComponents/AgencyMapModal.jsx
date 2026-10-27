import { useState } from 'react';
import { MapPin, X, Search, Clock, Phone, Compass } from 'lucide-react';
import { AGENCIES_MOCK } from '../mocks/agenciesMock';

export default function AgencyMapModal({ isOpen, onClose, theme, agencies = AGENCIES_MOCK }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(agencies[0] || null);

  if (!isOpen) return null;

  const filtered = agencies.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.commune.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[85vh] max-h-[720px] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div 
          className="px-6 py-5 flex items-center justify-between text-white flex-shrink-0"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">Réseau des Agences</h3>
              <p className="text-xs text-white/85">Localisation en temps réel & estimation d'affluence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par commune, ville ou boulevard (ex: Plateau, Cocody)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Corps : Vue Scindée Liste / Simulation Carte */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Liste des Agences */}
          <div className="w-full md:w-5/12 overflow-y-auto border-r border-slate-200 p-4 space-y-3 bg-slate-50/50">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                Aucune agence trouvée pour votre recherche.
              </div>
            ) : (
              filtered.map((agency) => {
                const isSelected = selectedAgency?.id === agency.id;
                return (
                  <div
                    key={agency.id}
                    onClick={() => setSelectedAgency(agency)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all text-left ${
                      isSelected
                        ? 'bg-white shadow-md'
                        : 'bg-white/80 hover:bg-white border-slate-200/90'
                    }`}
                    style={{ borderColor: isSelected ? theme.colors.primary : undefined }}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">{agency.name}</h4>
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: theme.colors.badgeBg, color: theme.colors.badgeText }}
                      >
                        {agency.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-2.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {agency.address}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Attente: <b className="text-slate-900">{agency.currentWaitTime}</b>
                      </span>
                      <span className="text-xs font-bold" style={{ color: theme.colors.primary }}>
                        Voir sur la carte →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Simulation de Carte Interactive */}
          <div className="flex-1 bg-slate-200 relative overflow-hidden flex flex-col items-center justify-center p-6">
            
            {/* Arrière-plan grille cartographique */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px]" />
            
            {/* Lignes de repère routier */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="w-full h-2 bg-slate-300 absolute top-1/3 -rotate-3" />
              <div className="w-full h-3 bg-white absolute top-2/3 rotate-2" />
              <div className="h-full w-2 bg-slate-300 absolute left-1/3" />
              <div className="h-full w-3 bg-white absolute right-1/4" />
            </div>

            {/* Repère Flottant Agence */}
            {selectedAgency && (
              <div className="relative z-10 flex flex-col items-center max-w-sm w-full animate-bounce-once">
                <div 
                  className="p-3.5 rounded-2xl text-white shadow-2xl flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <MapPin className="w-8 h-8" />
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-xl mt-3 text-center border border-slate-100 w-full">
                  <span 
                    className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block mb-1"
                    style={{ backgroundColor: theme.colors.badgeBg, color: theme.colors.badgeText }}
                  >
                    {selectedAgency.commune}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{selectedAgency.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{selectedAgency.hours}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Guichets Actifs</span>
                      <b className="text-slate-800 text-sm">{selectedAgency.countersActive} ouverts</b>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Temps Moyen</span>
                      <b className="text-slate-800 text-sm">{selectedAgency.currentWaitTime}</b>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a
                      href={`tel:${selectedAgency.phone}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Appeler
                    </a>
                    <button
                      onClick={() => alert(`Lancement de l'itinéraire GPS vers : ${selectedAgency.name}`)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-95"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <Compass className="w-3.5 h-3.5" /> Itinéraire
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[11px] text-slate-600 px-3 py-1 rounded-full border border-slate-200 shadow-xs font-medium">
              Simulation Réseau Géolocalisé
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
