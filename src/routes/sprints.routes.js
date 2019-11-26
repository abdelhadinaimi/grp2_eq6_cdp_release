const route = require("express").Router({ mergeParams: true });

const sprintController = require("../controllers/sprint.controller");
const { sprintValidation, validate } = require("../config/validations.config");

route.get("/:sprintId?", sprintController.getProjectSprints);

route.get('/add', sprintController.getAdd);

route.get('/:sprintId/edit', sprintController.getEdit);

/*
route.post('/add', sprintValidations, validate, sprintController.postSprint);

route.put('/:sprintId', sprintValidations, validate, sprintController.putEdit);

route.delete('/:sprintId', sprintController.deleteSprint);
*/

module.exports = route;
