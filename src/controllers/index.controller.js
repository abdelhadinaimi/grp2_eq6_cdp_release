const projectRepo = require('../repositories/project.repository');

module.exports.getIndex = (req, res) => {
  if (req.session.user) {
    projectRepo
      .getProjectsByContributorId(req.session.user._id)
      .then(projects => {
        res.render('index/index-connected', {
          pageTitle: 'Accueil',
          projects: projects
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).redirect('/500');
      });
  } else {
    res.render('index/index-not-connected', {
      pageTitle: 'Accueil'
    });
  }
};