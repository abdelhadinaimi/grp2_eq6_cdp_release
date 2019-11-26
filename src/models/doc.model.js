const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocSchema = new Schema(
  {
    version: {
      type: String,
      maxlength: 20,
      required: true
    },
    docUrl: String,
    category: { type: String, enum: ["code", "user", "admin"] }
  },
  { timestamps: true }
);

module.exports = { name: "Doc", schema: DocSchema };
