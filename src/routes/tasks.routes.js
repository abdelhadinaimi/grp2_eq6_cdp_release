const route = require("express").Router({ mergeParams: true });

const taskController = require("../controllers/task.controller");
const { taskStateValidation, taskValidations, validate } = require("../config/validations.config");

route.get("/mine", taskController.getMyTasks);

route.put("/:taskId/state", taskStateValidation, validate, taskController.putTaskState);

route.get('/add', taskController.getAdd);

route.get('/:taskId/edit', taskController.getEdit);

route.post('/add', taskValidations, validate, taskController.postTask);

route.put('/:taskId', taskValidations, validate, taskController.putEdit);

route.delete('/:taskId', taskController.deleteTask);

route.get("/:taskId?", taskController.getSprintTasks);

module.exports = route;
