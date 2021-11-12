const express = require('express');
const router = express.Router()
var TeacherApplication = require("../models/teacherApplication");

const swal = require('sweetalert');
const User = require('../models/user');
//const passport = require('passport');
require('../config/auth');
//require('../config/passport')(passport);;
const alert = require('node-popup');
//const popup = require('node-popup/dist/cjs.js');
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
  .get("/postTeacherApp", (req, res) => { 
    res.render("postTeacherApp");
  })

  .post("/postTeacherApp", (req, res) => {
 
    const {name, email, phoneNumber, language, skills } = req.body;
    
    // * check for the missing fields!
    if (!name || !email)
      return res.send("Please enter all the required credentials!");

      const newApp = new TeacherApplication({name, email, phoneNumber, language, skills });

    // save the blog to the database
    newApp
      .save()
      .then(() => {
        console.log("Teacher Application Saved Successfully!");
       // const alert = require('alert');
      // const {alert} = require('node-popup');
         // alert("Thank you, we will contact you by email soon.");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
