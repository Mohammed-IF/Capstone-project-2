const express = require('express');
const router = express.Router()
const Custom = require('../models/Custom');

router
  .get("/customReq/:id", async (req, res) => {
    const { id } = req.params;
    const getCustom = await Custom.findOne({ _id: id }).populate("comments");

    res.render("particularCustomReq", { custom: getCustom  });
  })
  .get("/customRes/:id", async (req, res) => {
    const { id } = req.params;
    const getCustom = await Custom.findOne({ _id: id }).populate("comments");

    res.render("particularCustomRes", { custom: getCustom  });
  })

  .get("/deleteCustom/:id", (req, res) => {
    const { id } = req.params;
    Custom.deleteOne({ _id: id })
      .then(() => {
        console.log("Deleted custom service successfully!");
        res.redirect("/user/customServices");
      })
      .catch((err) => console.log(err));
  })

  .get("/editCustom/:id", async (req, res) => {
    const { id } = req.params;

    const getData = await Custom.findOne({ _id: id });
    res.render("editCustom", { custom: getData });
  })

  .post("/editCustom/:id", (req, res) => {
    const { id } = req.params;
    const { title, content, category, day, price, } = req.body;

    Custom.updateOne({ _id: id }, { title, content, category, day, price })
      .then(() => {
        console.log("successfully! updated the custom service!");
        res.redirect("/user/customServices");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
