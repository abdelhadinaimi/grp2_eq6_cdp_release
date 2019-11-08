const mongoose = require("mongoose");

const URL = process.env.MONGO_URL || "localhost";
const PORT = process.env.MONGO_PORT || "27017";
const USER = process.env.MONGO_USER || "root";
const PASS = process.env.MONGO_PASS || "example";

module.exports = dbName => {
  const mongooseOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    dbName
  };

  return mongoose.connect(`mongodb://${USER}:${PASS}@${URL}:${PORT}`, mongooseOptions);
};

// register schemas

const userModel = require("../models/user.model");
mongoose.model(userModel.name, userModel.schema);

const projectModel = require("../models/project.model");
mongoose.model(projectModel.name, projectModel.schema);
