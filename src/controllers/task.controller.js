const taskRepo = require("../repositories/task.repository");
const projectRepo = require("../repositories/project.repository");

const {errorGeneralMessages} = require("../util/constants");
const titlesTask = require('../util/constants').global.titles.task;
const {routes} = require('../util/constants').global;
const viewsTask = require('../util/constants').global.views.task;

module.exports.getAdd = (req, res) => {
  const {projectId} = req.params;
  const {sprintId} = req.params;

  return projectRepo
    .hasAuthorizationOnProject(projectId, req.session.user._id, ["po", "pm"])
    .then(result => {
      if (result) {
        return res.render(viewsTask.addEdit, {
          pageTitle: titlesTask.add,
          errors: [],
          values: undefined,
          projectId,
          sprintId,
          url: 'spr',
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

module.exports.getEdit = (req, res) => {
  const {projectId} = req.params;
  const {sprintId} = req.params;
  const {taskId} = req.params;

  return projectRepo
    .hasAuthorizationOnProject(projectId, req.session.user._id, ["po", "pm"])
    .then(result => {
      if (result) {
        return taskRepo
          .getTaskById(projectId, taskId)
          .then(task => {
            if (task) {
              return res.render(viewsTask.addEdit, {
                pageTitle: titlesTask.edit,
                errors: [],
                values: task,
                url: 'tas',
                editing: true,
                project: {id: projectId},
                projectId,
                sprintId
              });
            } else {
              req.flash("toast", errorGeneralMessages.accessNotAuthorized);
              return res.status(403).redirect(routes.task.tasks(projectId));
            }
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
    testLink: req.body.testLink,
    linkedSprint: req.params.sprintId
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

  return taskRepo
    .createTask(req.params.projectId, task, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.project(req.params.projectId));
      }

      req.flash("toast", "Tâche créée avec succès !");
      return res.status(201).redirect(routes.sprint.sprint(req.params.projectId, req.params.sprintId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.putEdit = (req, res) => {
  const {projectId} = req.params;
  const {taskId} = req.params;

  const task = {
    _id: taskId,
    description: req.body.description,
    definitionOfDone: req.body.definitionOfDone,
    cost: req.body.cost,
    testLink: req.body.testLink,
    linkedIssues: req.body.linkedIssues ? req.body.linkedIssues : [],
    assignedContributors: req.body.assignedContributors ? req.body.assignedContributors : []
  };

  if (!req.validation.success) {
    return res.status(422).render(viewsTask.addEdit, {
      pageTitle: titlesTask.edit,
      errors: req.validation.errors,
      values: task,
      projectId: projectId,
      project: {id: projectId},
      url: 'tas',
      editing: true
    });
  }

  return taskRepo
    .updateTask(req.params.projectId, task)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.task.task(projectId, req.params.sprintId, taskId));
      }

      req.flash("toast", "Tâche modifiée avec succès !");
      return res.status(201).redirect(routes.task.task(projectId, req.params.sprintId, taskId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.putTaskState = (req, res) => {
  const projectId = req.params.projectId;
  const task = {
    _id: req.params.taskId,
    state: req.body.state
  };

  if (!req.validation.success) {
    return res.status(403).send(req.validation.errors[0].state);
  }

  return taskRepo
    .updateTaskState(projectId, req.session.user._id, task)
    .then(result => {
      if (!result.success) {
        req.flash('toast', result.error);
        return res.status(400).send(result.error);
      }
      return res.send('Tâche mise à jour !');
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(routes.error["500"]);
    });
};

module.exports.deleteTask = (req, res) => {
  const {projectId} = req.params;
  const {sprintId} = req.params;
  const {taskId} = req.params;
  const userId = req.session.user._id;

  taskRepo
    .deleteTask(projectId, taskId, userId)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect(routes.index);
      }
      req.flash("toast", "Tâche supprimée avec succès !");
      return res.status(200).redirect(routes.task.tasks(projectId, sprintId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};
