const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Issue = require("./issue.model");
const Task = require("./task.model");
const User = require("./user.model");
const Sprint = require("./sprint.model");
const Doc = require("./doc.model");

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
    tasks: [Task.schema],
    sprint: [Sprint.schema],
    docs: [Doc.schema],
    collaborators: [
      {
        _id: { type: Schema.Types.ObjectId, ref: User.name },
        userType: { type: String, enum: ["po", "pm", "user"], required: true },
        activated: {type: Boolean, default: false},
        addedAt: { type: Date, default: Date.now },
        addedBy: { type: Schema.Types.ObjectId, ref: User.name }
      }
    ],
  },
  { timestamps: true }
);

projectSchema.statics.findIfUserIsPo = function(projectId, userId) {
  return this.findOne({_id: projectId, projectOwner: userId});
};

projectSchema.statics.findIfUserType = function(projectId, userId, userTypes) {
  return this.findOne({_id: projectId,collaborators:{$elemMatch: {_id: userId,userType:{$in: userTypes}}}});
};

module.exports = { name: "Project", schema: projectSchema };
