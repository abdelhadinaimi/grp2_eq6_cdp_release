const projectRepo = require("../repositories/project.repository");

module.exports.getProjectIssues = (req, res) => {
  projectRepo
    .getProjectIssues(req.params.projectId, req.session.user._id)
    .then(project => {
      if (project) {
        return res.render("project/issues", {
          pageTitle: "Issues",
          errors: [],
          projectId: project._id,
          project
        });
      } else {
        req.flash("toast", "Accès non Autorisé");
        return res.status(403).redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};
