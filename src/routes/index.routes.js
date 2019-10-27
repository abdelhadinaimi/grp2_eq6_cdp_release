const route = require("express").Router();

route.get("/", (req, res) => {
  res.send("Hello world!");
});

module.exports = route;
