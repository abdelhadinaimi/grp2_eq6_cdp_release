const route = require("express").Router({mergeParams:true});

const taskController = require('../controllers/task.controller');
const {taskValidations, validate} = require('../config/validations.config');

const isAuth = require('../config/auth.config').isAuth;

route.get('/', isAuth, taskController.getProjectTasks);

/*
route.get('/add', isAuth, taskController.getAdd);

route.post('/add', isAuth, taskValidations, validate, taskController.postTask);

route.get('/:taskId/edit', isAuth, taskController.getEdit);

route.put('/:taskId', isAuth, taskValidations, validate, taskController.putEdit);

route.delete('/:taskId', isAuth, taskController.deleteIssue);
*/

module.exports = route;
