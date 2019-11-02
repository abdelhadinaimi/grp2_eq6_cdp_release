const global = require('../util/constants').global;

module.exports.getIndex = (req, res) => {
  if (req.session.user) {
    // Get projects with this contributor user
    // const projects = [];
    const projects = [
      {
        title: 'Titre du Projet',
        description: 'Ceci est la description du projet !',
        beginDate: '30/10/2019',
        endDate: '15/01/2020',
        contributorNb: 3,
        completion: 65
      }
    ];

    res.render('index/index-connected', {
      appName: global.app.name,
      pageTitle: 'Accueil',
      username: req.session.user.username,
      projects: projects,
      toasts: req.flash('toast')
    });
  } else {
    res.render('index/index-not-connected', {
      appName: global.app.name,
      pageTitle: 'Accueil'
    });
  }
};