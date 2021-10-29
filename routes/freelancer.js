const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth-freelancer');

const freelancerController = require('../controllers/freelancer');
//const portfolio = require('../models/portfolio');

const router = express.Router();

// /admin/products => GET
router.get('/postedServices', isAuth, freelancerController.getPostedServices);

// /admin/add-product => GET
router.get('/add-postedService', isAuth, freelancerController.getAddPostedService);

// /admin/add-product => POST
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
    body('price').isFloat(),
    body('description')
      .isLength({ min: 3, max: 200 })
      .trim()
  ],
  freelancerController.postAddPostedService
);

// /admin/edit-product => GET
router.get('/edit-postedService/:postedServiceId', isAuth, freelancerController.getEditPostedService);

// /admin/edit-product => POST
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

// // /admin/delete-product => POST
router.delete('/postedService/:postedServiceId',isAuth, freelancerController.deletePostedService);


// /admin/products => GET
router.get('/portfolios', isAuth, freelancerController.getPortfolios);

// /admin/add-product => GET
router.get('/add-portfolio', isAuth, freelancerController.getAddPortfolio);

// /admin/add-product => POST
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

// /admin/edit-product => GET
router.get('/edit-portfolio/:portfolioId',isAuth, freelancerController.getEditPortfolio);

// /admin/edit-product => POST
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

// // /admin/delete-product => POST
router.delete('/portfolio/:portfolioId', isAuth, freelancerController.deletePortfolio);


module.exports = router;
