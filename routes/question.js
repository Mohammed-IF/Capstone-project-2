const express = require('express');
const router = express.Router()
const Question = require('../models/Question');

router
  .get("/question/:id", async (req, res) => {
    const { id } = req.params;
    const getQuestion = await Question.findOne({ _id: id }).populate("comments");

    res.render("particularQuestion", { question: getQuestion  });
  })

  .get("/deleteQuestion/:id", (req, res) => {
    const { id } = req.params;
    Question.deleteOne({ _id: id })
      .then(() => {
        console.log("Deleted Question successfully!");
        res.redirect("/adminQuestion");
      })
      .catch((err) => console.log(err));
  })

  .get("/editQuestion/:id", async (req, res) => {
    const { id } = req.params;

    const getData = await Question.findOne({ _id: id });
    res.render("editQuestion", { question: getData });
  })

  .post("/editQuestion/:id", (req, res) => {
    const { id } = req.params;
    const { title, content, category, } = req.body;

    Question.updateOne({ _id: id }, { title, content, category })
      .then(() => {
        console.log("successfully! updated the Question!");
        res.redirect("/Question");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
