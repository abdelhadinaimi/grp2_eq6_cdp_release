# Documentation
La dernière version de la documentation est disponible [ici](https://abdelhadinaimi.github.io/grp2_eq6_cdp_release/doc/v0.3/).

# Intégration Continue
Dernière exécution Test Unitaire et Intégration : [![Actions Status](https://github.com/Version-Project/grp2_eq6_cdp_dev/workflows/tests/badge.svg)](https://github.com/Version-Project/grp2_eq6_cdp_dev/actions)

Dernière Release disponible [ici](https://grp2-eq6-cdp-dev.herokuapp.com/)

# Utilisation
Téléchargez le projet, décompressez l'archive, rendez vous dans le nouveau dossier puis lancez la commande :<br>
`` docker-compose up ``

Une fois installée et démarrée, l'application sera accessible à l'adresse : [localhost:8080](http://localhost:8080)

# Tests
Une fois le projet lancé, il faut se placer dans le dossier *src* et il suffit de faire la commande : `` npm test ``

# Releases
Lien vers les Releases : [Lien](https://github.com/abdelhadinaimi/grp2_eq6_cdp_release/blob/master/RELEASE.md)

| Version | Date | Téléchargement |
| :-: | :-: | :-: |
| v0.1 | 08/11/2019 | [#1 Release](https://github.com/abdelhadinaimi/grp2_eq6_cdp_release/archive/v0.1.zip) |
| v0.2 | 22/11/2019 | [#2 Release](https://github.com/abdelhadinaimi/grp2_eq6_cdp_release/archive/v0.2.zip) |

# Sprints
| N° | Date de Début | Date de Fin | Issues | Tasks |
| :-: | :-: | :-: | -- | -- |
| 1 | Lundi 21 Octobre 2019 | Vendredi 8 Novembre 2019 | [#1 Issues](https://github.com/Version-Project/grp2_eq6_cdp_dev/blob/master/Sprints/sprint1.md) | [#1 Tasks](https://github.com/Version-Project/grp2_eq6_cdp_dev/blob/master/Sprints/task1.md) |
| 2 | Mardi 12 Novembre 2019 | Vendredi 22 Novembre 2019 | [#2 Issues](https://github.com/Version-Project/grp2_eq6_cdp_dev/blob/master/Sprints/sprint2.md) | [#2 Tasks](https://github.com/Version-Project/grp2_eq6_cdp_dev/blob/master/Sprints/task2.md) |
| 3 | Lundi 25 Novembre 2019 | Vendredi 6 Décembre 2019 | [#3 Issues](https://github.com/Version-Project/grp2_eq6_cdp_dev/blob/master/Sprints/sprint3.md) | [#3 Tasks](https://github.com/Version-Project/grp2_eq6_cdp_dev/blob/master/Sprints/task3.md) |

# Backlog

| ID | Descriptif | Priorité | Coût | N° Sprint | État |
| :-: | -- | :-: | :-: | :-: | :-: |
| US#01 | **En tant que** visiteur, **je souhaite** cliquer sur le bouton “Créer un compte”, remplir un formulaire composé des champs “Adresse mail” (format valide d’une adresse mail, 256 char max), “Nom d’utilisateur” (unique, 20 char max) et “Mot de Passe” (composé d’au moins une majuscule, une minuscule et un chiffre, 8 char min et 32 max), puis cliquer sur le bouton “Créer” **afin de** créer un compte. | High | 2 | 1 | DONE |
| US#02 | **En tant que** visiteur, **je souhaite** cliquer sur le bouton “Se connecter” puis remplir un formulaire en donnant mon adresse mail et mon mot de passe (cf. spécifications US#01) **afin de** me connecter. | High | 1 | 1 | DONE |
| US#03 | **En tant que** utilisateur, **je souhaite** cliquer sur le bouton “Déconnecter” **afin de** me déconnecter. | Low | 1 | 1 | DONE |
| US#04 | **En tant que** utilisateur, **je souhaite** pouvoir cliquer sur le bouton “Mon Compte” qui affiche un formulaire avec les champs “Adresse mail”, “Nom d’utilisateur” et “Mot de Passe” (cf. spécifications US#01) et valider sur le bouton “Sauvegarder” **afin de** mettre à jour mes informations. | Low | 2 | 2 | DONE |
| US#05 | **En tant que** utilisateur, **je souhaite** me rendre sur la page “Accueil” **afin de** afficher la liste des projets auxquels je contribue et ceux que j'ai créé (et leurs titres, dates de début et de fin, pourcentage de complétion, et le nombre de collaborateurs) . | High | 1 | 1 | DONE |
| US#06 | **En tant que** utilisateur, **je souhaite** cliquer sur le bouton “Créer un projet”, remplir un formulaire composé des champs “Titre” (128 char max), “Description” (3000 char max), “Date de rendu” (format jj/mm/aaaa), puis cliquer sur le bouton “Créer” **afin de** créer un nouveau projet, dont je serai le *Project Owner* (PO). | High | 2 | 1 | DONE |
| US#07 | **En tant que** utilisateur, **je souhaite**, une fois sur la page “Accueil”, cliquer sur le nom d’un projet qui est listé **afin de** se rendre sur la page d’accueil de ce projet. | High | 1 | 1 | DONE |
| US#08 | **En tant que** PO, **je souhaite** cliquer sur le bouton “Modifier” sur un projet pour afficher un formulaire avec les champs “Titre”, “Description”, “Date de rendu” (cf. spécifications US#06) et valider en cliquant sur le bouton “Sauvegarder” **afin de** mettre à jour les informations du projet. | Low | 2 | 1 | DONE |
| US#09 | **En tant que** PO, **je souhaite** cliquer sur le bouton “Supprimer” associé à un projet que j’ai créé **afin de** supprimer ce projet. | Low | 1 | 1 | DONE |
| US#10 | **En tant que** PO ou CP, **je souhaite** une fois sur la page d’accueil du projet, cliquer sur le bouton “Inviter un contributeur”, donner l’adresse mail ou le nom d'utilisateur d’une personne à ajouter et cliquer sur “Envoyer” **afin de** lui envoyer un mail d’invitation à devenir contributeur. | Low | 3 | 2 | DONE |
| US#11 | **En tant que** PO, **je souhaite**, une fois sur la page d'accueil du projet, cliquer sur la liste déroulante devant le nom d’un contributeur, puis sur une des entrées de cette liste (“Développeur”, “Chef de Projet”), **afin de** changer le rôle de ce contributeur. | Low | 1 | 2 | DONE |
| US#12 | **En tant que** PO ou CP, **je souhaite** une fois sur la page d’accueil du projet, cliquer la liste déroulante devant le nom d’un contributeur, cliquer sur le bouton supprimer et confirmer la suppression **afin de** le supprimer du projet. | Low | 1 | 2 | DONE |
| US#13 | **En tant que** utilisateur, **je souhaite** cliquer sur le lien reçu par mail **afin de** accepter l'invitation à collaborer sur le projet. | Low | 1 | 2 | DONE |
| US#14 | **En tant que** utilisateur, **je souhaite** une fois sur la page d’accueil du projet, cliquer sur le menu déroulant devant le nom du projet, cliquer sur le bouton “Quitter projet” et “Confirmer” **afin de** quitter le projet. | Low | 1 | 2 | DONE |
| US#15 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Créer une issue” de la page “Issues” du projet, remplir un formulaire contenant les champs “En tant que”, “Je souhaite”, “Afin de” (tous trois relatifs à une *user story*, 1000 char max), “Identifiant” (unique, 20 char max), “Niveau de priorité” (Faible/Moyen/Élevé), “Coût” (min. 1), “Test” (sous forme de lien, optionnel, 2000 char max), puis cliquer sur le bouton “Créer” **afin de** créer une nouvelle *issue*. | High | 2 | 1 | DONE |
| US#16 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Modifier” d’une *issue*, remplir le formulaire (cf. spécifications US#15) **afin de** mettre à jour les informations relatives à cette *issue*. | High | 2 | 1 | DONE |
| US#17 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Supprimer” d’une *issue* **afin de** supprimer une *issue*. | High | 1 | 1 | DONE |
| US#18 | **En tant que** utilisateur, **je souhaite** cliquer sur l’onglet “Issues” **afin de** afficher la liste de toutes les *issues* du projet. | High | 1 | 1 | DONE |
| US#19 | **En tant que** utilisateur, **je souhaite** cliquer sur une issue **afin de** consulter les informations relatives à cette issue (cf. spécifications US#15), les tâches qui lui sont liées (leurs descriptions et états) et le sprint à laquelle elle est affectée (son identifiant). | High | 1 | 1 | DONE |
| US#20 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Créer une tâche” de la page “Tâches” du projet, remplir un formulaire contenant les champs “Description” (3000 char max), “*Definition of Done* (DoD)” (3000 char max), “Durée de réalisation” (min. 0,5 j/h), “Test” (sous forme de lien, optionnel, 2000 char max), puis cliquer sur le bouton “Créer” **afin de** créer une nouvelle tâche. | High | 2 | 2 | DONE |
| US#21 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Modifier” d’une tâche puis afficher le formulaire (cf. spécifications US#20) **afin de** mettre à jour les information de la tâche. | High | 2 | 2 | DONE |
| US#22 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Supprimer” d’une tâche **afin de** la supprimer. | High | 1 | 2 | DONE |
| US#23 | **En tant que** utilisateur, **je souhaite** cliquer sur l’onglet “Tâches” **afin de** afficher la liste de toutes les tâches du projet. | High | 1 | 2 | DONE |
| US#24 | **En tant que** utilisateur, **je souhaite** cliquer sur le bouton “Mes tâches” **afin de** filtrer la liste des tâches et n’afficher que les tâches auxquelles je suis assigné. | Low | 1 | 2 | DONE |
| US#25 | **En tant que** utilisateur, **je souhaite** cliquer sur une tâche **afin de** consulter les informations relatives à cette tâche (cf. champs US#20). | High | 1 | 2 | DONE |
| US#26 | **En tant que** PO ou CP, **je souhaite**, une fois dans la page de modification d’une tâche, cliquer sur le bouton “Lier à une issue” puis choisir une issue de la liste” **afin de** lier l’*issue* à la tâche. | High | 2 | 2 | DONE |
| US#27 | **En tant que** PO ou CP, **je souhaite**, une fois sur la page de modification d’une tâche, cliquer sur le bouton “Assigner” puis choisir un ou plusieurs utilisateur(s) **afin de** assigner ces utilisateurs à cette tâche. | High | 1 | 2 | DONE |
| US#28 | **En tant que** utilisateur, **je souhaite** cliquer sur la liste déroulante apparaissant à côté d’une tâche à laquelle j’étais assigné, puis sur une des entrées de cette liste (*TODO*, *DONE*, *DOING*, *TOTEST*, *TESTING*, *TESTED*), **afin de** changer l’état de cette tâche et mettre à jour le niveau de progression des *issues* et sprint liés. | High | 1 | 2 | DONE |
| US#29 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Créer un sprint” de la page “Sprints” du projet, remplir un formulaire contenant les champs “Identifiant” (unique, 20 char max), “Description” (3000 char max), “Date de début” (format jj/mm/aaaa) et “Date de fin” (format jj/mm/aaaa, postérieur à la date de début), puis cliquer sur le bouton “Créer” **afin de** créer un nouveau sprint. | Low | 2 | 3 | DONE |
| US#30 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Modifier” d’un sprint puis afficher le formulaire (cf. spécifications US#29) **afin de** mettre à jour les information de ce sprint.  | Low | 2 | 3 | DONE |
| US#31 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Supprimer” devant le nom du sprint **afin de** supprimer ce sprint. | Low | 1 | 3 | DONE |
| US#32 | **En tant que** utilisateur, **je souhaite** cliquer sur l’onglet “Sprints” **afin de** afficher toute la liste des sprints du projet. | Low | 1 | 3 | DONE |
| US#33 | **En tant que** utilisateur, **je souhaite** une fois dans l’onglet “Sprint”, cliquer sur un sprint **afin de** afficher les informations relatives à ce sprint (Cf spécifications US#29), l’état d’avancement, le coût total et le temps restant| Low | 1 | 3 | DONE |
| US#34 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Crée une tâche” **afin de** d'ajouter une *tâche* au sprint. | Low | 2 | 3 | DONE |
| US#35 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Supprimer” devant chaque *tâche* **afin de** supprimer une *tâche* du sprint. | Low | 1 | 3 | DONE |
| US#36 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Ajouter une release” d’un sprint, remplir le formulaire avec les champs “Version” (format X.Y, avec X et Y des nombres), “Description” (3000 char max) et “Lien vers le dépôt” (sous forme de lien, 2000 char max) où elle peut être récupérée, puis cliquer sur le bouton “Ajouter” **afin de** ajouter une release à ce sprint. | Low | 2 | 3 | DONE |
| US#37 | **En tant que** utilisateur, **je souhaite** cliquer sur l’onglet “Releases” **afin de** afficher la liste de toutes les *releases* du projet. | Low | 1 | 3 | DONE |
| US#38 | **En tant que** utilisateur, **je souhaite** cliquer sur l’onglet “Tests” **afin de** afficher la liste des tests de toutes les *issues* et de toutes les tâches du projet. | Low | 1 | 3 | DONE |
| US#39 | **En tant que** utilisateur, **je souhaite** cliquer sur l’onglet “Documentation” **afin de** afficher la documentation Utilisateur, Administrateur et celle du Code. | Low | 1 | 3 | DONE |
| US#40 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Ajouter” de la page “Documentation”, remplir un formulaire contenant les champs "Version" (20 char max), “Fichier” (format .zip ou .pdf), “Catégorie” (Utilisateur/Administrateur/Code) puis cliquer sur le bouton “Valider” **afin de** d’ajouter de la documentation. | Low | 1 | 3 | DONE |
| US#41 | **En tant que** PO ou CP, **je souhaite**, une fois dans l’onglet “Documentation”, cliquer sur le bouton “Télécharger Doc” **afin de** télécharger la documentation. | Low | 1 | 3 | DONE |
| US#42 | **En tant que** utilisateur, **je souhaite** voir s'afficher une alerte affichant que la durée de la tâche est excessive si elle est supérieure à 2 j/h **afin de** être prévenu que la granularité de ma tâche n'est pas assez fine. | Low | 1 | 3 | DONE |
| US#43 | **En tant que** utilisateur, **je souhaite** pouvoir voir le burndown chart sur la page d'un projet **afin de** connaître l'avancement par rapport au calendrier prévisionnel. | Low | 2 | 3 | DONE |
| US#44 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Modifier” d’une release puis afficher le formulaire (cf. spécifications US#36) **afin de** mettre à jour les information de cette release.  | Low | 1 | 3 | DONE |
| US#45 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Supprimer” devant la version d'une release **afin de** supprimer cette release. | Low | 1 | 3 | DONE |
