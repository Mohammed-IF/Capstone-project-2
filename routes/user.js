/*
Creating URL's for facebook authentication and login, profile, logout and
callback
*/

var passport = require('passport');
var passportConf = require('../config/passport');
var Course = require('../models/course');
var User = require('../models/user');
module.exports = function(app) {
  //------Get request for login web page
  app.get('/accounts/login', function(req, res, next) {
    res.render('accounts/login');
  });

  //-------Get  request for redirecting to support facebook for the facebook authentication-----
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));


  //-------Get request for a callback function-------------
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));


  //--------Get request for the logout from the session and route the user to the home page--------
  /*app.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });*/

  //------Get request for the profile page of the user--------------
  app.get('/profile', function(req, res, next) {
    User.find({}, function(err, users) {
       
       res.render('accounts/profile', {users: users ,message: req.flash('loginMessage')});
    });
   
  });
  


}

