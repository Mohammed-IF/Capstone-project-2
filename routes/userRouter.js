const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const userController = require('../controllers/userController');
const User = require('../models/user');

const Profile = require('../models/profile');

const router = express.Router();
router.get('/editUser', isAuth, userController.getAddProfile);


router.post(
  '/editUser',
  isAuth,
  [
    body('name')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .trim(),
  ],
  userController.postAddProfile
);
router.get('/editProfile/:profileId/:userId', isAuth, userController.getEditProfile);


router.post(
  '/editProfile',
  isAuth,
  [
    body('name')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .trim(),
  ],
  userController.postEditProfile
);

router.get('/getUser', isAuth, userController.getProfiles);

router.get('/getUser', userController.getProfile);

/*router.get("/editProfile/:id", async (req, res) => {
  const { id } = req.params;

  const getData = await Profile.findOne({ _id: id });
  res.render("editProfile", { profile: getData });
})

router.post("/editProfile/:id", (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  Profile.updateOne({ _id: id }, { name,image })
    .then(() => {
      console.log("successfully! updated the app service!");
      res.redirect("/getUser");
    })
    .catch((err) => console.log(err));
});
*/

module.exports = router;
