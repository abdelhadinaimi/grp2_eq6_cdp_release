const route = require("express").Router();
const userController = require("../controllers/user.controller");
const { validate, userValidations } = require("../config/validations.config");

route.get('/register', userController.getRegisterUser);

route.get('/login', userController.getLoginUser);

route.post("/register", userValidations, validate, userController.postRegisterUser);

// only use the first & second validations ie the email & password
route.post("/login", [userValidations[0], userValidations[1]], validate, userController.postLoginUser);

module.exports = route;
