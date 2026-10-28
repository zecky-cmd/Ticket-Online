import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MapPin, X, List, Map } from 'lucide-react';
import { AGENCIES_MOCK } from '../../mocks/agenciesMock';
import { openModal } from '../../features/modalSlice';
import { setSelectedAgency as setReduxAgency } from '../../features/agencySlice';
import AgencyList from './components/AgencyList';
import AgencyDetailSheet from './components/AgencyDetailSheet';

/**
 * Screen / Modal Réseau des Agences
 * Mode Mobile Optimal : Bascule fluide [Liste / Carte] sur mobile et Split-View sur Desktop.
 */
export default function AgencyMapScreen({ isOpen, onClose, theme, agencies = AGENCIES_MOCK }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(agencies[0] || null);
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'map'

  if (!isOpen) return null;

  const handleTakeTicketForAgency = (agency) => {
    dispatch(setReduxAgency(agency));
    dispatch(openModal('ticket'));
  };

  const handleSelectAgencyOnMobile = (agency) => {
    setSelectedAgency(agency);
    setMobileTab('map'); // Bascule automatique vers la carte sur mobile
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      {/* Conteneur Hybride : Bottom Sheet mobile / Large Modal desktop */}
      <div className="bg-white w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl sm:max-w-4xl h-[92vh] sm:h-[85vh] max-h-[760px] flex flex-col overflow-hidden border-t sm:border border-slate-100 animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">
        
        {/* Poignée tactile de glissement mobile */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

        {/* Header Modal */}
        <div 
          className="px-5 sm:px-6 py-4 flex items-center justify-between text-white flex-shrink-0"
          style={{ backgroundColor: theme?.colors?.primary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-snug">Réseau des Agences</h3>
              <p className="text-xs text-white/85">Localisation & estimation d'affluence</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Sélecteur d'onglets pour mobile (Liste vs Carte) */}
        <div className="flex md:hidden border-b border-slate-200 bg-slate-100 p-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex-1 min-h-[40px] flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Liste des Agences ({agencies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex-1 min-h-[40px] flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Carte & Itinéraire</span>
          </button>
        </div>

        {/* Corps : Bascule Mobile / Split-View Desktop */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Vue Liste */}
          <div className={`w-full md:w-5/12 overflow-hidden border-r border-slate-200 ${
            mobileTab === 'list' ? 'flex flex-col flex-1' : 'hidden md:flex md:flex-col'
          }`}>
            <AgencyList
              agencies={agencies}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedAgency={selectedAgency}
              onSelectAgency={handleSelectAgencyOnMobile}
              theme={theme}
            />
          </div>

          {/* Vue Carte & Détails */}
          <div className={`flex-1 overflow-hidden ${
            mobileTab === 'map' ? 'flex flex-col flex-1' : 'hidden md:flex md:flex-col'
          }`}>
            <AgencyDetailSheet
              selectedAgency={selectedAgency}
              theme={theme}
              onTakeTicket={handleTakeTicketForAgency}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
