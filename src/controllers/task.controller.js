const projectRepo = require("../repositories/project.repository");
const { errorGeneralMessages, global: { appRoutes } } = require("../util/constants");
const { viewRoutes } = require("../util/constants").global;

module.exports.getProjectTasks = (req, res) => {
  const userId = req.session.user._id;

  return projectRepo
    .getProjectTasks(req.params.projectId, userId)
    .then(project => {
      if (project) {
        const isPo = (project.projectOwner.toString() === userId.toString());
        const isPm = (project.collaborators.findIndex(collaborator =>
          (collaborator._id.toString() === userId.toString() && collaborator.userType === "pm")) >= 0);

        return res.render("project/tasks", {
          pageTitle: "Tâches",
          errors: [],
          url: 'tas',
          isPo: isPo,
          isPm: isPm,
          project
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.getAdd = (req, res) => {
  return projectRepo
    .getProjectIssues(req.params.projectId, req.session.user._id)
    .then(project => {
      if (project) {
        return res.render("project/add-edit-task", {
          pageTitle: "Nouvelle Tâche",
          errors: [],
          values: undefined,
          projectId: req.params.projectId,
          url: 'tas',
          editing: false,
          project
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.postTask = (req, res) => {
  const task = {
    description: req.body.description,
    definitionOfDone: req.body.definitionOfDone,
    cost: req.body.cost,
    testLink: req.body.testLink
  };

  if (!req.validation.success) {
    return res.status(422).render(viewRoutes.addEditTask, {
      pageTitle: "Nouvelle Tâche",
      errors: req.validation.errors,
      values: task,
      projectId: req.params.projectId,
      project: {id: req.params.projectId},
      url: 'tas',
      editing: false
    });
  }

  return projectRepo.createTask(req.params.projectId, task, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect("/projects/" + req.params.projectId);
      }

      req.flash("toast", "Tâche créée avec succès !");
      return res.status(201).redirect("/projects/" + req.params.projectId + "/tasks");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.getMyTasks = (req, res) => {
  const { projectId } = req.params;
  const userId = req.session.user._id;

  return projectRepo
    .getMyTasks(projectId, userId)
    .then(tasks => {
      return res.send(tasks);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.putTaskState = (req, res) => {
  const projectId = req.params.projectId;
  const redirectUrl = appRoutes.projectTasks(projectId);
  const task = {
    _id: req.params.taskId,
    state: req.body.state
  }

  if (!req.validation.success) {
    req.flash('toast', req.validation.errors[0].state);
    return res.status(403).redirect(redirectUrl);
  }

  return projectRepo
    .updateTaskState(projectId, req.session.user._id, task)
    .then(result => {
      if (!result.success) {
        req.flash('toast', result.error)
        return res.redirect(redirectUrl);
      }
      req.flash('toast', 'Tâche mise à jour !');
      return res.redirect(redirectUrl);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect('/500');
    });
};

module.exports.deleteTask = (req, res) => {
  const { projectId } = req.params;
  const { taskId } = req.params;
  const userId = req.session.user._id;

  projectRepo
    .deleteTask(projectId, taskId, userId)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect("/");
      }
      req.flash("toast", "Tâche supprimée avec succès !");
      return res.status(200).redirect("/projects/" + projectId + "/tasks");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect('/500');
    });
};

