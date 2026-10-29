
# S2Q — Présentation générale du projet et spécifications du module Ticket en ligne

## 1. Présentation générale du projet

S2Q est une solution de gestion des files d'attente et de l'accueil client destinée notamment aux établissements bancaires.

L'objectif est de moderniser le parcours client en agence, de mieux organiser les files d'attente, de faciliter le travail des agents et de réduire le temps d'attente des clients.

La plateforme est constituée de cinq modules complémentaires :

1. **Back-office** : interface centrale d'administration et de gestion du système.
2. **Borne de prise de ticket** : dispositif installé en agence permettant au client de prendre un ticket sur place.
3. **Borne de satisfaction** : dispositif permettant de recueillir l'avis du client après sa prise en charge.
4. **Diffuseur** : système d'affichage et d'annonce des tickets appelés, notamment sur les écrans présents en agence.
5. **Ticket en ligne** : plateforme permettant au client de préparer sa visite depuis chez lui, de choisir une agence et un créneau de rendez-vous, puis d'obtenir un ticket utilisable à son arrivée.

Ces modules ne doivent pas être considérés comme cinq applications totalement indépendantes. Ils participent à un même processus métier et doivent respecter les règles communes du système.

## 2. Le back-office : le centre de gestion de S2Q

Le back-office est un élément central du projet. Avant de développer Ticket en ligne, il est indispensable de comprendre comment les agences, les services, les files d'attente, les agents et les tickets y sont organisés.

Le back-office permet notamment de configurer et de superviser les opérations d'accueil en agence.

### 2.1. Les principaux éléments métier

**Les agences**

Le système peut gérer plusieurs agences bancaires. Chaque agence possède ses propres informations et peut disposer de ses horaires, de ses services et de ses capacités d'accueil.

**Les services**

Une agence peut proposer différents services bancaires. Par exemple :

- Ouverture de compte ;
- Opérations au guichet ;
- Informations et assistance ;
- Crédit ;
- Services aux entreprises.

Cette liste est illustrative : les services réels dépendent de la configuration du système.

**Les tickets**

Un ticket représente une demande de prise en charge d'un client. Il est associé à un numéro permettant de l'identifier et de l'appeler.

Selon les règles métier en place, un ticket peut être associé à une agence, à un service, à un créneau horaire, à une priorité et à un état.

**Les agents et les guichets**

Les agents prennent en charge les clients. Un agent peut être affecté à un guichet et intervenir sur certains services, selon les autorisations et les règles de configuration de l'agence.

**Les files d'attente**

Une file d'attente regroupe les tickets qui attendent une prise en charge pour un service ou un périmètre donné.

Le système doit permettre de connaître les tickets en attente, ceux qui sont appelés et ceux dont la prise en charge est terminée, selon les états effectivement utilisés par S2Q.

### 2.2. Le cycle de vie d'un ticket

Le cycle suivant constitue une représentation fonctionnelle à vérifier avec l'implémentation existante :

1. **Création** : un ticket est créé par la borne en agence ou par la plateforme en ligne.
2. **Enregistrement** : le ticket est enregistré dans le système et rattaché aux informations nécessaires.
3. **Attente** : le ticket attend son tour ou son créneau de prise en charge.
4. **Appel** : un agent appelle le ticket depuis l'interface de gestion.
5. **Affichage et annonce** : le diffuseur peut afficher le numéro du ticket et annoncer son appel.
6. **Prise en charge** : le client est reçu par l'agent.
7. **Clôture** : le ticket est terminé selon les règles métier du système.

Des états supplémentaires peuvent exister : absent, annulé, reporté, prioritaire ou non présenté. Il faut reprendre les états et les transitions déjà définis dans le projet plutôt que créer un nouveau cycle incompatible.

### 2.3. Les informations importantes pour la gestion des tickets

Un ticket peut notamment nécessiter les informations suivantes :

- Son identifiant technique ;
- Son numéro visible par le client ;
- L'agence concernée ;
- Le service demandé ;
- Sa date de création ;
- Son mode de création : borne ou plateforme en ligne ;
- Son créneau de rendez-vous, lorsqu'il existe ;
- Son état actuel ;
- Les informations nécessaires à son appel et à sa prise en charge.

Il ne faut pas supposer que tous ces champs existent déjà sous ces noms dans l'API. L'agent doit inspecter les modèles, les endpoints et les données actuellement utilisés par le projet.

## 3. Les interactions entre les cinq modules

### Back-office et borne de prise de ticket

Le back-office fournit le cadre de gestion des agences et des services. La borne permet au client présent sur place de sélectionner son besoin et d'obtenir un ticket conformément aux règles configurées.

### Back-office et borne de satisfaction

La borne de satisfaction intervient dans le parcours de prise en charge pour recueillir l'évaluation du client. Les modalités de rattachement de cette évaluation au ticket ou à l'agent doivent respecter le fonctionnement existant.

### Back-office et diffuseur

Lorsqu'un agent appelle un ticket, le diffuseur permet de transmettre l'information au dispositif d'affichage et d'annonce utilisé en agence.

Le diffuseur doit présenter les informations pertinentes, par exemple le numéro du ticket et le guichet concerné, conformément à la configuration du système.

### Back-office et Ticket en ligne

Cette interaction est particulièrement importante pour le nouveau module.

Ticket en ligne doit permettre de créer des demandes de visite à distance tout en respectant les règles de gestion des agences, des services et des créneaux.

Le back-office doit rester cohérent avec les tickets issus de la plateforme en ligne. Selon l'architecture actuelle, les agents doivent pouvoir retrouver les tickets concernés, comprendre leur origine et les traiter dans le processus normal de l'agence.

La plateforme en ligne ne doit donc pas développer son propre système parallèle de gestion des tickets.

## 4. Le module Ticket en ligne

### 4.1. Objectif

Ticket en ligne permet à un client de préparer sa visite en agence depuis son domicile ou depuis tout autre endroit disposant d'un accès à Internet.

Au lieu de se déplacer sans visibilité sur l'attente, le client peut choisir une agence, sélectionner un service et réserver un créneau disponible, selon les règles métier du système.

Il renseigne ensuite ses informations personnelles et reçoit un e-mail de confirmation contenant son numéro de ticket et un QR code.

À son arrivée en agence, il présente son QR code ou saisit son numéro sur la borne prévue à cet effet. Le système vérifie sa réservation et permet l'impression du ticket correspondant.

L'objectif est de fluidifier l'accueil, de mieux répartir les arrivées et de limiter l'incertitude liée au temps d'attente.

### 4.2. Parcours du client

**Étape 1 — Accéder à la plateforme**

Le client ouvre la plateforme Ticket en ligne depuis son téléphone ou son ordinateur.

**Étape 2 — Choisir une agence**

Une carte interactive affiche les agences disponibles. Le client peut consulter leur emplacement et les informations utiles pour choisir où se rendre.

**Étape 3 — Consulter l'affluence**

La plateforme présente une indication de l'affluence dans chaque agence afin d'aider le client à choisir son lieu de visite.

Cette indication doit être fondée sur des données fiables : nombre de tickets en attente, état des files et, si les données le permettent, estimation du temps d'attente.

Il faudra déterminer avec l'équipe si l'affluence est affichée globalement par agence ou par service.

**Étape 4 — Choisir un service**

Le client sélectionne le service correspondant à son besoin parmi ceux proposés par l'agence choisie.

**Étape 5 — Choisir un créneau**

Le système affiche les créneaux disponibles pour le service et l'agence. Le client choisit l'heure qui lui convient.

Les disponibilités doivent être calculées à partir des règles de capacité, des horaires et des réservations déjà enregistrées. Le frontend ne doit pas inventer lui-même les créneaux disponibles.

**Étape 6 — Renseigner ses informations**

Le formulaire recueille les informations nécessaires, notamment :

- Nom ;
- Prénoms ;
- Adresse e-mail ;
- Toute autre information requise par les règles métier.

Il faut limiter les données personnelles aux informations réellement nécessaires au service.

**Étape 7 — Confirmer la réservation**

Le système valide les données et réserve le créneau de manière cohérente avec les disponibilités. Il crée ou associe un ticket selon les règles métier retenues.

Il doit éviter que plusieurs clients obtiennent une réservation confirmée pour une même place disponible lorsque la capacité ne le permet pas.

**Étape 8 — Recevoir la confirmation**

Après confirmation effective de la réservation, le client reçoit un e-mail contenant :

- Le numéro de ticket ;
- Le QR code ;
- L'agence choisie ;
- Le service concerné ;
- La date et l'heure du rendez-vous ;
- Les instructions utiles pour son arrivée.

Un e-mail ne doit pas être présenté comme une confirmation définitive si la réservation n'a pas été correctement enregistrée.

**Étape 9 — Arriver à l'agence**

À son arrivée, le client se rend à la borne prévue pour les réservations en ligne. Il scanne le QR code ou saisit son numéro de ticket.

Le système vérifie la validité de la réservation, son agence, son créneau et son état. Si les conditions sont remplies, il permet l'impression du ticket correspondant.

Il faut éviter de créer un deuxième ticket par erreur lorsque le client récupère celui déjà associé à sa réservation.

**Étape 10 — Être pris en charge**

Le ticket suit ensuite le processus de gestion de S2Q. Il doit être visible dans les interfaces concernées et pouvoir être appelé par un agent conformément aux règles de l'agence.

Le comportement exact en cas d'arrivée anticipée, de retard ou d'absence doit être défini par les règles métier du projet.

## 5. La carte des agences et l'affluence

La carte constitue une fonctionnalité importante du module Ticket en ligne.

Elle doit permettre au client de :

- Localiser les agences ;
- Consulter les informations utiles de chaque agence ;
- Comparer leur niveau d'affluence ;
- Choisir une agence adaptée à son besoin ;
- Accéder à la réservation auprès de l'agence sélectionnée.

L'indicateur d'affluence peut être construit à partir de plusieurs données :

- Nombre de tickets actuellement en attente ;
- Nombre de guichets ou d'agents disponibles ;
- Durée d'attente observée ;
- Nombre de réservations prévues sur les prochains créneaux.

Ces éléments ne sont pas nécessairement tous disponibles dans l'API existante. L'agent doit d'abord identifier les données déjà exposées par le back-office et les services backend.

Il faut également distinguer deux notions :

- **Affluence actuelle** : situation observée à l'instant où le client consulte la carte.
- **Disponibilité future** : capacité restante pour un service à une date et à une heure précises.

Une agence peut être très fréquentée actuellement tout en proposant des créneaux disponibles plus tard. Inversement, une agence peu fréquentée peut ne plus avoir de place sur un créneau donné.

## 6. Principes techniques à respecter

Le développement doit s'intégrer à l'architecture existante de S2Q.

L'agent ne doit pas commencer par créer une architecture parallèle ou réinventer les mécanismes déjà disponibles.

Avant toute modification, il doit :

1. Examiner la structure du projet et les conventions de code.
2. Identifier les API utilisées par le back-office pour les agences, les services, les tickets et les files d'attente.
3. Repérer les modèles de données et les identifiants utilisés.
4. Comprendre comment les tickets sont créés, affichés, appelés et clôturés.
5. Identifier les mécanismes d'authentification, d'autorisation et de validation.
6. Vérifier les composants UI, les règles de navigation et la gestion d'état déjà utilisés.
7. Identifier les fonctionnalités backend disponibles et celles qui nécessitent une évolution.
8. Documenter les points métier encore incertains avant de les implémenter.

Le frontend doit consommer les API existantes ou les nouveaux endpoints validés par l'équipe. Les règles sensibles — réservation, vérification de disponibilité, génération ou association d'un ticket, validation du QR code — doivent être contrôlées côté serveur.

Le QR code ne doit pas être considéré comme une preuve suffisante à lui seul : le système doit vérifier la réservation correspondante et empêcher une utilisation invalide ou répétée.

## 7. Points métier à clarifier avec l'équipe

Les questions suivantes doivent être résolues avant de figer l'implémentation :

1. Un ticket est-il créé dès la réservation en ligne ou seulement à l'arrivée en agence ?
2. Le créneau représente-t-il une heure de rendez-vous précise ou une fenêtre d'arrivée ?
3. Comment les capacités sont-elles calculées pour chaque agence et chaque service ?
4. Comment le système gère-t-il les retards, les absences, les annulations et les changements de rendez-vous ?
5. Le QR code contient-il une référence opaque permettant de retrouver la réservation ou un autre format déjà défini ?
6. Comment la borne valide-t-elle la réservation et déclenche-t-elle l'impression du ticket ?
7. Comment les tickets réservés en ligne s'intègrent-ils dans la file des tickets pris directement en agence ?
8. Comment l'affluence est-elle calculée et à quelle fréquence est-elle actualisée ?
9. Quelles API sont déjà disponibles et quelles évolutions backend sont nécessaires ?
10. Quels sont les rôles, autorisations et règles de sécurité applicables à ce parcours ?

Ces décisions doivent être prises en cohérence avec l'implémentation réelle de S2Q.

## 8. Mission confiée à l'agent IA

Tu es chargé de développer le module Ticket en ligne de S2Q.

Ta mission ne consiste pas simplement à produire des écrans de réservation. Tu dois comprendre le système existant et créer un parcours cohérent avec le back-office, les bornes et le diffuseur.

Procède progressivement :

**Phase 1 — Exploration**

Étudie le projet, les API, les modèles de données, les composants existants et les règles métier. Identifie les dépendances avec le back-office.

**Phase 2 — Analyse**

Présente le parcours utilisateur, les données nécessaires, les endpoints existants, les éventuels endpoints manquants et les décisions métier à confirmer.

**Phase 3 — Conception**

Propose l'architecture du module, les écrans, les états de chargement et d'erreur, ainsi que les interactions entre les différentes étapes du parcours.

**Phase 4 — Implémentation**

Développe progressivement la carte des agences, le choix du service, la sélection du créneau, le formulaire, la confirmation, la réception du QR code et le parcours de récupération du ticket à la borne, en respectant les dépendances backend.

**Phase 5 — Tests**

Teste notamment les disponibilités, les réservations simultanées, les erreurs de validation, les e-mails, les QR codes invalides, les doubles récupérations de tickets et les différents états d'une réservation.

**Phase 6 — Revue**

Vérifie la cohérence avec le back-office, la sécurité, l'accessibilité, le responsive design, la qualité du code et les conventions du projet.

Ne suppose pas qu'une fonctionnalité existe parce qu'elle est décrite dans ce document. Vérifie le code et les API avant de t'appuyer dessus. Si une règle métier ou une capacité backend manque, signale-le et propose une solution avant de prendre une décision structurante.

## 9. Résultat attendu

Le module Ticket en ligne doit permettre au client de préparer sa visite, de choisir une agence et un créneau réellement disponible, de recevoir une confirmation exploitable et de récupérer son ticket à son arrivée.

Il doit également permettre à S2Q de conserver une vision cohérente des réservations, des tickets, des files d'attente et de la capacité d'accueil.

**Principe directeur : Ticket en ligne doit s'intégrer au système S2Q existant, et non devenir un système de réservation indépendant.**
