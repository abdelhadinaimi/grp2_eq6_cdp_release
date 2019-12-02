const route = require("express").Router({ mergeParams: true });
const { param } = require("express-validator");

const sprintController = require("../controllers/sprint.controller");
const {sprintValidations, validate} = require('../config/validations.config');

route.get('/add', sprintController.getAdd);

route.get('/:sprintId/edit', sprintController.getEdit);

route.post('/add', sprintValidations, validate, sprintController.postSprint);

route.put('/:sprintId', sprintValidations, validate, sprintController.putEdit);

route.delete('/:sprintId', sprintController.deleteSprint);

route.get("/:sprintId/:taskId?", [param("sprintId").exists().isMongoId()], sprintController.getSprint);

route.get("/", sprintController.getProjectSprints);

module.exports = route;
