const sprintRepo = require("../repositories/sprint.repository");
const projectRepo = require("../repositories/project.repository");

const { errorGeneralMessages } = require("../util/constants");
const titlesSprint = require('../util/constants').global.titles.sprint;
const { routes } = require('../util/constants').global;
const viewsSprint = require('../util/constants').global.views.sprint;

module.exports.getProjectSprints = (req, res) => {
  const userId = req.session.user._id;
  const { projectId } = req.params;
  const { sprintId } = req.params;

  return sprintRepo
    .getProjectSprints(projectId, userId)
    .then(project => {
      if (project) {
        const isPo = (project.projectOwner.toString() === userId.toString());
        const isPm = (project.collaborators.findIndex(collaborator =>
          (collaborator._id.toString() === userId.toString() && collaborator.userType === "pm")) >= 0);

        return res.render(viewsSprint.sprints, {
          pageTitle: titlesSprint.sprints,
          activeSprint: sprintId,
          url: 'spr',
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
  const { projectId } = req.params;

  return projectRepo
    .hasAuthorizationOnProject(projectId, req.session.user._id, ["po", "pm"])
    .then(result => {
      if (result) {
        return res.render(viewsSprint.addEdit, {
          pageTitle: titlesSprint.add,
          errors: [],
          values: undefined,
          projectId: projectId,
          url: 'spr',
          editing: false,
          project: { id: projectId }
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.sprint.sprints(projectId));
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.postSprint = (req, res) => {
  const sprint = {
    id: req.body.id,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description
  };

  if (!req.validation.success) {
    return res.status(422).render(viewsSprint.addEdit, {
      pageTitle: titlesSprint.add,
      errors: req.validation.errors,
      values: sprint,
      projectId: req.params.projectId,
      project: { id: req.params.projectId },
      url: 'spr',
      editing: false
    });
  }

  return sprintRepo.createSprint(req.params.projectId, sprint, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.project.project(req.params.projectId));
      }

      req.flash("toast", "Sprint créé avec succès !");
      return res.status(201).redirect(routes.sprint.sprints(req.params.projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.getEdit = (req, res) => {
  const { projectId } = req.params;
  const { sprintId } = req.params;

  return projectRepo
    .hasAuthorizationOnProject(projectId, req.session.user._id, ["po", "pm"])
    .then(result => {
      if (result) {
        return sprintRepo
          .getSprintById(projectId, sprintId)
          .then(sprint => {
            if (sprint) {
              return res.render(viewsSprint.addEdit, {
                pageTitle: titlesSprint.edit,
                errors: [],
                values: sprint,
                projectId: projectId,
                url: 'spr',
                editing: true,
                project: { id: projectId }
              });
            } else {
              req.flash("toast", errorGeneralMessages.accessNotAuthorized);
              return res.status(403).redirect(routes.sprint.sprints(projectId));
            }
          });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.sprint.sprints(projectId));
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.putEdit = (req, res) => {
  const sprint = {
    _id: req.params.sprintId,
    id: req.body.id,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
  };

  if (!req.validation.success) {
    return res.status(422).render(viewsSprint.addEdit, {
      pageTitle: titlesSprint.edit,
      errors: req.validation.errors,
      values: sprint,
      projectId: req.params.projectId,
      project: {id: req.params.projectId},
      url: 'spr',
      editing: true
    });
  }

  return sprintRepo
    .updateSprint(req.params.projectId, sprint, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.sprint.sprints(req.params.projectId));
      }

      req.flash("toast", "Sprint mis à jour !");
      return res.status(201).redirect(routes.sprint.sprints(req.params.projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.deleteSprint = (req, res) => {
  return sprintRepo
    .deleteSprint(req.params.projectId, req.params.sprintId, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect(routes.index);
      }
      req.flash("toast", "Sprint supprimé avec succès !");
      return res.status(200).redirect(routes.index);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};
