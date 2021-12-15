const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth-admin');
const Course = require('../models/course');
const adminController = require('../controllers/adminPages');
const Custom = require('../models/Custom');
//const portfolio = require('../models/portfolio');

const router = express.Router();

router.get('/admin/index', adminController.getIndex);
// /admin/products => GET
//router.get('/admin/postedServices', isAuth, adminController.getPostedServices);


// /admin/edit-product => GET
router.get('/admin/edit-postedService/:postedServiceId', isAuth, adminController.getEditPostedService);

// /admin/edit-product => POST
router.post(
  '/admin/edit-postedService',
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
  adminController.postEditPostedService
);

// // /admin/delete-product => POST
router.delete('/admin/postedService/:postedServiceId',isAuth, adminController.deletePostedService);


// /admin/products => GET
router.get('/admin/portfolios', isAuth, adminController.getPortfolios);

router.get('/admin/courses', isAuth, adminController.getCourses);

// /admin/add-product => GET

// /admin/edit-product => GET
router.get('/admin/edit-portfolio/:portfolioId',isAuth, adminController.getEditPortfolio);

// /admin/edit-product => POST
router.post(
  '/admin/edit-portfolio',
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
  adminController.postEditPortfolio
);

// // /admin/delete-product => POST
router.delete('/admin/portfolio/:portfolioId', isAuth, adminController.deletePortfolio);



/*router
  .get("/editCustom", (req, res) => { 
    res.render("adminPages/custom");
  })
  .get("/editCustom/:id", async (req, res) => {
    const { id } = req.params;

    const getData = await Custom.findOne({ _id: id });
    res.render("adminPages/custom", { custom: getData });
  })

  .post("/editCustom/:id", (req, res) => {
    const { id } = req.params;
    const { title, price, description, WistiaID } = req.body;

    Custom.updateOne({ _id: id }, { title, price, description, WistiaID })
      .then(() => {
        console.log("successfully! updated the course !");
        res.redirect("/Admin/custom");
      })
      .catch((err) => console.log(err));
  });
*/
  router
  .get("/editCourse", (req, res) => { 
    res.render("adminPages/editCourse");
  })
  .get("/editCourse/:id", async (req, res) => {
    const { id } = req.params;

    const getData = await Course.findOne({ _id: id });
    res.render("adminPages/editCourse", { course: getData });
  })

  .post("/editCourse/:id", (req, res) => {
    const { id } = req.params;
    const { title, price, description, WistiaID } = req.body;

    Course.updateOne({ _id: id }, { title, price, description, WistiaID })
      .then(() => {
        console.log("successfully! updated the course !");
        res.redirect("/Admin/courses");
      })
      .catch((err) => console.log(err));
  });

  router.get('/admin/customServices', isAuth, adminController.getCustomServices);

module.exports = router;
