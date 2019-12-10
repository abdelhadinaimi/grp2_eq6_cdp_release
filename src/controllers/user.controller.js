const userRepo = require("../repositories/user.repository");
const {sendMail} = require('../util/mail');

const titlesUser = require('../util/constants').global.titles.user;
const {routes} = require('../util/constants').global;
const viewsUser = require('../util/constants').global.views.user;

module.exports.getRegisterUser = (req, res) => {
  res.status(200).render(viewsUser.register, {
    pageTitle: titlesUser.register,
    errors: [],
    values: undefined
  });
};

module.exports.getLoginUser = (req, res) => {
  res.status(200).render(viewsUser.login, {
    pageTitle: titlesUser.login,
    errors: [],
    values: undefined
  });
};

module.exports.getLogoutUser = (req, res) => {
  req.session.destroy();
  res.status(204).redirect(routes.index);
};

module.exports.getForgotPassword = (req, res) => {
  res.render(viewsUser.forgotPassword, {
    pageTitle: titlesUser.forgotPassword,
    info: req.flash('info')
  })
};

module.exports.getResetPassword = (req, res) => {
  res.render(viewsUser.resetPassword, {
    pageTitle: titlesUser.resetPassword,
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
    return res.status(422).render(viewsUser.register, {
      pageTitle: titlesUser.register,
      errors: req.validation.errors,
      values: user
    });
  }

  return userRepo
    .upsertUser(user)
    .then(result => {
      if (!result.success) {
        user.password = user.confirmPassword;
        return res.status(401).render(viewsUser.register, {
          pageTitle: titlesUser.register,
          errors: result.errors,
          values: user
        });
      }

      req.flash('toast', 'Compte créé avec succès !');
      return res.status(201).redirect(routes.user.login);
    })
    .catch(error => {
      console.error(error);
      res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.postLoginUser = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  return userRepo
    .checkLogin(user)
    .then(result => {
      if (!result.success) {
        return res.status(401).render(viewsUser.login, {
          pageTitle: titlesUser.login,
          errors: [result.errors],
          values: user
        });
      }

      req.flash('toast', 'Bienvenue ' + result.user.username + ' !');
      req.session.user = result.user;
      const url = (req.session.url) ? req.session.url : routes.index;
      req.session.url = null;
      return res.redirect(url);
    })
    .catch(error => {
      console.error(error);
      return res.status(500).redirect(routes.error["500"]);
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
            Veuillez cliquer sur ce lien pour l'effectuer : <a href="http://${req.get('host')}/reset-password/${token}">Réinitialiser</a><br>
            Bonne journée !
        </p>`;
        sendMail(req.body.email, 'Réinitialisation de votre mot de passe', message);
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });

  req.flash('info', 'Si votre compte existe bien, un mail vous a été envoyé pour réinitialiser votre mot de passe.');
  res.redirect(routes.user.forgotPassword);
};

module.exports.postResetPassword = (req, res) => {
  const {token} = req.params;
  const {password} = req.body;
  const {confirmPassword} = req.body;

  if (!req.validation.success) {
    return res.status(422).render(viewsUser.resetPassword, {
      pageTitle: titlesUser.resetPassword,
      token: token,
      errors: req.validation.errors,
      values: {
        password: password,
        confirmPassword: confirmPassword
      }
    });
  }

  return userRepo
    .resetPassword(token, password)
    .then(result => {
      if (!result.success) {
        return res.redirect(routes.index);
      }
      req.flash('toast', 'Le mot de passe a bien été réinitialisé.');
      return res.redirect(routes.user.login);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    })
};

module.exports.getAccount = (req, res) => {
  return userRepo
    .getUser(req.session.user._id)
    .then(result => {
      if (result.success) {
        return res.render(viewsUser.account, {
          pageTitle: titlesUser.account,
          errors: [],
          url: 'iss',
          values: result.user
        });
      } else {
        req.flash("toast", "Accès non-autorisé !");
        return res.status(403).redirect(routes.index);
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
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
    return res.status(422).render(viewsUser.account, {
      pageTitle: titlesUser.account,
      errors: req.validation.errors,
      values: {
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword
      }
    });
  }

  return userRepo
    .upsertUser(user)
    .then(result => {
      if (!result.success) {
        return res.status(401).render(viewsUser.account, {
          pageTitle: titlesUser.account,
          errors: result.errors,
          values: {
            username: user.username,
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword
          }
        });
      }

      req.session.user.username = user.username;
      req.flash('toast', 'Vos modifications ont bien été prises en compte !');
      return res.status(201).redirect(routes.user.account);
    })
    .catch(error => {
      console.error(error);
      return res.status(500).redirect(routes.error["500"]);
    });
};
