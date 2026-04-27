# F1 2026 - Portail Expert

## Description du projet

Ce projet est un portail web immersif consacre a la Formule 1 version 2026. Il combine une page d'accueil avec une monoplace 3D interactive sous Three.js et plusieurs pages de contenu editorial pour explorer l'histoire de la discipline, les ecuries, les evolutions techniques, les circuits iconiques, la securite et le parcours de formation des pilotes.

L'objectif est de proposer un site a la fois visuel, pedagogique et technique, avec une direction artistique sombre inspiree de l'univers automobile et de l'ingenierie de pointe.

## Fonctionnalites principales

- Hub d'accueil avec modele 3D interactif de F1 2026. (Nous avons été aidé par l'ia afin de faire fonctionner le modèle 3D de la F1)
- Navigation multi-pages vers les differents dossiers du site.
- Redirection contextuelle depuis les zones detectees sur la monoplace 3D.
- Page historique retraçant l'evolution de la Formule 1 de 1950 a 2026.
- Page consacree aux ecuries et aux projets majeurs de la grille 2026.
- Page technique sur le reglement 2026 et les principales innovations.
- Page d'analyse de circuits emblématiques avec donnees techniques.
- Page dediee a la securite avec integration de videos de crashs analyses.
- Page presentant le parcours de formation du karting a la Super Licence.
- Feuille de style partagee entre toutes les pages pour garantir une identite visuelle coherente.
- Interactions JavaScript discretes sur le site : animations d'apparition, progression de lecture et mise en avant des sections.

## Instructions d'installation et d'execution

### 1. Recuperer le projet

Placez le dossier du projet dans votre environnement web local, par exemple dans `htdocs` si vous utilisez MAMP.

### 2. Verifier les fichiers necessaires

Le projet repose notamment sur les fichiers suivants :

- `index.html`
- `main.js`
- `app.js`
- `style.css`
- `new_f1_car_2026_new_car.glb`
- le dossier `pages/`

### 3. Lancer le projet

Deux possibilites simples :

- Ouvrir `index.html` depuis un serveur local.
- Ou lancer le projet via MAMP / Apache en pointant le navigateur vers le dossier du site.

Exemple en local :

- Demarrer MAMP.
- Verifier que le dossier du projet est place dans `htdocs`.
- Ouvrir le navigateur sur l'URL correspondant au projet, par exemple :
  `http://localhost/F1_Website_ISEN/`

### 4. Navigation

- Depuis la page d'accueil, il est possible de faire pivoter la voiture, zoomer et cliquer sur certaines zones techniques.
- Le menu principal permet d'acceder directement a toutes les pages du portail.

## Membres du groupe

- Romain Geiger
- Thomas Titrent
- Jean-Baptiste Declercq
