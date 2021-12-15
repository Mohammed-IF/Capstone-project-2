
const { validationResult } = require('express-validator');
const cloudinary = require('../cloudinaryConfig');
const PostedService = require('../models/postedService');
const Portfolio = require('../models/portfolio');
const Course = require('../models/course');
const CustomService = require('../models/Custom');
const fileHelper = require('../util/file');

const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
  
    PostedService.find()
      .countDocuments()
      .then(numPostedServices => {
        totalItems = numPostedServices;
  
        return PostedService.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(postedServices => {
        res.render('adminPages/index', {
          prods: postedServices,
          pageTitle: 'adminPages',
          path: '/admin/index',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
      .catch(err => console.log(err));
  };
  

exports.getEditPostedService = (req, res, next) => {
    const prodId = req.params.postedServiceId;
    PostedService.findById(prodId)
      .then(postedService  => {
        res.render('adminPages/edit-postedService', {
          postedService: postedService,
          pageTitle: 'Edit PostedService',
          path: '/admin/add-postedService',
          editing: true,
          errorMessage: null,
          validationErrors: []
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  };
  
  exports.postEditPostedService  = (req, res, next) => {
    const prodId = req.body.postedServiceId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-postedService', {
        postedService: {
          title,
          price,
          description,
          _id: prodIdDesigns
        },
        pageTitle: 'Edit PostedService',
        path: '/admin/add-postedService',
        editing: true,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
  
    PostedService.findById(prodId)
      .then(postedService  => {
        if (postedService.freelancer.toString() !== req.freelancer._id.toString()) {
          res.redirect('/');
        }
        postedService.title = title;
        postedService.price = price;
        postedService.description = description;
        if (image) {
          cloudinary.v2.uploader.destroy(postedService.image.public_id, function(
            error,
            result
          ) {
            if (error) {
              error.httpStatusCode = 500;
              next(error);
            }
            console.log('Image deleted '.result);
          });
          postedService.image = { url: image.url, public_id: image.public_id };
        }
        return postedService.save().then(() => res.redirect('/admin/postedServices'));
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  };
  
  exports.deletePostedService = (req, res, next) => {
    const prodId = req.params.postedServiceId;
    PostedService.findById(prodId)
      .then(postedService => {
        if (!postedService) {
          return next(new Error('PostedService Not Found'));
        }
        cloudinary.v2.uploader.destroy(postedService.image.public_id, function(
          error,
          result
        ) {
          if (error) {
            error.httpStatusCode = 500;
            next(error);
          }
          console.log('Image deleted '.result);
        });
        return PostedService.deleteOne({ _id: prodId });
      })
      .then(() => {
        res.status(200).json({ message: 'Success' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to delete product' });
      });
  };
  
  exports.getPostedServices = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
  
    PostedService.find({ freelancerId: req.freelancer._id })
      .countDocuments()
      .then(numPostedServices => {
        totalItems = numPostedServices;
  
        return PostedService.find({ freelancer: req.freelancer._id })
          .populate('freelancerId')
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(postedServices => {
        res.render('admin/postedServices', {
          prods: postedServices,
          pageTitle: 'Admin PostedServices',
          path: '/admin/postedServices',
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

  exports.getEditPortfolio = (req, res, next) => {
    const prodId = req.params.portfolioId;
    Portfolio.findById(prodId)
      .then(portfolio  => {
        res.render('admin/edit-portfolio', {
          portfolio: portfolio,
          pageTitle: 'Edit Portfolio',
          path: '/admin/add-portfolio',
          editing: true,
          errorMessage: null,
          validationErrors: []
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  };
  
  exports.postEditPortfolio = (req, res, next) => {
    const prodId = req.body.portfolioId;
    const previousWork = req.body.previousWork;
    const yearsOfExperinece = req.body.yearsOfExperinece;
    const description = req.body.description;
    const image = req.file;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-portfolio', {
        portfolio: {
          previousWork,
          yearsOfExperinece,
          description,
          _id: prodIdDesigns
        },
        pageTitle: 'Edit Portfolio',
        path: '/admin/add-portfolio',
        editing: true,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
  
    Portfolio.findById(prodId)
      .then(portfolio  => {
        if (portfolio.adminId.toString() !== req.admin._id.toString()) {
          res.redirect('/');
        }
        portfolio.previousWork = previousWork; 
        portfolio.yearsOfExperinece = yearsOfExperinece;
        portfolio.description = description;
        if (image) {
          cloudinary.v2.uploader.destroy(portfolio.image.public_id, function(
            error,
            result
          ) {
            if (error) {
              error.httpStatusCode = 500;
              next(error);
            }
            console.log('Image deleted'.result);
          });
          portfolio.image = { url: image.url, public_id: image.public_id };
        }
        return portfolio.save().then(() => res.redirect('/admin/portfolios'));
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  };
  
  exports.deletePortfolio = (req, res, next) => {
    const prodId = req.params.portfolioId;
    Portfolio.findById(prodId)
      .then(portfolio => {
        if (!portfolio) {
          return next(new Error('Portfolio Not Found'));
        }
        cloudinary.v2.uploader.destroy(portfolio.image.public_id, function(
          error,
          result
        ) {
          if (error) {
            error.httpStatusCode = 500;
            next(error);
          }
          console.log('Image deleted'.result);
        });
        return Portfolio.deleteOne({ _id: prodId, freelancerId: req.freelancer._id });
      })
      .then(() => {
        res.status(200).json({ message: 'Success' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to delete portfolio' });
      });
  };
  
  /*exports.getPortfolios = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
  
    Portfolio.find({ adminId: req.admin._id })
      .countDocuments()
      .then(numPortfolios => {
        totalItems = numPortfolios;
  
        return Portfolio.find({ adminId: req.admin._id })
          .populate('adminId')
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(porfolios => {
        res.render('admin/portfolios', {
          prods: porfolios,
          pageTitle: 'Admin Portfolios',
          path: '/admin/portfolios',
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
  
*/
  exports.getPortfolios = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
  
    Portfolio.find()
      .countDocuments()
      .then(numPortfolios => {
        totalItems = numPortfolios;
  
        return Portfolio.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(portfolios => {
        res.render('adminPages/portfolios', {
          prods: portfolios,
          pageTitle: 'adminPages',
          path: '/admin/portfolios',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
      .catch(err => console.log(err));
  };
  exports.getCourses = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
  
    Course.find()
      .countDocuments()
      .then(numCourses => {
        totalItems = numCourses;
  
        return Course.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(courses => {
        res.render('adminPages/courses', {
          prods: courses,
          pageTitle: 'adminPages',
          path: '/admin/courses',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
      .catch(err => console.log(err));
  };

  exports.getCustomServices = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
  
    CustomService.find()
      .countDocuments()
      .then(numCustomServices => {
        totalItems = numCustomServices;
  
        return CustomService.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(customs => {
        res.render('adminPages/custom', {
          prods: customs,
          pageTitle: 'All CustomServices',
          path: '/admin/customServices',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
      .catch(err => console.log(err));
  };
  
  /*exports.getCustomService = (req, res, next) => {
    const prodId = req.params.customServiceId;
    CustomService.findById(prodId).then(customService => {
      res.render('adminPages/custom', {
        custom: custom,     
        pageTitle: customService.title,
        path: '/admin/customServices'
      });
    });
  };
  */
  