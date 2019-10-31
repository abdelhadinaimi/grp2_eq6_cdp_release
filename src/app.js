const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");

const connection = require("./config/database.config");
const issuesRoutes = require("./routes/issues.routes");
const projectRoutes = require("./routes/project.routes");
const userRoutes = require("./routes/user.routes");
const indexRoutes = require("./routes/index.routes");

try {
  console.log("Loading variables from .env ...");
  dotenv.config();
  console.log("Variables loaded");
} catch (e) {
  console.error(`.env file doens't exist please add it.`);
}

const PORT = process.env.SERVER_PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cookieParser())

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
