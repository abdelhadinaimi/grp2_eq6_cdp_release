const route = require("express").Router();

const indexController = require('../controllers/index.controller');

const { verifyJWT } = require("../config/auth.config");

// route.get('/', verifyJWT, indexController.getIndexConnected);

route.get('/', indexController.getIndexNotConnected);

module.exports = route;
