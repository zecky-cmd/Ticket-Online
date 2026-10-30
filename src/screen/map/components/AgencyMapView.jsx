import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const AFFLUENCE_COLOR = {
  fluide:  '#008056',
  moderee: '#f59e0b',
  saturee: '#ef4444',
};

/**
 * Crée un marker circulaire coloré en CSS pur (DivIcon Leaflet)
 */
function createColoredMarker(affluence, isSelected = false) {
  const color = AFFLUENCE_COLOR[affluence] ?? '#94a3b8';
  const size = isSelected ? 20 : 16;
  const border = isSelected ? `3px solid white` : `2.5px solid white`;
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: ${border};
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      transition: all 0.2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

/**
 * Sous-composant : recentre la carte sur une agence sélectionnée
 */
function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

/**
 * Sous-composant : positionne la vue sur la géolocalisation utilisateur
 */
function UserLocator({ trigger }) {
  const map = useMap();
  const hasFired = useRef(false);

  useEffect(() => {
    if (!trigger || hasFired.current) return;
    hasFired.current = true;
    map.locate({ setView: true, maxZoom: 14 });
    map.once('locationfound', (e) => {
      L.circleMarker(e.latlng, {
        radius: 8,
        color: '#fff',
        weight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 1,
      }).addTo(map).bindPopup('Votre position').openPopup();
    });
    map.once('locationerror', () => {
      hasFired.current = false;
    });
  }, [trigger, map]);

  return null;
}

/**
 * Carte Leaflet + OpenStreetMap avec markers colorés par affluence
 */
export default function AgencyMapView({ agencies, selectedAgency, onSelectAgency, locateTrigger }) {
  // Centrage initial sur Abidjan
  const center = [5.3197, -4.0167];
  const zoom = 12;

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Recentre la carte si une agence est sélectionnée */}
        {selectedAgency && (
          <MapRecenter lat={selectedAgency.lat} lng={selectedAgency.lng} />
        )}

        {/* Géolocalisation utilisateur */}
        <UserLocator trigger={locateTrigger} />

        {/* Markers des agences */}
        {agencies.map((agency) => (
          <Marker
            key={agency.id}
            position={[agency.lat, agency.lng]}
            icon={createColoredMarker(agency.affluence, selectedAgency?.id === agency.id)}
            eventHandlers={{
              click: () => onSelectAgency(agency),
            }}
          >
            <Popup className="agency-popup">
              <div className="text-xs font-semibold text-slate-900 leading-snug">
                {agency.name}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Attente : <b>{agency.waitMinutes} min</b>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

