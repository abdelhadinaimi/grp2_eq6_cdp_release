const projectRepo = require("../repositories/project.repository");
const {errorGeneralMessages, global:{viewRoutes}} = require("../util/constants");

module.exports.getProjectTasks = (req, res) => {
    return projectRepo
      .getProjectTasks(req.params.projectId, req.session.user._id)
      .then(project => {
        if (project) {
          return res.render("project/tasks", {
            pageTitle: "Tâches",
            errors: [],
            url: 'tas',
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

module.exports.getMyTasks = (req, res) => {
  const {projectId} = req.params;
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