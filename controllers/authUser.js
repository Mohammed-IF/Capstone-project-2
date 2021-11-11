const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user'); 

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

exports.getLogin = (req, res, next) => {
  res.render('authUser/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')[0],
    validationErrors: [],
    oldInput: {
      email: '',
      password: ''
    }
  });
};

exports.getSignup = (req, res, next) => {
  res.render('authUser/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error')[0],
    oldInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('authUser/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { email, password }
    });
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(422).render('authUser/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          validationErrors: [{ param: 'email' }, { param: 'password' }],
          oldInput: { email, password }
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              if (err) console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('authUser/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { name, email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }
  bcrypt.hash(password, 12).then(hashedPass => {
    const newUser = new User({
      name,
      email,
      password: hashedPass,
      cart: { items: [] }
    });
    return newUser 
      .save()
      .then(result => {
        res.redirect('/login');

        return transporter.sendMail({
          to: email,
          from: 'shop@node-complete.com',
          subject: 'Signup successful',
          html: '<h1>You have signed up</h1>'
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  res.render('authUser/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('error')[0]
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: email })
      .then(user  => {
        if (!user) {
          req.flash('error', 'No account with specified email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: email,
          from: 'm.i.f.15@outlook.sa',
          subject: 'Password Reset',
          html: `<p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password`
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        req.flash('error', 'Reset Link is invalid or expired');
        return res.redirect('/reset');
      }
      res.render('authUser/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: req.flash('error')[0],
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { newPassword, userId, passwordToken } = req.body;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      if (!user) {
        req.flash(
          'error',
          'New Password cannot be set, request new password reset link'
        );
        return res.redirect('/reset');
      }
      resetUser= user;
      return bcrypt.hash(newPassword, 12).then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save().then(savedUser => {
          res.redirect('/login');
          transporter.sendMail({
            to: savedUser.email,
            from: 'm.i.f.15@outlook.sa',
            subject: 'New Password Set',
            html: `<p>You have created a new password</p>`
          });
        });
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
exports.getUsers = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  User.find()
    .countDocuments()
    .then(numUsers => {
      totalItems = numUsers;

      return User.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(users => {
      res.render('partials/header', {
        uors: users,
        pageTitle: 'All Users',
        path: '/users',
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
exports.getUserInfo = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId).then(user => {
    res.render('pages/account', {
      user: user,
      path: '/users'
    });
  });
  
};