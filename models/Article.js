const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Schema = mongoose.Schema;

const ArticleSchema = new mongoose.Schema({
  user: {
    type: String,
   
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

const Article = mongoose.model('Article', ArticleSchema); 
module.exports = Article; 