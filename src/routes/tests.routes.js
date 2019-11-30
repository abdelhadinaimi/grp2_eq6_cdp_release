const route = require("express").Router({ mergeParams: true });

const testController = require("../controllers/test.controller");

route.get("/:testId?", testController.getProjectTests);

module.exports = route;
