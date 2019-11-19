const taskRepo = require("../repositories/task.repository");
const projectRepo = require("../repositories/project.repository");

const {errorGeneralMessages} = require("../util/constants");
const titlesTask = require('../util/constants').global.titles.task;
const {routes} = require('../util/constants').global;
const viewsTask = require('../util/constants').global.views.task;

module.exports.getProjectTasks = (req, res) => {
  const userId = req.session.user._id;

  return taskRepo
    .getProjectTasks(req.params.projectId, userId)
    .then(project => {
      if (project) {
        const isPo = (project.projectOwner.toString() === userId.toString());
        const isPm = (project.collaborators.findIndex(collaborator =>
          (collaborator._id.toString() === userId.toString() && collaborator.userType === "pm")) >= 0);

        return res.render(viewsTask.tasks, {
          pageTitle: titlesTask.tasks,
          errors: [],
          url: 'tas',
          isPo: isPo,
          isPm: isPm,
          project
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.index);
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.getAdd = (req, res) => {
  const {projectId} = req.params;

  return projectRepo
    .hasAuthorizationOnProject(projectId, req.session.user._id, ["po", "pm"])
    .then(project => {
      if (project) {
        return res.render(viewsTask.addEdit, {
          pageTitle: titlesTask.add,
          errors: [],
          values: undefined,
          projectId: projectId,
          url: 'tas',
          editing: false,
          project: {id: projectId}
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.task.tasks(projectId));
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
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
    return res.status(422).render(viewsTask.addEdit, {
      pageTitle: titlesTask.add,
      errors: req.validation.errors,
      values: task,
      projectId: req.params.projectId,
      project: {id: req.params.projectId},
      url: 'tas',
      editing: false
    });
  }

  taskRepo.createTask(req.params.projectId, task, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.project(req.params.projectId));
      }

      req.flash("toast", "Tâche créée avec succès !");
      return res.status(201).redirect(routes.task.tasks(req.params.projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.getMyTasks = (req, res) => {
  const { projectId } = req.params;
  const userId = req.session.user._id;

  return taskRepo
    .getMyTasks(projectId, userId)
    .then(tasks => {
      return res.send(tasks);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.putTaskState = (req, res) => {
  const projectId = req.params.projectId;
  const redirectUrl = routes.task.tasks(projectId);
  const task = {
    _id: req.params.taskId,
    state: req.body.state
  };

  if (!req.validation.success) {
    req.flash('toast', req.validation.errors[0].state);
    return res.status(403).redirect(redirectUrl);
  }

  return taskRepo
    .updateTaskState(projectId, req.session.user._id, task)
    .then(result => {
      if (!result.success) {
        req.flash('toast', result.error);
        return res.redirect(redirectUrl);
      }
      req.flash('toast', 'Tâche mise à jour !');
      return res.redirect(redirectUrl);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.deleteTask = (req, res) => {
  const { projectId } = req.params;
  const { taskId } = req.params;
  const userId = req.session.user._id;
  console.log("deleteTask" + taskId);

  taskRepo
    .deleteTask(projectId, taskId, userId)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect(routes.index);
      }
      req.flash("toast", "Tâche supprimée avec succès !");
      return res.status(200).redirect(routes.task.tasks(projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};
