const express = require('express');
const router = express.Router()
var Custom = require("../models/Custom");
require('../models/user');

function isLoggedIn(req, res, next){
      if(req.session.isLoggedIn){
          next();
      }else{
        res.redirect('/login');      }
}
router
  .get("/postCustom", isLoggedIn, (req, res) => { 
    res.render("postCustom");
  })
  .post("/postCustom", (req, res) => {
    const {title, content, category, day, price } = req.body;
    if (!title || !content)
      return res.send("Please enter all the required credentials!");
      const newCustom = new Custom({ user: req.user.name, title, content, category, day, price, userId: req.user});

    newCustom
      .save()
      .then(() => {
        console.log("Custom service Saved Successfully!");
        res.redirect("/user/customServices");
      })
      .catch((err) => console.log(err));
  });
module.exports = router;