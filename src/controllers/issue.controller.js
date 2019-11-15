const projectRepo = require("../repositories/project.repository");
const {errorGeneralMessages, global:{viewRoutes}} = require("../util/constants");

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
        return res.render("project/add-edit-issue", {
          pageTitle: "Nouvelle Issue",
          errors: [],
          values: undefined,
          projectId: req.params.projectId,
          url: 'iss',
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

module.exports.postIssue = (req, res) => {
  const issue = {
    userType: req.body.userType,
    userGoal: req.body.userGoal,
    userReason: req.body.userReason,
    difficulty: req.body.difficulty,
    storyId: req.body.storyId,
    priority: req.body.priority,
    testLink: req.body.testLink
  };

  if (!req.validation.success) {
    return res.status(422).render(viewRoutes.addEditIssue, {
      pageTitle: "Nouvelle Issue",
      errors: req.validation.errors,
      values: issue,
      projectId: req.params.projectId,
      project: {id: req.params.projectId},
      url: 'iss',
      editing: false
    });
  }

  return projectRepo.createIssue(req.params.projectId, issue, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect("/projects/" + req.params.projectId);
      }

      req.flash("toast", "Issue créée avec succès !");
      return res.status(201).redirect("/projects/" + req.params.projectId + "/issues");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.getEdit = (req, res) => {
  const {issueId} = req.params;

  projectRepo
    .getProjectIssues(req.params.projectId, req.session.user._id)
    .then(project => {
      if (!project) {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect("/");
      }

      const issue = project.issues.find(issue => issue._id.toString() === issueId.toString());

      if (!issue) {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect("/");
      }

      return res.render("project/add-edit-issue", {
        pageTitle: "Éditer Issue",
        errors: [],
        values: issue,
        projectId: req.params.projectId,
        url: 'iss',
        editing: true,
        project
      });
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
    difficulty: req.body.difficulty,
    priority: req.body.priority,
    testLink: req.body.testLink
  };

  if (!req.validation.success) {
    return res.status(422).render(viewRoutes.addEditIssue, {
      pageTitle: "Éditer Issue",
      errors: req.validation.errors,
      values: issue,
      projectId: req.params.projectId,
      project: {id: req.params.projectId},
      url: 'iss',
      editing: true
    });
  }
  return projectRepo
    .updateIssue(req.params.projectId, issue, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect("/projects/" + req.params.projectId + "/issues");
      }

      req.flash("toast", "Issue mise à jour !");
      return res.status(201).redirect("/projects/" + req.params.projectId + "/issues");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.deleteIssue = (req, res) => {
  const {projectId} = req.params;
  const {issueId} = req.params;
  const userId = req.session.user._id;

  projectRepo
    .deleteIssue(projectId, issueId, userId)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect("/");
      }
      req.flash("toast", "Issue supprimée avec succès !");
      return res.status(200).redirect("/projects/" + projectId + "/issues");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect('/500');
    });
};
