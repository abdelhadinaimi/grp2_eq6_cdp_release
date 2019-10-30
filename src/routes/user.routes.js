const route = require("express").Router();
const userController = require("../controllers/user.controller");
const { validate, userValidations } = require("../config/validations.config");

route.post("/register", userValidations, validate, userController.postRegisterUser);

module.exports = route;
