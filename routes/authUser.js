const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/authUser');
const User = require('../models/user');
const cloudinary = require('../cloudinaryConfig');
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(
              'Email already exists, please pick a different one'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text with at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords don't match");
        }
        return true;
      })
      .trim()
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

//router.get('/', authController.getUsers);

//router.get('/account/:userId', authController.getUserInfo);
/*router.get("/getUser",(req, res) => {
  const userId = req.user;
  //const porId = req.params;

    
  User.findById(userId).then(user => {
    res.render('pages/account', {
      user: user,
        pageTitle: 'User profile',
        path: '/getUser',
        
        
    });
  })
})*/

/*router.get("/editUser/:id", async (req, res) => {
  const { id } = req.params;

  const getData = await User.findOne({ _id: id });
  res.render("editUser", { user: getData });
})

router.post("/editUser/:id", (req, res) => {
  const { id } = req.params;
  const {image} = req.body;
  const { name} = req.body;

  User.updateOne({ _id: id }, { name, image})
    .then(() => {
      console.log("successfully! updated the user!");
      res.redirect("/getUser");
    })
    .catch((err) => console.log(err));
});

*/
module.exports = router;
