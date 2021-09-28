const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require("body-parser")
const router = express.Router();
const path = require('path');
const morgan = require('morgan');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

app.use(morgan('tiny'));
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/', require('./routes/router'))

var cons = require('consolidate');


app.get('/become-a-seller',function (req, res) {
  res.render('pages/become-a-seller',{
  })
  });
  app.get('/contact',function (req, res) {
    res.render('pages/contact',{
    })
    });
    app.get('/freelancers',function (req, res) {
      res.render('/freelancers/become-a-freelancer',{
      })
      });

      app.get('/freelancerRequests',function (req, res) {
        res.render('adminPages/freelancerRequests',{
        })
        });
        app.get('/index',function (req, res) {
          res.render('index',{
          })
          });
          app.get('/add_freelancer',function (req, res) {
            res.render('add_freelancer',{
            })
            });
            app.get('/update_freelancer',function (req, res) {
              res.render('update_freelancer',{
              })
              });
      

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));


