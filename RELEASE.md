# Release 2
Date : Vendredi 22 Novembre 2019

Version : v0.2

Lien de Téléchargement : [v0.2](https://github.com/abdelhadinaimi/grp2_eq6_cdp_release/archive/v0.2.zip)

| ID | Descriptif |
| :-: | -- |
| US#04 | **En tant que** utilisateur, **je souhaite** pouvoir cliquer sur le bouton “Mon Compte” qui affiche un formulaire avec les champs “Adresse mail”, “Nom d’utilisateur” et “Mot de Passe” (cf. spécifications US#01) et valider sur le bouton “Sauvegarder” **afin de** mettre à jour mes informations. |
| US#10 | **En tant que** PO ou CP, **je souhaite** une fois sur la page d’accueil du projet, cliquer sur le bouton “Inviter un contributeur”, donner l’adresse mail ou le nom d'utilisateur d’une personne à ajouter et cliquer sur “Envoyer” **afin de** lui envoyer un mail d’invitation à devenir contributeur. |
| US#11 | **En tant que** PO, **je souhaite**, une fois sur la page d'accueil du projet, cliquer sur la liste déroulante devant le nom d’un contributeur, puis sur une des entrées de cette liste (“Développeur”, “Chef de Projet”), **afin de** changer le rôle de ce contributeur. |
| US#12 | **En tant que** PO ou CP, **je souhaite** une fois sur la page d’accueil du projet, cliquer la liste déroulante devant le nom d’un contributeur, cliquer sur le bouton supprimer et confirmer la suppression **afin de** le supprimer du projet. |
| US#13 | **En tant que** utilisateur, **je souhaite** cliquer sur le lien reçu par mail **afin de** accepter l'invitation à collaborer sur le projet. |
| US#14 | **En tant que** utilisateur, **je souhaite** une fois sur la page d’accueil du projet, cliquer sur le menu déroulant devant le nom du projet, cliquer sur le bouton “Quitter projet” et “Confirmer” **afin de** quitter le projet. |
| US#20 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Créer une tâche” de la page “Tâches” du projet, remplir un formulaire contenant les champs “Description” (3000 char max), “*Definition of Done* (DoD)” (3000 char max), “Durée de réalisation” (min. 0,5 j/h), “Test” (sous forme de lien, optionnel, 2000 char max), puis cliquer sur le bouton “Créer” **afin de** créer une nouvelle tâche. |
| US#21 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Modifier” d’une tâche puis afficher le formulaire (cf. spécifications US#20) **afin de** mettre à jour les information de la tâche. |
| US#22 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Supprimer” d’une tâche **afin de** la supprimer. |
| US#23 | **En tant que** utilisateur, **je souhaite** cliquer sur l’onglet “Tâches” **afin de** afficher la liste de toutes les tâches du projet. |
| US#24 | **En tant que** utilisateur, **je souhaite** cliquer sur le bouton “Mes tâches” **afin de** filtrer la liste des tâches et n’afficher que les tâches auxquelles je suis assigné. |
| US#25 | **En tant que** utilisateur, **je souhaite** cliquer sur une tâche **afin de** consulter les informations relatives à cette tâche (cf. champs US#20). |
| US#26 | **En tant que** PO ou CP, **je souhaite**, une fois dans la page de modification d’une tâche, cliquer sur le bouton “Lier à une issue” puis choisir une issue de la liste” **afin de** lier l’*issue* à la tâche. |
| US#27 | **En tant que** PO ou CP, **je souhaite**, une fois sur la page de modification d’une tâche, cliquer sur le bouton “Assigner” puis choisir un ou plusieurs utilisateur(s) **afin de** assigner ces utilisateurs à cette tâche. |
| US#28 | **En tant que** utilisateur, **je souhaite** cliquer sur la liste déroulante apparaissant à côté d’une tâche à laquelle j’étais assigné, puis sur une des entrées de cette liste (*TODO*, *DONE*, *DOING*, *TOTEST*, *TESTING*, *TESTED*), **afin de** changer l’état de cette tâche et mettre à jour le niveau de progression des *issues* et sprint liés. |

## Tâches non réalisées pour le Sprint 2

| ID | Description | État |
| -- | -- | :-: |
| TEST_PRJ2 | Ajouter de nouveaux tests pour les projets. | TODO |
| TEST_US | Ajouter de nouveaux tests selinium. | DOING |

# Release 1
Date : Vendredi 8 Novembre 2019

Version : v0.1

Lien de Téléchargement : [v0.1](https://github.com/abdelhadinaimi/grp2_eq6_cdp_release/archive/v0.1.zip)

| ID | Descriptif |
| :-: | -- |
| US#01 | **En tant que** visiteur, **je souhaite** cliquer sur le bouton “Créer un compte”, remplir un formulaire composé des champs “Adresse mail” (format valide d’une adresse mail, 256 char max), “Nom d’utilisateur” (unique, 20 char max) et “Mot de Passe” (composé d’au moins une majuscule, une minuscule et un chiffre, 8 char min et 32 max), puis cliquer sur le bouton “Créer” **afin de** créer un compte. |
| US#02 | **En tant que** visiteur, **je souhaite** cliquer sur le bouton “Se connecter” puis remplir un formulaire en donnant mon adresse mail et mon mot de passe (cf. spécifications US#01) **afin de** me connecter. |
| US#03 | **En tant que** utilisateur, **je souhaite** cliquer sur le bouton “Déconnecter” **afin de** me déconnecter. |
| US#05 | **En tant que** utilisateur, **je souhaite** me rendre sur la page “Accueil” **afin de** afficher la liste des projets auxquels je contribue et ceux que j'ai créé (et leurs titres, dates de début et de fin, pourcentage de complétion, et le nombre de collaborateurs) . |
| US#06 | **En tant que** utilisateur, **je souhaite** cliquer sur le bouton “Créer un projet”, remplir un formulaire composé des champs “Titre” (128 char max), “Description” (3000 char max), “Date de rendu” (format jj/mm/aaaa), puis cliquer sur le bouton “Créer” **afin de** créer un nouveau projet, dont je serai le *Project Owner* (PO). |
| US#07 | **En tant que** utilisateur, **je souhaite**, une fois sur la page “Accueil”, cliquer sur le nom d’un projet qui est listé **afin de** se rendre sur la page d’accueil de ce projet. |
| US#08 | **En tant que** PO, **je souhaite** cliquer sur le bouton “Modifier” sur un projet pour afficher un formulaire avec les champs “Titre”, “Description”, “Date de rendu” (cf. spécifications US#06) et valider en cliquant sur le bouton “Sauvegarder” **afin de** mettre à jour les informations du projet. |
| US#09 | **En tant que** PO, **je souhaite** cliquer sur le bouton “Supprimer” associé à un projet que j’ai créé **afin de** supprimer ce projet. |
| US#15 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Créer une issue” de la page “Issues” du projet, remplir un formulaire contenant les champs “En tant que”, “Je souhaite”, “Afin de” (tous trois relatifs à une *user story*, 1000 char max), “Identifiant” (unique, 20 char max), “Niveau de priorité” (Faible/Moyen/Élevé), “Coût” (min. 1), “Test” (sous forme de lien, optionnel, 2000 char max), puis cliquer sur le bouton “Créer” **afin de** créer une nouvelle *issue*. |
| US#16 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Modifier” d’une *issue*, remplir le formulaire (cf. spécifications US#15) **afin de** mettre à jour les informations relatives à cette *issue*. | High | 2 | DONE |
| US#17 | **En tant que** PO ou CP, **je souhaite** cliquer sur le bouton “Supprimer” d’une *issue* **afin de** supprimer une *issue*. |
| US#18 | **En tant que** utilisateur, **je souhaite** cliquer sur l’onglet “Issues” **afin de** afficher la liste de toutes les *issues* du projet. |
| US#19 | **En tant que** utilisateur, **je souhaite** cliquer sur une issue **afin de** consulter les informations relatives à cette issue (cf. spécifications US#15), les tâches qui lui sont liées (leurs descriptions et états) et le sprint à laquelle elle est affectée (son identifiant). |
