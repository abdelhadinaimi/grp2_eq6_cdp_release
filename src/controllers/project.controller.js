const projectRepo = require("../repositories/project.repository");
const userRepo = require("../repositories/user.repository");

const {sendMail} = require("../util/mail");

module.exports.getProject = (req, res) => {
  const {projectId} = req.params;
  const userId = req.session.user._id;

  projectRepo.getProjectById(projectId, userId)
    .then(project => {
      if (project) {
        return res.status(200).render('project/project', {
          pageTitle: project.title,
          project: project,
          userId: userId,
          url: 'pro'
        });
      }

      return res.status(500).redirect('/500');
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect('/500');
    });
};

module.exports.getAdd = (req, res) => {
  res.render("project/add-edit", {
    pageTitle: "Nouveau Projet",
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
    return res.status(422).render("project/add-edit", {
      pageTitle: "Nouveau Projet",
      errors: req.validation.errors,
      values: {title: project.title, dueDate: project.dueDate, description: project.description},
      editing: false
    });
  }

  return projectRepo
    .createProject(project)
    .then(result => {
      if (!result) {
        req.flash("toast", "Projet non créé...");
        return res.status(403).redirect('/');
      }

      req.flash("toast", "Projet créé avec succès !");
      return res.status(201).redirect("/");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.getEdit = (req, res) => {
  const {projectId} = req.params;
  const userId = req.session.user._id;

  return projectRepo.getProjectById(projectId, userId)
    .then(project => {
      if (project && project.projectOwner.toString() === userId) {
        return res.render("project/add-edit", {
          pageTitle: "Éditer Projet",
          errors: [],
          values: project,
          editing: true
        });
      } else {
        req.flash("toast", "Accès non Autorisé");
        return res.status(403).redirect("/");
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).redirect("/500");
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
    return res.status(422).render("project/add-edit", {
      pageTitle: "Éditer Projet",
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
        return res.status(403).redirect("/");
      }

      req.flash("toast", "Projet mis à jour !");
      return res.status(201).redirect("/projects/" + project.id);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.deleteProject = (req, res) => {
  return projectRepo
    .deleteProject(req.params.projectId, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect("/");
      }
      req.flash("toast", "Projet supprimé avec succès !");
      return res.status(200).redirect("/");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.postInvite = async (req, res) => {
  const {projectId} = req.params;
  const {email} = req.body;
  const {username} = req.body;
  let userFound = null;

  if (email !== "")
    userFound = await userRepo.findUserBy('email', email);
  else if (username !== "")
    userFound = await userRepo.findUserBy('username', username);

  if (userFound !== null) {
    projectRepo
      .isContributorFromProject(projectId, userFound._id)
      .then(result => {
        if (result) {
          req.flash('toast', 'Contributeur déjà ajouté !');
          return res.redirect('/projects/' + projectId);
        } else {
          projectRepo
            .addContributorToProject(projectId, userFound._id, req.session.user._id)
            .then(result => {
              if (!result) {
                req.flash('toast', 'Contributeur non ajouté...');
                return res.redirect('/projects/' + projectId);
              }

              const userEmail = userFound.email;
              return sendMail(userEmail, 'Nouvelle Invitation', 'Bonjour,');
            })
            .then(() => {
              req.flash('toast', 'Contributeur ajouté !');
              return res.redirect('/projects/' + projectId);
            });
        }
      });
  }
};
