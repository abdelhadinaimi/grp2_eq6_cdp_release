const route = require('express').Router();

const errorController = require('../controllers/error.controller');

route.get('/500', errorController.get500);

route.use(errorController.get404);

module.exports = route;