const projectRepo = require("../repositories/project.repository");
const userRepo = require("../repositories/user.repository");
const {sendMail} = require("../util/mail");

const { app, routes } = require("../util/constants").global;
const titlesProject = require('../util/constants').global.titles.project;
const viewsProject = require('../util/constants').global.views.project;

module.exports.getProject = (req, res) => {
  const {projectId} = req.params;
  const userId = req.session.user._id;

  projectRepo.getProjectById(projectId, userId)
    .then(project => {
      if (project) {
        const isPo = (project.projectOwner.toString() === userId.toString());
        const isPm = (project.collaborators.findIndex(collaborator =>
          (collaborator._id._id.toString() === userId.toString() && collaborator.userType === "pm")) >= 0);

        return res.status(200).render(viewsProject.project, {
          pageTitle: project.title,
          project: project,
          userId: userId,
          isPo: isPo,
          isPm: isPm,
          url: 'pro'
        });
      }

      return res.status(500).redirect(routes.error["500"]);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.getAdd = (req, res) => {
  res.render(viewsProject.addEdit, {
    pageTitle: titlesProject.add,
    errors: [],
    values: undefined,
    editing: false
  });
};

module.exports.postAdd = (req, res) => {
  const project = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    projectOwner: req.session.user
  };

  if (!req.validation.success) {
    return res.status(422).render(viewsProject.addEdit, {
      pageTitle: titlesProject.add,
      errors: req.validation.errors,
      values: {title: project.title, dueDate: project.dueDate, description: project.description},
      editing: false
    });
  }

  return projectRepo
    .createProject(project)
    .then(result => {
      if (!result) {
        req.flash("toast", "Le projet n'a pas été créé...");
        return res.status(403).redirect(routes.index);
      }

      req.flash("toast", "Projet créé avec succès !");
      return res.status(201).redirect(routes.index);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.getEdit = (req, res) => {
  const {projectId} = req.params;
  const userId = req.session.user._id;

  return projectRepo.getProjectById(projectId, userId)
    .then(project => {
      if (project && project.projectOwner.toString() === userId) {
        return res.render(viewsProject.addEdit, {
          pageTitle: titlesProject.edit,
          errors: [],
          values: project,
          editing: true
        });
      } else {
        req.flash("toast", "Accès non-autorisé !");
        return res.status(403).redirect(routes.index);
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.putEdit = (req, res) => {
  const project = {
    id: req.params.projectId,
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate
  };

  if (!req.validation.success) {
    return res.status(422).render(viewsProject.addEdit, {
      pageTitle: titlesProject.edit,
      errors: req.validation.errors,
      values: {
        id: project.id,
        title: project.title,
        dueDate: project.dueDate,
        description: project.description
      },
      editing: true
    });
  }

  return projectRepo
    .updateProject(project, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.index);
      }

      req.flash("toast", "Projet mis à jour !");
      return res.status(201).redirect(routes.project.project(project.id));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.deleteProject = (req, res) => {
  return projectRepo
    .deleteProject(req.params.projectId, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect(routes.index);
      }
      req.flash("toast", "Projet supprimé avec succès !");
      return res.status(200).redirect(routes.index);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.postInvite = async (req, res) => {
  const {projectId} = req.params;
  const {email} = req.body;
  const {username} = req.body;
  let userFound = null;

  if (email !== ""){
    userFound = await userRepo.findUserBy('email', email);
  }
  if (userFound === null && username !== ""){
    // eslint-disable-next-line require-atomic-updates
    userFound = await userRepo.findUserBy('username', username);
  }

  if (userFound !== null) {
    return projectRepo
      .isContributorFromProject(projectId, userFound._id)
      .then(result => {
        if (result) {
          req.flash('toast', 'Ce contributeur a déjà été ajouté !');
          return res.redirect(routes.project.project(projectId));
        } else {
          return projectRepo
            .addContributorToProject(projectId, userFound._id, req.session.user._id)
            .then(result => {
              if (!result) {
                req.flash('toast', 'Le contributeur n\'a pas été ajouté...');
                return res.redirect(routes.project.project(projectId));
              }

              const userEmail = userFound.email;
              const subject = app.name + ' - Invitation Projet';
              const message = `
                <p>
                    Bonjour,<br>
                    Vous venez d'être ajouté à un projet.<br>
                    Pour le rejoindre cliquer sur ce lien : <a href="http://localhost:8080/projects/${projectId}/invite">Accepter</a><br>
                    Bonne journée !
                </p>`;

              return sendMail(userEmail, subject, message);
            })
            .then(() => {
              req.flash('toast', 'Invitation envoyée !');
              return res.redirect(routes.project.project(projectId));
            });
        }
      });
  } else {
    req.flash('toast', 'Aucun compte trouvé...');
    return res.redirect(routes.project.project(projectId));
  }
};

module.exports.getInvite = (req, res) => {
  const {projectId} = req.params;
  const userId = req.session.user._id;

  projectRepo
    .acceptInvitation(projectId, userId)
    .then(result => {
      if (!result)
        return res.redirect(routes.index);

      req.flash('toast', 'Invitation Acceptée !');
      return res.redirect(routes.project.project(projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.deleteInvite = (req, res) => {
  const {projectId} = req.params;
  const {userId} = req.params;
  const connectedUserId = req.session.user._id;
  projectRepo
    .removeContributorToProject(projectId, userId ? userId : connectedUserId, connectedUserId)
    .then(result => {
      const redirectUrl = userId ? routes.project.project(projectId) : routes.index;
      if (result && userId){
        req.flash('toast', 'Contributeur supprimé !');
      }
      if(result && !userId){
        req.flash('toast', 'Vous avez quittez le projet !');
      }
      return res.redirect(redirectUrl);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.updateRole = (req, res) => {
  const user = {
    _id: req.params.userId,
    role: req.body.role
  };

  if (!req.validation.success) {
    req.flash("toast", "Une erreur s'est produite.");
    return res.status(403).redirect(routes.project.project(req.params.projectId));
  }

  return projectRepo
    .updateUserRole(req.params.projectId, req.session.user._id, user)
    .then(result => {
      const redirectUrl = routes.project.project(req.params.projectId);
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(redirectUrl);
      }

      req.flash("toast", "Rôle mis à jour !");
      return res.status(201).redirect(redirectUrl);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};
