# Rapport d'Investigation UX/Mobile — Module de Prise de Ticket S2Q

## 1. Contexte & Problématique

Sur smartphone (mode mobile), lors de l'étape 1 du flux de prise de ticket (**Sélection de l'agence** via le composant `SearchSelect`), l'utilisateur fait face à deux problèmes ergonomiques majeurs lorsqu'il clique pour rechercher une agence :

1. **Étouffement de l'espace par le clavier virtuel (Virtual Keyboard)** : Le clavier virtuel Android/iOS occupe entre 40% et 50% du bas de l'écran. Combiné aux éléments d'en-tête volumineux de la modal (drag handle, titres, sous-titre, barre de progression stepper en 5 étapes, label), l'espace résiduel pour afficher la liste des agences filtrées est réduit à moins de 60-80 px. Seul **1 à 2 éléments de résultats** sont visibles, forçant l'utilisateur à faire défiler un minuscule bandeau.
2. **Double contour parasite (Border/Outline indésirable)** : Lorsqu'on clique dans le champ de saisie, un rectangle vert vif supplémentaire apparaît spécifiquement autour de l'élément `<input>`, en plus du cadre extérieur du conteneur. Ce contour parasite réduit l'espace visuel interne et dégrade le rendu.

---

## 2. Analyse Visuelle Détaillée des Captures

### Capture 1 : Écran d'accueil Mobile (Normal)
* **État** : Vue globale responsive du portail S2Q sur un écran smartphone standard (360x800 ou 390x844).
* **Constat** : Le design s'affiche parfaitement, zéro scroll, bandeau supérieur, carrousel compact et boutons d'actions ("Ticket en ligne", "Avis client", "Nos agences").

### Capture 2 : Modale Ticket Ouverte (Clavier fermé)
* **Composant** : Bottom sheet modale occupant le bas de l'écran.
* **Éléments affichés du haut vers le bas** :
  1. Poignée tactile grise de glissement (`w-12 h-1.5 bg-slate-300`).
  2. En-tête :
     * Eyebrow : `"VOTRE RENDEZ-VOUS EN QUELQUES ÉTAPES"` + Bouton Fermer `X`.
     * Titre : `"Prendre un ticket"` (taille `text-2xl` / `text-3xl`).
     * Sous-titre : `"Un parcours simple pour préparer votre visite en agence."`.
  3. Stepper de progression :
     * 5 barres horizontales (Agence, Service, Prestation, Créneau, Vos infos).
     * 5 libellés d'étapes sous les barres.
  4. Formulaire Étape 1 :
     * Label : `"1. SÉLECTIONNEZ VOTRE AGENCE BANCAIRE"`.
     * Champ déclencheur fermé : `"Sélectionner une agence..."` avec chevron à droite.
     * Bouton d'action : `"Valider l'agence et continuer"`.
* **Constat** : Tous les éléments sont lisibles mais occupent déjà une hauteur fixe d'environ **320 px**.

### Capture 3 : Recherche Active & Clavier Mobile Déployé
* **État** : L'utilisateur a cliqué sur le champ de recherche, le clavier virtuel mobile est ouvert.
* **Anomalie A (Double contour de saisie)** :
  * Le conteneur parent s'entoure d'une bordure verte avec une loupe à gauche et un chevron à droite.
  * **Problème** : À l'intérieur, autour du texte tapé dans le `<input>`, un **second contour rectangulaire vert** apparaît. Cela crée un effet de "boîte dans la boîte" qui compresse le texte et encombre la zone de saisie.
* **Anomalie B (Zone de résultats écrasée)** :
  * Le clavier virtuel masque la moitié inférieure de l'écran (environ 300 à 350 px).
  * L'en-tête (titre + stepper + label) reste figé en haut et consomme la quasi-totalité de la zone restante.
  * **Résultat critique** : La liste déroulante (`ul[role="listbox"]`) est compressée. On ne peut apercevoir que **le premier élément** (`ABENGOUROU — Abengourou`) et un infime bord du second. L'utilisateur perd la visibilité globale et l'ergonomie de sélection.

---

## 3. Causes Techniques Identifiées

### Cause du Double Contour Parasite
Dans `src/globalComponents/ui/SearchSelect.jsx` (lignes 184-198) :
* Le conteneur `div` gère déjà la bordure :
  ```jsx
  className={`... border rounded-xl ${isOpen ? 'border-primary-500 ring-2 ring-primary-500/15' : 'border-slate-200'}`}
  ```
* L'élément `<input>` interne possède `className="... bg-transparent outline-none"` :
  * Sur les navigateurs mobiles (Webkit/Blink, Chrome Mobile, Safari iOS), la classe `outline-none` de Tailwind v4 ne supprime pas toujours le focus-ring natif ou le border natif de l'input si `border-none`, `focus:ring-0`, `focus:outline-none` ou `-webkit-tap-highlight-color: transparent` ne sont pas explicitement appliqués.
  * Par conséquent, le navigateur applique un outline/border focus par défaut vert ou hérité qui crée ce rectangle interne parasite.

### Cause de l'Écrasement Vertical par le Clavier
Dans `TicketScreen.jsx` et `TicketStepperHeader.jsx` :
* La modale utilise une hauteur fixe ou un flux normal qui ne détecte pas l'état d'édition/focus de l'input.
* Le header (`TicketStepperHeader`) mesure plus de **180 px** à lui seul :
  * Drag handle : 15 px
  * Eyebrow + Titre + Sous-titre : 85 px
  * Stepper 5 étapes : 50 px
  * Marges et paddings : 30 px
* En ajoutant le label `"1. SÉLECTIONNEZ VOTRE AGENCE BANCAIRE"` (30 px) et le champ de saisie (52 px), on atteint **262 px**.
* Sur un écran mobile de 750 px de haut :
  * Clavier virtuel : ~340 px
  * Header navigateur / barre d'adresse : ~80 px
  * Reste disponible total : ~330 px.
  * Espace disponible pour le dropdown : `330 px - 262 px = 68 px` (soit la hauteur d'une seule ligne d'agence !).

---

## 4. Recommandations d'Expert UX & Solutions Proposées

### Solution 1 (Recommandée) : Mode "Focus Recherche" Rétractable sur Mobile
Lorsque l'utilisateur ouvre le champ de recherche sur mobile (`isOpen === true` et écran mobile) :
1. **Masquage / Repli compact de l'en-tête** :
   * Masquer temporairement l'eyebrow, le sous-titre et le stepper 5 étapes, OU remplacer tout le header par une barre compacte d'une ligne :
     `[ ← Retour ] Rechercher une agence`
   * Cela libère immédiatement **~150 px d'espace vertical**.
2. **Gain immédiat** :
   * La liste déroulante passe de 1 élément visible à **5 ou 6 agences visibles simultanément** au-dessus du clavier virtuel.
3. Dès que l'utilisateur sélectionne son agence ou clique sur le chevron / extérieur pour fermer, le header et le stepper réapparaissent instantanément dans leur état normal.

### Solution 2 : Bottom Sheet plein écran avec ancrage haut (Full-Screen Overlay sur Mobile)
* Détecter le focus sur mobile et faire monter la modale à `100dvh` (ou passer le SearchSelect en modal overlay plein écran comme sur Airbnb / Google Maps) :
  * Le champ de recherche se place tout en haut de l'écran (top: 0).
  * Les résultats occupent 100% de la hauteur entre le champ et le clavier.
  * Bouton "Fermer / Annuler" ou croix à droite.

### Solution 3 (Correctif immédiat du contour parasite)
Sur le `<input>` du `SearchSelect.jsx` :
* Supprimer tout style natif parasite :
  ```jsx
  className="flex-1 text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 shadow-none appearance-none"
  style={{ outline: 'none', boxShadow: 'none' }}
  ```
* Cela garantit la disparition immédiate et totale du rectangle vert interne sur tous les navigateurs mobiles.

---

## 5. Synthèse pour l'Agent IA d'Implémentation (Mobile)

| Anomalie | Fichier concerné | Action à mener |
|---|---|---|
| **Contour parasite intérieur** | `src/globalComponents/ui/SearchSelect.jsx` | Ajouter `border-0 focus:ring-0 focus:outline-none shadow-none appearance-none style={{ outline: 'none' }}` sur l'`<input>`. |
| **Hauteur écrasée par le clavier** | `src/screen/ticket/TicketScreen.jsx` & `TicketStepperHeader.jsx` | Masquer ou compacter l'en-tête (eyebrow, sous-titre, barres stepper) lorsque le dropdown de recherche est actif sur mobile. |
| **Hauteur max de la liste** | `src/globalComponents/ui/SearchSelect.jsx` | Ajuster `max-h-52` pour qu'elle s'étende dynamiquement selon la hauteur disponible. |

---

## 6. Analyse du Mode Desktop — Modale Étriquée & Espace Sous-exploité

### Capture Desktop : Modale Ticket (Étape 2 — Choix du service)
* **Contexte** : Écran d'ordinateur de bureau / PC portable standard (1920x1080 ou 1366x768).
* **Constat visuel immédiat** :
  1. **Largeur excessivement étroite (`sm:max-w-xl` = 576 px)** :
     * Sur un écran Full HD (1920 px de large), la modale n'occupe que **~25% à 30%** de la largeur de l'écran.
     * Plus de **70% de la surface de l'écran** est un grand vide sombre flouté inutile (`bg-slate-950/70 backdrop-blur-md`).
     * La boîte paraît minuscule ("effet timbre-poste" ou carte postale perdue au centre).
  2. **Hauteur comprimée et scrollbar parasite** :
     * Dès que l'utilisateur clique sur le champ de recherche pour déplier la liste des services ou prestations, la liste déroulante s'étend vers le bas.
     * Comme la modale est petite et que son corps a la classe `overflow-y-auto`, le dropdown force le conteneur interne à défiler : **une barre de défilement verticale verte apparaît immédiatement sur le côté droit** (visible distinctement sur la capture).
     * Les boutons de validation ("Retour" et "Valider") et le bas de la liste d'options sont masqués sous le pli, obligeant l'utilisateur de bureau à faire un scroll vertical inutile alors que l'écran dispose d'un espace gigantesque tout autour.
  3. **Disproportion entre l'en-tête et le contenu** :
     * Le stepper horizontal à 5 étapes et les titres occupent près de **45%** de la hauteur totale de la modale.
     * Le contenu actif (le formulaire) est confiné dans un carré étroit.

### Cause Technique dans le Code
Dans `src/screen/ticket/TicketScreen.jsx` (ligne 253) :
```jsx
<div className="bg-white w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl sm:max-w-xl max-h-[94dvh] sm:max-h-[90vh] flex flex-col overflow-hidden ...">
```
* `sm:max-w-xl` limite arbitrairement la largeur maximale à **576 px**, quel que soit l'écran desktop (tablette, laptop, grand moniteur).
* En comparaison, l'autre écran modal du projet ([`AgencyMapScreen.jsx`](file:///d:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/screen/map/AgencyMapScreen.jsx)) utilise `md:max-w-4xl` (896 px) et offre une respiration visuelle bien supérieure.

### Recommandations & Solutions pour l'Agent IA (Mode Desktop)

1. **Élargir la modale sur grand écran** :
   * Remplacer `sm:max-w-xl` par :
     * `sm:max-w-xl md:max-w-2xl lg:max-w-3xl` (soit **768 px** sur desktop au lieu de 576 px).
     * Cela donne immédiatement une sensation haut de gamme, moderne et équilibrée conforme aux standards bancaires.
2. **Donner de la hauteur et aérer le corps sans scrollbar prématurée** :
   * Sur desktop (`md:`), dimensionner la hauteur pour que le dropdown ouvert n'impose pas de scrollbar (`md:min-h-[520px]` ou ajustement de `max-h`).
   * Augmenter les marges intérieures : `p-5 sm:p-8 md:p-10` sur grand écran.
3. **Optimiser les formulaires larges (Étape 5 - Vos infos)** :
   * Avec une largeur de `max-w-3xl`, les champs Nom et Prénoms, ainsi que Téléphone et Email peuvent se placer naturellement sur **2 colonnes (`grid grid-cols-1 sm:grid-cols-2 gap-4`)** au lieu d'une longue colonne étroite.


---------------------------------------------------------------