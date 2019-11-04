const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 128,
    required: true
  },
  dueDate: {
    type: Date,
    required: false
  },
  description: {
    type: String,
    maxlength: 3000,
    required: false
  }
});

module.exports = {name: 'Project', schema: projectSchema};