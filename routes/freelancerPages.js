const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth-freelancer');

const freelacnerController = require('../controllers/freelancerPages');

const router = express.Router();


function isLoggedIn(req, res, next){
      if(req.session.isLoggedIn){
          next();
      }else{
        res.redirect('/login1');
      }
}








router.get('/freelancerPages',isLoggedIn, freelacnerController.getIndex);

router.get('/freelancerPages/postedServices',isLoggedIn, freelacnerController.getPostedServices);

router.get('/freelancerPages/postedServices/:postedServiceId', freelacnerController.getPostedService);


/*
router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.addToCart);

router.post('/cart-delete-item', isAuth, shopController.deleteCartItem);

router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);

router.post('/checkout/cancel', isAuth, shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);
*/
module.exports = router;
