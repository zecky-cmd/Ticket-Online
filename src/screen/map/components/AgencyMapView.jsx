import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  LocateFixed, 
  RotateCw, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus 
} from 'lucide-react';
import { getAffluence } from '../../../theme/affluence';

const DEFAULT_CENTER = [5.3197, -4.0167];
const DEFAULT_ZOOM = 12;

/**
 * Crée un marker circulaire coloré en CSS pur (DivIcon Leaflet)
 */
function createMarker(affluence, isSelected = false) {
  const color = getAffluence(affluence).color;
  const size = isSelected ? 20 : 15;
  const border = isSelected ? '3px solid white' : '2px solid white';
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: ${border};
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

/**
 * Force Leaflet à recalculer ses dimensions après le rendu du DOM
 */
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

/**
 * Sous-composant interne accédant à l'instance Leaflet `useMap`
 * pour gérer tous les contrôles personnalisés (Position, Refresh, D-Pad, Zoom)
 */
function MapControlsOverlay({ 
  onRefresh, 
  isRefreshing,
  primaryColor = '#008056'
}) {
  const map = useMap();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const locationMarkerRef = useRef(null);

  // Action "Me localiser" : centre la carte et pose un marqueur sur la position
  const handleLocate = () => {
    setIsLocating(true);
    map.locate({ setView: true, maxZoom: 14 });

    const handleFound = (e) => {
      setIsLocating(false);
      if (locationMarkerRef.current) {
        locationMarkerRef.current.remove();
      }
      const marker = L.circleMarker(e.latlng, {
        radius: 8,
        color: '#ffffff',
        weight: 3,
        fillColor: primaryColor,
        fillOpacity: 1,
      }).addTo(map);
      marker.bindPopup('<div class="font-bold text-xs text-slate-800">Votre position actuelle</div>').openPopup();
      locationMarkerRef.current = marker;
    };

    const handleError = () => {
      setIsLocating(false);
      alert("Impossible d'accéder à votre position actuelle.");
    };

    map.once('locationfound', handleFound);
    map.once('locationerror', handleError);
  };

  // Actions de navigation directionnelle (pan)
  const panDistance = 140;
  const handlePan = (dx, dy) => {
    map.panBy([dx, dy], { animate: true, duration: 0.3 });
  };

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();

  return (
    <div className="leaflet-top leaflet-bottom leaflet-left leaflet-right pointer-events-none z-[1000] absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between">
      {/* ── Ligne Supérieure : Position (Gauche) & Refresh (Droite) ── */}
      <div className="flex items-center justify-between w-full">
        {/* Bouton Position (Haut Gauche) */}
        <button
          type="button"
          onClick={handleLocate}
          title="Centrer sur ma position"
          className="pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-xs text-slate-700 hover:text-primary-500 hover:bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <LocateFixed className={`w-4 h-4 sm:w-5 sm:h-5 ${isLocating ? 'animate-spin text-primary-500' : ''}`} />
        </button>

        {/* Bouton Rafraîchir / Reset vue (Haut Droite) */}
        <button
          type="button"
          onClick={() => {
            if (onRefresh) onRefresh(map);
            else map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
          }}
          title="Réinitialiser la carte"
          className="pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-xs text-slate-700 hover:text-primary-500 hover:bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin text-primary-500' : ''}`} />
        </button>
      </div>

      {/* ── Bas Gauche : Pavé de navigation dépliable ── */}
      <div className="flex items-end justify-start">
        <div className="pointer-events-auto relative">
          {/* Menu déployé */}
          {isNavOpen && (
            <div className="mb-2 p-1.5 sm:p-2 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/90 animate-in fade-in zoom-in-90 duration-200">
              <div className="grid grid-cols-3 gap-1 place-items-center">
                {/* Ligne 1 : Haut & Zoom + */}
                <div />
                <button
                  type="button"
                  onClick={() => handlePan(0, -panDistance)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-xs flex items-center justify-center border border-slate-200 cursor-pointer transition-transform active:scale-90"
                  title="Déplacer vers le haut"
                >
                  <ChevronUp className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-xs flex items-center justify-center border border-slate-200 cursor-pointer transition-transform active:scale-90"
                  title="Zoom avant"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-700 font-bold" />
                </button>

                {/* Ligne 2 : Gauche & Droite */}
                <button
                  type="button"
                  onClick={() => handlePan(-panDistance, 0)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-xs flex items-center justify-center border border-slate-200 cursor-pointer transition-transform active:scale-90"
                  title="Déplacer vers la gauche"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <div />
                <button
                  type="button"
                  onClick={() => handlePan(panDistance, 0)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-xs flex items-center justify-center border border-slate-200 cursor-pointer transition-transform active:scale-90"
                  title="Déplacer vers la droite"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>

                {/* Ligne 3 : Bas & Zoom - */}
                <div />
                <button
                  type="button"
                  onClick={() => handlePan(0, panDistance)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-xs flex items-center justify-center border border-slate-200 cursor-pointer transition-transform active:scale-90"
                  title="Déplacer vers le bas"
                >
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-xs flex items-center justify-center border border-slate-200 cursor-pointer transition-transform active:scale-90"
                  title="Zoom arrière"
                >
                  <Minus className="w-3.5 h-3.5 text-slate-700 font-bold" />
                </button>
              </div>
            </div>
          )}

          {/* Bouton déclencheur rond */}
          <button
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            title={isNavOpen ? "Masquer les contrôles" : "Commandes de navigation"}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-md flex items-center justify-center border transition-all cursor-pointer ${
              isNavOpen 
                ? 'bg-slate-900 text-white border-slate-900 shadow-slate-900/30' 
                : 'bg-white/95 backdrop-blur-xs text-slate-700 hover:text-primary-500 hover:bg-white border-slate-200 hover:scale-105 active:scale-95'
            }`}
          >
            <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute -top-0.5 sm:-top-1" />
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute -bottom-0.5 sm:-bottom-1" />
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute -left-0.5 sm:-left-1" />
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute -right-0.5 sm:-right-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Sous-composant : recentre la carte sur une agence sélectionnée
 */
function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 14, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

/**
 * Carte Leaflet principale
 */
export default function AgencyMapView({ agencies, selectedAgency, onSelectAgency, primaryColor = '#008056' }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = (map) => {
    setIsRefreshing(true);
    if (agencies && agencies.length > 0) {
      const bounds = L.latLngBounds(agencies.map(a => [a.lat, a.lng]));
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Garantit le rendu dès l'ouverture de l'onglet */}
        <MapResizeHandler />

        {/* Recentre la carte si une agence est sélectionnée */}
        {selectedAgency && (
          <MapRecenter lat={selectedAgency.lat} lng={selectedAgency.lng} />
        )}

        {/* Overlay avec les commandes flottantes */}
        <MapControlsOverlay 
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          primaryColor={primaryColor}
        />

        {/* Markers des agences */}
        {agencies.map((agency) => (
          <Marker
            key={agency.id}
            position={[agency.lat, agency.lng]}
            icon={createMarker(agency.affluence, selectedAgency?.id === agency.id)}
            eventHandlers={{
              click: () => onSelectAgency(agency),
            }}
          >
            <Popup className="agency-popup">
              <div className="text-xs font-bold text-slate-900 leading-snug">
                {agency.name}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {agency.commune}
              </div>
              <div className="text-xs text-primary-500 font-semibold mt-1">
                {agency.currentWaitTime ? `Attente : ${agency.currentWaitTime}` : 'Affluence indisponible'}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
