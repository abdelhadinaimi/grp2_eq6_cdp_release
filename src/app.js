const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./config/database.config");
const issuesRoutes = require("./routes/issues.routes");
const projectRoutes = require("./routes/project.routes");
const userRoutes = require("./routes/user.routes");
const indexRoutes = require("./routes/index.routes");

const PORT = process.env.SERVER_PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use("/projects/:projectId/issues", issuesRoutes);
app.use("/projects", projectRoutes);
app.use("/", indexRoutes, userRoutes);

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error on start: " + err.stack);
    process.exit(1);
  });
