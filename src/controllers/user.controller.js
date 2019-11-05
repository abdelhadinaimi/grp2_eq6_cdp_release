const userRepo = require("../repositories/user.repository");

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
