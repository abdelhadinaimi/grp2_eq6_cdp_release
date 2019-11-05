const userRepo = require("../repositories/user.repository");
const {global} = require('../util/constants');

module.exports.getRegisterUser = (req, res) => {
  res.status(200).render('user/register', {
    appName: global.app.name,
    pageTitle: 'Créer un Compte',
    errors: [],
    values: undefined,
    csrfToken: req.csrfToken()
  });
};

module.exports.getLoginUser = (req, res) => {
  res.status(200).render('user/login', {
    appName: global.app.name,
    pageTitle: 'Connexion',
    errors: [],
    values: undefined,
    toasts: req.flash('toast'),
    csrfToken: req.csrfToken()
  });
};

module.exports.getLogoutUser = (req, res) => {
  req.session.destroy();
  res.status(204).redirect('/');
};

module.exports.postRegisterUser = (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  if (!req.validation.success) {
    return res.status(422).render('user/register', {
      appName: global.app.name,
      pageTitle: 'Créer un Compte',
      errors: req.validation.errors,
      values: {username: user.username, email: user.email, password: user.password},
      csrfToken: req.csrfToken()
    });
  }

  userRepo
    .createUser(user)
    .then(result => {
      if (!result.success) {
        return res.status(401).render('user/register', {
          appName: global.app.name,
          pageTitle: 'Créer un Compte',
          errors: result.errors,
          values: {username: user.username, email: user.email, password: user.password},
          csrfToken: req.csrfToken()
        });
      }

      req.flash('toast', 'Compte créé avec succès !');
      return res.status(201).redirect('/login');
    })
    .catch(error => {
      console.error(error);
      res.status(500).redirect('/500');
    });
};

module.exports.postLoginUser = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  userRepo
    .checkLogin(user)
    .then(result => {
      if (!result.success) {
        return res.status(401).render('user/login', {
          appName: global.app.name,
          pageTitle: 'Connexion',
          errors: [result.errors],
          values: {email: user.email, password: user.password},
          toasts: req.flash('toast'),
          csrfToken: req.csrfToken()
        });
      }

      req.flash('toast', 'Bienvenue ' + result.user.username + ' !');
      req.session.user = result.user;
      res.redirect('/');
    })
    .catch(error => {
      console.error(error);
      res.status(500).redirect('/500');
    });
};
