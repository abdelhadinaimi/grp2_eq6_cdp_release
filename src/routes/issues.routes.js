const route = require("express").Router({mergeParams:true});

const issueController = require('../controllers/issue.controller');
const {issueValidations, validate} = require('../config/validations.config');

route.get('/add', issueController.getAdd);

route.post('/add', issueValidations, validate, issueController.postIssue);

route.get('/:issueId/edit', issueController.getEdit);

route.put('/:issueId', issueValidations, validate, issueController.putEdit);

route.delete('/:issueId', issueController.deleteIssue);

route.get('/:issueId?', issueController.getProjectIssues);

module.exports = route;
