const express = require('express');
const router = express.Router()
const postedService = require('../models/postedService');
const portfolio = require('../models/portfolio');
const nodemailer = require('nodemailer');
const isAuth = require('../middleware/is-auth-admin');


router
  .get("/app/:id", async (req, res) => {
    const { id } = req.params;
    const getApp = await App.findOne({ _id: id }).populate("comments");

    res.render("particularApp", { app: getApp  });
  })

  .get("/deletepostedService/:id", isAuth,  (req, res) => {

    const { id } = req.params;
    
    postedService.deleteOne({ _id: id })
      .then(() => {
        console.log("Deleted postedService successfully!");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  })
  .get("/deleteprtfolio/:id", isAuth, (req, res) => {

   
    const { id } = req.params;
    
    portfolio.deleteOne({ _id: id })
      .then(() => {
        console.log("Deleted portfolio successfully!");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  })
  .get("/declineApp/:id/:email", (req, res) => {

   
    const { id } = req.params;
    const {email} = req.params;
    //const email1 = App.findOne({ email: email });
    transporter.sendMail({
        to: email,
        from: 'm.i.f.15@outlook.sa',
        subject: 'Application response',
        html: `<p>Sorry, Your application has been rejected</p>`
      });
    App.deleteOne({ _id: id })
      .then(() => {
        console.log("Deleted app service successfully!");
        res.redirect("/App");
      })
      .catch((err) => console.log(err));
  })


  .get("/editApp/:id", async (req, res) => {
    const { id } = req.params;

    const getData = await App.findOne({ _id: id });
    res.render("editApp", { app: getData });
  })

  .post("/editApp/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, language, skills } = req.body;

    App.updateOne({ _id: id }, { name, email, phoneNumber, language, skills })
      .then(() => {
        console.log("successfully! updated the app service!");
        res.redirect("/App");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
