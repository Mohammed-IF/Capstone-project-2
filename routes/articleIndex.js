const express = require('express');
const router = express.Router()


const Article = require("../models/Article")


router.get("/Article", async (req, res) => {

    let category = req.query.category

    if( category && category !== 'all'){
    
        const allArticles = await Article.find({category: category});
        res.render("Article", { articles: allArticles });

    }else{

    const allArticles = await Article.find();
    res.render("Article", { articles: allArticles });
         } 



  });
  

module.exports = router;

