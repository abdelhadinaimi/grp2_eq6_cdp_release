const docRepo = require('../repositories/doc.repository');

const {errorGeneralMessages, errorDocsMessages} = require('../util/constants');
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
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.postAddDoc = (req, res) => {
  const {projectId} = req.params;
  let msg = errorDocsMessages.failed;
  let status = 403;

  if (!req.file) {
    req.flash("toast", msg);
    return res.status(status).redirect(routes.doc.docs(projectId));
  }

  const doc = {
    category: req.body.type,
    version: req.body.version,
    docUrl: 'doc_storage/' + req.file.filename
  };

  return docRepo
    .addDocumentation(projectId, doc)
    .then(result => {
      if (result) {
        msg = errorDocsMessages.success;
        status = 201;
      }

      req.flash("toast", msg);
      return res.status(status).redirect(routes.doc.docs(projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};
