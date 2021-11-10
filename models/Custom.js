const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Schema = mongoose.Schema;

const CustomSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  
  price: {
    type: Number,
    required: true
  },

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }


,
  postedAt: {
    type: String,
    default: new Date().toString(),
  }
});

const Custom = mongoose.model('Custom', CustomSchema); 
module.exports = Custom; 