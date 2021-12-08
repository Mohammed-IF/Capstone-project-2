const mongoose = require('mongoose');
const express = require('express');
const app = express();

const commentSchema = new mongoose.Schema({
    freelancerName: {
        type: String,
        required: true,
      },
      freelancerEmail: {
        type: String,
      },
      comment: {
        type: String,
        required: true,
      },
      bidPrice: {
        type: Number
      },

      custom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Custom'
     },
     freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Freelancer'
    }
  


});

    
const Comment = mongoose.model('Comment', commentSchema); 
module.exports = Comment; 