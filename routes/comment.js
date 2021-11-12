const express = require('express');
const Custom = require('../models/Custom');
const router = express.Router()
const Comment = require('../models/comment');
//const User = require('../models/user');
const PostedService = require('../models/postedService');
const passport = require('passport');
require('../config/auth');
//require('../config/passport')(passport);;
require('../models/user');
const freelancer = require('../models/freelancer');
const Article = require('../models/Article');
const Question = require('../models/Question');
const isAuth = require('../middleware/is-auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const user = require('../models/user');

const MY_DOMAIN = "http://localhost:3000";
function isLoggedIn(req, res, next){
      if(req.session.isLoggedIn){
          next();
      }else{
        res.redirect('login1');
      }


}
function isLoggedIn1(req, res, next){
  if(req.session.isLoggedIn){
      next();
  }else{
    res.redirect('login');
  }
}

router.post('/customReq/:id/comments', isLoggedIn, (req,res) => {  
    
     const comment = new Comment({
         freelancerName: req.freelancer.name,
         bidPrice: req.body.bidPrice,
         comment: req.body.comment,
         freelancerId: req.freelancer

    });

   comment.save((err, result)=> {
        if(err){
          console.log(err)

        }else{
          Custom.findById(req.params.id, (err, custom) =>{
                if(err){
                    console.log(err);
                
                }else{
                   
                  custom.comments.push(result);
                  custom.save();

                   console.log(custom.comments);
                   res.redirect('/freelancer/customServices');
                }

            })
           
        }  
    
    
   })

});

router.post('/customRes/:id/comments', isLoggedIn1, (req,res) => {  
    
  const comment = new Comment({
      freelancerName: req.user.name,
      comment: req.body.comment,
      freelancerId: req.user

 });

comment.save((err, result)=> {
     if(err){
       console.log(err)

     }else{
       Custom.findById(req.params.id, (err, custom) =>{
             if(err){
                 console.log(err);
             
             }else{
                
               custom.comments.push(result);
               custom.save();

                console.log(custom.comments);
                res.redirect('/Custom');
             }

         })
        
     }  
 
 
})

});

router.post('/postedmReq/:id/comments', isLoggedIn, (req,res) => {  
    
  const comment = new Comment({
      userName: req.user.name,
      quotePrice: req.body.bidPrice,
      comment: req.body.comment,
      userId: req.user

 });

comment.save((err, result)=> {
     if(err){
       console.log(err)

     }else{
       Custom.findById(req.params.id, (err, custom) =>{
             if(err){
                 console.log(err);
             
             }else{
                
               custom.comments.push(result);
               custom.save();

                console.log(custom.comments);
                res.redirect('/freelancer/customServices');
             }

         })
        
     }  
 
 
})

});
//router.get("/acceptBid/:title/:contnet/:categoty/:price", async (req, res) => {
  //router.get("/acceptBid/:price", async (req, res) => {
   
  /*const { title } = req.params;
  const {content} = req.params;
  const {category} = req.params;
  const {price} = req.params;
  const quantity =0;
  let customServices;
  //const email1 = App.findOne({ email: email });
  /*transporter.sendMail({
      to: email,
      from: 'm.i.f.15@outlook.sa',
      subject: 'Application response',
      html: `<p>You have been accepted as freelancer</p>
          <p>please sigunp through the following link <a href="http://localhost:3000/signup1">here</a>`
    });*/
    /*
    stripe.charges.create({
      amount: price,
      source: req.body.stripeTokenId,
      currency: 'usd'
    }).then(function() {
      console.log('Charge Successful')
      res.json({ message: 'Successfully purchased items' })
    }).catch(function() {
      console.log('Charge Fail')
      res.status(500).end()
    })
    const { customService } = req.body;
    /*const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "USD",
                    customService_data: {
                        title: title,
                        content: content,
                        category: category
                    },
                    unit_amount: price * 100,
                },
                //quantity: 1
            },
        ],
        mode: "payment",
        success_url: `${MY_DOMAIN}/success.html`,
        cancel_url: `${MY_DOMAIN}/cancel.html`,
    });

    res.json({ id: session.id });
/*
  App.deleteOne({ _id: id })
    .then(() => {
      console.log("Deleted app service successfully!");
      res.redirect("/App");
    })
    .catch((err) => console.log(err));
    */
//})
router.get("/acceptBid/:title/:price/:categoty/:content/:freelancerName/:freelancerId", async (req, res) => {
  const { title } = req.params;
  const {price} = req.params;
  const {category} = req.params;
  const {content} = req.params;
  const {freelancerName} = req.params;
  const {freelancerId} = req.params;


  const postedService = new PostedService({
    title : title,
    price : price,
    category : category,
    description : content,
    name: freelancerName,
    freelancerId: freelancerId
    
  })
  postedService
      .save()
      .then(() => {
        console.log("Service Saved Successfully!");
       res.redirect("/customCart");
       req.user.addCustomToCart(postedService._id)
      //res.redirect("/customCheckout/"+postedService._id);
    /*  PostedService.findById(postedService._id)
    .then(postedService => {
      return req.user.addCustomToCart(postedService);
    })
    .then(result => {
      res.redirect('/customCart/'+postedService._id);
    });*/
      })
      
     /* PostedService.deleteOne({ _id: postedService._id })
      .then(() => {
        console.log("Delete service successfully!");
        res.redirect("/");
      })
      */
      .catch((err) => console.log(err));
})

// article comment
router.post('/article/:id/comments',(req,res) => {  
    
    const comment = new Comment({
        author: req.user.name,
        comment: req.body.comment

   });

  comment.save((err, result)=> {
       if(err){
         console.log(err)

       }else{
        Article.findById(req.params.id, (err, article) =>{
               if(err){
                   console.log(err);
               
               }else{
                  
                article.comments.push(result);
                article.save();

                  console.log(article.comments);
                  res.redirect('/Article');
               }

           })
          
       }  
   
   
  })

});

// Question comment

router.post('/question/:id/comments',isLoggedIn,(req,res) => {  
    
  const comment = new Comment({
      author: req.user.name,
      comment: req.body.comment

 });

comment.save((err, result)=> {
     if(err){
       console.log(err)

     }else{
      Question.findById(req.params.id, (err, question) =>{
             if(err){
                 console.log(err);
             
             }else{
                
              question.comments.push(result);
              question.save();

                console.log(question.comments);
                res.redirect('/Question');
             }

         })
        
     }  
 
 
})

});
module.exports = router;