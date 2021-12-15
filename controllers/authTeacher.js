const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');


const Teacher = require('../models/teacher');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

exports.getLogin = (req, res, next) => {
  res.render('authTeacher/login2', {
    path: '/login2',
    pageTitle: 'Login2',
    errorMessage: req.flash('error')[0],
    validationErrors: [],
    oldInput: {
      email: '',
      password: ''
    }
  });
};

exports.getSignup = (req, res, next) => {
  res.render('authTeacher/signup2', {
    path: '/signup2',
    pageTitle: 'Signup2',
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
    return res.status(422).render('authTeacher/login2', {
      path: '/login2',
      pageTitle: 'Login2',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { email, password }
    });
  }
  Teacher.findOne({ email })
    .then(teacher => {
      if (!teacher) {
        return res.status(422).render('authTeacher/login2', {
          path: '/login2',
          pageTitle: 'Login2',
          errorMessage: 'Invalid email or password',
          validationErrors: [{ param: 'email' }, { param: 'password' }],
          oldInput: { email, password }
        });
      }
      bcrypt
        .compare(password, teacher.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.teacher = teacher;
            return req.session.save(err => {
              if (err) console.log(err);
              res.redirect('/teacher/dashboard');
            });
          }
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login2');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login2');
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
    return res.status(422).render('authTeacher/signup2', {
      path: '/signup2',
      pageTitle: 'Signup2',
      errorMessage: errors.array()[0].msg,
      oldInput: { name, email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }
  bcrypt.hash(password, 12).then(hashedPass => {
    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPass,
    });
    return newTeacher
      .save()
      .then(result => {
        res.redirect('/login2');

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
    res.redirect('/teacher/dashboard');
  });
};

exports.getReset = (req, res, next) => {
  res.render('authTeacher/reset2', {
    path: '/reset2',
    pageTitle: 'Reset Password2',
    errorMessage: req.flash('error')[0]
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(22, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/reset2');
    }
    const token = buffer.toString('hex');
    Teacher.findOne({ email: email })
      .then(teacher  => {
        if (!teacher) {
          req.flash('error', 'No account with specified email found');
          return res.redirect('/reset2');
        }
        teacher.resetToken = token;
        teacher.resetTokenExpiration = Date.now() + 2600000;
        return teacher.save();
      })
      .then(result => {
        res.redirect('/teacher/dashboard');
        transporter.sendMail({
          to: email,
          from: 'm.i.f.15@outlook.sa',
          subject: 'Password Reset',
          html: `<p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:2000/reset1/${token}">link</a> to set a new password`
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
  Teacher.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(teacher => {
      if (!teacher) {
        req.flash('error', 'Reset Link is invalid or expired');
        return res.redirect('/reset2');
      }
      res.render('authTeacher/new-password2', {
        path: '/new-password2',
        pageTitle: 'New Password2',
        errorMessage: req.flash('error')[0],
        teacherId: teacher._id.toString(),
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
  const { newPassword, teacherId, passwordToken } = req.body;
  let resetTeacher;
  Teacher.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: teacherId
  })
    .then(teacher => {
      if (!teacher) {
        req.flash(
          'error',
          'New Password cannot be set, request new password reset link'
        );
        return res.redirect('/reset2');
      }
      resetTeacher= teacher;
      return bcrypt.hash(newPassword, 12).then(hashedPassword => {
        resetTeacher.password = hashedPassword;
        resetTeacher.resetToken = undefined;
        resetTeacher.resetTokenExpiration = undefined;
        return resetUser.save().then(savedUser => {
          res.redirect('/login2');
          transporter.sendMail({
            to: savedTeacher.email,
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
