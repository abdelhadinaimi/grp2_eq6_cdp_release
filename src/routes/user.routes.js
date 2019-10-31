const route = require("express").Router();
const { postRegisterUser, postLoginUser } = require("../controllers/user.controller");
const { validate, userValidations } = require("../config/validations.config");
const { verifyJWT } = require("../config/auth.config");

route.post("/register", userValidations, validate, postRegisterUser);

// only use the first & secound validations ie the email & password
route.post("/login", [userValidations[0], userValidations[1]], validate, postLoginUser);

route.get("/hello", verifyJWT, (req, res) => {
  res.send(req.user);
});
module.exports = route;
