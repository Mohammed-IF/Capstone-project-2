const express = require('express');
const router = express.Router()
var Quote = require("../models/quote");
const Posted = require("../models/postedService");
const swal = require('sweetalert');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
//const passport = require('passport');
require('../config/auth');
//require('../config/passport')(passport);;
const alert = require('node-popup');
//const popup = require('node-popup/dist/cjs.js');
require('../routes/authUser');
require('../models/user');
const isAuth = require('../middleware/is-auth-freelancer');
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

function isLoggedIn(req, res, next){
  if(req.session.isLoggedIn){
      next();
  }else{
    res.redirect('login1');
  }
}


router.post('/postedReq/:id/quotes', isLoggedIn, (req,res) => {  
    
  const quote = new Quote({
      userName: req.user.name,
      price: req.body.price,
      comment: req.body.comment,
      userId: req.user

 });

 quote.save((err, result)=> {
     if(err){
       console.log(err)

     }else{
      Posted.findById(req.params.id, (err, posted) =>{
             if(err){
                 console.log(err);
             
             }else{
                
               posted.quotes.push(result);
               posted.save();

                console.log(posted.quotes);
                res.redirect('/');
             }

         })
        
     }  
 
 
})

});
router.get("/acceptQuote/:quoteId/:postedId/:price/:description", isAuth, (req, res) => {

   
  const { quoteId } = req.params;
  const { postedId } = req.params;
  const { price } = req.params;
  const { description } = req.params;
  const {email} = req.params;
  //const email1 = App.findOne({ email: email });
  transporter.sendMail({
      to: 'm.a.f.15@hotmail.com',
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

router.get("/rejectQuote/:id", isAuth, (req, res) => {

   
  const { id } = req.params;
  const {email} = req.params;
  //const email1 = App.findOne({ email: email });
  transporter.sendMail({
      to: 'm.a.f.15@hotmail.com',
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
