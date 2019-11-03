const route = require("express").Router();

const projectController = require('../controllers/project.controller');

const isAuth = require('../config/auth.config').isAuth;

route.get("/", isAuth, (req, res) => {
  res.send("all projects");
});

route.post('/add', isAuth, projectController.postAdd);

module.exports = route;
