# 🧭 SYNTHÈSE DE TRANSMISSION AGENT — PROJET S2Q (TICKET EN LIGNE)

> **Document destiné aux agents IA et développeurs reprenant le projet.**  
> Ce document résume le contexte métier, les décisions architecturales, les contraintes imposées par l'utilisateur et l'état exact du code.

---

## 1. Contexte du Projet & Règle d'or

* **Nom du projet** : `TEMPLATE TICKET EN LIGNE` (Module client web de la suite **S2Q — Synapse Queue System**).
* **Entreprise** : Synapse (Abidjan, Côte d'Ivoire).
* **Rôle du module** : Portail en ligne permettant aux clients bancaires de prendre un ticket dématérialisé à distance, de localiser les agences et de donner leur avis de satisfaction.
* ⚠️ **RÈGLE CRITIQUE DE L'UTILISATEUR** :
  * Le fichier `n-context.md` à la racine contient la description fonctionnelle du système complet. **IL EST STRICTEMENT INTERDIT DE MODIFIER `n-context.md`** (*instruction explicite : "ne modifi rien"*).

---

## 2. Contraintes Techniques et Design Validées

### 🎨 A. Couleur officielle de marque
* **Vert signature S2Q** : `#008056` (**OBLIGATOIRE**).
* *Attention* : Ne plus jamais utiliser l'ancienne nuance `#00843D`.
* Définie dans `src/assets/css/index.css` sous `--color-primary-500` et dans `src/theme/themes.js`.

### 🖥️ B. La règle stricte du "100vh / Zéro Scroll" & Responsive Mobile
* **Demande explicite de l'utilisateur** :
  > *"le header + footer + le corp tous dois faire 100vh en hauteur ou 100% ne pas avoir besoin de scroler pour voir le footer"*
* **Implémentation** :
  * `src/layout/Layout.jsx` : Utilise `h-screen max-h-screen h-[100dvh] w-full flex flex-col justify-between overflow-hidden`.
  * `src/screen/OnlineScreen.jsx` : `main` et conteneurs ont `flex-1 min-h-0 overflow-hidden`.
  * Tous les composants internes sont calibrés avec précision (paddings compacts, hauteurs équilibrées) pour que la totalité (Header, Accroche, Carrousel, Cartes de service, Vague verte CTA, Footer) soit visible **d'un coup d'œil dès le chargement sans barre de défilement**.
* **Gestion spécifique sur Mobile (iOS / Safari)** :
  * Les modales utilisent `h-[94dvh]` pour éviter d'être coupées par la barre de navigation dynamique du bas sur smartphone.

### 🔤 C. Configuration de la police en "Une seule ligne"
* L'utilisateur a demandé de pouvoir basculer la police du projet en **modifiant seulement 1 ligne**.
* **Configuration en place** :
  1. Les polices Google Fonts (**Plus Jakarta Sans**, **Lato**, **Inter**) sont préchargées dans `index.html`.
  2. Dans `src/assets/css/index.css` (Ligne 21), modifier uniquement :
     ```css
     --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
     ```
  3. Tous les textes, titres, boutons, modales et formulaires en héritent automatiquement.
  * Police active par défaut : **Plus Jakarta Sans** (conforme au rendu moderne fintech de la maquette).

### 🌊 D. Bandeau vert inférieur (`CtaWave.jsx`) & Pastille radar CSS
* Conforme aux spécifications du designer dans `nplan.md` :
  1. **Courbe SVG asymétrique** mesurée au pixel près sur la maquette :
     `viewBox="0 0 1440 20"` avec découpe tendue (`d="M 0,13 C 70,7 140,1 215,0 C 280,0 340,2.5 420,2.5 L 1010,2.5 C 1090,2.5 1150,0 1225,0 C 1310,0 1380,7 1440,13 L 1440,20 L 0,20 Z"`).
  2. **Pastille radar de contact** : Réalisée en **CSS pur sans SVG ni image** via les classes `.contact-mark` et `.contact-mark__dot` définies dans `src/assets/css/index.css`.

### 📦 E. Gestionnaire de packages exclusif : `npm`
* ⚠️ **Instruction ferme de l'utilisateur** : **UTILISER UNIQUEMENT `npm`**.
* Ne pas utiliser `pnpm` ni `yarn` pour éviter les conflits de fichiers de lock (`package-lock.json` est le seul fichier de lock du projet).
* Commandes : `npm run dev`, `npm run build`, `npm run lint`.

### 🏛️ F. Architecture logicielle & Garde-fous (`GARDE_FOU.md`)
* **React 19 / JSX Transform** : Ne pas importer `React` inutilement (`import React from 'react'` interdit par le linter).
* **Règles des Hooks React** : Ne jamais placer de condition anticipée (`if (!isOpen) return null;`) avant les hooks (`useState`, `useCallback`, etc.).
* **Aucun fichier barrel** (`index.js` regroupant des exports) : les imports doivent être explicites et directs.
* **Aucun lien mort `<a href="#">`** : utiliser `<button type="button">` ou le composant `<Link>`.
* **Indépendance des blocs** : chaque composant visuel a sa responsabilité propre et ses props modulaires.

---

## 3. Détail de la Fonctionnalité "Nos Agences" (Refonte Récente)

La modale `AgencyMapScreen` a été entièrement refondue pour coller aux maquettes validées et offrir une vraie carte interactive sans coût d'API :

* **Technologie cartographique** : `leaflet` (v1.9.4) + `react-leaflet` (v5.0.0) sur OpenStreetMap (sans token/clé API).
* **Composants du module (`src/screen/map/`)** :
  * `AgencyMapScreen.jsx` : Orchestrateur de la modale avec système d'onglets `[Carte]` / `[Liste]` adapté au mobile (`100dvh`).
  * `components/AgencyMapView.jsx` : Composant carte Leaflet avec :
    * Marqueurs CSS circulaires colorés selon l'affluence :
      * 🟢 **Fluide** : `#008056` (< 10 min)
      * 🟡 **Modérée** : `#f59e0b` (10 - 25 min)
      * 🔴 **Saturée** : `#ef4444` (> 25 min)
    * `MapResizeHandler` pour forcer `map.invalidateSize()` à l'ouverture de l'onglet.
    * 🎯 **Bouton Position (Haut Gauche)** : Géolocalisation navigateur native et centrage immédiat.
    * 🔄 **Bouton Refresh (Haut Droite)** : Dézoom et vue d'ensemble du réseau (`fitBounds`).
    * 🕹️ **Pavé de contrôle dépliable (Bas Gauche)** : Bouton 4 directions (`panBy`) et zoom (`+` / `-`).
    * Mention d'attribution Leaflet masquée (`attributionControl={false}`).
  * `components/AgencyFilterBar.jsx` : Filtres compacts (Toutes, Fluides, Modérées, Saturées).
  * `components/AgencyCard.jsx` : Carte horizontale de la liste avec affluence, quartier, horaires et temps d'attente.
  * `components/AgencyDetailSheet.jsx` : Fiche détaillée de l'agence sélectionnée avec actions d'appel, d'itinéraire et de prise directe de ticket.
* **Données (`src/mocks/agenciesMock.js`)** :
  * Enrichies avec `lat`, `lng`, `affluence`, `waitMinutes`, `openUntil` et `district`.

---

## 4. Détail du Parcours "Prise de Ticket" (Nouveau flux à 5 étapes)

Le parcours de prise de ticket a été refondu pour reproduire fidèlement l'en-tête de la maquette et proposer un flux guidé complet :
* **Stepper Horizontal & En-tête** (`TicketStepperHeader.jsx`) :
  * Eyebrow : `VOTRE RENDEZ-VOUS EN QUELQUES ÉTAPES`
  * Titre : `Prendre un ticket` en vert S2Q (`#008056`)
  * Sous-titre : `Un parcours simple pour préparer votre visite en agence.`
  * 5 barres horizontales d'avancement au-dessus des labels d'étapes :
    1. **Agence** (Sélection déroulante + récapitulatif affluence, horaires, guichets)
    2. **Service** (Sélection déroulante des grands pôles bancaires : Caisse, Conseil, Entreprises, Réclamations)
    3. **Prestation** (Sélection déroulante contextuelle filtrée selon le service + rappel des pièces à apporter)
    4. **Créneau** (Choix entre passage immédiat ou rendez-vous programmé sur créneau horaire)
    5. **Vos infos** (Saisie nom, téléphone pour SMS/suivi, email + récapitulatif compact)
* **Reçu Virtuel S2Q** (`TicketReceipt.jsx`) :
  * Numéro de ticket grand format généré selon la série du service (ex: `CAI-102`, `CPT-405`)
  * QR Code de scan pour validation à la borne d'accueil en agence
  * Mention de l'heure/créneau réservé et boutons d'impression / clôture.

---

## 5. Structure des Fichiers Clés

```text
├── index.html                           # Préchargement Google Fonts + point d'entrée
├── package.json                         # Dépendances du projet (Leaflet, Redux, Lucide, Tailwind v4)
├── package-lock.json                    # Lockfile officiel npm unique
├── n-context.md                         # ⚠️ NE PAS TOUCHER : Métier S2Q
├── nplan.md                             # Spécifications du designer pour le CTA Wave
├── GARDE_FOU.md                         # Règles strictes d'architecture du projet
├── SYNTHESE_AGENT.md                    # Ce document de transmission (mis à jour)
│
├── src/
│   ├── assets/css/
│   │   └── index.css                    # Tailwind v4 CSS-first config, @theme, police (L21), radar CSS
│   │
│   ├── layout/
│   │   ├── Layout.jsx                   # Structure 100vh globale (Header, main, Footer)
│   │   └── Container.jsx                # Centrage horizontal max-w-5xl / paddings
│   │
│   ├── screen/
│   │   ├── OnlineScreen.jsx             # Orchestrateur d'accueil 100vh + déclencheur des modales
│   │   ├── ticket/                      # 🎫 Module Prise de Ticket Multi-Étapes (Refondu)
│   │   │   ├── TicketScreen.jsx         # Orchestrateur modal & flux à 5 étapes
│   │   │   └── components/
│   │   │       ├── TicketStepperHeader.jsx # En-tête avec 5 barres de progression horizontales
│   │   │       ├── StepAgency.jsx       # Étape 1 : Liste déroulante des agences + fiche affluence
│   │   │       ├── StepService.jsx      # Étape 2 : Liste déroulante des services bancaires
│   │   │       ├── StepPrestation.jsx   # Étape 3 : Liste déroulante des prestations contextuelles + pièces
│   │   │       ├── StepTimeslot.jsx     # Étape 4 : Créneau (Passage immédiat ou RDV programmé)
│   │   │       ├── StepCustomerInfo.jsx # Étape 5 : Saisie coordonnées + récapitulatif
│   │   │       └── TicketReceipt.jsx    # Reçu final format Boarding Pass avec QR Code
│   │   ├── satisfaction/SatisfactionScreen.jsx # Modal avis client
│   │   └── map/                         # 🗺️ Module Nos Agences (Refondu)
│   │       ├── AgencyMapScreen.jsx      # Modale principale responsive (Tabs Carte / Liste)
│   │       └── components/
│   │           ├── AgencyMapView.jsx    # Carte Leaflet + Overlay contrôles (Position, Refresh, D-Pad)
│   │           ├── AgencyFilterBar.jsx  # Barre de filtres affluence compacte
│   │           ├── AgencyCard.jsx       # Card horizontale d'agence
│   │           ├── AgencyDetailSheet.jsx# Fiche détaillée & CTA "Prendre ticket ici"
│   │           └── AgencyList.jsx       # Vue liste avec recherche textuelle
│   │
│   ├── globalComponents/
│   │   ├── Header.jsx                   # Barre verte d'en-tête (h-14)
│   │   │   ├── header/HeaderBrand.jsx   # Logo 'S' + Synapse S2Q
│   │   │   └── header/HeaderContact.jsx # Pilule téléphonique (+225 27 20 00 00)
│   │   ├── WelcomeBanner.jsx            # Eyebrow ambre + "L'agence, sans l'attente."
│   │   ├── Carousel.jsx                 # Slider bannières (hauteur calibrée h-[180px]-h-[210px])
│   │   ├── ServiceCards.jsx             # Grille 3 actions (Ticket, Avis, Agences)
│   │   ├── CtaWave.jsx                  # Arc asymétrique vert + radar CSS + bouton "Nous contacter"
│   │   └── Footer.jsx                   # Pied de page blanc épuré 1 ligne
│   │
│   ├── mocks/
│   │   ├── agenciesMock.js              # Données mockées agences avec coordonnées et affluence
│   │   ├── ticketFlowMock.js            # Données hiérarchiques services, prestations et créneaux
│   │   ├── servicesMock.js              # Motifs de visite bancaires
│   │   └── slidesMock.js                # Bannières du carrousel
│   │
│   ├── theme/themes.js                  # Palette dynamique Redux (vertBlanc par défaut)
│   └── store/store.js                   # Store Redux Toolkit (modales, agence sélectionnée, thèmes)
```

---

## 5. Ce qu'il reste à faire / Prochaines étapes

1. **Intégration API Back-Office** :
   * Connecter le formulaire de prise de ticket (`TicketForm.jsx`) aux endpoints réels de l'API S2Q pour générer les vrais numéros de ticket (ex: `#A042`) et créneaux horaires configurés dans le back-office.
2. **Synchronisation en temps réel des files** :
   * Brancher les données d'affluence et de temps d'attente sur les websockets ou polling API S2Q.
3. **Persistance et Impression/Export du ticket** :
   * Permettre au client de sauvegarder son ticket sur smartphone (téléchargement PDF, capture ou SMS/QR Code de rappel).

---

## 6. Mémo pour le prochain agent

* Si l'utilisateur demande une modification d'espacement : garde toujours à l'esprit la contrainte **100vh / zéro scroll**.
* Si l'utilisateur demande de changer de police : modifie uniquement `--font-sans` dans `src/assets/css/index.css` (ligne 21).
* Respecte rigoureusement la charte **`#008056`**.
* Utilise **exclusivement `npm`** pour toute installation ou script.
* Aucun `import React from 'react'` inutile pour maintenir **0 erreur ESLint**.

