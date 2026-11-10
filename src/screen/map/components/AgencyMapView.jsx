import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
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
import { SITE_CONFIG } from '../../../config/siteConfig';
import { CI_BOUNDS, MACRO_CLUSTER_THRESHOLD } from '../mapConfig';
import { getAffluence } from '../../../theme/affluence';

const BRAND_LETTER = (SITE_CONFIG.brand.entreprise || 'S').charAt(0).toUpperCase();

/**
 * Crée un pin d'agence en forme de goutte (SVG) avec monogramme de l'enseigne.
 */
function createAgencyPin(color = '#008056', isSelected = false) {
  const size = isSelected ? 46 : 34;
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
        cursor: pointer;
      ">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C7.03 0 3 4.03 3 9c0 6.9 9 15 9 15s9-8.1 9-15c0-4.97-4.03-9-9-9z"
                fill="#ffffff" stroke="${color}" stroke-width="1.4" />
        </svg>
        <span style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: ${Math.round(size * 0.5)}px;
          font-weight: 900;
          font-size: ${Math.round(size * 0.32)}px;
          line-height: 1;
          color: ${color};
        ">${BRAND_LETTER}</span>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
    tooltipAnchor: [0, -size + 4],
  });
}

/** Échappe le HTML pour les contenus injectés dans les tooltips/clusters */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** HTML du tooltip de survol d'une agence — affiche le nom, l'affluence, les personnes en attente et le temps estimé */
function buildTooltipHtml(agency, primaryColor) {
  // Récupère la config d'affluence S2Q (fluide / moyenne / forte)
  const aff = getAffluence(agency.affluence);

  // Bloc attente — uniquement si les données sont disponibles
  const hasWaiting = agency.waitingClients != null && agency.waitingClients !== '';
  const hasWaitTime = agency.waitMinutes != null && agency.waitMinutes !== '';

  const waitBlock = (hasWaiting || hasWaitTime) ? `
    <div style="margin-top:8px;padding-top:7px;border-top:1px solid #f1f5f9;display:flex;gap:12px;">
      ${hasWaiting ? `
        <div style="display:flex;flex-direction:column;align-items:center;gap:1px;">
          <span style="font-size:15px;font-weight:900;color:#0f172a;line-height:1;">${escapeHtml(agency.waitingClients)}</span>
          <span style="font-size:10px;color:#64748b;white-space:nowrap;">en attente</span>
        </div>` : ''}
      ${hasWaiting && hasWaitTime ? `<div style="width:1px;background:#e2e8f0;align-self:stretch;"></div>` : ''}
      ${hasWaitTime ? `
        <div style="display:flex;flex-direction:column;align-items:center;gap:1px;">
          <span style="font-size:15px;font-weight:900;color:#0f172a;line-height:1;">${escapeHtml(agency.waitMinutes)} min</span>
          <span style="font-size:10px;color:#64748b;white-space:nowrap;">attente estimée</span>
        </div>` : ''}
    </div>` : '';

  return `
    <div style="min-width:160px;max-width:220px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="width:28px;height:28px;border-radius:50%;background:${primaryColor};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:11px;flex-shrink:0;">${escapeHtml(BRAND_LETTER)}</span>
        <div style="min-width:0;flex:1;">
          <p style="margin:0;font-size:12px;font-weight:700;color:#0f172a;line-height:1.3;">${escapeHtml(agency.name)}</p>
          ${agency.commune ? `<p style="margin:2px 0 0;font-size:10px;color:#64748b;">${escapeHtml(agency.commune)}</p>` : ''}
        </div>
        <span style="flex-shrink:0;padding:2px 7px;border-radius:999px;background:${aff.color}22;color:${aff.color};font-size:10px;font-weight:800;border:1px solid ${aff.color}44;">${escapeHtml(aff.label)}</span>
      </div>
      ${waitBlock}
    </div>`;
}

/** Libellé d'un macro-cluster : le district/commune le plus fréquent parmi les enfants */
function getClusterLabel(cluster) {
  const counts = {};
  cluster.getAllChildMarkers().forEach((marker) => {
    const key = marker.district || marker.commune;
    if (key) counts[key] = (counts[key] || 0) + 1;
  });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0][0] : '';
}

/** Icône de cluster : macro rouge pulsant avec libellé, ou micro pastille bleue */
function createClusterIcon(cluster) {
  const count = cluster.getChildCount();

  if (count > MACRO_CLUSTER_THRESHOLD) {
    const label = getClusterLabel(cluster);
    const size = 54;
    return L.divIcon({
      className: 'agency-macro-cluster',
      html: `
        <div style="position:relative;width:${size}px;height:${size}px;">
          <span class="cluster-pulse" style="position:absolute;inset:-10px;border-radius:50%;background:rgba(220,38,38,0.35);"></span>
          <div style="position:absolute;inset:0;border-radius:50%;background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;border:3px solid #fff;box-shadow:0 4px 12px rgba(220,38,38,0.5);">${count}</div>
        </div>
        ${label ? `<div style="text-align:center;margin-top:4px;font-weight:800;font-size:11px;color:#111827;background:#fff;border-radius:999px;padding:2px 10px;border:1px solid #e5e7eb;box-shadow:0 2px 6px rgba(0,0,0,0.15);">${escapeHtml(label)}</div>` : ''}
      `,
      iconSize: label ? [size, size + 26] : [size, size],
      iconAnchor: label ? [size / 2, size / 2 + 6] : [size / 2, size / 2],
    });
  }

  const size = count >= 10 ? 46 : 38;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#2563eb;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${count >= 10 ? 14 : 12}px;border:3px solid #fff;box-shadow:0 3px 10px rgba(37,99,235,0.45);">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/**
 * Groupe de marqueurs clusterisés (leaflet.markercluster) intégré à react-leaflet.
 * - Macro-cluster rouge pulsant avec libellé (ex: "24 Abidjan") au-delà du seuil ;
 * - Micro-clusters bleus chiffrés pour les agences proches ;
 * - Éclatement au zoom : natif au plugin.
 */
function MarkerClusterGroup({ agencies, selectedAgency, onSelectAgency, primaryColor }) {
  const map = useMap();

  useEffect(() => {
    // Le plugin s'attache à L (ou à window.L selon le bundler) — garde-fou contre un chargement raté
    const ClusterGroupFactory =
      L.markerClusterGroup ||
      (typeof window !== 'undefined' && window.L && window.L.markerClusterGroup);

    if (!ClusterGroupFactory) {
      console.error('[MarkerClusterGroup] Plugin leaflet.markercluster non chargé.');
      return;
    }

    const clusterGroup = ClusterGroupFactory({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      zoomToBoundsOnClick: true,
      iconCreateFunction: createClusterIcon,
    });

    const markers = agencies
      .filter((a) => a.lat != null && a.lng != null)
      .map((agency) => {
        const aff = getAffluence(agency.affluence);
        const pinColor = aff?.color || primaryColor;
        const marker = L.marker([agency.lat, agency.lng], {
          icon: createAgencyPin(pinColor, selectedAgency?.id === agency.id),
        });
        marker.district = agency.district;
        marker.commune = agency.commune;
        marker.bindTooltip(buildTooltipHtml(agency, primaryColor), {
          direction: 'top',
          offset: [0, -12],
          opacity: 1,
          className: 'agency-tooltip',
        });
        marker.on('click', () => onSelectAgency(agency));
        return marker;
      });

    clusterGroup.addLayers(markers);
    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
      clusterGroup.clearLayers();
    };
  }, [agencies, selectedAgency, onSelectAgency, primaryColor, map]);

  return null;
}

/**
 * Force Leaflet à recalculer ses dimensions après le rendu du DOM et l'animation de la modale
 */
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    // Invalide la taille plusieurs fois pour couvrir toute la durée de l'animation modale (duration-300)
    const t1 = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(CI_BOUNDS, { padding: [25, 25], animate: false });
    }, 100);
    const t2 = setTimeout(() => {
      map.invalidateSize();
    }, 350);
    const t3 = setTimeout(() => {
      map.invalidateSize();
    }, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
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
  onLocationFound,
}) {
  const map = useMap();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const locationMarkerRef = useRef(null);

  // Action "Me localiser" : centre la carte et pose un marqueur sur la position
  const handleLocate = () => {
    setIsLocating(true);
    map.locate({ setView: false, maxZoom: 15 });

    const handleFound = (e) => {
      setIsLocating(false);
      if (locationMarkerRef.current) {
        locationMarkerRef.current.remove();
      }

      // Point bleu vibrant avec halo radar pulsant
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <span style="position:absolute;width:36px;height:36px;border-radius:50%;background:rgba(37,99,235,0.35);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
            <div style="position:relative;z-index:2;width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>
          </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(e.latlng, { icon: userIcon }).addTo(map);
      marker.bindPopup('<div class="font-bold text-xs text-slate-900">📍 Votre position actuelle</div>').openPopup();
      locationMarkerRef.current = marker;

      // Déclenche la détection de proximité dans le composant parent
      onLocationFound?.(e.latlng, map);
    };

    const handleError = () => {
      setIsLocating(false);
      alert("Impossible d'accéder à votre position actuelle. Vérifiez que la géolocalisation est autorisée dans votre navigateur.");
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
            else map.fitBounds(CI_BOUNDS, { padding: [20, 20], animate: true });
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
    if (lat != null && lng != null) {
      map.setView([lat, lng], 14, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

/**
 * Recentre la carte sur les cibles d'une recherche (debouncée côté parent).
 */
function MapSearchFocus({ targets }) {
  const map = useMap();
  useEffect(() => {
    if (!targets || !targets.length) return;
    const withCoords = targets.filter((a) => a.lat != null && a.lng != null);
    if (withCoords.length === 1) {
      map.flyTo([withCoords[0].lat, withCoords[0].lng], 13, { duration: 0.8 });
    } else if (withCoords.length > 1) {
      const bounds = L.latLngBounds(withCoords.map((a) => [a.lat, a.lng]));
      map.flyToBounds(bounds, { padding: [40, 40], duration: 0.8 });
    }
  }, [targets, map]);
  return null;
}

/**
 * Rapporte les bounds visibles au parent (volet « Résultats » du split-screen).
 */
function MapBoundsWatcher({ onBoundsChange }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const b = map.getBounds();
        if (b && b.isValid && b.isValid()) {
          onBoundsChange?.(b);
        }
      } catch {
        // bounds non encore calculables
      }
    }, 250);
    return () => clearTimeout(t);
  }, [map, onBoundsChange]);

  useMapEvents({
    moveend: () => {
      try {
        const b = map.getBounds();
        if (b && b.isValid && b.isValid()) {
          onBoundsChange?.(b);
        }
      } catch {
        // bounds non encore calculables
      }
    },
  });
  return null;
}

/**
 * Réinitialise la vue nationale quand le déclencheur change (fiche flottante).
 */
function MapResetTrigger({ trigger }) {
  const map = useMap();
  useEffect(() => {
    if (!trigger) return;
    map.fitBounds(CI_BOUNDS, { padding: [20, 20], animate: true });
  }, [trigger, map]);
  return null;
}

/**
 * Carte Leaflet principale
 */
export default function AgencyMapView({
  agencies,
  selectedAgency,
  onSelectAgency,
  primaryColor = '#008056',
  searchTargets,
  onBoundsChange,
  resetTrigger,
  onLocationFound,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = (map) => {
    setIsRefreshing(true);
    // Réinitialisation : retour à la vue nationale (Côte d'Ivoire)
    map.fitBounds(CI_BOUNDS, { padding: [20, 20], animate: true });
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="w-full h-full relative isolate">
      <MapContainer
        center={[7.5399, -5.5470]}
        zoom={7}
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

        {/* Recentre la carte sur les résultats d'une recherche */}
        <MapSearchFocus targets={searchTargets} />

        {/* Synchronise le volet « Résultats » avec la zone visible */}
        <MapBoundsWatcher onBoundsChange={onBoundsChange} />

        {/* Réinitialisation déclenchée depuis la fiche flottante */}
        <MapResetTrigger trigger={resetTrigger} />

        {/* Overlay avec les commandes flottantes */}
        <MapControlsOverlay 
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onLocationFound={onLocationFound}
        />

        {/* Pins clusterisés des agences (macro rouge / micro bleu) */}
        <MarkerClusterGroup
          agencies={agencies}
          selectedAgency={selectedAgency}
          onSelectAgency={onSelectAgency}
          primaryColor={primaryColor}
        />
      </MapContainer>
    </div>
  );
}
