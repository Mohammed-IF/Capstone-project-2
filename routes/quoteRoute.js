const express = require('express');
const router = express.Router()
var Quote = require("../models/quote");
const Posted = require("../models/postedService");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
require('../config/auth');
require('../routes/authUser');
require('../models/user');
const isAuth = require('../middleware/is-auth-freelancer');
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }}));

router.get("/acceptQuote/:quoteId/:postedId/:price/:description/:email", isAuth, (req, res) => {
  const { quoteId } = req.params;
  const { postedId } = req.params;
  const { price } = req.params;
  const { description } = req.params;
  const {email} = req.params;

  transporter.sendMail({
      to: email,
      from: 'm.i.f.15@outlook.sa',
      subject: 'Quote response',
      html: `<p>Your quote have been accepted</p>`
    });
    Posted.updateOne({ _id: postedId }, { price, description })
    .then(() => {
      console.log("successfully! updated the posted service!");
    })
      Quote.deleteOne({ _id: quoteId })
    .then(() => {
      console.log("Deleted quote successfully!");
      res.redirect("/freelancerPages");
    })
    .catch((err) => console.log(err));
})

router.get("/rejectQuote/:id/:email", isAuth, (req, res) => {   
  const { id } = req.params;
  const {email} = req.params;
 
  transporter.sendMail({
      to: email,
      from: 'm.i.f.15@outlook.sa',
      subject: 'Quote response',
      html: `<p>Sorry, Your quote has been rejected</p>`
    });
  Quote.deleteOne({ _id: id })
    .then(() => {
      console.log("Deleted app service successfully!");
      res.redirect("/freelancerPages");
    })
    .catch((err) => console.log(err));
})
module.exports = router;