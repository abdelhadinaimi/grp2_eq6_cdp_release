const mongoose = require("mongoose");

const URL = process.env.MONGO_URL || "localhost";
const PORT = process.env.MONGO_PORT || "27017";
const USER = process.env.MONGO_USER || "root";
const PASS = process.env.MONGO_PASS || "example";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

module.exports = mongoose.connect(
  `mongodb://${USER}:${PASS}@${URL}:${PORT}`,
  mongooseOptions
);
