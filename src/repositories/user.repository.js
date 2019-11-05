const mongoose = require("mongoose");
const User = mongoose.model("User");
const MongoError = require("mongodb").MongoError;
const crypto = require('crypto');

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

module.exports.generateResetPasswordToken = email => new Promise((resolve, reject) => {
  User
    .findOne({email: email})
    .then(user => {
      if (user) {
        crypto.randomBytes(32, (err, buffer) => {
          if (err)
            reject(err);

          const token = buffer.toString('hex');
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          user.save()
            .then(() => resolve(token))
            .catch(err => reject(err));
        });
      }
    });
});

module.exports.resetPassword = (token, password) => new Promise((resolve, reject) => {

});