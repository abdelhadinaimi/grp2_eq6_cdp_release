const mongoose = require("mongoose");
const User = mongoose.model("User");
const MongoError = require("mongodb").MongoError;
const crypto = require('crypto');

const errorMessages = require("../util/constants").errorUserMessages;

module.exports.upsertUser = async user => {
  if(user.password){
    user.password = User.generateHash(user.password);
  }else{
    delete user.password;
  }
  try {
    user._id = user._id || new mongoose.mongo.ObjectID();
    await User.findOneAndUpdate({_id:user._id},user,{upsert:true}).exec();
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

  return {success: true, user: {_id:foundUser._id, username:foundUser.username}};
};

module.exports.generateResetPasswordToken = email => new Promise((resolve, reject) => {
  return User
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
  return User
    .findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      if (!user) {
        resolve({success: false});
      } else {
        user.password = User.generateHash(password);
        delete user.resetToken;
        delete user.resetTokenExpiration;
        return user.save();
      }
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

module.exports.getUser = async (userId) => {
  const foundUser = await User.findById(userId);
  if (!foundUser) {
    return { success: false, errors: { email: errorMessages.user.not_found } };
  }
  return {
    success: true,
    user: { _id: foundUser._id, username: foundUser.username, email: foundUser.email }
  };
};
