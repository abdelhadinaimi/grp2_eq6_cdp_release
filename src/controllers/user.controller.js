const userRepo = require("../repositories/user.repository");

const postRegisterUser = (req, res) => {
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

module.exports = {
  postRegisterUser
};
