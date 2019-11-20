const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Issue = require("./issue.model");
const User = require("./user.model");

const TaskSchema = new Schema(
  {
    description: { type: String, maxlength: 3000, required: true },
    definitionOfDone: { type: String, maxlength: 3000 },
    cost: { type: Number, min: 0.5, required: true },
    testLink: String,
    state: { type: String, enum: ["TODO", "DOING", "DONE", "TOTEST", "TESTING", "TESTED"], default: "TODO" },
    assignedContributors: [{ type: Schema.Types.ObjectId, ref: User.name }],
    linkedIssues: [{ type: Schema.Types.ObjectId, ref: Issue.name }]
  },
  { timestamps: true }
);

module.exports = { name: "Task", schema: TaskSchema };
