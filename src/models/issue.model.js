const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./user.model");

const issueSchema = new Schema(
  {
    userType: { type: String, maxlength: 1000, required: true },
    userGoal: { type: String, maxlength: 1000, required: true },
    userReason: { type: String, maxlength: 1000, required: true },
    storyId: { type: String, maxlength: 20, sparse: true },
    priority: { type: String, enum: ["high", "normal", "low"] },
    cost: { type: Number, min: 1 },
    testLink: String,
    createdBy: { type: Schema.Types.ObjectId, ref: User.name }
  },
  { timestamps: true }
);

module.exports = { name: "Issue", schema: issueSchema };
//db.projects.updateOne({"_id" : ObjectId("5dc2f58318e5242291e92d1d")},{$addToSet: {issues: {userType:"acheteur",userGoal:"acheter",userReason:"etre cool",priority:"low",createdBy:ObjectId("5dbfee5ee25c6822df10632d")}}});