const mongoose = require('mongoose');
const express = require('express');
const app = express();

const rateSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
      },

      star: {
        type: Number,
         
      },
      comment: {
        type: String,
        required: true,
      },
      
     course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  

});

    
const Rate = mongoose.model('Rate', rateSchema); 
module.exports = Rate; 