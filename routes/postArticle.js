const express = require('express');
const router = express.Router()
var Article = require("../models/Article");


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
  .get("/postArticle",isLoggedIn, (req, res) => { 
    res.render("postArticle");
  })

  .post("/postArticle", (req, res) => {
 
    const {title, content, category} = req.body;
    
    // * check for the missing fields!
    if (!title || !content)
      return res.send("Please enter all the required credentials!");

      const newArticle = new Article({ user: req.user.name ,title, content, category });

    // save the blog to the database
    newArticle
      .save()
      .then(() => {
        console.log("Article Saved Successfully!");
        res.redirect("/Article");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
