const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./user.model");

const issueSchema = new Schema(
  {
    userType: { type: String, maxlength: 1000, required: true },
    userGoal: { type: String, maxlength: 1000, required: true },
    userReason: { type: String, maxlength: 1000, required: true },
    storyId: { type: String, maxlength: 20, required: true, unique: true },
    priority: { type: String, enum: ["-", "high", "medium", "low"] },
    difficulty: { type: Number, min: 1 },
    testLink: String,
    createdBy: { type: Schema.Types.ObjectId, ref: User.name }
  },
  { timestamps: true }
);

module.exports = { name: "Issue", schema: issueSchema };
