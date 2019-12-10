# Documentation utilisateur :<br /> Gestion des projets

Cette documentation correspond à la version 0.3 de **SixCess**.

***

| Fonctionnalités | Documentation |   | Fonctionnalités | Documentation |
| :-------------- | :------------ | - | :-------------- | :------------ |
| Gestion de compte utilisateur | [cliquez ici](/doc/v0.3/doc-user/doc-user-account.md) | | Gestion des tâches | [cliquez ici](/doc/v0.3/doc-user/doc-user-task.md) |
| Gestion des projets | [cliquez ici](/doc/v0.3/doc-user/doc-user-project.md) | | Gestion des releases | [cliquez ici](/doc/v0.3/doc-user/doc-user-release.md) |
| Gestion des issues | [cliquez ici](/doc/v0.3/doc-user/doc-user-issue.md) | | Gestion des tests | [cliquez ici](/doc/v0.3/doc-user/doc-user-test.md) |
| Gestion des sprints | [cliquez ici](/doc/v0.3/doc-user/doc-user-sprint.md) | | Gestion de la documentation | [cliquez ici](/doc/v0.3/doc-user/doc-user-documentation.md) |

***

## Consulter et gérer la liste des projets

Voici la page d'accueil à laquelle peut accéder un utilisateur connecté. Il peut consulter les projets dont il est collaborateur, et aussi modifier et supprimer ceux qu'il a lui-même créé. Enfin, il peut cliquer sur le bouton "**Nouveau projet**" pour créer un nouveau projet.

![accueil projets](/media/doc-user/accueil-projets.png)

***

## Créer un nouveau projet

Le formulaire de création de projet est composé de trois champs : un titre, une date de rendu (optionnelle) et une description (optionnelle).

![nouveau projet](/media/doc-user/nouveau-projet.png)

***

## Naviguer entre les différentes sections

Ci-dessous se trouve la page d'accueil d'un projet. À partir de celle-ci, vous pouvez consulter les différentes informations relatives au projet, et les modifier si vous êtes *Project Owner* ou *Project Manager* en cliquant sur le bouton "Paramètres du projet".

De plus, vous avez également accès aux différentes sections de ce projet via la barre de navigation : Issues, Sprints, Releases, Tests et Documentation.

![projet exemple](/media/doc-user/projet-exemple.png)

***

## Ajouter un contributeur

À partir de la page d'accueil d'un projet, cliquez sur le bouton "+" dans la section "Contributeurs" afin d'ajouter un nouveau collaborateur au projet. Vous arriverez alors à la page affichée ci-dessous. 

Renseignez ensuite le nom de l'utilisateur, ou son adresse mail, puis cliquez sur "Ajouter". Un mail sera alors envoyé à l'adresse associée à son compte, lui permettant d'accepter l'invitation.

![ajout contributeur](/media/doc-user/projet-ajout-contributeur.png)

***

## Changer le rôle d'un contributeur

Pour changer le rôle d'un contributeur, cliquez sur le champ de la colonne "Rôle" du contributeur souhaité (dans l'exemple ci-dessous, l'utilisateur "Version"), et choisissez le rôle à lui attribuer : *Project Manager* ou *Developer*.

Seul un utilisteur ayant accepté l'invitation à contribuer au projet pourra voir son rôle être modifié. Dans l'exemple ci-dessous, l'utilisateur "Testerman" a un rôle "En cours d'activation", et ne peut donc pas encore être modifié.

![changer role](/media/doc-user/changer-role.png)
