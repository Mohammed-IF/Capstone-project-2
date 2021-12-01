const mongoose = require('mongoose');
const express = require('express');
const app = express();

const commentSchema = new mongoose.Schema({
    freelancerName: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      bidPrice: {
        type: Number
      },
      
     freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer'
    }
  


});

    
const Comment = mongoose.model('Comment', commentSchema); 
module.exports = Comment; 