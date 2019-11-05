const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const dotenv = require("dotenv");
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');

const connection = require("./config/database.config");

const global = require('./util/constants').global;

const issuesRoutes = require("./routes/issues.routes");
const projectRoutes = require("./routes/project.routes");
const indexRoutes = require("./routes/index.routes");
const userRoutes = require("./routes/user.routes");
const errorRoutes = require('./routes/error.routes');

try {
  console.log("Loading variables from .env ...");
  dotenv.config();
  console.log("Variables loaded");
} catch (e) {
  console.error(`.env file doens't exist please add it.`);
}

const PORT = process.env.SERVER_PORT || 8080;
const app = express();
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({secret: 'secret session',  resave: false, saveUninitialized: false}));
app.use(csrfProtection);
app.use(flash());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.locals.appName = global.app.name;
  res.locals.csrfToken = req.csrfToken();
  res.locals.toasts = req.flash('toast');
  if (req.session.user)
    res.locals.username =  req.session.user.username;
  next();
});

app.use("/projects/:projectId/issues", issuesRoutes);
app.use("/projects", projectRoutes);
app.use(indexRoutes, userRoutes, errorRoutes);

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
