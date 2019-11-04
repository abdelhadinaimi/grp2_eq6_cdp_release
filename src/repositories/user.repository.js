const mongoose = require("mongoose");
const User = mongoose.model("User");
const MongoError = require("mongodb").MongoError;
const errorMessages = require("../util/constants").errorUserMessages;

module.exports.createUser = async user => {
  const newUser = new User();
  newUser.username = user.username;
  newUser.email = user.email;
  newUser.password = newUser.generateHash(user.password);

  try {
    await newUser.save();
    return {success: true};
  } catch (error) {
    const errorMsg = {success: false, errors: []};
    // if the error is a mongoDB error
    if (error instanceof MongoError) {
      // if the error is a duplication error (a unique field inserted twice)
      if (error.code === 11000) {
        const errorKeys = Object.keys(error["keyPattern"]);
        errorKeys.forEach(k => {
          // push the errors into the object one by one
          errorMsg.errors.push({[k]: errorMessages[k].exists});
        });
      }
    }
    return errorMsg;
  }
};

module.exports.checkLogin = async user => {
  const foundUser = await User.findOne({email: user.email});

  if (!foundUser) {
    return {success: false, errors: {email: errorMessages.user.not_found}};
  }
  if (!foundUser.verifyPassword(user.password)) {
    return {success: false, errors: {password: errorMessages.password.incorrect}};
  }

  return {success: true, user: foundUser};
};
