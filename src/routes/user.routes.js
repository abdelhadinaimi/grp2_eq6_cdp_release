const route = require("express").Router();
const userController = require("../controllers/user.controller");
const { validate, userValidations } = require("../config/validations.config");

route.get('/register', userController.getRegisterUser);

route.get('/login', userController.getLoginUser);

route.get('/logout', userController.getLogoutUser);

route.post('/register', userValidations, validate, userController.postRegisterUser);

route.post('/login', userController.postLoginUser);

module.exports = route;
