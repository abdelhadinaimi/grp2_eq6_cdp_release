const userRepo = require("../repositories/user.repository");

const {sendMail} = require('../util/mail');

module.exports.getRegisterUser = (req, res) => {
  res.status(200).render('user/register', {
    pageTitle: 'Créer un Compte',
    errors: [],
    values: undefined
  });
};

module.exports.getLoginUser = (req, res) => {
  res.status(200).render('user/login', {
    pageTitle: 'Connexion',
    errors: [],
    values: undefined
  });
};

module.exports.getLogoutUser = (req, res) => {
  req.session.destroy();
  res.status(204).redirect('/');
};

module.exports.getForgotPassword = (req, res) => {
  res.render('user/forgot-password', {
    pageTitle: 'Mot de Passe Oublié',
    info: req.flash('info')
  })
};

module.exports.postRegisterUser = (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  if (!req.validation.success) {
    return res.status(422).render('user/register', {
      pageTitle: 'Créer un Compte',
      errors: req.validation.errors,
      values: {
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword
      }
    });
  }

  userRepo
    .createUser(user)
    .then(result => {
      if (!result.success) {
        return res.status(401).render('user/register', {
          pageTitle: 'Créer un Compte',
          errors: result.errors,
          values: {
            username: user.username,
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword
          }
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
          pageTitle: 'Connexion',
          errors: [result.errors],
          values: {email: user.email, password: user.password}
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

module.exports.postForgotPassword = (req, res) => {
  userRepo
    .generateResetPasswordToken(req.body.email)
    .then(token => {
      sendMail(req.body.email, 'Sujet du Message', token);
    })
    .catch(err => {
      console.log(err);
    });

  req.flash('info', 'Si votre compte existe bien, un mail vous a été envoyé pour réinitialiser votre mot de passe.');
  res.redirect('/forgot-password');
};
