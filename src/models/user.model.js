const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    maxlength: 20,
    required: true
  },
  email: {
    type: String,
    unique: true,
    maxlength: 256,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.generateHash = function(password) {
  const salt = bcrypt.genSaltSync(8);
  return bcrypt.hashSync(password, salt);
};

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJwt = function() {
  return jwt.sign({ _id: this._id, username: this.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP
  });
};

module.exports = { name: "User", schema: UserSchema };
