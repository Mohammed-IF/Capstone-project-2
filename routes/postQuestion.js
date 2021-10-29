const express = require('express');
const router = express.Router()
var Question = require("../models/Question");


const User = require('../models/User');
const passport = require('passport');
require('../config/auth');
require('../config/passport')(passport);;
require('../models/User');

function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
          next();
      }else{
        res.redirect('/users/login');
      }


}


router
  .get("/postQuestion",isLoggedIn, (req, res) => { 
    res.render("postQuestion");
  })

  .post("/postQuestion", (req, res) => {
 
    const {title, content, category} = req.body;
    
    // * check for the missing fields!
    if (!title || !content)
      return res.send("Please enter all the required credentials!");

      const newQuestion = new Question({ user: req.user.name ,title, content, category });

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
