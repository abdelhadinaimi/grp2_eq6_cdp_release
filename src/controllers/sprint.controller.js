const sprintRepo = require("../repositories/sprint.repository");
const projectRepo = require("../repositories/project.repository");

const { errorGeneralMessages } = require("../util/constants");
const titlesSprint = require('../util/constants').global.titles.sprint;
const { routes } = require('../util/constants').global;
const viewsSprint = require('../util/constants').global.views.sprint;

module.exports.getProjectSprints = (req, res) => {
    const userId = req.session.user._id;
    const {projectId} = req.params;
    const {sprintId} = req.params;
      
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