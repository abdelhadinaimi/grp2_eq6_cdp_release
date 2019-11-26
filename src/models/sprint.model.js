const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SprintSchema = new Schema(
  {
    id: {
      type: String,
      maxlength: 20,
      unique: true
    },
    description: {
      type: String,
      maxlength: 3000,
      required: false
    },
    startDate: Date,
    endDate: Date
  },
  { timestamps: true }
);

module.exports = { name: "Schema", schema: SprintSchema };
