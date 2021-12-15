const mongoose = require('mongoose');
const express = require('express');
const app = express();

const quoteSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
      },
      userEmail: {
        type: String,
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },

      posted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostedService'
     },
     userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Freelancer'
    }
  


});

    
const Quote = mongoose.model('Quote', quoteSchema); 
module.exports = Quote; 