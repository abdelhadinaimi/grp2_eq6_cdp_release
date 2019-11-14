const os = require('os');

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

module.exports.getResetPassword = (req, res) => {
  res.render('user/reset-password', {
    pageTitle: 'Réinitialisation Mot de Passe',
    token: req.params.token,
    errors: [],
    values: undefined
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
    .upsertUser(user)
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
      if (token) {
        const message = `
        <p>
            Bonjour,<br>
            Vous avez demandé la réinitialisation de votre mot de passe.<br>
            Veuillez cliquer sur ce lien pour l'effectuer : <a href="http://localhost:8080/reset-password/${token}">Réinitialiser</a><br>
            Bonne journée !
        </p>`;
        sendMail(req.body.email, 'Réinitialisation de votre mot de passe', message);
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect('/500');
    });

  req.flash('info', 'Si votre compte existe bien, un mail vous a été envoyé pour réinitialiser votre mot de passe.');
  res.redirect('/forgot-password');
};

module.exports.postResetPassword = (req, res) => {
  const {token} = req.params;
  const {password} = req.body;
  const {confirmPassword} = req.body;

  if (!req.validation.success) {
    return res.status(422).render('user/reset-password', {
      pageTitle: 'Réinitialisation Mot de Passe',
      token: token,
      errors: req.validation.errors,
      values: {
        password: password,
        confirmPassword: confirmPassword
      }
    });
  }

  userRepo
    .resetPassword(token, password)
    .then(result => {
      if (!result.success) {
        return res.redirect('/');
      }
      req.flash('toast', 'Mot de Passe Réinitialisé');
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
      res.status(500).redirect('/500');
    })
};

module.exports.getAccount = (req, res) => {
  return userRepo
    .getUser(req.session.user._id)
    .then(result => {
      if (result.success) {
        return res.render("user/account", {
          pageTitle: "Mon compte",
          errors: [],
          url: 'iss',
          values: result.user
        });
      } else {
        req.flash("toast", "Accès non-autorisé");
        return res.status(403).redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect("/500");
    });
};

module.exports.postAccount = (req, res) => {
  const user = {
    _id: req.session.user._id,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };
  if (!req.validation.success && (user.password || user.confirmPassword)) {
    return res.status(422).render('user/account', {
      pageTitle: 'Mon Compte',
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
    .upsertUser(user)
    .then(result => {
      if (!result.success) {
        return res.status(401).render('user/account', {
          pageTitle: 'Mon Compte',
          errors: result.errors,
          values: {
            username: user.username,
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword
          }
        });
      }

      req.flash('toast', 'Compte modifié avec succès !');
      return res.status(201).redirect('/account');
    })
    .catch(error => {
      console.error(error);
      res.status(500).redirect('/500');
    });
};
