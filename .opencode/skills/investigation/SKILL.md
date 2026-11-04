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

## 5. Synthèse pour l'Agent IA d'Implémentation

| Anomalie | Fichier concerné | Action à mener |
|---|---|---|
| **Contour parasite intérieur** | `src/globalComponents/ui/SearchSelect.jsx` | Ajouter `border-0 focus:ring-0 focus:outline-none shadow-none appearance-none style={{ outline: 'none' }}` sur l'`<input>`. |
| **Hauteur écrasée par le clavier** | `src/screen/ticket/TicketScreen.jsx` & `TicketStepperHeader.jsx` | Masquer ou compacter l'en-tête (eyebrow, sous-titre, barres stepper) lorsque le dropdown de recherche est actif sur mobile. |
| **Hauteur max de la liste** | `src/globalComponents/ui/SearchSelect.jsx` | Ajuster `max-h-52` pour qu'elle s'étende dynamiquement selon la hauteur disponible. |

