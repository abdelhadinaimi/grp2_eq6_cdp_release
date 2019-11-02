const route = require("express").Router();

const indexController = require('../controllers/index.controller');

route.get('/', indexController.getIndex);

module.exports = route;
