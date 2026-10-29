# 🗺️ PLAN DE REFONTE ÉTAPE PAR ÉTAPE — S2Q TICKET EN LIGNE

> **Document de cadrage pour la refonte visuelle du site.**  
> Ce plan respecte strictement notre **architecture établie**, les **2 maquettes fournies (Desktop & Mobile)** et les **règles du garde-fou**.

---

## 🎯 1. Les 4 Exigences Fondamentales

1. **Conservation intégrale de notre architecture** :
   - On conserve notre arborescence validée (`globalComponents/`, `layout/`, `screen/`, `services/`, `theme/`).
   - Aucun sous-dossier inutile, aucun fichier `index.js`.
2. **Chaque bloc est codé indépendamment** :
   - Chaque composant possède son propre fichier, ses props explicites et sa responsabilité unique.
3. **Zéro scroll (Plein écran / Viewport Fitting)** :
   - Sur PC comme sur mobile, la page principale tient entièrement dans la hauteur de l'écran (`h-screen flex flex-col justify-between overflow-hidden`).
   - L'utilisateur a l'ensemble des services et informations sous les yeux sans avoir à faire défiler la page.
4. **Fidélité absolue aux maquettes (Desktop & Mobile)** :
   - Header vert avec pilule contact.
   - Titre d'accroche centré avec badge ambre.
   - Carrousel sous forme de carte flottante avec overlay gauche et pagination intégrée.
   - 3 cartes de services : format horizontal sur desktop, et **3 colonnes compactes côte-à-côte (`grid-cols-3`) sur mobile**.
   - Bandeau vert inférieur avec découpe en vague SVG.
   - Footer épuré 1 ligne.

---

## 🏗️ 2. Rappel de l'Architecture Conservée

```text
TEMPLATE TICKET EN LIGNE/
├── GARDE_FOU.md                        <-- Règles d'or du projet
├── PLAN_REFONTE.md                     <-- CE FICHIER (Feuille de route de la refonte)
├── src/
│   ├── assets/css/index.css            <-- Tokens Tailwind v4 (@theme --color-primary-*)
│   ├── layout/
│   │   ├── Layout.jsx                  <-- Squelette complet (Header + Corps + Footer)
│   │   └── Container.jsx               <-- Cadrage & centrage (max-w-7xl mx-auto)
│   ├── globalComponents/
│   │   ├── Header.jsx                  <-- Barre d'en-tête verte signature
│   │   ├── header/
│   │   │   ├── HeaderBrand.jsx         <-- Logo Synapse 'S' + Sous-titre S2Q
│   │   │   └── HeaderContact.jsx       <-- Pilule d'assistance (+225 27 20 00 00 →)
│   │   ├── WelcomeBanner.jsx           <-- Bloc d'accroche ("L'agence, sans l'attente.")
│   │   ├── Carousel.jsx                <-- Carrousel flottant arrondi avec overlay CTA
│   │   ├── ServiceCards.jsx            <-- Grille des 3 services (horizontal / 3 cols mobile)
│   │   ├── CtaWave.jsx                 <-- Bandeau vert avec vague SVG + bouton contact
│   │   ├── Footer.jsx                  <-- Pied de page minimaliste blanc
│   │   └── ui/                         <-- Primitives (Button.jsx, Card.jsx, Link.jsx)
│   ├── screen/
│   │   ├── OnlineScreen.jsx            <-- Page principale (assemble les blocs en 0-scroll)
│   │   ├── ticket/TicketScreen.jsx     <-- Écran Prise de ticket
│   │   ├── satisfaction/SatisfactionScreen.jsx <-- Écran Avis client
│   │   └── map/AgencyMapScreen.jsx     <-- Écran Carte des agences
│   ├── services/                       <-- Couche API S2Q (Axios + USE_MOCK)
│   ├── mocks/                          <-- Données mockées (agencies, slides)
│   ├── features/                       <-- Redux Toolkit
│   └── theme/                          <-- Thèmes dynamiques (themes.js)
```

---

## 🚀 3. Déroulement de la Refonte (6 Étapes Pas à Pas)

### 🔹 Étape 1 : Le Header Vert Signature
* **Fichiers ciblés** : 
  - [`src/globalComponents/header/HeaderBrand.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/header/HeaderBrand.jsx)
  - [`src/globalComponents/header/HeaderContact.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/header/HeaderContact.jsx)
  - [`src/globalComponents/Header.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/Header.jsx)
* **Actions** :
  1. Passer le fond en vert corporate `primary` (`#00843D`).
  2. Gauche : Logo carré arrondi vert foncé avec la lettre **"S"** blanche + texte **"Synapse"** en gras blanc + sous-titre **"S2Q · TICKETS EN LIGNE"** en vert pâle.
  3. Droite : Capsule/pilule d'assistance téléphonique arrondie (`bg-white/10 hover:bg-white/20 border border-white/20`) affichant *"Besoin d'aide ? +225 27 20 00 00 →"* sur desktop, et la pilule compacte avec le numéro sur mobile.

---

### 🔹 Étape 2 : Le Bloc d'Accroche (`WelcomeBanner.jsx`)
* **Nouveau composant indépendant** : [`src/globalComponents/WelcomeBanner.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/WelcomeBanner.jsx)
* **Actions** :
  1. **Badge Eyebrow** : Pastille ambre `●` + texte *"VOTRE ACCUEIL, EN PLUS SIMPLE"* en lettres capitales espacées.
  2. **Titre H1** : **« L’agence, sans l’attente. »** en typographie bold moderne, parfaitement centrée.
  3. **Sous-titre** : *"Préparez votre visite, trouvez une agence ou partagez votre expérience en quelques instants."* (texte gris doux lisible).
  4. **Gestion de l'espace vertical** : Marges calculées pour ne pas pousser la page en débordement (hauteur compacte).

---

### 🔹 Étape 3 : Le Carrousel Flottant Épuré (`Carousel.jsx`)
* **Fichier ciblé** : [`src/globalComponents/Carousel.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/Carousel.jsx)
* **Actions** :
  1. **Format carte flottante** : Conteneur centré avec bordures très arrondies (`rounded-3xl` / `rounded-[28px]`), ombre douce et cadrage dans `Container`.
  2. **Overlay de contenu à gauche** :
     - Badge de contexte (*"VOTRE AVIS COMPTE"* ou *"TICKET EN LIGNE"*).
     - Titre percutant de la slide (*"Ensemble, améliorons votre expérience."* / *"Votre ticket, sans faire la queue."*).
     - Description d'aide concise.
     - Bouton d'action blanc avec flèche : `Donner mon avis →` ou `Prendre un ticket →`.
  3. **Contrôles de navigation en bas à droite** :
     - Bouton rond précédent `←`.
     - Points de pagination fluides (`dots`).
     - Bouton rond suivant `→`.
     - Compteur de position (`1/3`, `2/3`, `3/3`).
  4. **Hauteur optimisée viewport** : Ratio d'aspect adapté pour préserver l'équilibre sans scroll.

---

### 🔹 Étape 4 : Les 3 Cartes de Services (`ServiceCards.jsx`)
* **Fichier ciblé** : [`src/globalComponents/ServiceCards.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/ServiceCards.jsx)
* **Actions** :
  1. **En-tête de section** :
     - À gauche : *"Que souhaitez-vous faire ?"* (gras, sombre).
     - À droite (desktop) : Horloge + *"Quelques clics suffisent"*.
  2. **Double layout adaptatif Desktop / Mobile** :
     - **Sur Desktop** : 3 cartes horizontales blanches avec icône encadrée à gauche, titre, sous-titre et flèche verte `→` à droite.
     - **Sur Mobile** : **Grille 3 colonnes (`grid-cols-3 gap-2`)** avec cartes verticales compactes (icône en haut, libellé court en dessous), exactement conforme à la capture mobile pour tenir sur 1 ligne sans scroll !
  3. **Connexions Redux** :
     - Clic 1 ➔ `openModal('ticket')` ➔ Ouvre `TicketScreen`
     - Clic 2 ➔ `openModal('satisfaction')` ➔ Ouvre `SatisfactionScreen`
     - Clic 3 ➔ `openModal('map')` ➔ Ouvre `AgencyMapScreen`

---

### 🔹 Étape 5 : Le Bandeau Vert avec Vague SVG (`CtaWave.jsx`)
* **Nouveau composant indépendant** : [`src/globalComponents/CtaWave.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/CtaWave.jsx)
* **Actions** :
  1. **Découpe supérieure en vague SVG** : Courbe fluide et douce aux couleurs du thème (`fill: primary`).
  2. **Contenu du bandeau vert** :
     - À gauche : Cercle radar vert foncé avec pastille ambre + titre **« Votre temps compte. »** + *"Nous facilitons chaque étape de votre accueil en agence."*
     - À droite : Bouton *"Nous contacter →"* sur Desktop, transformé en bouton d'action circulaire tactile `→` sur Mobile.

---

### 🔹 Étape 6 : Le Footer Minimaliste (`Footer.jsx`)
* **Fichier ciblé** : [`src/globalComponents/Footer.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/Footer.jsx)
* **Actions** :
  1. Fond blanc pur / très clair (1 ligne discrète en bas de page).
  2. À gauche : **Synapse · S2Q** + texte d'accompagnement *"Un accueil plus fluide, à votre rythme."*
  3. À droite : Liens discrets *"Confidentialité"*, *"Assistance"*, *"© 2026 Synapse"*.

---

### 🔹 Étape 7 : Assemblage Global Zéro-Scroll (`OnlineScreen.jsx`)
* **Fichier ciblé** : [`src/screen/OnlineScreen.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/screen/OnlineScreen.jsx)
* **Actions** :
  1. Assembler les 6 blocs indépendants dans le conteneur racine.
  2. Verrouiller la hauteur globale avec `min-h-screen max-h-screen flex flex-col justify-between overflow-hidden`.
  3. Calibrer les espacements `gap` et `py` pour garantir l'absence totale de barre de défilement sur les résolutions standards PC et smartphone.

---

## ✅ Validation Finale

À la fin des 6 étapes, nous vérifierons :
- [ ] Zéro barre de défilement (tout visible en 1 écran sur Desktop et Mobile).
- [ ] Les 3 modales/bottom-sheets s'ouvrent parfaitement depuis les 3 cartes et depuis le carrousel.
- [ ] Aucun fichier `index.js`, imports explicites préservés.
- [ ] Code propre, lisible et prêt pour les développeurs backend.
