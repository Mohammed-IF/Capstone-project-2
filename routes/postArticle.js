
const passport = require('passport');
require('../config/auth');
const freelancer = require('../models/freelancer');
const isAuth = require('../middleware/is-auth');

const MY_DOMAIN = "http://localhost:3000";


const express = require('express');
const router = express.Router()
var Article = require("../models/Article");


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
  .get("/postArticle",isLoggedIn, (req, res) => { 
    res.render("postArticle");
  })

  .post("/postArticle", (req, res) => {
    
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

      const newArticle = new Article({ user: test ,title, content, category });

    // save the Article to the database
    newArticle
      .save()
      .then(() => {
        console.log("Article Saved Successfully!");
        res.redirect("/Article");
      })
      .catch((err) => console.log(err));
  });
////////////////////////////////////////////////////
 
module.exports = router;
