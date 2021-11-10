const express = require('express');
const router = express.Router()


const Custom = require("../models/Custom")

/*function isLoggedIn(req, res, next){
    if(req.session.isLoggedIn){
        next();
    }else{
      res.redirect('/login1');
    }
*/


router.get("/freelancer/customServices", async (req, res) => {

    let category = req.query.category

    if( category && category !== 'all'){
    
        const allCustoms = await Custom.find({category: category});
        res.render("freelancer/customServices", { customs: allCustoms });

    }else{

    const allCustoms = await Custom.find();
    res.render("freelancer/customServices", { customs: allCustoms });
         } 



  });
  

module.exports = router;
