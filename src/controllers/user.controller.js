const userRepo = require("../repositories/user.repository");

module.exports.postRegisterUser = (req, res) => {
  // TODO validate fields
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };
  console.log(req.body);
  userRepo.createUser(user)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send();
    });
};
