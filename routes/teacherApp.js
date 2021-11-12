const express = require('express');
const router = express.Router()
const App = require('../models/teacherApplication');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { application } = require('express');
const isAuth = require('../middleware/is-auth-admin');
require('../models/application');
const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SENDGRID_API_KEY
      }
    })
  );
  
router
  .get("/teacherApp/:id", async (req, res) => {
    const { id } = req.params;
    const getApp = await App.findOne({ _id: id }).populate("comments");

    res.render("particularApp", { app: getApp  });
  })

  .get("/acceptTeacherApp/:id/:email", isAuth, (req, res) => {

   
    const { id } = req.params;
    const {email} = req.params;
    //const email1 = App.findOne({ email: email });
    transporter.sendMail({
        to: email,
        from: 'm.i.f.15@outlook.sa',
        subject: 'Application response',
        html: `<p>You have been accepted as a teacher</p>
            <p>please sigunp through the following link <a href="http://localhost:3000/signup1">here</a>`
      });
    App.deleteOne({ _id: id })
      .then(() => {
        console.log("Deleted app service successfully!");
        res.redirect("/teacherApp");
      })
      .catch((err) => console.log(err));
  })
  .get("/declineTeacherAppApp/:id/:email", isAuth, (req, res) => {

   
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
        res.redirect("/teacherApp");
      })
      .catch((err) => console.log(err));
  })


  .get("/editTeacherApp/:id", async (req, res) => {
    const { id } = req.params;

    const getData = await App.findOne({ _id: id });
    res.render("edittTeacherApp", { app: getData });
  })

  .post("/editTeacherApp/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, language, skills } = req.body;

    App.updateOne({ _id: id }, { name, email, phoneNumber, language, skills })
      .then(() => {
        console.log("successfully! updated the app service!");
        res.redirect("/teacherApp");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
