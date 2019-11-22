const projectRepo = require('../repositories/project.repository');

const titlesIndex = require('../util/constants').global.titles.index;
const routesError = require('../util/constants').global.routes.error;
const viewsIndex = require('../util/constants').global.views.index;

module.exports.getIndex = (req, res) => {
  if (req.session.user) {
    projectRepo
      .getProjectsByContributorId(req.session.user._id)
      .then(projects => {
        res.render(viewsIndex.connected, {
          pageTitle: titlesIndex,
          projects: projects
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).redirect(routesError["500"]);
      });
  } else {
    res.render(viewsIndex.nonConnected, {
      pageTitle: titlesIndex
    });
  }
};
