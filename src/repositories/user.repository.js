const mongoose = require("mongoose");
const User = mongoose.model("User");
const MongoError = require("mongodb").MongoError;
const errorMessages = require("../constants").errorMessages;

module.exports.createUser = async user => {
  const newUser = new User();
  newUser.username = user.username;
  newUser.email = user.email;
  newUser.password = newUser.generateHash(user.password);

  try {
    await newUser.save();
    return { success: true };
  } catch (error) {
    const errorMsg = { success: false };
    if (error instanceof MongoError) {
      if (error.code === 11000) {
        const errorKeys = Object.keys(error["keyPattern"]);
        errorKeys.forEach(k => {
          errorMsg[k] = errorMessages[k].exists;
        });
      }
    }
    return errorMsg;
  }
};
