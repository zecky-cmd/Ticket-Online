import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, ArrowRight } from 'lucide-react';

/**
 * Crée un marker circulaire moderne pour la mini-carte
 */
function createMiniPin(color = '#00865D', isSelected = false) {
  const size = isSelected ? 30 : 22;
  return L.divIcon({
    className: 'custom-mini-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${isSelected ? '<span style="position: absolute; width: 40px; height: 40px; border-radius: 9999px; background: rgba(0, 134, 93, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>' : ''}
        <div style="width: ${size}px; height: ${size}px; border-radius: 9999px; background: ${color}; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 9999px; background: white;"></div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MiniMapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, map]);
  return null;
}

function MiniMapResize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function HomeMiniMap({
  agencies = [],
  selectedAgency,
  onSelectAgency,
  onOpenMap,
  primaryColor = '#00865D'
}) {
  const defaultCenter = [5.3484, -4.0150]; // Abidjan Cocody
  const mapCenter = selectedAgency?.lat && selectedAgency?.lng
    ? [selectedAgency.lat, selectedAgency.lng]
    : defaultCenter;

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[340px] relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 isolate z-0">
      {/* ── Bouton Flottant en Haut à Droite : "Voir la carte" ── */}
      <div className="absolute top-3.5 right-3.5 z-[1000]">
        <button
          type="button"
          onClick={onOpenMap}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/95 backdrop-blur-xs text-slate-800 hover:text-emerald-800 hover:bg-white rounded-xl shadow-md border border-slate-200/80 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MapIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>Voir la carte</span>
        </button>
      </div>

      {/* ── Carte Leaflet ── */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        <MiniMapResize />
        <MiniMapRecenter center={mapCenter} />

        {/* Marqueurs des agences */}
        {agencies
          .filter((a) => a.lat != null && a.lng != null)
          .map((agency) => {
            const isSelected = selectedAgency?.id === agency.id;
            const color = agency.affluence === 'elevee' ? '#E5484D' : agency.affluence === 'moderee' ? '#F5A623' : primaryColor;
            return (
              <Marker
                key={agency.id}
                position={[agency.lat, agency.lng]}
                icon={createMiniPin(color, isSelected)}
                eventHandlers={{
                  click: () => onSelectAgency && onSelectAgency(agency),
                }}
              />
            );
          })}
      </MapContainer>

      {/* ── Popover Flottant au Centre : Agence Active ── */}
      {selectedAgency && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-[1000] pointer-events-auto">
          <button
            type="button"
            onClick={onOpenMap}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 text-left hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
              <span className="text-xs font-black">BNI</span>
            </div>
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-900 truncate">
                {selectedAgency.name || 'Agence Cocody'}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <span>Fluide</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">{selectedAgency.currentWaitTime || '08 min'}</span>
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}

