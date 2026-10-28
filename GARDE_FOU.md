# 🛡️ GARDE-FOU DU PROJET — S2Q (Synapse Queue System)

> **Document de référence architectural & règles de développement non négociables.**  
> Tout développeur (ou agent IA) intervenant sur ce projet **DOIT** impérativement respecter ces principes.

---

## 🎯 1. La Règle d'Or du Projet

> **« Le développeur qui prend la suite ne doit JAMAIS avoir à recoder du HTML ou du CSS.  
> Tout le design, la réactivité et les interactions sont déjà verrouillés. Il vient UNIQUEMENT pour implémenter les services et connecter les APIs. »**

- Les composants d'interface sont déjà conçus, testés et entièrement paramétrés via leurs `props`.
- Les maquettes, responsive mobile, animations et thèmes dynamiques sont déjà en place.
- La tâche du développeur backend/intégration se résume à :
  1. Configurer l'URL de base dans [`src/services/serveur.js`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/services/serveur.js).
  2. Passer `USE_MOCK = false` dans le service correspondant (`ticketService`, `agencyService`, `satisfactionService`).
  3. Ajuster les payloads Axios si l'API l'exige.

---

## 📁 2. Architecture des Dossiers & Responsabilités

```text
TEMPLATE TICKET EN LIGNE/
├── GARDE_FOU.md                <-- CE FICHIER (Règles fondamentales)
├── src/
│   ├── assets/
│   │   └── css/index.css       <-- Configuration Tailwind v4 (@theme tokens)
│   ├── screen/                 <-- LES ÉCRANS (Considérés comme des pages)
│   │   ├── online/             <-- Écran d'accueil principal (Portail en ligne)
│   │   │   ├── components/     <-- Sous-composants spécifiques au portail
│   │   │   └── OnlineScreen.jsx
│   │   ├── ticket/             <-- Module Prise de Ticket
│   │   │   ├── components/     <-- Sous-composants UNIQUEMENT liés au ticket
│   │   │   │   ├── TicketForm.jsx
│   │   │   │   └── TicketReceipt.jsx
│   │   │   └── TicketScreen.jsx
│   │   ├── satisfaction/       <-- Module Évaluation Client
│   │   │   ├── components/     <-- Sous-composants UNIQUEMENT liés à la satisfaction
│   │   │   │   ├── SatisfactionForm.jsx
│   │   │   │   └── SatisfactionSuccess.jsx
│   │   │   └── SatisfactionScreen.jsx
│   │   └── map/                <-- Module Réseau des Agences
│   │       ├── components/     <-- Sous-composants UNIQUEMENT liés à la carte
│   │       │   ├── AgencyList.jsx
│   │       │   └── AgencyDetailSheet.jsx
│   │       └── AgencyMapScreen.jsx
│   ├── globalComponents/      <-- Composants TRANSVERSES et RÉUTILISABLES
│   │   ├── ui/                 <-- Primitives universelles (Button, Card, Link, Section)
│   │   ├── header/             <-- Éléments d'en-tête (Brand, Contact, ThemePicker)
│   │   ├── Header.jsx          <-- Header complet
│   │   ├── Footer.jsx          <-- Footer complet
│   │   ├── Carousel.jsx        <-- Carousel / Slider de promotion
│   │   └── ServiceCards.jsx    <-- Grille de raccourcis vers les services
│   ├── layout/                 <-- Squelettes de disposition (Layout, Container)
│   ├── services/               <-- Couche API & Logique métier (Axios + S2Q endpoints)
│   ├── mocks/                  <-- Jeux de données mockées (JAMAIS dans assets/)
│   ├── features/               <-- Slices Redux Toolkit (modal, ticket, agency, theme)
│   ├── theme/                  <-- Thèmes interchangeables dynamiques (themes.js)
│   ├── App.jsx                 <-- Point d'assemblage principal
│   ├── main.jsx                <-- Point d'entrée React avec Provider Redux
│   └── store.js                <-- Configuration du Store Redux Toolkit
```

### Règle de séparation des composants :
- **Dans `src/screen/<nom>/components/`** : Tout sous-composant dont l'usage est strictement réservé à cet écran (ex: `TicketReceipt.jsx` n'a de sens que dans le ticket).
- **Dans `src/globalComponents/`** : Tout composant réutilisable par plusieurs écrans ou sections (ex: `Button.jsx`, `Card.jsx`, `HeaderBrand.jsx`).
- **Dans `src/mocks/`** : Toutes les données de démonstration. **Interdiction de mettre des mocks dans `src/assets/`**.

---

## 🚫 3. Les Interdictions Formelles (Anti-Patterns)

### ❌ 1. AUCUN fichier `index.js` (Barrel Files)
- **Pourquoi ?** L'utilisateur et l'équipe rejettent catégoriquement les fichiers `index.js` :
  - Ils polluent les onglets de l'IDE avec des dizaines de fichiers au nom identique (`index.js | index.js | index.js`).
  - Ils masquent la provenance réelle du code et créent des risques d'imports circulaires.
- **Règle :** Toujours importer directement le fichier explicite :
  ```js
  // ✅ OUI - Import clair et direct
  import TicketScreen from './screen/ticket/TicketScreen';
  import Button from '../../globalComponents/ui/Button';

  // ❌ NON - Pas de barrel file
  import { TicketScreen } from './screen/ticket';
  ```

### ❌ 2. AUCUNE balise `<a href="#">` brute
- **Pourquoi ?** Les ancres brutes provoquent des rechargements intempestifs de page (F5) et cassent l'état de l'application (SPA).
- **Règle :**
  - Pour une action/clic : Utiliser `<button type="button">`.
  - Pour un lien de navigation : Utiliser le composant unifié [`src/globalComponents/ui/Link.jsx`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/globalComponents/ui/Link.jsx) (qui gère automatiquement SPA, liens externes `target="_blank"`, et `tel:` / `mailto:`).

### ❌ 3. AUCUN nom de client codé en dur dans les classes CSS
- **Pourquoi ?** Ce projet est un **template multi-clients** (BNI, Sunu, NSIA, etc.). Le projet ne doit contenir aucun token comme `bg-bni-500`.
- **Règle :**
  - Utiliser les tokens génériques configurés dans Tailwind v4 : `bg-primary-500`, `text-primary-600`, `focus:ring-primary-500`, etc.
  - La couleur spécifique du client se configure dans [`src/theme/themes.js`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/theme/themes.js) via la clé `primary`.

---

## 📱 4. Standard Mobile-First Obligatoire (Option A)

Plus de 85% des utilisateurs finaux ouvriront ce site depuis leur smartphone (scan de QR code en agence). Tout écran ou composant créé **doit impérativement respecter les règles suivantes** :

1. **Format "Bottom Sheet" sur mobile** :
   - Les écrans modaux (`TicketScreen`, `SatisfactionScreen`, `AgencyMapScreen`) s'ouvrent en **tiroir glissant depuis le bas** (`rounded-t-[32px]`, `slide-in-from-bottom`) avec une poignée tactile (`w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden`).
   - Sur desktop (`sm:`), ils redeviennent automatiquement une modale centrée avec backdrop flou.

2. **Cibles Tactiles $\ge 48\text{px}$** :
   - Tout bouton ou champ cliquable doit avoir une hauteur minimale d'au moins `44px` à `50px` (`min-h-[48px]`) pour éviter les erreurs de clic au pouce.

3. **Protection contre l'auto-zoom forcé d'iOS** :
   - Les `<input>` et `<select>` doivent impérativement avoir une taille de texte d'au moins `16px` sur mobile (`text-base sm:text-sm`). En dessous de 16px, Safari iOS zoome automatiquement sur la page au focus.

4. **Défilement Tactile Fluide** :
   - Les conteneurs défilables doivent inclure `overscroll-contain` pour une inertie native fluide sans rebond indésirable sur la page mère.

---

## 🔌 5. Pattern d'Intégration des Services (Services / Redux)

L'architecture est calquée sur le standard interne du projet **`Diffusseur`** (`D:\DOC\Synapse doc\Diffusseur`).

### Structure type d'un service ([`src/services/ticketService.js`](file:///D:/DOC/Synapse%20doc/TEMPLATE%20TICKET%20EN%20LIGNE/src/services/ticketService.js)) :
```js
// Drapeau de bascule Mock / Production
const USE_MOCK = true;

export const ticketService = {
  async createTicket(payload) {
    if (USE_MOCK) {
      // 1. Simulation avec délai réseau et mock réaliste
      await new Promise((r) => setTimeout(r, 600));
      return { code: 'A-104', ...payload };
    }

    // 2. Appel API réel quand USE_MOCK = false
    const response = await s2qApiClient.post('/online-tickets/create', payload);
    return response.data;
  }
};
```

---

## 📋 6. Checklist avant de valider tout nouveau code

- [ ] Aucun fichier nommé `index.js` n'a été créé.
- [ ] Aucun `<a href="#">` n'a été introduit (utilisation de `<Button>` ou `<Link>`).
- [ ] Les imports sont directs et explicites (`./dossier/Fichier.jsx`).
- [ ] Le responsive mobile a été testé (Bottom Sheet, boutons de pouce, inputs $\ge 48\text{px}$).
- [ ] Aucun style en dur spécifique à une marque n'a été figé (usage de `primary` / `theme.colors`).
- [ ] Le code fonctionne sans obliger le prochain développeur à écrire du CSS.
