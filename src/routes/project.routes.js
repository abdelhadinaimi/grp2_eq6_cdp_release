const route = require("express").Router();
const {param} = require("express-validator");

const projectController = require('../controllers/project.controller');
const {projectValidations,roleValidation, validate} = require('../config/validations.config');

route.get("/", (req, res) => {
  res.send("all projects");
});

route.get('/add', projectController.getAdd);

route.post('/add', projectValidations, validate, projectController.postAdd);

route.get('/:projectId/edit', [
  param("projectId")
  .exists()
  .isMongoId()
], projectController.getEdit);

route.get("/:projectId", [param("projectId").exists().isMongoId()], projectController.getProject);

route.put('/:projectId', projectValidations, validate, projectController.putEdit);

route.delete('/:projectId', validate,projectController.deleteProject);

route.put('/:projectId/:userId/role', roleValidation, validate, projectController.updateRole);

module.exports = route;
