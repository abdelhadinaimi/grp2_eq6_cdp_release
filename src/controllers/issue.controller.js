const projectRepo = require("../repositories/project.repository");

module.exports.getProjectIssues = (req, res) => {
  return projectRepo
    .getProjectIssues(req.params.projectId, req.session.user._id)
    .then(project => {
      if (project) {
        return res.render("project/issues", {
          pageTitle: "Issues",
          errors: [],
          url: 'iss',
          project
        });
      } else {
        req.flash("toast", "Accès non-autorisé");
        return res.status(403).redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.postIssue = (req, res) => {
  const issue = {
    userType: req.body.userType,
    userGoal: req.body.userGoal,
    userReason: req.body.userReason,
    storyId: req.body.storyId,
    priority: req.body.priority,
    testLink: req.body.testLink
  }
  if (!req.validation.success) {
    return res.status(422).render("project/add-edit-issue", {
      pageTitle: "Éditer Issue",
      errors: req.validation.errors,
      values: issue,
      editing: true
    });
  }
<<<<<<< HEAD
  projectRepo.createIssue(req.params.projectId, issue, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect("/projects/" + req.params.projectId);
      }
=======
  return projectRepo.createIssue(req.params.projectId,issue,req.session.user._id)
  .then(result => {
    if (!result.success) {
      req.flash("toast", result.error);
      return res.status(403).redirect("/projects/" + req.params.projectId);
    }
>>>>>>> 23603e6a5c55f106c7837438dc39fac685835ec3

      req.flash("toast", "Issue créée avec succès !");
      return res.status(201).redirect("/projects/" + req.params.projectId);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
}

module.exports.getAdd = (req, res) => {
  projectRepo
    .getProjectIssues(req.params.projectId, req.session.user._id)
    .then(project => {
      if (project) {
        res.render("project/add-edit-issue", {
          pageTitle: "Nouvelle Issue",
          errors: [],
          values: undefined,
          projectId: req.params.projectId,
          url: 'iss',
          editing: false,
          project
        });
      } else {
        req.flash("toast", "Accès non-autorisé");
        return res.status(403).redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.postAdd = (req, res) => {
  const issue = {
    _id: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    projectOwner: req.session.user
  };

  if (!req.validation.success) {
    return res.status(422).render("project/add-edit", {
      pageTitle: "Nouveau Projet",
      errors: req.validation.errors,
      values: { title: project.title, dueDate: project.dueDate, description: project.description },
      editing: false
    });
  }

  projectRepo
    .createProject(project)
    .then(result => {
      if (!result) {
        req.flash("toast", "Projet non créé...");
        res.status(403).redirect('/');
      }

      req.flash("toast", "Projet créé avec succès !");
      return res.status(201).redirect("/");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.putEdit = (req, res) => {
  const issue = {
    _id: req.params.issueId,
    userReason: req.body.userReason,
    userType: req.body.userType,
    userGoal: req.body.userGoal,
    storyId: req.body.storyId,
    cost: req.body.cost,
    priority: req.body.priority
  }
  if (!req.validation.success) {
    return res.status(422).render("project/add-edit-issue", {
      pageTitle: "Éditer Issue",
      errors: req.validation.errors,
      values: issue,
      editing: true
    });
  }
  return projectRepo
    .updateIssue(req.params.projectId,issue,req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect("/projects/" + req.params.projectId);
      }

      req.flash("toast", "Issue mise à jour !");
      return res.status(201).redirect("/projects/" + req.params.projectId);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};
