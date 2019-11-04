const global = require('../util/constants').global;

const projectRepo = require('../repositories/project.repository');

module.exports.getIndex = (req, res) => {
  if (req.session.user) {
    projectRepo
      .getProjectsByContributorId(req.session.user._id)
      .then(projects => {
        res.render('index/index-connected', {
          appName: global.app.name,
          pageTitle: 'Accueil',
          username: req.session.user.username,
          projects: projects,
          toasts: req.flash('toast')
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).redirect('/500');
      });
  } else {
    res.render('index/index-not-connected', {
      appName: global.app.name,
      pageTitle: 'Accueil'
    });
  }
};