const { validationResult } = require('express-validator');
const cloudinary = require('../cloudinaryConfig');
const PostedService = require('../models/postedService');
const Freelancer = require('../models/freelancer');
const CustomService = require('../models/Custom');
const Portfolio = require('../models/portfolio');
const fileHelper = require('../util/file');

const ITEMS_PER_PAGE = 3;

exports.getAddPostedService = (req, res, next) => {
  let postedService = { title: '', price: '', category: '', description: '', image: { url: '' } };
  res.render('freelancer/edit-postedService', {
    postedService: postedService,
    pageTitle: 'Add PostedService',
    path: '/freelacner/add-postedService',
    editing: false,
    errorMessage: null,
    validationErrors: [],
    oldInput: { title: '', imageUrl: '', category: '',price: '', description: '' }
  });
};

exports.postAddPostedService  = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const category = req.body.category;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render('freelancer/edit-postedService', {
      postedService: {
        title,
        category,
        price,
        description
      },
      pageTitle: 'Add PostedService',
      path: '/freelancer/add-postedService',
      editing: false,
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
      oldInput: { title, category, price, description }
    });
  }

  const postedService  = new PostedService ({
    title,
    category,
    price,
    image: {
      url: image.url,
      public_id: image.public_id
    },
    description,
    name: req.freelancer.name,
    freelancerId: req.freelancer
  /*portfolio: {
    previousWork: req.portfolio.previousWork,
    yearsOfExperinece: req.portfolio.yearsOfExperinece,
    description: req.portfolio.description,
    freelancerId: req.freelancer
  }*/
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('freelancer/edit-postedService', {
      postedService: postedService,
      pageTitle: 'Add PostedService',
      path: '/freelancer/add-postedService',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { title, image, category, description }
    });
  }

  postedService 
    .save()
    .then(result => {
      console.log('Created PostedService');
      res.redirect('/freelancer/postedServices');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getEditPostedService = (req, res, next) => {
  const prodId = req.params.postedServiceId;
  PostedService.findById(prodId)
    .then(postedService  => {
      res.render('freelancer/edit-postedService', {
        postedService: postedService,
        pageTitle: 'Edit PostedService',
        path: '/freelancer/add-postedService',
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
  const category = req.body.category; 
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('freelancer/edit-postedService', {
      postedService: {
        title,
        category,
        price,
        description,
        _id: prodIdDesigns
      },
      pageTitle: 'Edit PostedService',
      path: '/freelancer/add-postedService',
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  PostedService.findById(prodId)
    .then(postedService  => {
      if (postedService.freelancerId.toString() !== req.freelancer._id.toString()) {
        res.redirect('/freelancerPages');
      }
      postedService.title = title;
      postedService.category = category;
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
      return postedService.save().then(() => res.redirect('/freelancer/postedServices'));
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
      return PostedService.deleteOne({ _id: prodId, freelancerId: req.freelancer._id });
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

      return PostedService.find({ freelancerId: req.freelancer._id })
        .populate('freelancerId')
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(postedServices => {
      res.render('freelancer/postedServices', {
        prods: postedServices,
        pageTitle: 'Freelancer PostedServices',
        path: '/freelancer/postedServices',
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


exports.getAddPortfolio = (req, res, next) => {
  let portfolio = { previousWork: '', yearsOfExperinece: '', description: '', image: { url: '' } };
  res.render('freelancer/edit-portfolio', {
    portfolio: portfolio,
    pageTitle: 'Add Portfolio',
    path: '/freelacner/add-portfolio',
    editing: false,
    errorMessage: null,
    validationErrors: [],
    oldInput: { previousWork: '', imageUrl: '', yearsOfExperinece: '', description: '' }
  });
};

exports.postAddPortfolio = (req, res, next) => {
  const previousWork = req.body.previousWork;
  const image = req.file;
  const yearsOfExperinece = req.body.yearsOfExperinece;
  const description = req.body.description;
  const portfolioNum =0;
 
  if (!image) {
    return res.status(422).render('freelancer/edit-portfolio', {
      portfolio: {
        previousWork,
        yearsOfExperinece,
        description
      },
      pageTitle: 'Add Portfolio',
      path: '/freelancer/add-portfolio',
      editing: false,
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
      oldInput: { previousWork, yearsOfExperinece, description }
    });
  }
  const portfolioNumber = portfolioNum + 1;
  
  const portfolio  = new Portfolio ({
    portfolioNumber,
    previousWork,
    yearsOfExperinece, 
    image: {
      url: image.url,
      public_id: image.public_id
    },
    description,
    freelancerId: req.freelancer,
    name: req.freelancer.name
  });
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('freelancer/edit-portfolio', {
      portfolio: portfolio,
      pageTitle: 'Add Portfolio',
      path: '/freelancer/add-portfolio',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { previousWork, image, description }
    });
  }

  portfolio
    .save()
    .then(result => {
      console.log('Created Portfolio');
      res.redirect('/freelancer/portfolios');
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
      res.render('freelancer/edit-portfolio', {
        portfolio: portfolio,
        pageTitle: 'Edit Portfolio',
        path: '/freelancer/add-portfolio',
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
    return res.status(422).render('freelancer/edit-portfolio', {
      portfolio: {
        previousWork,
        yearsOfExperinece,
        description,
        _id: prodIdDesigns
      },
      pageTitle: 'Edit Portfolio',
      path: '/freelancer/add-portfolio',
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Portfolio.findById(prodId)
    .then(portfolio  => {
      if (portfolio.freelancerId.toString() !== req.freelancer._id.toString()) {
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
      return portfolio.save().then(() => res.redirect('/freelancer/portfolios'));
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

exports.getPortfolios = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Portfolio.find({ freelancerId: req.freelancer._id })
    .countDocuments()
    .then(numPortfolios => {
      totalItems = numPortfolios;

      return Portfolio.find({ freelancerId: req.freelancer._id })
        .populate('freelancerId')
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(porfolios => {
      res.render('freelancer/portfolios', {
        prods: porfolios,
        pageTitle: 'Freelancer Portfolios',
        path: '/freelancer/portfolios',
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

exports.getPortfolio = (req, res, next) => {
  const porId = req.params.portfolioId;

    
  Portfolio.findById(porId).then(portfolio => {
    res.render('freelancer/portfolios', {
      portfolio: portfolio,
      //pageTitle: postedService.title,
      path: '/portfolios'
    });
  })
  Freelancer.updateOne({ _id: req.freelancer }, { porId})
    .then(() => {
      console.log("successfully! updated the posted service!");
    })
}


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
    .then(customServices => {
      res.render('freelancerPages/customService-list', {
        prods: customServices,
        pageTitle: 'All CustomServices',
        path: '/freelancer/customServices',
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

exports.getCustomService = (req, res, next) => {
  const prodId = req.params.customServiceId;
  CustomService.findById(prodId).then(customService => {
    res.render('freelancerPages/customService-list', {
      customService: customService,
      pageTitle: customService.title,
      path: '/freelancer/customServices'
    });
  });
};