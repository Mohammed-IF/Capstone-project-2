const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/authAdmin');
const Admin = require('../models/admin');

const router = express.Router();

router.get('/login3', authController.getLogin);

router.get('/signup3', authController.getSignup);

router.post(
  '/login3',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
  ],
  authController.postLogin
);

router.post(
  '/signup3',
  [
    body(
      'name'
    )
      .isLength({ min: 5 })
      .trim(),
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return Admin.findOne({ email: value }).then(admin => {
          if (admin) {
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

router.post('/logout3', authController.postLogout);

router.get('/reset3', authController.getReset);

router.post('/reset3', authController.postReset);

router.get('/reset3/:token', authController.getNewPassword);

router.post('/new-password3', authController.postNewPassword);

module.exports = router;
