const express = require('express');
const router = express.Router()
const Rate = require('../models/rate');
const Course = require('../models/course');
//const User = require('../models/user');
const passport = require('passport');
require('../config/auth');
//require('../config/passport')(passport);;
require('../models/user');
const Freelancer = require('../models/freelancer');
const isAuth = require('../middleware/is-auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const user = require('../models/user');

const MY_DOMAIN = "http://localhost:3000";

function isLoggedIn(req, res, next){
      if(req.session.isLoggedIn){
          next();
      }else{
        res.redirect('/login');
      }
}




// Course rate
router.post('/rateCourse/:id/rates',isLoggedIn,(req,res) => {  
             
  var test;
if(req.freelancer){
test = req.freelancer.name
}else{
test = req.user.name
}

  const rate = new Rate({
      Name: test,
      star: req.body.star,
      comment: req.body.comment

 });

rate.save((err, result)=> {
     if(err){
       console.log(err)

     }else{
      Course.findById(req.params.id, (err, course) =>{
             if(err){
                 console.log(err);
             
             }else{
                

              course.stars.push(rate);
              course.comments.push(rate);
              course.save();

                console.log(course.comments);
                res.redirect('/courses/'+req.params.id);
             }

         })
        
     }  
 
 
})

});

// frelancer rate

router.post('/postedServices/:id/:id',isLoggedIn,(req,res) => {  
             
  var test;
if(req.freelancer){
test = req.freelancer.name
}else{
test = req.user.name
}

  const rate = new Rate({
      Name: test,
      star: req.body.star,
      comment: req.body.comment

 });

rate.save((err, result)=> {
     if(err){
       console.log(err)

     }else{
      Freelancer.findById(req.params.id, (err, freelancer) =>{
             if(err){
                 console.log(err);
             
             }else{
                

              freelancer.stars.push(rate);
              freelancer.comments.push(rate);
              freelancer.save();

                console.log(freelancer.comments);
                res.redirect('/Courses');
             }

         })
        
     }  
 
 
})

});

module.exports = router;