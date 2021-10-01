const express = require('express');
const mongoose = require('mongoose');
const app = express();

const postedServiceSchema = new mongoose.Schema({
  name: {
    type: String,
     required: true
      }, 
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

const postedService= mongoose.model('postedService', postedServiceSchema); 


module.exports = postedService;
