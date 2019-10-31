const userRepo = require("../repositories/user.repository");

module.exports.postRegisterUser = (req, res) => {
  // TODO validate fields
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };
  userRepo
    .createUser(user)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send();
    });
};

module.exports.postLoginUser = (req, res) => {
  // TODO validate fields
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  userRepo
    .checkLogin(user)
    .then(result => {
      if (!result.success) {
        return res
          .status(401)
          .send(result)
          .end();
      }
      res.cookie("token", result.token, { maxAge: process.env.JWT_EXP * 1000, httpOnly: true });
      res.send({ success: true, user: result.user }).end();
    })
    .catch(error => {
      console.error(error);
      res.status(500).send();
    });
};
