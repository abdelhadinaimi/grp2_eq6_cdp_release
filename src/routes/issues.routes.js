const route = require("express").Router();

route.get("/", (req, res) => {
  res.send("issues");
});

module.exports = route;
