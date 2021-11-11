const express = require('express');
const router = express.Router()


const PostedService = require("../models/postedService")
const ITEMS_PER_PAGE = 3;
/*function isLoggedIn(req, res, next){
    if(req.session.isLoggedIn){
        next();
    }else{
      res.redirect('/login1');
    }
*/


router.get("/", async (req, res) => {
    const page = +req.query.page || 1;
    let totalItems;
    PostedService.find()
    .countDocuments()
    .then(numPostedServices => {
      totalItems = numPostedServices;

      return PostedService.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })

    let category = req.query.category

    if( category && category !== 'all'){
    
        const allPostedServices = await PostedService.find({category: category});

        res.render("shop/index", { 
            prods: allPostedServices,
            pageTitle: 'All PostedServices',
            path: '/postedServices',
            currentPage: page,
            hasNextPage: 3 * page < 4,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(4 / 3) });

    }else{

    const allPostedServices = await PostedService.find();
    
    res.render("shop/index", { 
        prods: allPostedServices,
        pageTitle: 'All PostedServices',
        path: '/',
        currentPage: page,
        hasNextPage: 3 * page < 4,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(4 / 3)
    });
    
         } 



  });
  

module.exports = router;
