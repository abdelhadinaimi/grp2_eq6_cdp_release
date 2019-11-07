const projectRepo = require("../repositories/project.repository");

module.exports.getProjectIssues = (req, res) => {
  projectRepo
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
        req.flash("toast", "Accès non Autorisé");
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
    priority: "low"
  }
  projectRepo.createIssue(req.params.projectId,issue,req.session.user._id)
  .then(result => {
    console.log(result);
    res.send("OK");
  });
}

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
  projectRepo
    .updateIssue(req.params.projectId,issue,req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect("/");
      }

      req.flash("toast", "Issue mise à jour !");
      return res.status(201).redirect("/projects/" + req.params.projectId);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};