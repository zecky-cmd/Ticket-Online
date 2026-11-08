# Proposition d'Architecture et d'Implémentation : Solution 1 (Carte des Agences)

> **Document :** `docs/solution1.md`  
> **Cible :** Équipe de développement / Agent IA  
> **Objectif :** Implémenter fidèlement la carte interactive multi-échelles (Côte d'Ivoire ↔ Abidjan), le clustering dynamique (rouge métropole / bleu quartier), le split-screen desktop, les tooltips au survol, la recherche et le guidage GPS (Itinéraire).

---

## 1. Vue d'Ensemble de l'Architecture

La solution s'articule autour de 5 piliers :

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AgencyMapScreen (Modal XL)                      │
│                                                                        │
│  [ Barre de Recherche Textuelle & Filtres rapides & Bouton GPS ]       │
├──────────────────────────────────────┬─────────────────────────────────┤
│                                      │                                 │
│        Volet Gauche : Carte          │    Volet Droit : Résultats     │
│          (AgencyMapView)             │         (AgencyList)            │
│                                      │                                 │
│  - Niveau 1 : Vue CI Macro           │  - Cartes avec photo agence     │
│    (Cluster Rouge Pulsant "24 Abidjan")│  - Badge "AGENCE OUVERTE"       │
│    (Pins verts des villes de province)│  - Horaires, Adresse, Téléphone │
│                                      │  - Bouton vert "ITINÉRAIRE"     │
│  - Niveau 2 : Vue Zoomée Urbaine     │                                 │
│    (Micro-clusters bleus 2, 3, 5...) │                                 │
│    (Pins individuels SVG avec logo)  │                                 │
│                                      │                                 │
│  - Tooltip au survol (HoverCard)     │                                 │
│  - Fiche Flottante (AgencyFloatingCard)│                                 │
│    [Itinéraire] [Réinitialiser]      │                                 │
└──────────────────────────────────────┴─────────────────────────────────┘
```

---

## 2. Découpage Modulaire des Composants

### 2.1. Nouveaux Fichiers et Refactorisation

| Fichier | Rôle & Responsabilité |
| :--- | :--- |
| `src/screen/map/AgencyMapScreen.jsx` | Orchestrateur principal : gestion du split-screen responsive, de l'état de recherche, de la sélection d'agence et des niveaux de zoom. |
| `src/screen/map/components/AgencyMapView.jsx` | Vue Leaflet enrichie : gestion des bounds (CI vs Abidjan), des calques de marqueurs, clusters et animations `flyTo`. |
| `src/screen/map/components/AgencySearchBar.jsx` | *(Nouveau)* Barre de recherche avec autocomplétion des villes/agences et bouton de géolocalisation rapide. |
| `src/screen/map/components/AgencyFloatingCard.jsx` | *(Nouveau)* Carte popover ancrée en bas à gauche de la carte affichant les détails de l'agence sélectionnée + boutons Itinéraire et Réinitialiser (Image 2). |
| `src/screen/map/components/AgencyCard.jsx` | Carte agence mise à jour avec photo, badge vert de statut et bouton itinéraire (Image 1). |
| `src/screen/map/utils/markerFactory.js` | *(Nouveau)* Usine de création des marqueurs Leaflet personnalisés (Pins SVG, clusters rouges, clusters bleus). |

---

## 3. Détail des Spécifications Techniques

### 3.1. Usine de Marqueurs (`markerFactory.js`)

Pour reproduire exactement les visuels des images sans surcharger la mémoire, nous utilisons des `L.divIcon` légers basés sur du SVG et Tailwind CSS :

#### A. Le Pin d'Agence Individuel (Vert avec Logo)
- **Visuel :** Épingle en goutte inversée blanche avec ombre portée et bordure, intégrant au centre le logo d'entreprise ou l'icône de marque.
- **Code DivIcon Leaflet :**
```javascript
export function createAgencyPinIcon(logoUrl, isSelected = false) {
  const size = isSelected ? 42 : 36;
  return L.divIcon({
    className: 'custom-agency-pin',
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px; transform: translate(-50%, -100%); cursor: pointer;">
        <svg viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3)); width: 100%; height: 100%;">
          <path d="M18 0C8.06 0 0 8.06 0 18C0 29.5 18 44 18 44C18 44 36 29.5 36 18C36 8.06 27.94 0 18 0Z" fill="white"/>
          <path d="M18 2C9.16 2 2 9.16 2 18C2 28.2 18 41.5 18 41.5C18 41.5 34 28.2 34 18C34 9.16 26.84 2 18 2Z" fill="${isSelected ? '#008056' : '#ffffff'}"/>
          <circle cx="18" cy="18" r="13" fill="${isSelected ? '#ffffff' : '#f0fdf4'}" stroke="#008056" stroke-width="1.5"/>
        </svg>
        <div style="position: absolute; top: 7px; left: 7px; width: 22px; height: 22px; display: flex; items-center; justify-content: center;">
          <img src="${logoUrl || '/img/logo-beni.png'}" style="width: 18px; height: 18px; object-fit: contain;" alt="Logo" />
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}
```

#### B. Le Macro-Cluster Métropolitain Rouge (Ex: Abidjan - Image 3 & 4)
- **Visuel :** Badge rouge vif avec effet radar pulsant (`animate-ping`) et libellé chiffré `"24 Abidjan"`.
- **Code DivIcon Leaflet :**
```javascript
export function createHotspotClusterIcon(count, label = 'Abidjan') {
  return L.divIcon({
    className: 'custom-hotspot-cluster',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); cursor: pointer;">
        <!-- Halo radar lumineux animé -->
        <span style="position: absolute; width: 56px; height: 56px; border-radius: 9999px; background: rgba(239, 68, 68, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <!-- Pastille centrale rouge -->
        <div style="position: relative; z-index: 10; display: flex; align-items: center; gap: 4px; background: #dc2626; color: white; padding: 4px 10px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5); border: 2px solid white; font-weight: 800; font-size: 12px;">
          <span>${count}</span>
          <span style="font-weight: 600; font-size: 11px;">${label}</span>
        </div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  });
}
```

#### C. Les Micro-Clusters Urbains Bleus (Image 1)
- **Visuel :** Cercle bleu indigo épuré avec chiffre blanc centré (`2`, `3`, `5`).
```javascript
export function createSubClusterIcon(count) {
  return L.divIcon({
    className: 'custom-subcluster',
    html: `
      <div style="width: 32px; height: 32px; border-radius: 9999px; background: #2563eb; color: white; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.45); cursor: pointer; transform: translate(-50%, -50%);">
        ${count}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}
```

---

### 3.2. Gestion Multi-Échelles de la Carte (Niveaux de Zoom)

1. **Constantes Géographiques :**
```javascript
export const MAP_CONFIG = {
  // Vue Macro Nationale (Côte d'Ivoire entière)
  NATIONAL: {
    center: [7.5399, -5.5470],
    zoom: 7,
    bounds: [[4.30, -8.65], [10.75, -2.50]],
  },
  // Vue Métropole Abidjan
  ABIDJAN: {
    center: [5.3484, -4.0150],
    zoom: 12,
  },
  // Zoom agence individuelle
  AGENCY_DETAIL_ZOOM: 15,
};
```

2. **Logique d'Affichage Dynamique selon le Zoom :**
- **Niveau 1 (Zoom < 10 - Macro) :**
  - Toutes les agences d'Abidjan sont fusionnées dans le marqueur `createHotspotClusterIcon(24, 'Abidjan')`.
  - Les agences de l'intérieur (Soubré, Gagnoa, Korhogo, Yamoussoukro, Abengourou, Bouaké) sont rendues sous forme de pins individuels avec étiquette de ville.
  - Au survol d'un pin intérieur : affichage de l'infobulle compacte (Logo + Ville + Tél).
  - Au clic sur le cluster rouge d'Abidjan : appel de `map.flyTo(MAP_CONFIG.ABIDJAN.center, MAP_CONFIG.ABIDJAN.zoom, { duration: 1.2 })`.
- **Niveau 2 (Zoom >= 10 - Urbain) :**
  - Le macro-cluster rouge disparaît.
  - Les agences d'Abidjan s'affichent sous forme de pins verts individuels et de micro-clusters bleus par quartier.

---

### 3.3. Infobulle au Survol (Hover Tooltip - Image 4)

Dans React-Leaflet, le composant `<Tooltip>` permet de gérer le survol sans ouvrir de pop-up intrusive :

```jsx
<Marker
  position={[agency.lat, agency.lng]}
  icon={createAgencyPinIcon(siteConfig.brand.logo, selectedAgency?.id === agency.id)}
  eventHandlers={{
    click: () => onSelectAgency(agency),
  }}
>
  {/* Tooltip visible uniquement au survol (hover) */}
  <Tooltip direction="top" offset={[0, -32]} opacity={1} className="custom-hover-tooltip">
    <div className="flex items-center gap-2 p-1 bg-white rounded-lg shadow-md border border-slate-100 text-xs">
      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
        <img src={siteConfig.brand.logo} className="w-3.5 h-3.5 object-contain" alt="" />
      </div>
      <div>
        <div className="font-bold text-slate-800 leading-tight">{agency.name}</div>
        <div className="text-[10px] text-slate-500 flex items-center gap-1">
          <span>📞</span> {agency.phone || '2720242424'}
        </div>
      </div>
    </div>
  </Tooltip>
</Marker>
```

---

### 3.4. Carte Flottante d'Agence Sélectionnée (`AgencyFloatingCard.jsx` - Image 2)

Ancrée au-dessus de la carte en bas à gauche sur desktop (ou sous forme de bottom sheet sur mobile) :

- **Horaires et Statut Dynamique :**
  - Calcul automatique du statut `"Ouvert"` ou `"Fermé"` selon l'heure courante.
- **Action "Itinéraire" :**
```javascript
const handleDirections = (agency, userLocation) => {
  const dest = `${agency.lat},${agency.lng}`;
  const origin = userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : '';
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1${origin}&destination=${dest}&travelmode=driving`;
  window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
};
```
- **Action "Réinitialiser" :**
```javascript
const handleResetView = () => {
  setSelectedAgency(null);
  map.flyToBounds(MAP_CONFIG.NATIONAL.bounds, { duration: 1 });
};
```

---

### 3.5. Split-Screen Desktop & Barre de Recherche

Dans `AgencyMapScreen.jsx` :

1. **Barre de Recherche Supérieure (`AgencySearchBar.jsx`) :**
   - Input texte avec loupe et raccourci "Effacer".
   - Filtre instantané sur `agency.name`, `agency.commune`, `agency.city` ou `agency.address`.
   - Bouton de géolocalisation GPS intégré.
2. **Affichage Split-Screen sur Desktop (`md:flex md:flex-row`) :**
```jsx
<div className="flex-1 flex flex-col md:flex-row overflow-hidden">
  {/* Volet Gauche : Carte Leaflet (65% à 70% de la largeur desktop) */}
  <div className="flex-1 h-[50vh] md:h-full relative overflow-hidden">
    <AgencyMapView ... />
    {selectedAgency && (
      <AgencyFloatingCard 
        agency={selectedAgency} 
        onClose={() => setSelectedAgency(null)}
        onDirections={handleDirections}
        onReset={handleResetView}
        onTakeTicket={handleTakeTicket}
      />
    )}
  </div>

  {/* Volet Droit : Liste des Résultats (30% à 35% de la largeur desktop) */}
  <div className="hidden md:flex md:w-80 lg:w-96 flex-col border-l border-slate-200 bg-slate-50 overflow-y-auto">
    <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
      <h3 className="text-xs font-extrabold text-slate-800">
        Résultats ({filteredAgencies.length})
      </h3>
    </div>
    <div className="p-3 space-y-2.5">
      {filteredAgencies.map((agency) => (
        <AgencyCard 
          key={agency.id} 
          agency={agency}
          isSelected={selectedAgency?.id === agency.id}
          onSelect={() => handleSelectAgency(agency)}
          onDirections={() => handleDirections(agency)}
        />
      ))}
    </div>
  </div>
</div>
```

---

## 4. Plan de Déploiement Étape par Étape

1. **Étape 1 :** Créer `src/screen/map/utils/markerFactory.js` avec la définition des DivIcons (pins SVG, cluster rouge halo, clusters bleus).
2. **Étape 2 :** Implémenter la barre de recherche `AgencySearchBar.jsx` et brancher la logique de filtrage textuel.
3. **Étape 3 :** Adapter `AgencyMapView.jsx` pour intégrer :
   - Le centrage initial national (`MAP_CONFIG.NATIONAL`).
   - L'agrégation Abidjan vs agences provinciales.
   - Les tooltips compacts au survol (`hover`).
   - Le zoom animé fluide au clic sur le cluster rouge.
4. **Étape 4 :** Créer `AgencyFloatingCard.jsx` avec les boutons "Itinéraire" (GPS universel) et "Réinitialiser" (dézoom national).
5. **Étape 5 :** Réorganiser `AgencyMapScreen.jsx` en Split-Screen responsive (Carte + Liste côte à côte sur desktop).
6. **Étape 6 :** Tests d'intégration (recherche, clics, responsive mobile/desktop, lint & build).

