const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth');

const appController = require('../controllers/appController');
//const portfolio = require('../models/portfolio');

const router = express.Router();

//router.get('/postedServices', appController.getPostedServices);

// /admin/add-product => GET
router.get('/add-application', isAuth, appController.getAddApplication);

// /admin/add-product => POST
router.post(
  '/add-application',
  isAuth,
  [
    body('name')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('description')
      .isLength({ min: 3, max: 200 })
      .trim()
  ],
  appController.postAddApplication 
);

module.exports = router;
