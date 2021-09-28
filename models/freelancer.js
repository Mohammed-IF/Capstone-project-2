const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
  userName: {
        type: String,
        required: true
      }, 
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
    type: Array,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Freelancer= mongoose.model('Freelancer', FreelancerSchema);

module.exports = Freelancer;
