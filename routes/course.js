const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth-teacher');

const teacherController = require('../controllers/course');
//const portfolio = require('../models/portfolio');

const router = express.Router();


router.get('/teacher/dashboard', isAuth, teacherController.getCourses);





router.get('/create-course', isAuth, teacherController.getAddCourse);


router.post(
  '/create-course',
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
      .trim(),
      body('wistiaId')
      .not()
      .isEmpty()
  ],
  teacherController.postAddCourse
);


module.exports = router;