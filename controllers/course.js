const { validationResult } = require('express-validator');
const cloudinary = require('../cloudinaryConfig');
const Course = require('../models/course');
const Freelancer = require('../models/teacher');
const CustomService = require('../models/Custom');
const Portfolio = require('../models/portfolio');
const fileHelper = require('../util/file');

const ITEMS_PER_PAGE = 3;

exports.getAddCourse = (req, res, next) => {
  let course = { title: '', price: '', category: '', description: '', wistiaId:'', image: { url: '' } };
  res.render('teacher/create-course', {
    course: course,
    pageTitle: 'Add Course',
    path: '/create-course',
    editing: false,
    errorMessage: null,
    validationErrors: [],
    oldInput: { title: '', imageUrl: '', category: '', price: '', description: '', wistiaId:'' }
  });
};

exports.postAddCourse  = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const category = req.body.category;
  const price = req.body.price;
  const description = req.body.description;
  const wistiaId = req.body.wistiaId;

  if (!image) {
    return res.status(422).render('teacher/create-course', {
      course: {
        title,
        category,
        price,
        description,
        wistiaId
      },
      pageTitle: 'Add Course',
      path: '/create-course',
      editing: false,
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
      oldInput: { title, category, price, description, wistiaId }
    });
  }

  const course  = new Course ({
    title,
    category,
    price,
    image: {
      url: image.url,
      public_id: image.public_id
    },
    description,
    wistiaId,
    ownByTeacher: req.teacher
  /*portfolio: {
    previousWork: req.portfolio.previousWork,
    yearsOfExperinece: req.portfolio.yearsOfExperinece,
    description: req.portfolio.description,
    teacherId: req.teacher
  }*/
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('teacher/create-course', {
      course: course,
      pageTitle: 'Add Course',
      path: '/create-course',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { title, image, category, description, wistiaId }
    });
  }

  course 
    .save()
    .then(result => {
      console.log('Created Course');
      res.redirect('/teacher/dashboard');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCourses = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Course.find({ teacherId: req.teacher._id })
    .countDocuments()
    .then(numCourses => {
      totalItems = numCourses;

      return Course.find({ teacherId: req.teacher._id })
        .populate('teacherId')
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(courses => {
      res.render('teacher/teacher-dashboard', {
        prods: courses,
        pageTitle: 'Teacher Courses',
        path: '/teacher/dashboard',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
