const express = require('express');
const router = express.Router()
const Article = require('../models/Article');

router
  .get("/article/:id", async (req, res) => {
    const { id } = req.params;
    const getArticle = await Article.findOne({ _id: id }).populate("comments");

    res.render("particularArticle", { article: getArticle  });
  })

  .get("/deleteArticle/:id", (req, res) => {
    const { id } = req.params;
    Article.deleteOne({ _id: id })
      .then(() => {
        console.log("Deleted article successfully!");
        res.redirect("/Article");
      })
      .catch((err) => console.log(err));
  })

  .get("/editArticle/:id", async (req, res) => {
    const { id } = req.params;

    const getData = await Article.findOne({ _id: id });
    res.render("editArticle", { article: getData });
  })

  .post("/editArticle/:id", (req, res) => {
    const { id } = req.params;
    const { title, content, category, } = req.body;

    Article.updateOne({ _id: id }, { title, content, category })
      .then(() => {
        console.log("successfully! updated the Article!");
        res.redirect("/Article");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
