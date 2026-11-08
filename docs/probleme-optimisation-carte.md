# Spécification et Analyse des Besoins : Optimisation de la Carte des Agences

> **Note pour l'agent IA :** Ce document traduit et décrit de manière exhaustive les 4 captures d'écran de référence transmises par le client ainsi que les spécifications formulées dans `docs/optimisation-carte.md`. Il sert de source de vérité pour implémenter la nouvelle expérience interactive de la carte des agences.

---

## 1. Contexte et Objectifs

L'objectif est de transformer l'écran de visualisation des agences (`AgencyMapScreen` / `AgencyMapView`) en une expérience cartographique moderne, fluide et hiérarchisée, adaptée à la fois au contexte national (Côte d'Ivoire) et aux zones à forte densité urbaine (Abidjan).

Actuellement, l'application affiche une carte centrée arbitrairement sur Abidjan avec des points circulaires basiques sans regroupement dynamique, sans vue globale nationale et sans split-screen desktop.

---

## 2. Analyse Détaillée des 4 Captures d'Écran de Référence

### Image 1 : Vue Urbaine Détaillée & Split-Screen Desktop (Exemple : Abidjan)
*Fichier source : `media_1793982679164_6c53692f.png`*

- **Disposition (Layout) :**
  - **Split-Screen Desktop :** Sur grand écran, l'espace est divisé en deux panneaux synchronisés :
    - **Panneau gauche (70% de largeur) :** Carte interactive plein écran.
    - **Panneau droit (30% de largeur) :** Volet latéral défilant intitulé **"Résultats (X)"** listant les agences correspondant à la zone affichée.
- **Éléments sur la carte :**
  - **Bouton de géolocalisation GPS :** Bouton blanc circulaire flottant en haut à gauche avec une icône de viseur/cible pour centrer la carte sur la position GPS réelle de l'utilisateur.
  - **Marqueurs individuels personnalisés (Pins) :**
    - Forme d'épingle en goutte d'eau (pin) blanche avec bordure et ombre soignée.
    - À l'intérieur du pin : icône/logo stylisé vert de l'entreprise (ex: `{ }` ou monogramme bancaire).
  - **Micro-clusters de quartier (Bulles bleues) :**
    - Pour les zones d'Abidjan ayant plusieurs agences proches (ex: Cocody Palmeraie, Treichville, Plateau), des pastilles circulaires bleues affichent le nombre d'agences regroupées (ex: badge bleu **`2`**, **`3`**, **`5`**).
- **Cartes d'agences dans le volet droit :**
  - Chaque carte d'agence comporte :
    - Une photo/illustration de l'agence avec un badge vert incrusté **"AGENCE OUVERTE"**.
    - Le nom de l'agence (ex: *Koumassi*, *Marcory Solibra*).
    - L'adresse postale avec une icône de localisation (ex: *Boulevard...*, *Au sein de Solibra*).
    - Le numéro de téléphone avec une icône combiné (ex: *27202424...*).
    - Les horaires d'ouverture (ex: *Lundi - Vendredi : 08h00 - 16h30*).
    - Un bouton d'action dédié vert/outline **"ITINÉRAIRE"** avec icône flèche/boussole.

---

### Image 2 : Vue Zoomée sur une Agence & Carte Flottante d'Actions (Exemple : Soubré)
*Fichier source : `media_1793982679289_ebe5e1f3.png`*

- **Comportement au clic sur une agence :**
  - La carte zoome de façon fluide et se recentre sur l'agence sélectionnée (niveau de zoom de rue ~14-15).
  - Un marqueur pin vert d'agence est positionné précisément sur son adresse.
- **Carte d'information flottante (Floating InfoCard / Popover) :**
  - Ancrée élégamment en bas à gauche de la carte (sur desktop) ou sous forme de bottom sheet sans occulter la carte.
  - **En-tête de la carte :**
    - Badge carré vert avec logo de l'entreprise.
    - Nom de la ville/agence en grand et en gras : **Soubré**.
    - Nom de la commune/quartier en sous-titre : *Soubré*.
    - Badge de statut en ligne : **`• Ouvert`** (pastille verte + fond vert pâle).
    - Bouton croix (**X**) en haut à droite pour refermer la carte.
  - **Corps de la carte :**
    - Adresse : *Avenue Principale, Carrefour Dobois* (icône pin).
    - Téléphone : *2720242424* (icône téléphone).
    - Horaires complets : *Lundi - 12h30 à 15h30 / Mardi au vendredi - 08h à 15h30 / Samedi - 09h à 12h30* (icône horloge).
  - **Boutons d'action (Dual Action Bar) :**
    1. **Bouton "Itinéraire" :** Bouton principal vert plein (`bg-[#008056]`), texte blanc avec icône flèche de direction. Ouvre le guidage GPS depuis la position de l'utilisateur vers l'agence.
    2. **Bouton "Réinitialiser" :** Bouton secondaire outline/neutre avec icône flèche circulaire (refresh). Réinitialise la vue de la carte (dézoom automatique vers la vue globale Côte d'Ivoire).

---

### Image 3 : Vue Globale Macro Nationale & Cluster Abidjan
*Fichier source : `media_1793982679370_04647203.png`*

- **Vue initiale par défaut :**
  - Carte dézoomée à l'échelle du pays entier (Côte d'Ivoire complète avec ses frontières visibles : Guinée, Liberia, Mali, Burkina Faso, Ghana, Océan Atlantique).
- **Villes de province :**
  - Chaque ville dotée d'une ou deux agences présente son marqueur pin vert distinct :
    - Nord : Korhogo (2 agences visibles).
    - Centre : Bouaké / Katiola, Yamoussoukro.
    - Est : Abengourou.
    - Centre-Ouest / Ouest : Gagnoa, Soubré, Daloa.
- **Macro-Cluster d'Abidjan (Point Chaud / Hotspot) :**
  - Abidjan concentre une forte densité (ex: 24 agences).
  - Plutôt que d'afficher 24 pins superposés illisibles, le système affiche un **Macro-Cluster rouge vif avec effet halo/onde lumineuse (pulse)**.
  - Libellé : **`24 Abidjan`** (ou pastille rouge avec le chiffre 24 à côté du label Abidjan).
  - **Interaction :** Un clic sur ce macro-cluster déclenche une animation de zoom avant vers Abidjan, éclatant le cluster rouge en marqueurs de quartier (bleus) et agences individuelles (vertes) comme sur l'Image 1.

---

### Image 4 : Interaction au Survol (Hover Tooltip / Mini-Preview) (Exemple : Gagnoa)
*Fichier source : `media_1793982679376_00f6bd90.png`*

- **Interaction Hover (survol souris sur Desktop) :**
  - Lorsqu'on survole un marqueur d'agence sur la carte (sans encore cliquer dessus), une infobulle compacte (Tooltip) apparaît instantanément au-dessus de l'épingle.
- **Contenu du Tooltip compact :**
  - Badge avec le logo/icône de la banque/entreprise à gauche.
  - Nom de la ville/agence : **Gagnoa** (en gras).
  - Numéro de téléphone direct : **2720242424** (avec icône téléphone).
  - Petite étiquette texte simple sous le marqueur indiquant la ville ("Gagnoa").
- Cette interaction permet à l'utilisateur de scanner rapidement les villes et de voir les contacts sans quitter la vue macro.

---

## 3. Synthèse des Exigences Fonctionnelles & Techniques

| Fonctionnalité | Comportement Attendu | Image de Référence |
| :--- | :--- | :--- |
| **Vue Initiale Nationale** | Carte cadrée par défaut sur toute la Côte d'Ivoire (bounds coordonnées CI). | Image 3 & 4 |
| **Marqueurs Personnalisés** | Pins SVG en goutte d'eau avec logo de l'entreprise au centre (remplace les simples ronds colorés actuels). | Images 1, 2, 3, 4 |
| **Macro-Cluster Régional** | Pour Abidjan (ou toute ville à > 5 agences), afficher un cluster rouge vif pulsant avec badge chiffré (ex: `24 Abidjan`). | Image 3 & 4 |
| **Zoom d'Éclatement** | Clic sur le cluster rouge = zoom fluide vers la métropole, révélant les pins individuels et micro-clusters bleus. | Image 1 |
| **Micro-Clusters Locaux** | Pastilles bleues chiffrées (2, 3, 5...) pour les agences très proches dans la même commune. | Image 1 |
| **Tooltip au Survol** | Survol d'un marqueur = popover compact avec Logo + Nom de ville + Téléphone. | Image 4 |
| **Fiche Détail Flottante** | Clic sur un marqueur = zoom sur l'agence + carte détaillée en bas à gauche avec horaires, statut ouvert/fermé. | Image 2 |
| **Bouton Itinéraire** | Ouvre l'itinéraire GPS (Google Maps / Waze ou tracé OSM) depuis la position client jusqu'à l'agence. | Images 1 & 2 |
| **Bouton Réinitialiser** | Dézoome et réinitialise la vue vers la carte globale de la Côte d'Ivoire. | Image 2 |
| **Barre de Recherche** | Recherche textuelle en direct par nom d'agence, ville ou commune pour centrer directement la carte. | Exigence `L8` |
| **Split-Screen Desktop** | Sur grand écran : Carte à gauche (70%) + Liste déroulante des agences filtrées à droite (30%). | Image 1 |
| **Bouton Géolocalisation** | Bouton GPS flottant en haut à gauche pour centrer sur la position de l'utilisateur. | Image 1 |

---

## 4. Écarts avec le Code Existant (`src/screen/map/`)

1. **Gabarit & Centrage :**
   - *Actuel :* `DEFAULT_CENTER = [5.3197, -4.0167]` (Abidjan) zoom 12 fixe.
   - *Requis :* Vue initiale `fitBounds` sur l'ensemble de la Côte d'Ivoire `[4.3, -8.6]` à `[10.7, -2.5]`.
2. **Marqueurs :**
   - *Actuel :* DivIcon avec un cercle CSS de 15px/20px coloré selon l'affluence.
   - *Requis :* Vrai Pin SVG personnalisé avec logo de l'enseigne + gestion du hover tooltip.
3. **Clustering :**
   - *Actuel :* Aucun clustering (tous les marqueurs sont rendus indépendamment).
   - *Requis :* Clustering hiérarchique à 2 niveaux (Macro-cluster rouge avec halo pour les métropoles, clusters bleus pour les quartiers).
4. **Ergonomie Desktop :**
   - *Actuel :* Deux onglets mutuellement exclusifs (`activeTab === 'map'` OU `'list'`).
   - *Requis :* Split view simultanée sur grand écran (Carte + Volet latéral des résultats).
5. **Recherche :**
   - *Actuel :* Uniquement un filtre par niveau d'affluence (`AgencyFilterBar`).
   - *Requis :* Barre de recherche textuelle temps réel (villes, agences, communes).
6. **Actions de Guidage :**
   - *Actuel :* Uniquement le bouton "Prendre un ticket".
   - *Requis :* Bouton "Itinéraire" (GPS / lien de navigation externe) et bouton "Réinitialiser" (recentrage national).

