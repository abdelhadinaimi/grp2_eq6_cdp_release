const route = require("express").Router();
const userController = require("../controllers/user.controller");
const {validate, userValidations} = require("../config/validations.config");

const {isAuth, isNotAuth} = require('../config/auth.config');

route.get('/register', isNotAuth, userController.getRegisterUser);

route.get('/login', isNotAuth, userController.getLoginUser);

route.get('/logout', isAuth, userController.getLogoutUser);

route.get('/forgot-password', isNotAuth, userController.getForgotPassword);

route.get('/reset-password/:token', isNotAuth, userController.getResetPassword);

route.post('/register', isNotAuth, userValidations, validate, userController.postRegisterUser);

route.post('/login', isNotAuth, userController.postLoginUser);

route.post('/forgot-password', isNotAuth, userController.postForgotPassword);

route.post('/reset-password/:token', isNotAuth, [userValidations[1], userValidations[2]], validate, userController.postResetPassword);

module.exports = route;
