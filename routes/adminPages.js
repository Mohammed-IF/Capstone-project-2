const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth-admin');

const adminController = require('../controllers/adminPages');
//const portfolio = require('../models/portfolio');

const router = express.Router();

router.get('/admin/index', adminController.getIndex);
// /admin/products => GET
//router.get('/admin/postedServices', isAuth, adminController.getPostedServices);


// /admin/edit-product => GET
router.get('/admin/edit-postedService/:postedServiceId', isAuth, adminController.getEditPostedService);

// /admin/edit-product => POST
router.post(
  '/admin/edit-postedService',
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
  adminController.postEditPostedService
);

// // /admin/delete-product => POST
router.delete('/admin/postedService/:postedServiceId',isAuth, adminController.deletePostedService);


// /admin/products => GET
router.get('/admin/portfolios', isAuth, adminController.getPortfolios);

// /admin/add-product => GET

// /admin/edit-product => GET
router.get('/admin/edit-portfolio/:portfolioId',isAuth, adminController.getEditPortfolio);

// /admin/edit-product => POST
router.post(
  '/admin/edit-portfolio',
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
  adminController.postEditPortfolio
);

// // /admin/delete-product => POST
router.delete('/admin/portfolio/:portfolioId', isAuth, adminController.deletePortfolio);


module.exports = router;
