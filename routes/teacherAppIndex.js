const express = require('express');
const router = express.Router()


const App = require("../models/teacherApplication");


router.get("/teacherApp", async (req, res) => {

    let category = req.query.category

    if( category && category !== 'all'){
    
        const allApps = await App.find({category: category});
        res.render("App", { apps: allApps });

    }else{

    const allApps = await App.find();
    res.render("teacherApp", { apps: allApps });
         } 



  });
  

module.exports = router;

