const express = require('express');
const router = express.Router()
const Posted = require('../models/postedService');

router
  .get("/postedReq/:id", async (req, res) => {
    const { id } = req.params;
    const getPosted = await Posted.findOne({ _id: id }).populate("quotes");

    res.render("particularPostedReq", { posted: getPosted  });
  })
  .get("/postedRes/:id", async (req, res) => {
    const { id } = req.params;
    const getPosted = await Posted.findOne({ _id: id }).populate("quotes");

    res.render("particularPostedRes", { posted: getPosted  });
  })

  module.exports = router;