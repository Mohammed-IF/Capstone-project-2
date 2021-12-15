const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth-freelancer');

const freelacnerController = require('../controllers/freelancerPages');

const router = express.Router();


function isLoggedIn(req, res, next){
      if(req.session.isLoggedIn){
          next();
      }else{
        res.redirect('/login1');
      }
}








router.get('/freelancerPages',isLoggedIn, freelacnerController.getIndex);

router.get('/freelancerPages/postedServices',isLoggedIn, freelacnerController.getPostedServices);

router.get('/freelancerPages/postedServices/:postedServiceId', freelacnerController.getPostedService);

module.exports = router;