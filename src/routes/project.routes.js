const route = require("express").Router();

route.get("/", (req, res) => {
  res.send("all projects");
});

module.exports = route;
