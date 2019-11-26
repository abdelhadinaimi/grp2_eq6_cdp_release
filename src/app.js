const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const buildConnection = require("./config/database.config");

const global = require('./util/constants').global;
const isAuth = require('./config/auth.config').isAuth;

const issuesRoutes = require('./routes/issues.routes');
const tasksRoutes = require('./routes/tasks.routes');
const sprintsRoutes = require('./routes/sprints.routes');
const docsRoutes = require('./routes/doc.routes');
const projectRoutes = require('./routes/project.routes');
const indexRoutes = require('./routes/index.routes');
const userRoutes = require('./routes/user.routes');
const errorRoutes = require('./routes/error.routes');

const DBNAME = process.env.MONGO_NAME || 'cdp';

try {
  console.log('Loading variables from .env ...');
  dotenv.config();
  console.log('Variables loaded');
} catch (e) {
  console.error('.env file doens\'t exist please add it.');
}

const PORT = process.env.SERVER_PORT || 8080;
const app = express();
const csrfProtection = csrf();
const doc_storage = "doc_storage";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {cb(null, doc_storage)},
  filename: (req, file, cb) => {cb(null, new Date().toISOString() + "-" + file.originalname)}
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype === "application/zip")
    return cb(null, true);
  return cb(null, false);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/" + doc_storage, express.static(path.join(__dirname, doc_storage)));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("doc"));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret session',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(csrfProtection);
app.use(flash());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.locals.appName = global.app.name;
  res.locals.csrfToken = req.csrfToken();
  res.locals.toasts = req.flash('toast');
  if (req.session.user) res.locals.username = req.session.user.username;
  next();
});

app.use('/projects/:projectId/issues', isAuth, issuesRoutes);
app.use('/projects/:projectId/tasks', isAuth, tasksRoutes);
app.use('/projects/:projectId/sprints', isAuth, sprintsRoutes);
app.use('/projects/:projectId/doc', isAuth, docsRoutes);
app.use('/projects', isAuth, projectRoutes);
app.use(indexRoutes, userRoutes, errorRoutes);

buildConnection(DBNAME)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error on start: ' + err.stack);
    process.exit(1);
  });
