const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth');

const shopController = require('../controllers/shop');

const router = express.Router();

const { body } = require('express-validator');

router.get('/', shopController.getIndex);
router.get('/freelancerPortfoilo', shopController.getPortfolios);

router.get('/postedServices', shopController.getPostedServices);

router.get('/postedServices/:postedServiceId', shopController.getPostedService);
router.get('/postQuote/:postedServiceId', shopController.getPostedService1);

router.get('/cart', isAuth, shopController.getCart);
router.get('/customCart', isAuth, shopController.getCustomCart);

router.post('/cart', isAuth, shopController.addToCart);
router.post('/customCart/:postedServiceId', isAuth, shopController.addCustomToCart);

router.post('/cart-delete-item', isAuth, shopController.deleteCartItem);

router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);

router.get('/customCheckout/success', isAuth, shopController.getCustomCheckoutSuccess);

router.post('/checkout/cancel', isAuth, shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/customCheckout/:postedServiceId', isAuth, shopController.getCustomCheckout);
//router.get('/add-quote', isAuth,shopController.getAddQuote);

// /admin/add-product => POST
/*router.post(
  '/add-quote',
  isAuth,
  [
    body('description')
      .isLength({ min: 3, max: 200 })
      .trim()
  ],
 shopController.postAddQuote
);*/
module.exports = router;
