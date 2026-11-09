# CAHIER DES CHARGES UX/UI — BNI SYNAPSE
## Refonte de la page d'accueil — Desktop & Mobile

### 1. CONTEXTE ET OBJECTIF DU PROJET

BNI Synapse est une plateforme numérique de gestion des files d'attente dans les établissements bancaires.

Le système dispose déjà de bornes physiques installées dans les agences bancaires. Le site web vient compléter ce dispositif en permettant aux clients de :

- Prendre un ticket en ligne avant de se rendre en agence.
- Choisir une agence selon sa localisation et son niveau de fréquentation.
- Réserver un créneau horaire.
- Consulter le temps d'attente estimé.
- Suivre l'évolution de leur ticket.
- Donner leur avis sur la qualité de l'accueil et du service.

L'objectif est de transformer la page d'accueil en une véritable plateforme bancaire moderne, intuitive, élégante et professionnelle.

**Important :** Ne pas reconstruire un simple site vitrine. Synapse est un outil fonctionnel destiné aux clients d'une banque.

### 2. IDENTITÉ VISUELLE

Conserver l'identité graphique actuelle de BNI Synapse.

Palette de couleurs recommandée :

- Vert principal : #00865D
- Vert foncé : #006B4C
- Vert clair : #E5F5EF
- Blanc : #FFFFFF
- Fond général : #F8FAFC
- Texte principal : #142238
- Texte secondaire : #718096
- Bordures : #E5EAF0
- Orange : #F5A623 pour les alertes et situations intermédiaires.
- Rouge : #E5484D pour les situations de forte affluence.

Utiliser une typographie moderne comme Inter ou une police sans-serif équivalente.

Style général :
- Design minimaliste et premium.
- Coins arrondis entre 12 et 22 px.
- Ombres discrètes.
- Espacements généreux.
- Icônes Lucide cohérentes.
- Boutons avec états hover, active et disabled.
- Animations légères et fluides.
- Bonne hiérarchie typographique.

Éviter les effets excessifs, les dégradés trop prononcés et les couleurs trop nombreuses.

### 3. STRUCTURE DE LA PAGE DESKTOP

Construire une page d'accueil desktop avec une largeur maximale de contenu comprise entre 1440 et 1600 px.

#### A. HEADER / NAVIGATION

Créer une barre de navigation horizontale verte.

Hauteur indicative : 68 à 76 px.

À gauche :
- Logo BNI.
- Texte Synapse en blanc, en caractères gras.

Au centre :
- Accueil.
- Agences avec menu déroulant.
- Mes tickets.
- Avis.
- FAQ.

À droite :
- Numéro de téléphone : +225 27 20 00 00 (avec icône téléphone).
- Pas d'espace compte ni de bouton de connexion : l'accès aux services se fait directement et librement.

Le header doit être élégant, fixe ou sticky pendant le défilement, et rester discret.

#### B. HERO SECTION

C'est la première section visible et la plus importante.

Disposition desktop en deux parties :

Partie gauche :
- Grand titre sur deux lignes :
  « Votre agence,
  à votre rythme. »

- Mettre « à votre rythme. » en vert principal.
- Texte descriptif :
  « Prenez votre ticket en ligne, trouvez une agence et gagnez du temps en toute sérénité. »

- Bouton principal vert :
  « Prendre un ticket en ligne »
  avec une icône de ticket et une flèche.

- Lien secondaire :
  « Voir comment ça marche »
  accompagné d'une icône lecture.
- Durée indicative : 2 min.

Partie droite :
- Grande photographie professionnelle montrant une cliente africaine souriante utilisant son smartphone.
- En arrière-plan : intérieur moderne d'une agence BNI, guichets, mobilier contemporain et identité verte de la banque.

Le visuel doit être lumineux, chaleureux et crédible.

Le hero doit avoir une hauteur d'environ 400 à 420 px.

#### C. BARRE DES ACCÈS RAPIDES

Positionner une grande carte blanche horizontale, légèrement superposée à la partie inférieure du hero.

Elle contient quatre accès :

1. Prise de ticket rapide
   « En quelques clics »

2. Trouvez une agence
   « Carte et infos en temps réel »

3. Suivez votre ticket
   « Temps réel »

4. Donnez votre avis
   « Améliorez notre service »

Chaque accès possède :
- Une icône verte dans un cercle vert très clair.
- Un titre en gras.
- Une courte description.
- Une séparation verticale entre les éléments.

Survol : légère élévation de la carte et changement subtil de couleur.

#### D. SECTION FLUIDITÉ DES AGENCES

Créer une section à deux colonnes.

COLONNE GAUCHE : CARTE DE STATISTIQUES D'UNE AGENCE.

Afficher une carte blanche avec :

- Badge « Fluidité en temps réel ».
- Petit indicateur « Mis à jour il y a 1 min ».
- Nom : Agence Cocody.
- Badge de statut : Fluide.
- Nombre de clients en attente : 04.
- Temps d'attente estimé : 08 min.
- Petit graphique de fréquentation avec courbe verte.
- Bouton « Voir le détail de l'agence ».

Les données doivent provenir du backend et non être définitivement codées en dur.

COLONNE DROITE : CARTE GÉOGRAPHIQUE.

Afficher une carte interactive avec :
- Les différentes agences BNI.
- Des marqueurs verts pour les agences fluides.
- Des marqueurs orange pour les agences modérément fréquentées.
- Des marqueurs rouges pour les agences saturées.

Au clic sur un marqueur, afficher une petite fiche contenant :
- Nom de l'agence.
- Statut de fluidité.
- Temps d'attente estimé.
- Bouton pour consulter l'agence.

Ajouter un bouton « Voir la carte ».

Prévoir une intégration cartographique réelle, par exemple Leaflet ou Mapbox.

#### E. SECTION EXPÉRIENCE SYNAPSE

Titre :
« L'expérience Synapse, c'est aussi... »

Créer trois cartes fonctionnelles :

1. Donner mon avis
   « Votre satisfaction compte »

2. Mes tickets
   « Consultez vos passages »

3. Notifications
   « Restez informé en temps réel »

Chaque carte contient une icône, un titre, une description et une flèche de navigation.

À droite des trois cartes, ajouter un encart promotionnel vert avec :
- Une icône horloge.
- Le titre « Votre temps compte. »
- Le texte « Nous facilitons chaque étape de votre accueil en agence. »
- Une photographie discrète d'une agence BNI.

#### F. FOOTER

Créer un footer sobre comprenant :
- Logo Synapse.
- Confidentialité.
- Conditions d'utilisation.
- Assistance.
- FAQ.
- Copyright © 2026 Synapse.

### 4. VERSION MOBILE — RESPONSIVE DESIGN

La version mobile ne doit pas être une simple réduction de la version desktop.

Elle doit être repensée pour une utilisation au doigt, sur smartphone.

#### A. HEADER MOBILE

Hauteur indicative : 64 à 68 px.

À gauche :
- Logo BNI.
- Texte Synapse.

À droite :
- Bouton téléphone.
- Menu hamburger si nécessaire.

Conserver le fond vert.

#### B. HERO MOBILE

Disposition verticale.

Ordre des éléments :

1. Titre :
   « Votre agence, à votre rythme. »

2. Texte :
   « Prenez votre ticket en ligne, trouvez une agence et gagnez du temps. »

3. Bouton principal pleine largeur :
   « Prendre un ticket »

4. Photographie de la cliente dans l'agence bancaire.

La photographie doit occuper une bonne partie de la largeur de l'écran, avec des coins arrondis.

Ne pas réduire excessivement la taille du texte.

#### C. CARTE AGENCE MOBILE

Juste sous le hero, afficher une carte blanche présentant une agence à proximité.

Exemple :

Agence Cocody — badge Fluide.

Deux indicateurs côte à côte :
- 04 clients en attente.
- 08 min d'attente estimée.

En dessous :
- Aperçu de la carte géographique.
- Bouton « Voir la carte ».

#### D. ACCÈS RAPIDES

Créer une grille de quatre cartes, deux colonnes et deux lignes :

- Trouver une agence.
- Suivre mon ticket.
- Donner mon avis.
- Mes tickets.

Chaque carte possède une icône centrée et un titre court.

Les cartes doivent être suffisamment grandes pour faciliter les interactions tactiles.

#### E. BANDEAU VERT

Créer un bandeau vert avec :
- Icône horloge dans un cercle.
- « Votre temps compte. »
- « BNI Synapse, votre allié au quotidien. »
- Petite flèche de navigation.

Ne pas laisser ce bandeau masquer les contenus. Il peut être intégré dans le flux normal de la page.

#### F. NAVIGATION INFÉRIEURE MOBILE

Créer une barre de navigation fixe en bas de l'écran.

Elle comporte cinq éléments :

1. Accueil.
2. Agences.
3. Avis.
4. Tickets.
5. Plus.

Chaque élément dispose d'une icône et d'un libellé.

L'élément actif doit être affiché en vert principal.

Prévoir un espace inférieur adapté aux zones de sécurité des smartphones.

### 5. PARCOURS FONCTIONNELS À RESPECTER

Le bouton « Prendre un ticket » doit réellement conduire à un parcours de réservation.

Étapes :

1. Sélectionner le type d'opération bancaire.
2. Choisir une agence.
3. Consulter la disponibilité.
4. Choisir un créneau horaire.
5. Renseigner les informations nécessaires.
6. Confirmer la réservation.
7. Générer un ticket avec numéro unique et QR code.

Prévoir deux modes :
- Ticket immédiat.
- Réservation d'un créneau futur.

Après confirmation, afficher une page de récapitulatif avec le numéro de ticket, le QR code, l'agence, l'heure prévue et les instructions de visite.

Le suivi du ticket doit être synchronisé avec le système central de gestion des files d'attente et la borne physique.

### 6. RÈGLES UX IMPORTANTES

- Le client doit comprendre la fonction principale de Synapse en moins de cinq secondes.
- La prise de ticket doit être l'action la plus visible.
- Ne jamais afficher des temps d'attente fictifs comme s'ils étaient réels.
- Distinguer clairement les données en temps réel des données de démonstration.
- Prévoir les états de chargement, d'erreur et d'absence de données.
- Prévoir les agences fermées et les créneaux indisponibles.
- Garantir une bonne accessibilité et un contraste suffisant.
- Optimiser le temps de chargement.
- Prévoir une expérience fluide sur les écrans mobiles, tablettes et ordinateurs.

### 7. CONTRAINTES TECHNIQUES

Avant de commencer le développement :

- Examiner le projet existant.
- Identifier le framework et les composants déjà utilisés.
- Réutiliser les composants et les services existants lorsque cela est pertinent.
- Ne pas casser les fonctionnalités déjà opérationnelles.
- Respecter l'architecture backend existante.
- Ne pas créer de données fictives dans les appels de production.
- Aucun compte ni système d'authentification requis : le parcours (ticket, agences, avis) est 100% public et accessible directement sans login.
- Brancher les boutons d'action sur les modales existantes via Redux (`openModal('ticket')`, `openModal('map')`, `openModal('satisfaction')`).
- La mini-carte sur la page d'accueil est un aperçu compact : le bouton « Voir la carte » ouvre la modale complète `AgencyMapScreen`.
- Assurer la synchronisation des tickets en ligne avec les tickets générés par les bornes physiques.

Ne pas réécrire tout le projet inutilement.

### 8. RÉSULTAT ATTENDU

Je souhaite obtenir une interface qui donne l'impression d'utiliser un véritable produit numérique bancaire moderne, et non un simple site web institutionnel.

Le résultat doit être :
- Premium.
- Moderne.
- Professionnel.
- Très intuitif.
- Rapide.
- Cohérent avec l'identité BNI.
- Entièrement responsive.

La version desktop et la version mobile doivent avoir la même identité visuelle, mais des compositions adaptées à leurs écrans respectifs.

**Consigne finale :** Commence par analyser le code existant, puis implémente progressivement cette nouvelle page d'accueil. Préserve les fonctionnalités existantes et vérifie le rendu sur desktop et mobile avant de considérer le travail terminé.



----------------------------------
Pour BNI Synapse, utilise **Inter** comme police principale sur toute la plateforme.

- Titres principaux : Inter 700 (Bold)
- Titres secondaires : Inter 600 (SemiBold)
- Paragraphes : Inter 400 (Regular)
- Boutons et menus : Inter 600 (SemiBold)
- Chiffres, statistiques et temps d'attente : Inter 600

Charge la police depuis Google Fonts ou via le package existant du projet. Définis Inter comme police globale dans le CSS avec une police système de secours.

Veille à conserver une hiérarchie typographique cohérente sur toutes les pages, ainsi que sur les versions tablette et mobile. Ne mélange pas plusieurs familles de polices.
--------------------------------------------


Je te conseille de lui faire suivre cet ordre :
1. Refonte de la page d'accueil.
2. Interface de recherche des agences avec carte.
3. Parcours complet de prise de ticket.
4. Interface de suivi du ticket.
5. Système d'avis client.
6. Optimisation responsive et tests.
L'objectif est de faire évoluer sans casser ce qui fonctionne déjà.