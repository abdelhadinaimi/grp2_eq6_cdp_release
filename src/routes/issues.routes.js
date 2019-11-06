const route = require("express").Router({mergeParams:true});

const issueController = require('../controllers/issue.controller');
const {issueValidations, validate} = require('../config/validations.config');

const isAuth = require('../config/auth.config').isAuth;
 
route.get('/', isAuth, issueController.getProjectIssues);

// route.post('/add', isAuth, issueValidations, validate, issueController.postAdd);

// route.get('/:issueId/edit', isAuth, issueController.getEdit);

// route.get("/:issueId", isAuth, issueController.getissue);

// route.put('/:issueId', isAuth, issueValidations, validate, issueController.putEdit);

// route.delete('/:issueId', isAuth, issueController.deleteProject);

module.exports = route;
