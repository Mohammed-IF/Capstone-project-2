const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const Freelancer = require('../models/freelancer');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

exports.getLogin = (req, res, next) => {
  res.render('authFreelancer/login1', {
    path: '/login1',
    pageTitle: 'Login1',
    errorMessage: req.flash('error')[0],
    validationErrors: [],
    oldInput: {
      email: '',
      password: ''
    }
  });
};

exports.getSignup = (req, res, next) => {
  res.render('authFreelancer/signup1', {
    path: '/signup1',
    pageTitle: 'Signup1',
    errorMessage: req.flash('error')[0],
    oldInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',

    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('authFreelancer/login1', {
      path: '/login1',
      pageTitle: 'Login1',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { email, password }
    });
  }
  Freelancer.findOne({ email })
    .then(freelancer => {
      if (!freelancer) {
        return res.status(422).render('authFreelancer/login1', {
          path: '/login1',
          pageTitle: 'Login1',
          errorMessage: 'Invalid email or password',
          validationErrors: [{ param: 'email' }, { param: 'password' }],
          oldInput: { email, password }
        });
      }
      bcrypt
        .compare(password, freelancer.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.freelancer = freelancer;
            return req.session.save(err => {
              if (err) console.log(err);
              res.redirect('/freelancerPages');
            });
          }
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login1');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login1');
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
    return res.status(422).render('freelancerAuth/signup1', {
      path: '/signup1',
      pageTitle: 'Signup1',
      errorMessage: errors.array()[0].msg,
      oldInput: { name, email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }
  const portfolioId = null;
  bcrypt.hash(password, 12).then(hashedPass => {
    const newFreelancer = new Freelancer({
      name,
      email,
      password: hashedPass,
      portfolioId: ""
    });
    return newFreelancer 
      .save()
      .then(result => {
        res.redirect('/login1');

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
    res.redirect('/freelancerPages');
  });
};

exports.getReset = (req, res, next) => {
  res.render('freelancerAuth/reset1', {
    path: '/reset1',
    pageTitle: 'Reset Password1',
    errorMessage: req.flash('error')[0]
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/reset1');
    }
    const token = buffer.toString('hex');
    Freelancer.findOne({ email: email })
      .then(freelancer  => {
        if (!freelancer) {
          req.flash('error', 'No account with specified email found');
          return res.redirect('/reset1');
        }
        freelancer.resetToken = token;
        freelancer.resetTokenExpiration = Date.now() + 3600000;
        return freelancer.save();
      })
      .then(result => {
        res.redirect('/freelancerPages');
        transporter.sendMail({
          to: email,
          from: 'shop@node-complete.com',
          subject: 'Password Reset',
          html: `<p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset1/${token}">link</a> to set a new password`
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
  Freelancer.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(freelancer => {
      if (!freelancer) {
        req.flash('error', 'Reset Link is invalid or expired');
        return res.redirect('/reset');
      }
      res.render('freelancerAuth/new-password1', {
        path: '/new-password1',
        pageTitle: 'New Password1',
        errorMessage: req.flash('error')[0],
        freelancerId: freelancer._id.toString(),
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
  const { newPassword, freelancerId, passwordToken } = req.body;
  let resetFreelancer;
  Freelancer.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: freelancerId
  })
    .then(freelancer => {
      if (!freelancer) {
        req.flash(
          'error',
          'New Password cannot be set, request new password reset link'
        );
        return res.redirect('/reset1');
      }
      resetFreelancer= freelancer;
      return bcrypt.hash(newPassword, 12).then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save().then(savedUser => {
          res.redirect('/login1');
          transporter.sendMail({
            to: savedUser.email,
            from: 'shop@node-complete.com',
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
