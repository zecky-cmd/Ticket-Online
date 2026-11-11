# 📋 PLAN STRUCTURÉ — REFONTE DU PARCOURS DE PRISE DE TICKET S2Q

> **Document de référence & feuille de route**  
> Basé sur la maquette d'inspiration validée (layout 2 colonnes, sidebar rétractable, étapes dynamiques, sélection de créneau interactive, zone de feedback/erreur).

---

## 🎯 1. Objectifs & Exigences Fondamentales

1. **Expérience utilisateur moderne & aérée** :
   - Remplacer l'ancien modal à en-tête horizontal par un conteneur moderne à **2 colonnes**.
   - Présenter un **Stepper vertical à gauche**, rétractable (**collapsible**) d'un clic pour maximiser l'espace de contenu.
2. **Étapes dynamiques (2, 3, 4 ou 5 étapes)** :
   - Le stepper ne doit plus être figé à 5 étapes en dur.
   - Il s'adapte automatiquement au parcours :
     - Sans étape Agence si celle-ci est déjà sélectionnée.
     - Sans étape Prestation si le service n'a pas de sous-prestations.
     - Sans étape Créneau si c'est un ticket immédiat (passage en borne sans RDV).
3. **Zone de feedback / erreur (la « zone bleue »)** :
   - Emplacement dédié sous le contenu et au-dessus des boutons d'action.
   - **Mode normal** : Affiche le récapitulatif doux de la sélection en cours (ex : *« Mercredi 12 Nov, 07:15 - 07:30 »*).
   - **Mode alerte / erreur** : Affiche clairement le message d'erreur ou de validation manquante, sans décaler l'interface.
4. **Refonte complète de l'étape « Choix du Créneau » (`StepTimeslot`)** :
   - Remplacer les simples `<input type="date">` et `<input type="time">` natifs.
   - Sélecteur de mois (`< Novembre 2026 >`).
   - Sélecteur de jours horizontal avec défilement (*Aujourd'hui, Demain, Mer 12, Jeu 13...*).
   - Grille de créneaux horaires en tuiles élégantes et interactives avec accordéon *« Voir plus de créneaux »*.
5. **Responsive irréprochable** :
   - Desktop / Tablette (`md:`+) : 2 colonnes avec sidebar collapsible (`w-64` / `w-20`).
   - Mobile (< 768px) : La sidebar bascule en bandeau supérieur compact avec jauge de progression fine, libérant 100% de la largeur d'écran.

---

## 🏗️ 2. Architecture des Composants

```text
src/screen/ticket/
├── TicketScreen.jsx                     <-- Chef d'orchestre : Modal 2 colonnes, gestion du state & flux
├── components/
│   ├── TicketSidebarStepper.jsx         <-- [NOUVEAU] Sidebar verticale pliable + Stepper dynamique
│   ├── TicketFeedbackBanner.jsx         <-- [NOUVEAU] Zone bleue dédiée (Récapitulatif OU Alerte Erreur)
│   ├── StepTimeslot.jsx                 <-- [REFONTE] Date picker horizontal + Grille de créneaux en tuiles
│   ├── StepAgency.jsx                   <-- Choix de l'agence (inchangé fonctionnellement, adapté au layout)
│   ├── StepService.jsx                  <-- Choix du service (inchangé fonctionnellement)
│   ├── StepPrestation.jsx               <-- Choix prestation & gestionnaire
│   ├── StepCustomerInfo.jsx             <-- Formulaire coordonnées client
│   └── TicketReceipt.jsx                <-- Reçu final avec QR Code
```

---

## 📅 3. Déroulé des Étapes d'Implémentation

### Étape 1 : Création du composant `TicketSidebarStepper.jsx`
- [ ] Props : `steps` (tableau dynamique), `currentStepId`, `onStepClick`, `isCollapsed`, `onToggleCollapse`, `agencyName`.
- [ ] Mode étendu :
  - Logo / Header avec bouton rétracter (`PanelLeftClose` ou `ChevronLeft`).
  - Ligne de progression verticale reliant les étapes.
  - Indicateurs d'état :
    - Complété : cercle vert doux avec coche `Check` (cliquable).
    - Actif : cercle plein couleur primaire avec numéro en blanc + libellé gras.
    - Futur : cercle neutre avec numéro gris clair + libellé grisé.
  - Footer : lien discret *« Besoin d'aide pour réserver ? »*.
- [ ] Mode réduit (`isCollapsed = true`) :
  - Largeur étroite (`w-20`), transition fluide CSS `duration-300`.
  - Bouton déplier (`PanelLeftOpen` ou `ChevronRight`).
  - Pastilles centrées avec `title` / tooltip pour identifier chaque étape.
- [ ] Mode mobile (< md) :
  - Affichage horizontal compact en bandeau : *« Étape X/Y : [Nom] »* avec fine barre de progression.

### Étape 2 : Création du composant `TicketFeedbackBanner.jsx` (Zone Bleue)
- [ ] Props : `error` (string | null), `selectionSummary` (ReactNode | string | null), `theme`.
- [ ] Si `error` est présent :
  - Style alerte : fond rose/rouge pâle (`bg-rose-50 border-rose-200 text-rose-800`), icône `AlertCircle`.
- [ ] Sinon si `selectionSummary` est présent :
  - Style info/sélection : fond vert menthe subtil (`bg-emerald-50/70 border-emerald-200/80 text-emerald-900`), icône `Clock` ou `CheckCircle2`.
- [ ] Si rien à afficher :
  - Espace réservé minimal invisible ou rétracté avec transition fluide pour éviter tout layout shift.

### Étape 3 : Refonte de l'interface `StepTimeslot.jsx` (Choix du Créneau)
- [ ] Sélecteur de mois avec boutons précédent / suivant (`< Novembre 2026 >`).
- [ ] Sélecteur horizontal de jours (Day Strip) :
  - Génération des dates ouvrées (ex : 14 prochains jours hors dimanches).
  - Libellés : *Aujourd'hui*, *Demain*, puis jour abrégé (*Mer*, *Jeu*, *Ven*...) et chiffre du jour (*10*, *11*, *12*...).
  - État actif : sélection claire avec souligné ou pastille marquée.
- [ ] Grille de créneaux horaires (Time Slots) :
  - Tuiles cliquables au design moderne (`08:00`, `08:30`, `09:00`, `09:30`, etc.).
  - État sélectionné : couleur primaire (`#008056`), texte blanc, légère ombre.
  - Bouton accordéon *« Voir plus de créneaux ⌵ »* avec compteur de créneaux restants.
- [ ] Raccordement des callbacks `selectedDate`, `setSelectedDate`, `selectedTime`, `setSelectedTime`.

### Étape 4 : Restructuration de `TicketScreen.jsx`
- [ ] Configuration du tableau d'étapes dynamique `steps` selon le contexte (présence d'agence, de prestations, etc.).
- [ ] Layout 2 colonnes :
  - Conteneur flex horizontal sur desktop : `<TicketSidebarStepper />` à gauche + zone de travail à droite.
  - Intégration de la zone bleue `<TicketFeedbackBanner />` en bas de la zone droite.
  - Barre d'actions uniforme avec boutons *Retour* et *Suivant*.
- [ ] Gestion du state d'erreur `errorMessage` injecté dans la zone bleue.

### Étape 5 : Validation & Recette
- [ ] Tester chaque étape du parcours : Agence → Service → Prestation → Créneau → Infos → Reçu.
- [ ] Tester le parcours dynamique raccourci (agence pré-sélectionnée).
- [ ] Vérifier le repli / dépli de la sidebar gauche.
- [ ] Vérifier l'affichage responsive sur mobile et tablette.
- [ ] Contrôle strict du code et respect des conventions du projet.

---

## 🛡️ 4. Matrice des Risques & Parades

| Risque potentiel | Impact | Parade mise en place |
| :--- | :--- | :--- |
| **Surcharge visuelle sur petit écran** | Modale tronquée sur mobile | Passage automatique en bandeau compact sur mobile, 2 colonnes uniquement sur `md:` et supérieur. |
| **Régression sur le payload de l'API** | Échec de réservation de ticket | Conservation stricte des formats ISO (`YYYY-MM-DD`, `HH:mm`) attendus par `ticketService`. |
| **Étapes dynamiques désynchronisées** | Saut d'étape incorrect | Utilisation d'un identifiant textuel (`id: 'service' | 'timeslot'...`) et calcul de l'index relatif au lieu d'un simple entier en dur. |

