const mongoose = require('mongoose');


const TeacherApplicationSchema = new mongoose.Schema({
name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const TeacherApplication =  mongoose.model('TeacherApplication', TeacherApplicationSchema);
module.exports = TeacherApplication;

