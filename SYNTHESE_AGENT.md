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

### 🖥️ B. La règle stricte du "100vh / Zéro Scroll"
* **Demande explicite de l'utilisateur** :
  > *"le header + footer + le corp tous dois faire 100vh en hauteur ou 100% ne pas avoir besoin de scroler pour voir le footer"*
* **Implémentation** :
  * `src/layout/Layout.jsx` : Utilise `h-screen max-h-screen h-[100dvh] w-full flex flex-col justify-between overflow-hidden`.
  * `src/screen/OnlineScreen.jsx` : `main` et conteneurs ont `flex-1 min-h-0 overflow-hidden`.
  * Tous les composants internes sont calibrés avec précision (paddings compacts, hauteurs équilibrées) pour que la totalité (Header, Accroche, Carrousel, Cartes de service, Vague verte CTA, Footer) soit visible **d'un coup d'œil dès le chargement sans barre de défilement**.
  * ⚠️ *Attention au prochain agent* : Ne pas réaugmenter les `py-`, `gap-` ou les hauteurs fixes (ex: ne pas remettre le carrousel à 280px), sous peine de faire déborder le footer.

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
  2. **Pastille radar de contact** : Réalisée en **CSS pur sans SVG ni image** via les classes `.contact-mark` et `.contact-mark__dot` définies dans `src/assets/css/index.css` (anneau translucide `box-shadow: inset`, point doré `#edb64f` avec halo externe).

### 🏛️ E. Architecture logicielle & Garde-fous (`GARDE_FOU.md`)
* **Aucun fichier barrel** (`index.js` regroupant des exports) : les imports doivent être explicites et directs.
* **Aucun lien mort `<a href="#">`** : utiliser `<button type="button">` ou le composant `<Link>`.
* **Indépendance des blocs** : chaque composant visuel a sa responsabilité propre et ses props modulaires.

---

## 3. Structure des Fichiers Clés

```text
├── index.html                           # Préchargement Google Fonts + point d'entrée
├── n-context.md                         # ⚠️ NE PAS TOUCHER : Métier S2Q
├── nplan.md                             # Spécifications du designer pour le CTA Wave
├── GARDE_FOU.md                         # Règles strictes d'architecture du projet
├── SYNTHESE_AGENT.md                    # Ce document de transmission
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
│   │   ├── ticket/TicketScreen.jsx      # Modal & BottomSheet prise de ticket en ligne
│   │   ├── satisfaction/SatisfactionScreen.jsx # Modal avis client
│   │   └── map/AgencyMapScreen.jsx      # Modal carte / liste des agences
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
│   ├── theme/themes.js                  # Palette dynamique Redux (vertBlanc par défaut)
│   └── store/store.js                   # Store Redux Toolkit (modales, thèmes)
```

---

## 4. Ce qu'il reste à faire / Prochaines étapes

1. **Intégration API Back-Office** :
   * Connecter le formulaire de prise de ticket (`TicketForm.jsx`) aux endpoints réels de l'API S2Q pour générer les vrais numéros de ticket (ex: `#A042`) et créneaux horaires configurés dans le back-office.
2. **Synchronisation en temps réel des files** :
   * Brancher les données d'attente estimée et du nombre de personnes en file sur les agences réelles (`AgencyList.jsx` / `agenciesMock.js`).
3. **Persistance et Impression/Export du ticket** :
   * Permettre au client de sauvegarder son ticket sur smartphone (téléchargement PDF, capture ou SMS/QR Code de rappel).
4. **Vérification responsive tactile** :
   * Les Bottom Sheets tactiles (`TicketScreen`, `SatisfactionScreen`, `AgencyMapScreen`) sont opérationnelles pour mobile, à tester sur device réel.

---

## 5. Mémo pour le prochain agent

* Si l'utilisateur demande une modification sur les espacements : garde toujours à l'esprit la contrainte **100vh / zéro scroll**.
* Si l'utilisateur demande de changer de police : modifie uniquement `--font-sans` dans `src/assets/css/index.css` (ligne 21).
* Respecte rigoureusement la charte `#008056`.
