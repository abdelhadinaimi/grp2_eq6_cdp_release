const testRepo = require("../repositories/test.repository");
const { errorGeneralMessages } = require("../util/constants");
const { routes } = require("../util/constants").global;
const titlesTest = require("../util/constants").global.titles.test;
const viewsTest = require("../util/constants").global.views.test;

module.exports.getProjectTests = (req, res) => {
  const userId = req.session.user._id;
  const { projectId, testId } = req.params;
  return testRepo
    .getProjectTests(projectId, userId)
    .then(project => {
      if (project) {
        const isPo = project.projectOwner.toString() === userId.toString();
        const isPm =
          project.collaborators.findIndex(
            collaborator =>
              collaborator._id.toString() === userId.toString() && collaborator.userType === "pm"
          ) >= 0;
        return res.render(viewsTest.tests, {
          pageTitle: titlesTest.tests,
          activeTest: testId,
          url: "tes",
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
