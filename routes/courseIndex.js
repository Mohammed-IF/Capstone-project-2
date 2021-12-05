const express = require('express');
const router = express.Router()


const Course = require("../models/course")
const ITEMS_PER_PAGE = 3;
/*function isLoggedIn(req, res, next){
    if(req.session.isLoggedIn){
        next();
    }else{
      res.redirect('/login1');
    }
*/


router.get("/coursesFiltered", async (req, res) => {
    const page = +req.query.page || 1;
    let totalItems;
    

    let category = req.query.category

    if( category && category !== 'all'){
    Course.find()
    .countDocuments()
    .then(numCourses => {
      totalItems = numCourses;

      return Course.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
        const allCourses = await Course.find({category: category});
        totalItems =  allCourses
        res.render("courses/coursesFiltered", { 
            prods: allCourses,
            pageTitle: 'All Courses',
            path: '/coursesFiltered',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE) });

    }else{

    const allCourses = await Course.find();
    
    res.render("courses/coursesFiltered", { 
        prods: allCourses,
        pageTitle: 'All Courses',
        path: '/coursesFiltered',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
    
         } 



  });
  

module.exports = router;
