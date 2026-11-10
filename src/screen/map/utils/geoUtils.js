/**
 * Utilitaires géographiques pour la carte des agences
 */

/**
 * Calcule la distance orthodromique entre deux coordonnées GPS en kilomètres (formule Haversine).
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number|null} distance en km
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);

  if (!Number.isFinite(nLat1) || !Number.isFinite(nLon1) || !Number.isFinite(nLat2) || !Number.isFinite(nLon2)) {
    return null;
  }

  const R = 6371; // Rayon de la Terre en km
  const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
  const dLon = ((nLon2 - nLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nLat1 * Math.PI) / 180) *
      Math.cos((nLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formate une distance pour l'affichage utilisateur (ex: "650 m" ou "2,4 km").
 * @param {number|null} distanceInKm
 * @returns {string}
 */
export function formatDistance(distanceInKm) {
  if (distanceInKm == null || !Number.isFinite(distanceInKm)) return '';
  if (distanceInKm < 1) {
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} m`;
  }
  return `${distanceInKm.toFixed(1).replace('.', ',')} km`;
}

/**
 * Trie une liste d'agences par proximité avec une position utilisateur.
 * @param {any[]} agencies
 * @param {{ lat: number, lng: number }|null} userLocation
 * @returns {any[]}
 */
export function attachAndSortByDistance(agencies, userLocation) {
  if (!userLocation || userLocation.lat == null || userLocation.lng == null) {
    return agencies.map((a) => ({ ...a, distance: null }));
  }

  const withDist = agencies.map((agency) => {
    const dist = calculateDistance(userLocation.lat, userLocation.lng, agency.lat, agency.lng);
    return {
      ...agency,
      distance: dist,
    };
  });

  return withDist.sort((a, b) => {
    if (a.distance == null && b.distance == null) return 0;
    if (a.distance == null) return 1;
    if (b.distance == null) return -1;
    return a.distance - b.distance;
  });
}

