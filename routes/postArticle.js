const express = require('express');
const router = express.Router()
var Article = require("../models/Article");
require('../models/user');
require('../routes/authUser');

router
  .get("/postArticle", (req, res) => { 
    res.render("postArticle");
  })
  .post("/postArticle", (req, res) => {  
    
 var user;
if(req.freelancer){
user = req.freelancer.name
}else {
  user = req.user.name
}
  const {title, content, category} = req.body;
    if (!title || !content)
      return res.send("Please enter all the required credentials!");
      const newArticle = new Article({ user: user ,title, content, category });
    newArticle
      .save()
      .then(() => {
        console.log("Article Saved Successfully!");
        res.redirect("/Article");
      })
      .catch((err) => console.log(err));
  });
module.exports = router;