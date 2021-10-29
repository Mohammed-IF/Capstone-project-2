const mongoose = require('mongoose');


const ApplicationSchema = new mongoose.Schema({
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

const Application =  mongoose.model('Application', ApplicationSchema);
module.exports = Application;

