const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Schema = mongoose.Schema;

const QuestionSchema = new mongoose.Schema({
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

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
,
  postedAt: {
    type: String,
    default: new Date().toString(),
  }
});

const Question = mongoose.model('Question', QuestionSchema); 
module.exports = Question; 