const { validationResult } = require('express-validator');
const cloudinary = require('../cloudinaryConfig');
const CustomService = require('../models/Custom');
const Portfolio = require('../models/portfolio');
const fileHelper = require('../util/file');

const ITEMS_PER_PAGE = 3;

exports.getCustomServices = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
  
    CustomService.find({ userId: req.user._id })
      .countDocuments()
      .then(numCustomServices => {
        totalItems = numCustomServices;
  
        return CustomService.find({ userId: req.user._id })
          .populate('userId')
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(customServices => {
        res.render('user/customServices', {
          prods: customServices,
          pageTitle: 'User CustomServices',
          path: '/user/customServices',
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
  