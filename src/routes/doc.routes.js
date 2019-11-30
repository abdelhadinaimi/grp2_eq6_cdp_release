const route = require("express").Router({mergeParams: true});

const docController = require('../controllers/doc.controller');

route.get('/', docController.getDoc);

route.post('/add', docController.postAddDoc);

module.exports = route;
