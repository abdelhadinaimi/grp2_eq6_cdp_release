const route = require("express").Router();

const projectController = require('../controllers/project.controller');
const {projectValidations, validate} = require('../config/validations.config');

const isAuth = require('../config/auth.config').isAuth;

route.get("/", isAuth, (req, res) => {
  res.send("all projects");
});

route.get('/add', isAuth, projectController.getAdd);

route.post('/add', isAuth, projectValidations, validate, projectController.postAdd);

route.get('/:projectId/edit', isAuth, projectController.getEdit);

route.get("/:projectId", isAuth, projectController.getProject);

route.put('/:projectId', isAuth, projectValidations, validate, projectController.putEdit);

route.delete('/:projectId', isAuth, projectController.deleteDelete);

module.exports = route;
