const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/authTeacher');
const Teacher = require('../models/teacher');

const router = express.Router();

router.get('/login2', authController.getLogin);

router.get('/signup2', authController.getSignup);

router.post(
  '/login2',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
  ],
  authController.postLogin
);

router.post(
  '/signup2',
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
        return Teacher.findOne({ email: value }).then(teacher => {
          if (teacher) {
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

router.post('/logout2', authController.postLogout);

router.get('/reset2', authController.getReset);

router.post('/reset2', authController.postReset);

router.get('/reset2/:token', authController.getNewPassword);

router.post('/new-password2', authController.postNewPassword);

module.exports = router;
