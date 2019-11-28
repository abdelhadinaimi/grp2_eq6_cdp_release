const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReleaseSchema = new Schema(
  {
    version: {
      type: String,
      maxlength: 20,
      required: true
    },
    description: {
      type: String,
      maxlength: 3000,
      required: false
    },
    downloadLink: String,
    docLink: String,
    releaseDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = { name: "Release", schema: ReleaseSchema };
