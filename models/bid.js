const mongoose = require('mongoose');
const express = require('express');
const app = express();

const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },

      custom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Custom'
     }


});

    
const Comment = mongoose.model('Comment', commentSchema); 
module.exports = Comment; 