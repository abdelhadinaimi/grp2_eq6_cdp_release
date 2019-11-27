const route = require("express").Router({mergeParams:true});

const releaseController = require('../controllers/release.controller');
const {releaseValidations, validate} = require('../config/validations.config');

route.get('/add', releaseController.getAdd);

route.post('/add', releaseValidations, validate, releaseController.postRelease);

route.get('/:releaseId/edit', releaseController.getEdit);

route.put('/:releaseId', releaseValidations, validate, releaseController.putEdit);

route.delete('/:releaseId', releaseController.deleteRelease);

route.get('/:releaseId?', releaseController.getProjectReleases);

module.exports = route;
