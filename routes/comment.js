const express = require('express');
const Custom = require('../models/Custom');
const router = express.Router()
const Comment = require('../models/comment');
const User = require('../models/user');
const passport = require('passport');
require('../config/auth');
require('../config/passport')(passport);;
require('../models/user');

const Article = require('../models/Article');
const Question = require('../models/Question');

function isLoggedIn(req, res, next){
      if(req.session.isLoggedIn){
          next();
      }else{
        res.redirect('login1');
      }


}

router.post('/custom/:id/comments',isLoggedIn,(req,res) => {  
    
     const comment = new Comment({
         author: req.freelancer.name,
         comment: req.body.comment

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

// article comment
router.post('/article/:id/comments',isLoggedIn,(req,res) => {  
    
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