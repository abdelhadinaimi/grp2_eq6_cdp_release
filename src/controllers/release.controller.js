const releaseRepo = require("../repositories/release.repository");
const projectRepo = require("../repositories/project.repository");
const { errorGeneralMessages } = require("../util/constants");
const { routes } = require("../util/constants").global;
const titlesRelease = require("../util/constants").global.titles.release;
const viewsRelease = require("../util/constants").global.views.release;

module.exports.getProjectReleases = (req, res) => {
  const userId = req.session.user._id;
  const { projectId, releaseId } = req.params;
  return releaseRepo
    .getProjectReleases(projectId, userId)
    .then(project => {
      if (project) {
        const isPo = project.projectOwner.toString() === userId.toString();
        const isPm =
          project.collaborators.findIndex(
            collaborator =>
              collaborator._id.toString() === userId.toString() && collaborator.userType === "pm"
          ) >= 0;
        return res.render(viewsRelease.releases, {
          pageTitle: titlesRelease.releases,
          activeRelease: releaseId,
          url: "rel",
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
        return res.render(viewsRelease.addEdit, {
          pageTitle: viewsRelease.add,
          errors: [],
          values: undefined,
          projectId: projectId,
          url: "rel",
          editing: false,
          project: { id: projectId }
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.release.releases(projectId));
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.postRelease = (req, res) => {
  const release = {
    version: req.body.version,
    description: req.body.description,
    downloadLink: req.body.downloadLink,
    docLink: req.body.docLink
  };

  if (!req.validation.success) {
    return res.status(422).render(release.addEdit, {
      pageTitle: titlesRelease.add,
      errors: req.validation.errors,
      values: release,
      projectId: req.params.projectId,
      project: { id: req.params.projectId },
      url: "rel",
      editing: false
    });
  }
  return releaseRepo
    .createRelease(req.params.projectId, release, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.project.project(req.params.projectId));
      }

      req.flash("toast", "Release créée avec succès !");
      return res.status(201).redirect(routes.release.releases(req.params.projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.getEdit = (req, res) => {
  const {releaseId} = req.params;

  releaseRepo
    .getProjectReleases(req.params.projectId, req.session.user._id)
    .then(project => {
      if (!project) {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.index);
      }

      const release = project.releases.find(release => release._id.toString() === releaseId.toString());

      if (!release) {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.index);
      }

      return res.render(viewsRelease.addEdit, {
        pageTitle: titlesRelease.edit,
        errors: [],
        values: release,
        projectId: req.params.projectId,
        url: 'rel',
        editing: true,
        project
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.putEdit = (req, res) => {
  const release = {
    _id: req.params.releaseId,
    version: req.body.version,
    description: req.body.description,
    downloadLink: req.body.downloadLink,
    docLink: req.body.docLink
  };

  if (!req.validation.success) {
    return res.status(422).render(viewsRelease.addEdit, {
      pageTitle: titlesRelease.edit,
      errors: req.validation.errors,
      values: release,
      projectId: req.params.projectId,
      project: {id: req.params.projectId},
      url: 'rel',
      editing: true
    });
  }
  return releaseRepo
    .updateRelease(req.params.projectId, release, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.release.releases(req.params.projectId));
      }

      req.flash("toast", "Release mise à jour !");
      return res.status(201).redirect(routes.release.releases(req.params.projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.deleteRelease = (req, res) => {
  const { projectId } = req.params;
  const { releaseId } = req.params;
  const userId = req.session.user._id;

  releaseRepo
    .deleteRelease(projectId, releaseId, userId)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect(routes.index);
      }
      req.flash("toast", "Release supprimée avec succès !");
      return res.status(200).redirect(routes.release.releases(projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};
