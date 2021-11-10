const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const PostedService = require('../models/postedService'); 
const Portfolio = require('../models/portfolio'); 
const Order = require('../models/order');
const Quote = require('../models/quote'); 
const user = require('../models/user');
const quote = require('../models/quote');

const ITEMS_PER_PAGE = 3;

exports.getIndex = async(req, res, next) => {
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
      res.render('shop/index', {
        prods: postedServices,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => console.log(err));
     
  }
exports.getPostedServices = (req, res, next) => {
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
      res.render('shop/postedService-list', {
        prods: postedServices,
        pageTitle: 'All PostedServices',
        path: '/postedServices',
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

exports.getPostedService = (req, res, next) => {
  const prodId = req.params.postedServiceId;
  //const porId = req.params.portfolioId;
  PostedService.findById(prodId).then(postedService => {
    res.render('shop/postedService-detail', {
      postedService: postedService,
      pageTitle: postedService.title,
      path: '/postedServices'
    });
  });
  
};
exports.getPostedService1 = (req, res, next) => {
  const prodId = req.params.postedServiceId;
  //const porId = req.params.portfolioId;
  PostedService.findById(prodId).then(postedService => {
    res.render('postQuote', {
      postedService: postedService,
      pageTitle: postedService.title,
      path: '/postQuote'
    });
  });
};
/*Portfolio.findById(porId).then(portfolio => {
    res.render('shop/postedService-detail', {
      portfolio: portfolio,
      pageTitle: portfolio.name,
      path: '/postedServices'
    });
  }); */
exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.postedServiceId')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        postedServices: user.cart.items
      });
    })
    .catch(err => console.log(err));
};

exports.addToCart = (req, res, next) => {
  const prodId = req.body.postedServiceId;
  PostedService.findById(prodId)
    .then(postedService => {
      return req.user.addToCart(postedService);
    })
    .then(result => {
      res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({
    'user.userId': req.user._id
  })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        orders: orders,
        pageTitle: 'Your Orders'
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.postedServiceId')
    .execPopulate()
    .then(user => {
      const postedServices= user.cart.items.map(item => {
        return { quantity: item.quantity, postedService: { ...item.postedServiceId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        postedServices: postedServices
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.postedServiceId;
  req.user
    .removeFromCart(prodId)
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data/invoices', invoiceName);

      const pdfDoc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });

      pdfDoc.text('----------------------');

      let total = 0;
      order.postedServices.forEach(prod => {
        total += prod.quantity * prod.postedService.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.postedService.title +
              ' - ' +
              prod.quantity +
              ' x $ ' +
              prod.postedService.price
          );
      });

      pdfDoc.text('-----------------');
      pdfDoc.fontSize(20).text('Total Price: $ ' + total);
      pdfDoc.end();

      // fs.readFile(invoicePath, (err, data) => {
      //   if(err){
      //     return next(err)
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'attachment; filename="'+invoiceName+'"');
      //   res.send(data);
      // })

      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'attachment; filename="'+invoiceName+'"');
      // file.pipe(res);
    })
    .catch(err => next(err));
};

exports.getCheckout = (req, res, next) => {
  let postedServices,
    total = 0;
  req.user
    .populate('cart.items.postedServiceId')
    .execPopulate()
    .then(user => {
      postedServices = user.cart.items;
      postedServices.forEach(p => (total += p.quantity * p.postedServiceId.price));
      return stripe.checkout.sessions
        .create({
          payment_method_types: ['card'],
          line_items: postedServices.map(p => {
            return {
              name: p.postedServiceId.title,
              description: p.postedServiceId.description,
              amount: p.postedServiceId.price * 100,
              currency: 'usd',
              quantity: p.quantity
            };
          }),
          success_url:
            req.protocol + '://' + req.get('host') + '/checkout/success',
          cancel_url:
            req.protocol + '://' + req.get('host') + '/checkout/cancel'
        })
        .then(session => {
          res.render('shop/checkout', {
            path: '/checkout',
            pageTitle: 'Checkout',
            postedServices,
            totalSum: total,
            sessionId: session.id
          });
        });
    });
};
exports.getAddQuote = (req, res, next) => {
  let quote = { description: '', image: { url: '' } };
  res.render('shop/edit-quote', {
    quote: quote,
    pageTitle: 'Add quote',
    path: '/add-quote',
    editing: false,
    errorMessage: null,
    validationErrors: [],
    oldInput: { description: '', imageUrl: ''}
  });
};

exports.postAddQuote = (req, res, next) => {
  const description = req.body.description;
  const image = req.file;

  if (!image) {
    return res.status(422).render('shop/edit-quote', {
      quote: {
        description
      },
      pageTitle: 'Add Quote',
      path: '/add-quote',
      editing: false,
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
      oldInput: {description }
    });
  }

  const quote  = new Quote ({
    description,
    image: {
      url: image.url,
      public_id: image.public_id
    },
     userId: req.user,
     postedServiceId: req.postedService
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('shop/edit-quote', {
     quote: quote,
      pageTitle: 'Add Quote',
      path: '/add-quote',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: {description, image}
    });
  }

  quote 
    .save()
    .then(result => {
      console.log('Created Quote');
      res.redirect('/shop/index');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 404;
      next(error);
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
      res.render('shop/postedService-list', {
        pors: porfolios,
        pageTitle: 'Freelancer Portfolios',
        path: '/postedServices',
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
  //const prodId = req.params.postedServiceId;
  const porId = req.params.portfolioId;
  Portfolio.findById(porId).then(portfolio => {
    res.render('shop/postedService-detail', {
      portfolio: portfolio,
      //pageTitle: portfolio.title,
      path: '/postedServices'
    });
  });
  
};


