import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, MapPin, Map, List, Search } from 'lucide-react';
import { openModal } from '../../features/modalSlice';
import { setSelectedAgency as setReduxAgency } from '../../features/agencySlice';
import AgencyFilterBar from './components/AgencyFilterBar';
import AgencyCard from './components/AgencyCard';
import AgencyFloatingCard from './components/AgencyFloatingCard';
import AgencyMapView from './components/AgencyMapView';
import Modal from '../../globalComponents/ui/Modal';

/** Applique le filtre d'affluence puis la recherche textuelle */
function applyFilters(agencies, activeFilter, term) {
  const base =
    activeFilter === 'toutes' ? agencies : agencies.filter((a) => a.affluence === activeFilter);
  if (!term) return base;
  return base.filter((a) =>
    [a.name, a.commune, a.district, a.address].some(
      (v) => v && String(v).toLowerCase().includes(term)
    )
  );
}

/**
 * Screen / Modal Réseau des Agences
 * - Desktop : split-screen carte (70%) + volet « Résultats (X) » synchronisé avec la zone visible (30%).
 * - Mobile : onglets Carte / Liste.
 * - Recherche textuelle en direct (debounce) qui recentre la carte.
 */
export default function AgencyMapScreen({ isOpen, isClosing = false, onClose, theme, agencies = [] }) {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('toutes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('map');

  // Détection desktop (split-screen)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (/** @type {MediaQueryListEvent} */ e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Bounds visibles sur la carte (volet « Résultats » desktop)
  const [visibleBounds, setVisibleBounds] = useState(/** @type {[[number,number],[number,number]]|null} */ (null));

  // Déclencheur de réinitialisation de la vue nationale (fiche flottante)
  const [resetTrigger, setResetTrigger] = useState(0);

  const term = searchTerm.trim().toLowerCase();
  const searchFiltered = applyFilters(agencies, activeFilter, term);

  // Agences dans la zone visible (desktop)
  const inBounds = visibleBounds
    ? searchFiltered.filter((a) => {
        if (a.lat == null || a.lng == null) return false;
        const [[s, w], [n, e]] = visibleBounds;
        return a.lat >= s && a.lat <= n && a.lng >= w && a.lng <= e;
      })
    : searchFiltered;

  // Fallback initial : si le calcul de bounds pendant l'animation d'ouverture n'a rien capturé
  // et que la recherche est vide, on affiche la liste complète searchFiltered
  const visibleAgencies = inBounds.length > 0 || term ? inBounds : searchFiltered;

  // Cibles de recentrage après recherche (debounce 400ms)
  const [searchTargets, setSearchTargets] = useState(/** @type {any[]|null} */ (null));
  useEffect(() => {
    const t = setTimeout(() => {
      const list = applyFilters(agencies, activeFilter, searchTerm.trim().toLowerCase());
      setSearchTargets(list.length ? list : null);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm, activeFilter, agencies]);

  const handleSelectAgency = (/** @type {any} */ agency) => {
    setSelectedAgency(agency);
    setShowDetail(true);
  };

  const handleSelectOnMap = (/** @type {any} */ agency) => {
    setSelectedAgency(agency);
    setShowDetail(true);
  };

  const handleBoundsChange = (/** @type {any} */ bounds) => {
    setVisibleBounds([
      [bounds.getSouth(), bounds.getWest()],
      [bounds.getNorth(), bounds.getEast()],
    ]);
  };

  const handleTakeTicket = (/** @type {any} */ agency) => {
    dispatch(setReduxAgency(agency));
    dispatch(openModal('ticket'));
  };

  const handleResetView = () => {
    setResetTrigger((n) => n + 1);
    setShowDetail(false);
  };

  const renderMap = () => (
    <div className="w-full h-full min-h-0 flex-1 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-slate-200 relative">
      <AgencyMapView
        agencies={searchFiltered}
        selectedAgency={selectedAgency}
        onSelectAgency={handleSelectOnMap}
        primaryColor={theme?.colors?.primary}
        searchTargets={searchTargets}
        onBoundsChange={handleBoundsChange}
        resetTrigger={resetTrigger}
      />
      {showDetail && selectedAgency && (
        <AgencyFloatingCard
          agency={selectedAgency}
          theme={theme}
          onClose={() => setShowDetail(false)}
          onReset={handleResetView}
          onTakeTicket={(agency) => {
            setShowDetail(false);
            handleTakeTicket(agency);
          }}
        />
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} isClosing={isClosing} onClose={onClose} size="xl">

      {/* ── Header Ultra-Compact sur Mobile ───────────────────────── */}
        <div className="px-4 md:px-5 pt-1.5 md:pt-3 pb-1 md:pb-2.5 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-primary-500" />
              </span>
              <h2 className="text-sm md:text-xl font-extrabold text-slate-900 truncate">
                Réseau des Agences
              </h2>
            </div>

            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[11px] md:text-xs font-semibold text-slate-700">
                <MapPin className="w-3 h-3 text-primary-500" />
                <span className="hidden sm:inline">Réseau</span> Abidjan
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 md:p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          <p className="hidden md:block text-xs md:text-sm text-slate-500 mt-1">
            Sélectionnez un repère ou une agence pour consulter l'attente et le prochain créneau.
          </p>
        </div>

        {/* ── Recherche + filtres affluence ───────────────────────────── */}
        <div className="px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 border-b border-slate-100">
          <div className="relative w-full sm:flex-1 sm:min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une agence, une ville…"
              className="w-full pl-10 pr-9 min-h-[44px] bg-white border border-slate-200 focus:border-primary-500 rounded-full text-base sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 cursor-pointer"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <AgencyFilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {isDesktop ? (
          /* ── Split-screen desktop : carte (70%) + résultats (30%) ── */
          <div className="flex-1 min-h-0 flex overflow-hidden">
            <div className="flex-[7] min-w-0 h-full p-2 sm:p-3 flex flex-col">
              {renderMap()}
            </div>
            <div className="flex-[3] min-w-0 border-l border-slate-200 flex flex-col min-h-0 bg-white">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 shrink-0">
                <p className="text-xs font-bold text-slate-700">Résultats ({visibleAgencies.length})</p>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-2">
                {visibleAgencies.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    Aucune agence dans cette zone.
                  </div>
                ) : (
                  visibleAgencies.map((agency) => (
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
          </div>
        ) : (
          /* ── Mobile : onglets Carte / Liste ─────────────────────────── */
          <>
            <div className="flex border-b border-slate-200 bg-slate-100/90 p-1 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className={`flex-1 min-h-[34px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                Carte
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`flex-1 min-h-[34px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Liste
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'list' ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {searchFiltered.length}
                </span>
              </button>
            </div>

            {activeTab === 'map' && (
              <div className="flex-1 flex flex-col min-h-0 p-2 overflow-hidden">
                {renderMap()}
              </div>
            )}

            {activeTab === 'list' && (
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-white sticky top-0 z-[1]">
                  <p className="text-xs font-bold text-slate-700">Agences à proximité</p>
                  <p className="text-xs text-slate-400">
                    {searchFiltered.length} point{searchFiltered.length > 1 ? 's' : ''} d'accueil
                  </p>
                </div>

                <div className="px-3 py-2.5 grid grid-cols-1 gap-2 pb-6">
                  {searchFiltered.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      Aucune agence pour cette recherche.
                    </div>
                  ) : (
                    searchFiltered.map((agency) => (
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
          </>
        )}

    </Modal>
  );
}
