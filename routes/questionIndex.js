const express = require('express');
const router = express.Router()


const Question = require("../models/Question")


router.get("/Question", async (req, res) => {

    let category = req.query.category

    if( category && category !== 'all'){
    
        const allQuestions = await Question.find({category: category});
        res.render("Question", { questions: allQuestions });

    }else{

    const allQuestions = await Question.find();
    res.render("Question", { questions: allQuestions });
         } 



  });
  
  /////////////////////////// Question Admin page
  router.get("/AdminQuestion", async (req, res) => {

    let category = req.query.category

    if( category && category !== 'all'){
    
        const allQuestions = await Question.find({category: category});
        res.render("AdminQuestion", { questions: allQuestions });

    }else{

    const allQuestions = await Question.find();
    res.render("AdminQuestion", { questions: allQuestions });
         } 



  });

module.exports = router;

