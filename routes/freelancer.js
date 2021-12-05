const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth-freelancer');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const freelancerController = require('../controllers/freelancer');
const user = require('../models/user');
const Freelancer = require('../models/freelancer');
//const portfolio = require('../models/portfolio');

const router = express.Router();


router.get('/postedServices', isAuth, freelancerController.getPostedServices);


router.get('/customServices', isAuth, freelancerController.getCustomServices);


router.get('/add-postedService', isAuth, freelancerController.getAddPostedService);


router.post(
  '/add-postedService',
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
      .trim()
  ],
  freelancerController.postAddPostedService
);


router.get('/edit-postedService/:postedServiceId', isAuth, freelancerController.getEditPostedService);


router.post(
  '/edit-postedService',
  isAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('description')
      .isLength({ min: 3, max: 200 })
      .trim()
  ],
  freelancerController.postEditPostedService
);


router.delete('/postedService/:postedServiceId',isAuth, freelancerController.deletePostedService);



router.get('/portfolios', isAuth, freelancerController.getPortfolios);


router.get('/add-portfolio', isAuth, freelancerController.getAddPortfolio);


router.post(
  '/add-portfolio',
  isAuth,
  [
    body('previousWork')
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('yearsOfExperinece').isFloat(),
  body('description')
    .isLength({ min: 3, max: 200 })
    .trim()
  ],
  freelancerController.postAddPortfolio
);

/*router
  .get("/add-portfolio", (req, res) => { 
    res.render("freelancer/edit-portfolio");
  })

  .post("/add-portfolio", (req, res) => {
 
    const {image, previousWork, yearsOfExperience, description} = req.body;
    
    // * check for the missing fields!
    if (!previousWork || !yearsOfExperience)
      return res.send("Please enter all the required credentials!");

      const newPortfolio = new Portfolio({image, previousWork, yearsOfExperience, description});

    // save the blog to the database
    newPortfolio
      .save()
      .then(() => {
        console.log("Portfolio Saved Successfully!");
       // const alert = require('alert');
      // const {alert} = require('node-popup');
         // alert("Thank you, we will contact you by email soon.");
        res.redirect("/freelancer/portfolios");
      })
      .catch((err) => console.log(err));
  });
*/
router.get('/edit-portfolio/:portfolioId',isAuth, freelancerController.getEditPortfolio);


router.post(
  '/edit-portfolio',
  isAuth,
  [
    body('previousWork')
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('description')
    .isLength({ min: 3, max: 200 })
    .trim()
  ],
  freelancerController.postEditPortfolio
);
//router.get('/portfolios/:portfolioId', freelancerController.getPortfolio);

router.delete('/portfolio/:portfolioId', isAuth, freelancerController.deletePortfolio);


router.get("/freelancerRevenue/:id/:money", (req, res) => { 
  const { id } = req.params;
  const { money} = req.params;

  Freelancer.updateOne({ _id: id }, { "revenue":{money} })
    .then(() => {
      console.log("successfully! updated the app service!");
 
    })
    .catch((err) => console.log(err));
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
           // Freelancer.updateOne({_id:p.postedServiceId.freelancerId},{"revenue":p.postedServiceId.price * 100})
          }),
          success_url:
            req.protocol + '://' + req.get('host') + '/checkout/success',
          cancel_url:
            req.protocol + '://' + req.get('host') + '/checkout/cancel'
        })
        .then(session => {
          res.render('freelancer/freelancerRevenue', {
            path: '/freelancer/freelancerRevenue',
            pageTitle: 'Checkout',
            postedServices,
            totalSum: total,
            sessionId: session.id
          });
        });
    });
})
router.get('/revenueReport', function(req, res, next) {
  var revenue = 0;
  Freelancer.findOne({ _id: req.freelancer._id }, function(err, foundFreelancer) {
    foundFreelancer.revenue.forEach(function(value) {
      revenue += value;
    });

    res.render('freelancer/revenueReport', { revenue: revenue });
  });
});
router
  .get("/postPort/:fId/:pId", (req, res) => { 
    res.render("freelancer/portfolios", {
        prods: portfolio,
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

  .put("/postPort/:fId/:portfolioId", (req, res) => {
 
    const {fId} = req.params;
    const {portfolioId} = req.params;
    // * check for the missing fields!
    Freelancer.findByIdAndUpdate({ _id:fId },{portfolioId:portfolioId})
      .then(() => {
        console.log("Application Saved Successfully!");
       // const alert = require('alert');
      // const {alert} = require('node-popup');
         // alert("Thank you, we will contact you by email soon.");
        res.redirect("/freelancer/portfolios");
      })
      .catch((err) => console.log(err));
  });
module.exports = router;
