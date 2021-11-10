const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');


const Admin = require('../models/admin');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

exports.getLogin = (req, res, next) => {
  res.render('authAdmin/login3', {
    path: '/login3',
    pageTitle: 'Login3',
    errorMessage: req.flash('error')[0],
    validationErrors: [],
    oldInput: {
      email: '',
      password: ''
    }
  });
};

exports.getSignup = (req, res, next) => {
  res.render('authAdmin/signup3', {
    path: '/signup3',
    pageTitle: 'Signup3',
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
    return res.status(422).render('authAdmin/login3', {
      path: '/login3',
      pageTitle: 'Login3',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { email, password }
    });
  }
  Admin.findOne({ email })
    .then(admin => {
      if (!admin) {
        return res.status(422).render('authAdmin/login3', {
          path: '/login3',
          pageTitle: 'Login3',
          errorMessage: 'Invalid email or password',
          validationErrors: [{ param: 'email' }, { param: 'password' }],
          oldInput: { email, password }
        });
      }
      bcrypt
        .compare(password, admin.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.admin = admin;
            return req.session.save(err => {
              if (err) console.log(err);
              res.redirect('/admin/index');
            });
          }
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login3');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login3');
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
    return res.status(422).render('authAdmin/signup3', {
      path: '/signup3',
      pageTitle: 'Signup3',
      errorMessage: errors.array()[0].msg,
      oldInput: { name, email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }
  bcrypt.hash(password, 12).then(hashedPass => {
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPass,
    });
    return newAdmin
      .save()
      .then(result => {
        res.redirect('/login3');

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
    res.redirect('/adminPages');
  });
};

exports.getReset = (req, res, next) => {
  res.render('authAdmin/reset3', {
    path: '/reset3',
    pageTitle: 'Reset Password3',
    errorMessage: req.flash('error')[0]
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/reset3');
    }
    const token = buffer.toString('hex');
    Admin.findOne({ email: email })
      .then(admin  => {
        if (!admin) {
          req.flash('error', 'No account with specified email found');
          return res.redirect('/reset3');
        }
        admin.resetToken = token;
        admin.resetTokenExpiration = Date.now() + 3600000;
        return admin.save();
      })
      .then(result => {
        res.redirect('/adminPages');
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
  Admin.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(admin => {
      if (!admin) {
        req.flash('error', 'Reset Link is invalid or expired');
        return res.redirect('/reset3');
      }
      res.render('authAdmin/new-password3', {
        path: '/new-password3',
        pageTitle: 'New Password3',
        errorMessage: req.flash('error')[0],
        adminId: admin._id.toString(),
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
  const { newPassword, adminId, passwordToken } = req.body;
  let resetAdmin;
  Admin.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: adminId
  })
    .then(admin => {
      if (!admin) {
        req.flash(
          'error',
          'New Password cannot be set, request new password reset link'
        );
        return res.redirect('/reset3');
      }
      resetAdmin= admin;
      return bcrypt.hash(newPassword, 12).then(hashedPassword => {
        resetAdmin.password = hashedPassword;
        resetAdmin.resetToken = undefined;
        resetAdmin.resetTokenExpiration = undefined;
        return resetUser.save().then(savedUser => {
          res.redirect('/login3');
          transporter.sendMail({
            to: savedAdmin.email,
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
