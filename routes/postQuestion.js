const passport = require('passport');
require('../config/auth');
const freelancer = require('../models/freelancer');
const isAuth = require('../middleware/is-auth');
var Question = require("../models/Question");
const MY_DOMAIN = "http://localhost:3000";


const express = require('express');
const router = express.Router()


require('../models/user');
require('../routes/authUser');


function isLoggedIn(req, res, next){
  if(req.session.isLoggedIn){
      next();
  }else{
    res.redirect('login1');
  }

}


router
  .get("/postQuestion",isLoggedIn, (req, res) => { 
    res.render("postQuestion");
  })

  .post("/postQuestion", (req, res) => {
 
    var test;
    if(req.freelancer){
    test = req.freelancer.name
    }else{
    test = req.user.name
    }
    
    const {title, content, category} = req.body;
    
    // * check for the missing fields!
    if (!title || !content)
      return res.send("Please enter all the required credentials!");

      const newQuestion = new Question({ user:test ,title, content, category });

    // save the blog to the database
    newQuestion
      .save()
      .then(() => {
        console.log("Question Saved Successfully!");
        res.redirect("/Question");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;