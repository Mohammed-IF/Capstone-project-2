const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth-teacher');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const teacherController = require('../controllers/teacherController');
const Teacher = require('../models/teacher');

const Profile = require('../models/profile');

const router = express.Router();
router.get('/editTeacher', isAuth, teacherController.getAddProfile);


router.post(
  '/editTeacher',
  isAuth,
  [
    body('name')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .trim(),
  ],
  teacherController.postAddProfile
);
router.get('/editTeacherProfile/:profileId/:teacherId', isAuth, teacherController.getEditProfile);


router.post(
  '/editTeacherProfile',
  isAuth,
  [
    body('name')
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .trim(),
  ],
  teacherController.postEditProfile
);

router.get('/getTeacher', isAuth, teacherController.getProfiles);

router.get('/getTeacher', teacherController.getProfile);

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
      res.redirect("/getTeacher");
    })
    .catch((err) => console.log(err));
});
*/

module.exports = router;
