/*
module to hold the details of the teacher
A teacher can only become a teacher only when the teacher creates a new 
course

Creating a schema for the teacher to become an instructor

whenever the waterfall is used it means the second function is always dependednt on the first 
function
*/

var Teacher = require('../models/teacher');
//var Teacher = require('../models/teacher');
var Course = require('../models/course');
const cloudinary = require('../cloudinaryConfig');
var async = require('async');
const isAuth = require('../middleware/is-auth-teacher');

module.exports = function(app) {
  //--------route is used whenever we have more than 1 http methods connected to a single URL
  
  app.route('/become-an-instructor')
  
  //-----chaining method by rendering a web page of becoming the instructor-----------
    .get(function(req, res, next) {
      res.render('teacher/become-instructor');
    })
    //---------Creating a new course object and saving it to the database---------
    .post(function(req, res, next) {
      async.waterfall([
        function(callback) {
          var course = new Course();
          course.title = req.body.title;
          course.save(function(err) {
            callback(err, course);
          });
        },


        //--------When a teacher posts a new course the webpage is redirected to teacher URL-------
        function(course, callback) {
          Teacher.findOne({_id: req.teacher._id}, function(err, foundTeacher) {
            foundTeacher.role = "teacher";
            foundTeacher.coursesTeach.push({ course: course._id });
            foundTeacher.save(function(err) {
              if (err) return next(err);
              res.redirect('/teacher/dashboard');
            });
          });
        }
        
      ]);
    });

    //----------Get request to open teacher page------------
    app.get('/teacher/dashboard', isAuth, function(req, res, next) {
      Teacher.findOne({ _id: req.teacher._id })
      .populate('coursesTeach.course')
      .exec(function(err, foundTeacher) {
        res.render('teacher/teacher-dashboard', { foundFreelancer: foundFreelancer });
      });
     /* app.get('/freelancer/portfolios', function(req, res, next) {
        Freelance.findOne({ _id: req.teacher._id })
        .populate('portfolioId.freelancer')
        .exec(function(err, foundFreelance) {
          res.render('freelancer/portfolios', { foundFreelancer: foundFreelancer});
        });*/
    });

    //------------Chaining method using route to create a course and to redirect the web page to it----------
    /*app.route('/create-course')

      .get(function(req, res, next) {
        let course = { title: '', image: { url: '' }, price: '',  description: '' };
        res.render('teacher/create-course',{
          course: course,
        pageTitle: 'Add course',
        path: '/create-course',
       editing: false,
      errorMessage: null,
        validationErrors: [],
         oldInput: { title: '', imageUrl: '',price: '', description: '' }
        });
      })
      

      //------Creating a course and saving it in the database---------
      .post(function(req, res, next) {
      const title = req.body.title;
      const image = req.file;
      const price = req.body.price;
      const desc = req.body.desc;
      const wistiaId = req.body.wistiaId;
      const ownByTeacher = req.teacher._id

        async.waterfall([
          function(callback) {
            var course = new Course({
            title,
            image: {
              url: image.url,
              public_id: image.public_id
            },
            price,
            desc,
            wistiaId,
            ownByTeacher
            })
         
            course.save(function(err) {
              callback(err, course);
            });
          },

          function(course, callback) {
            Teacher.findOne({_id: req.teacher._id}, function(err, foundTeacher) {
              foundTeacher.coursesTeach.push({ course: course._id });
              foundTeacher.save(function(err) {
                if (err) return next(err);
                res.redirect('/teacher/dashboard');
              });
            });
          }
        ]);
      });

*/
      //-----------Chaining method to edit an existing course----------
      app.route('/edit-course/:id')

        .get(function(req, res, next) {
          Course.findOne({ _id: req.params.id }, function(err, foundCourse) {
            res.render('teacher/edit-course', { course: foundCourse });
          });
        })


        //---------Editing a course and savining it in the database
        .post(function(req, res, next) {
          Course.findOne({ _id: req.params.id }, function(err, foundCourse) {
            if (foundCourse) {
              if (req.body.title) foundCourse.title = req.body.title;
              if (req.body.image) foundCourse.image = req.body.image;
              if (req.body.wistiaId) foundCourse.wistiaId = req.body.wistiaId;
              if (req.body.price) foundCourse.price = req.body.price;
              if (req.body.desc) foundCourse.desc = req.body.desc;

              foundCourse.save(function(err) {
                if (err) return next(err);
                res.redirect('/teacher/dashboard');
              });
            }
          });
        });

        /*app.get("/removeCourse/:id", isAuth, (req, res) => {
          const { id } = req.params;
          Course.deleteOne({ _id: id })
            .then(() => {
              console.log("Delete course successfully!");
              res.redirect("/teacher/dashboard");
            })
            .catch((err) => console.log(err));
        })*/
      
        //---------Get requet for the revenue report------------
        app.get('/revenue-report', function(req, res, next) {
          var revenue = 0;
          Teacher.findOne({ _id: req.teacher._id }, function(err, foundTeacher) {
            foundTeacher.revenue.forEach(function(value) {
              revenue += value;
            });

            res.render('teacher/revenue-report', { revenue: revenue });
          });
        });





}
