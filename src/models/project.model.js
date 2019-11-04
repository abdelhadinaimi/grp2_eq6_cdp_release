const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Issue = require("./issue.model");
const User = require("./user.model");

const projectSchema = new Schema(
  {
    title: {
      type: String,
      maxlength: 128,
      required: true
    },
    description: {
      type: String,
      maxlength: 3000,
      required: false
    },
    dueDate: Date,
    projectOwner: {
      type: Schema.Types.ObjectId,
      ref: User.name,
      required: true
    },
    issues: [Issue.schema],
    collaborators: [
      {
        _id: { type: Schema.Types.ObjectId, ref: User.name },
        userType: { type: String, enum: ["po", "pm", "user"], required: true },
        addedAt: { type: Date, default: Date.now },
        addedBy: { type: Schema.Types.ObjectId, ref: User.name }
      }
    ],
  },
  { timestamps: true }
);

module.exports = { name: "Project", schema: projectSchema };
