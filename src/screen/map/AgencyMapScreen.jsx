import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { X, MapPin, Map, List } from 'lucide-react';
import { AGENCIES_MOCK } from '../../mocks/agenciesMock';
import { openModal } from '../../features/modalSlice';
import { setSelectedAgency as setReduxAgency } from '../../features/agencySlice';
import AgencyFilterBar from './components/AgencyFilterBar';
import AgencyCard from './components/AgencyCard';
import AgencyDetailSheet from './components/AgencyDetailSheet';
import AgencyMapView from './components/AgencyMapView';

/**
 * Screen / Modal Réseau des Agences
 *
 * Onglets Carte / Liste : chaque vue occupe tout l'espace restant
 * et gère son propre scroll interne.
 */
export default function AgencyMapScreen({ isOpen, onClose, theme, agencies = AGENCIES_MOCK }) {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('toutes');
  const [selectedAgency, setSelectedAgency] = useState(agencies[0] || null);
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'list'

  if (!isOpen) return null;

  const filteredAgencies = activeFilter === 'toutes'
    ? agencies
    : agencies.filter((a) => a.affluence === activeFilter);

  const handleSelectAgency = useCallback((agency) => {
    setSelectedAgency(agency);
    setShowDetail(true);
  }, []);

  const handleSelectOnMap = useCallback((agency) => {
    setSelectedAgency(agency);
    // Bascule automatique vers la liste pour afficher la card sélectionnée
    setActiveTab('list');
    setShowDetail(true);
  }, []);

  const handleLocate = useCallback(() => {
    setLocateTrigger((n) => n + 1);
  }, []);

  const handleTakeTicket = useCallback((agency) => {
    dispatch(setReduxAgency(agency));
    dispatch(openModal('ticket'));
  }, [dispatch]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center md:p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="bg-white w-full rounded-t-[32px] md:rounded-3xl shadow-2xl md:max-w-4xl h-[92vh] md:h-[88vh] flex flex-col overflow-hidden border-t md:border border-slate-100 animate-in slide-in-from-bottom duration-300 md:zoom-in-95">

        {/* Poignée tactile mobile */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 md:hidden flex-shrink-0" />

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="px-5 pt-3 pb-3 flex-shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008056] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#008056]" />
              </span>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#008056]">
                Affluence des agences
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-[#008056]" />
                Réseau Abidjan
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
            Choisissez votre agence.
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Sélectionnez un repère ou une agence pour consulter l'attente et le prochain créneau.
          </p>
        </div>

        {/* ── Filtres ─────────────────────────────────────────────────── */}
        <AgencyFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onLocate={handleLocate}
        />

        {/* ── Onglets Carte / Liste ───────────────────────────────────── */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-1.5 gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex-1 min-h-[40px] flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Map className="w-4 h-4" />
            Carte
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex-1 min-h-[40px] flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List className="w-4 h-4" />
            Liste
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'list' ? 'bg-[#008056] text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {filteredAgencies.length}
            </span>
          </button>
        </div>

        {/* ── Vue Carte — prend tout l'espace, Leaflet gère son affichage ── */}
        {activeTab === 'map' && (
          <div className="flex-1 overflow-hidden">
            <AgencyMapView
              agencies={filteredAgencies}
              selectedAgency={selectedAgency}
              onSelectAgency={handleSelectOnMap}
              locateTrigger={locateTrigger}
            />
          </div>
        )}

        {/* ── Vue Liste — scroll libre en interne ────────────────────── */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Sous-header sticky */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 bg-white sticky top-0 z-[1]">
              <p className="text-xs font-bold text-slate-700">Agences à proximité</p>
              <p className="text-xs text-slate-400">
                {filteredAgencies.length} point{filteredAgencies.length > 1 ? 's' : ''} d'accueil
              </p>
            </div>

            {/* Cards */}
            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 pb-6">
              {filteredAgencies.length === 0 ? (
                <div className="col-span-2 text-center py-10 text-slate-400 text-sm">
                  Aucune agence pour ce filtre.
                </div>
              ) : (
                filteredAgencies.map((agency) => (
                  <AgencyCard
                    key={agency.id}
                    agency={agency}
                    isSelected={selectedAgency?.id === agency.id}
                    onClick={() => handleSelectAgency(agency)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Bottom Sheet détail agence ─────────────────────────────── */}
        {showDetail && selectedAgency && (
          <div className="absolute inset-0 z-10 flex flex-col justify-end md:justify-center md:items-center md:p-6 bg-slate-950/40 backdrop-blur-xs">
            <div className="bg-white w-full md:max-w-md rounded-t-[28px] md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250">
              <div className="flex items-center justify-between px-5 pt-4 pb-1">
                <div className="w-10 h-1.5 bg-slate-300 rounded-full md:hidden" />
                <button
                  type="button"
                  onClick={() => setShowDetail(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-500 ml-auto"
                  aria-label="Fermer le détail"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AgencyDetailSheet
                selectedAgency={selectedAgency}
                theme={theme}
                onTakeTicket={(agency) => {
                  handleTakeTicket(agency);
                  setShowDetail(false);
                  onClose();
                }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
