const route = require("express").Router();

const isAuth = require('../config/auth.config').isAuth;

route.get("/", isAuth, (req, res) => {
  res.send("all projects");
});

module.exports = route;
