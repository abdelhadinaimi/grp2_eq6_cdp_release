/**
 * database config module
 * @module config/database
 */

const mongoose = require("mongoose");

const URL = process.env.MONGO_URL || "localhost";
const PORT = process.env.MONGO_PORT || "27017";
const USER = process.env.MONGO_USER || "root";
const PASS = process.env.MONGO_PASS || "example";

/**
 * creates a mongoose connection
 * @param {string} dbName - the name of the database to connect to
 */
const buildConnection = dbName => {
  const mongooseOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName
  };

  if (PORT === "srv")
    return mongoose.connect(`mongodb+srv://${USER}:${PASS}@${URL}`, mongooseOptions);
  return mongoose.connect(`mongodb://${USER}:${PASS}@${URL}:${PORT}`, mongooseOptions);
};

// register schemas

const userModel = require("../models/user.model");
mongoose.model(userModel.name, userModel.schema);

const projectModel = require("../models/project.model");
mongoose.model(projectModel.name, projectModel.schema);

const sprintModel = require("../models/sprint.model");
mongoose.model(sprintModel.name, sprintModel.schema);

module.exports = buildConnection;
