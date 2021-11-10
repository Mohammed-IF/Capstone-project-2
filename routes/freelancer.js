const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth-freelancer');

const freelancerController = require('../controllers/freelancer');
//const portfolio = require('../models/portfolio');

const router = express.Router();


router.get('/postedServices', isAuth, freelancerController.getPostedServices);


router.get('/customServices', isAuth, freelancerController.getCustomServices);


router.get('/add-postedService', isAuth, freelancerController.getAddPostedService);


router.post(
  '/add-postedService',
  isAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .trim(),
      body('category')
      .not()
      .isEmpty(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 3, max: 200 })
      .trim()
  ],
  freelancerController.postAddPostedService
);


router.get('/edit-postedService/:postedServiceId', isAuth, freelancerController.getEditPostedService);


router.post(
  '/edit-postedService',
  isAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('description')
      .isLength({ min: 3, max: 200 })
      .trim()
  ],
  freelancerController.postEditPostedService
);


router.delete('/postedService/:postedServiceId',isAuth, freelancerController.deletePostedService);



router.get('/portfolios', isAuth, freelancerController.getPortfolios);


router.get('/add-portfolio', isAuth, freelancerController.getAddPortfolio);


router.post(
  '/add-portfolio',
  isAuth,
  [
    body('previousWork')
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('yearsOfExperinece').isFloat(),
  body('description')
    .isLength({ min: 3, max: 200 })
    .trim()
  ],
  freelancerController.postAddPortfolio
);


router.get('/edit-portfolio/:portfolioId',isAuth, freelancerController.getEditPortfolio);


router.post(
  '/edit-portfolio',
  isAuth,
  [
    body('previousWork')
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('description')
    .isLength({ min: 3, max: 200 })
    .trim()
  ],
  freelancerController.postEditPortfolio
);
router.get('/portfolios/:portfolioId', freelancerController.getPortfolio);

router.delete('/portfolio/:portfolioId', isAuth, freelancerController.deletePortfolio);


module.exports = router;
