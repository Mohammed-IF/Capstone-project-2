/*

Stripe is a node library to authenticate the payment transactions
this module only supports "POST " method
*/


var User = require('../models/user');
var Teacher = require('../models/teacher');
var Course = require('../models/course');
var stripe = require('stripe')('sk_test_51JgEPqCuZRlwEilU9v4nC1rrBZCjE6C4KJOwZYyMih1mYPH8oRC3gOkUmXoOE4c29BWNNIEKffe3woYaU02lBiW900pxbJN2Pr');
var async = require('async');

module.exports = function(app) {
   /* app.post('/payment', function(req, res, next) {
        var stripeToken = req.body.stripeToken;
        var courseId = req.body.courseId;
      
        console.log(courseId);
        //---------Payment for the selected course-------
        async.waterfall([
          function(callback) {
            Course.findOne({ _id: courseId }, function(err, foundCourse) {
              if (foundCourse) {
                callback(err, foundCourse);
              }
            });
          },
          function(foundCourse, callback) {
            stripe.customers.create({
              source: stripeToken,
              email: req.user.email
            }).then(function(customer) {
              return stripe.charges.create({
                amount: foundCourse.price*100,
                currency: 'usd',
                customer: customer.id
              }).then(function(charge) {
      
                async.parallel([
                  function(callback) {
                    Course.updateOne({
                      _id: courseId,
                      'enrolledByStudents.user': { $ne: req.user._id }
                    },
                    {
                      $push: { enrolledByStudents: { user: req.user._id }},
                      $inc: { totalStudents: 1 }
                    }, function(err, count) {
                      if (err) return next(err);
                      callback(err);
                    });
                  },
                  function(callback) {
                    User.updateOne(
                      {
                        _id: req.user._id,
                        'coursesTaken.course': { $ne: courseId }
                      },
                      {
                        $push: { coursesTaken: { course: courseId }},
                      }, function(err, count) {
                        if (err) return next(err);
                        callback(err);
                      });
                  },
      
                  function(callback) {
                    Teacher.updateOne(
                      {
                        _id: foundCourse.ownByTeacher
                      },
                      {
                        $push: { revenue: { money: foundCourse.price }},
                      }, function(err, count) {
                        if (err) return next(err);
                        callback(err);
                      })
                  }
                ], function(err, results) {
                  if (err) return next(err);
                  res.redirect('/courses/' + courseId);
                });
              });
            });
          }
        ]);
      });

  
*/

}
