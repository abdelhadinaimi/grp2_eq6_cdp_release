const releaseRepo = require("../repositories/release.repository");

const { errorGeneralMessages } = require("../util/constants");
const { routes } = require('../util/constants').global;
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
        const isPm = (project.collaborators.findIndex(collaborator =>
          (collaborator._id.toString() === userId.toString() && collaborator.userType === "pm")) >= 0);
        return res.render(viewsRelease.releases, {
          pageTitle: titlesRelease.issues,
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
  res.send("getAdd");
};

module.exports.postRelease = (req, res) => {
  res.send("postRelease");
};

module.exports.getEdit = (req, res) => {
  res.send("getEdit");
};

module.exports.putEdit = (req, res) => {
  res.send("putEdit");
};

module.exports.deleteRelease = (req, res) => {
  res.send("deleteRelease");
};
