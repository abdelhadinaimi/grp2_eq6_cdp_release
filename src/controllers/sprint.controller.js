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