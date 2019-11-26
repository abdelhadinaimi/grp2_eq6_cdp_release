const docRepo = require('../repositories/doc.repository');

const {errorGeneralMessages} = require('../util/constants');
const titlesDoc = require('../util/constants').global.titles.doc;
const routes = require('../util/constants').global.routes;
const viewsDoc = require('../util/constants').global.views.doc;

module.exports.getDoc = (req, res) => {
  const {projectId} = req.params;
  const userId = req.session.user._id;

  docRepo
    .getDocumentation(projectId, userId)
    .then(project => {
      if (project) {
        return res.render(viewsDoc.doc, {
          pageTitle: titlesDoc.doc,
          url: 'doc',
          isPo: project.isPo,
          isPm: project.isPm,
          project
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.index);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.postAddDoc = (req, res) => {
  return res.send(req.body.version, req.body.type, req.body.doc);
};
