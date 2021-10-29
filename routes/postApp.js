const express = require('express');
const router = express.Router()
var Application = require("../models/application");


const User = require('../models/user');
//const passport = require('passport');
require('../config/auth');
//require('../config/passport')(passport);;

require('../routes/authUser');
require('../models/user');
const isAuth = require('../middleware/is-auth');

function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
          next();
      }else{
        res.redirect('/login');
      }


}


router
  .get("/postApp", (req, res) => { 
    res.render("postApp");
  })

  .post("/postApp", (req, res) => {
 
    const {name, email, phoneNumber, language, skills } = req.body;
    
    // * check for the missing fields!
    if (!name || !email)
      return res.send("Please enter all the required credentials!");

      const newApp = new Application({name, email, phoneNumber, language, skills });

    // save the blog to the database
    newApp
      .save()
      .then(() => {
        console.log("Application Saved Successfully!");
        res.redirect("/postCustom");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
