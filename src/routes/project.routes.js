const route = require("express").Router();
const {param} = require("express-validator");

const projectController = require('../controllers/project.controller');
const {projectValidations,roleValidation, validate} = require('../config/validations.config');

const rootProjectId = "/:projectId";

route.get("/", (req, res) => res.redirect("/"));

route.get('/add', projectController.getAdd);

route.post('/add', projectValidations, validate, projectController.postAdd);

route.get(rootProjectId + "/edit", [
  param("projectId")
  .exists()
  .isMongoId()
], projectController.getEdit);

route.get(rootProjectId, [param("projectId").exists().isMongoId()], projectController.getProject);

route.put(rootProjectId, projectValidations, validate, projectController.putEdit);

route.delete(rootProjectId, validate, projectController.deleteProject);

route.put(rootProjectId + "/closeOpen", projectController.putCloseOpen);

route.post(rootProjectId + "/invite", projectController.postInvite);

route.get(rootProjectId + "/invite", projectController.getInvite);

route.delete(rootProjectId + "/remove/:userId", projectController.deleteInvite);

route.post(rootProjectId + "/quit", projectController.deleteInvite);

route.put(rootProjectId + "/:userId/role", roleValidation, validate, projectController.updateRole);

module.exports = route;
