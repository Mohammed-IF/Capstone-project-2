const express = require('express');
const router = express.Router()


const Custom = require("../models/Custom")


router.get("/Custom", async (req, res) => {

    let category = req.query.category

    if( category && category !== 'all'){
    
        const allCustoms = await Custom.find({category: category});
        res.render("Custom", { customs: allCustoms });

    }else{

    const allCustoms = await Custom.find();
    res.render("Custom", { customs: allCustoms });
         } 



  });
  

module.exports = router;

