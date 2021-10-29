const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/authFreelancer');
const Freelancer = require('../models/freelancer');

const router = express.Router();

router.get('/login1', authController.getLogin);

router.get('/signup1', authController.getSignup);

router.post(
  '/login1',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
  ],
  authController.postLogin
);

router.post(
  '/signup1',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return Freelancer.findOne({ email: value }).then(freelancer => {
          if (freelancer) {
            return Promise.reject(
              'Email already exists, please pick a different one'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text with at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords don't match");
        }
        return true;
      })
      .trim()
  ],
  authController.postSignup
);

router.post('/logout1', authController.postLogout);

router.get('/reset1', authController.getReset);

router.post('/reset1', authController.postReset);

router.get('/reset1/:token', authController.getNewPassword);

router.post('/new-password1', authController.postNewPassword);

module.exports = router;
