const express = require('express');
const router = express.Router()


const PostedService = require("../models/postedService")

/*function isLoggedIn(req, res, next){
    if(req.session.isLoggedIn){
        next();
    }else{
      res.redirect('/login1');
    }
*/


/*router.get("/shop/index", async (req, res) => {

    let category = req.query.category

    if( category && category !== 'all'){
    
        const allPostedServices = await PostedService.find({category: category});
        res.render("shop/index", { customs: allPostedServices });

    }else{

    const allPostedServices = await PostedService.find();
    res.render("shop/index", { customs: allPostedServices });
         } 



  });
  */

module.exports = router;
