const { validationResult } = require('express-validator');
const cloudinary = require('../cloudinaryConfig');
const Profile = require('../models/profile');

const ITEMS_PER_PAGE = 3;

exports.getAddProfile = (req, res, next) => {
  let profile = { name: '', image: { url: '' } };
  res.render('editTeacher', {
    profile: profile,
    pageTitle: 'Add Profile',
    path: '/editTeacher',
    editing: false,
    errorMessage: null,
    validationErrors: [],
    oldInput: { name: '', imageUrl: ''}
  });
};

exports.postAddProfile  = (req, res, next) => {
  const name = req.body.name;
  const image = req.file;


  if (!image) {
    return res.status(422).render('editTeacher', {
      profile: {
        name
      },
      pageTitle: 'Add Profile',
      path: '/editTeacher',
      editing: false,
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
      oldInput: { name }
    });
  }
const teacher1 = req.teacher;
const freelancer1 = req.freelancer;
//const teacher1 = req.teacher;
  const profile  = new Profile ({
    name,
    image: {
      url: image.url,
      public_id: image.public_id
    },
    teacherId: req.teacher
    
  
  /*profile: {
    previousWork: req.profile.previousWork,
    yearsOfExperinece: req.profile.yearsOfExperinece,
    description: req.profile.description,
    freelancerId: req.freelancer
  }*/
  });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('editTeacher', {
      profile: profile,
      pageTitle: 'Add PostedService',
      path: '/editTeacher',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { name, image }
    });
  }

  profile 
    .save()
    .then(result => {
      console.log('Created PostedService');
      res.redirect('/teacherAccount');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
}
exports.getEditProfile = (req, res, next) => {
  const prodId = req.params.profileId;
  Profile.findById(prodId)
    .then(profile  => {
      res.render('editTeacherProfile', {
        profile: profile,
        pageTitle: 'Edit Profile',
        path: '/editTeacherProfile',
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

exports.postEditProfile = (req, res, next) => {
  //const prodId = req.params
const {prodId} = req.params;
const teacherId = req.params
const name = req.body.name;
const image = req.file;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('editTeacherProfile', {
      profile: {
      name,
      _id: prodIdDesigns
      },
      pageTitle: 'Edit Profile',
      path: '/editTeacherProfile',
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  
  Profile.findOne(prodId)
    .then(profile  => {
      /*if (profile.profileId !== req.teacher._id) {
        res.redirect('/getTeacher');
      }*/
      profile.name = name; 
  
      if (image) {
        cloudinary.v2.uploader.destroy(profile.image.public_id, function(
          error,
          result
        ) {
          if (error) {
            error.httpStatusCode = 500;
            next(error);
          }
          console.log('Image deleted'.result);
        });
        profile.image = { url: image.url, public_id: image.public_id };
      }
      return profile.save().then(() => res.redirect('/getTeacher'));
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
exports.getProfiles = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Profile.find({ teacherId: req.teacher._id })
    .countDocuments()
    .then(numProfiles => {
      totalItems = numProfiles;

      return Profile.find({ teacherId: req.teacher._id })
        .populate('teacherId')
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(profiles => {
      res.render('pages/teacherAccount', {
        prods: profiles,
        pageTitle: 'Teacher Profile',
        path: '/getTeacher',
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
exports.getProfile = (req, res, next) => {
  const teacherId = req.teacher;

    
  Profile.findById(teacherId).then(profile => {
    res.render('pages/teacherAccount', {
      profile: profile,
      pageTitle: 'Your profile',
      path: '/getTeacher'
    });
  })
 
}
