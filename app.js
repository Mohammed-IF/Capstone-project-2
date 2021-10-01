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
//var collection = require('postedservices')
//const MongoClient = require('mongodb').MongoClient
const postedService = require('./models/postedService.js');
const freelancers = require('./models/freelancer.js');

const app = express();

//require('./dotenv')

// Replace process.env.DB_URL with your actual connection string


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

app.use('/vendor', express.static(path.resolve(__dirname, "assets/vendor")))
app.use('/images', express.static(path.resolve(__dirname, "assets/images")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

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
app.use('/', require('./routes/router'));
app.use('/', require('./routes/postedServiceRouter'));
//app.use('/', require('./models/postedService'))

var cons = require('consolidate');
const Freelancer = require('./models/freelancer.js');
/*const postedServiceSchema = new mongoose.Schema({
 name: {
    type: String,
     required: true
      }, 
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

const postedService= mongoose.model('postedService', postedServiceSchema); 
*/
app.get('/display', (req, res) => {
  postedService.find({}, function(err, posted) {
      res.render('display', {
         postedList: posted
      })
  })
})
app.get('/index', (req, res) => {
  freelancers.find({}, function(err, posted) {
      res.render('index', {
         freelancerList: posted
      })
  })
})



app.get('/become-a-seller',function (req, res) {
  res.render('pages/become-a-seller',{
  })
  });
  app.get('/contact',function (req, res) {
    res.render('pages/contact',{
    })
    });
    app.get('/add_postedService',function (req, res) {
      res.render('pages/add_postedService',{
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
          app.get('/index1',function (req, res) {
            res.render('index1',{
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
              
             app.get('/postedServices',function (req, res) {
                res.render('postedServices/add_postedService',{
                })
                });
                app.get('/freelancerDashboard',function (req, res) {
                  res.render('pages/freelancerDashboard',{
                  })
                  });

                  app.get('/postedList', function (req, res) {
                    res.render('pages/postedList',{
                    })
                    });
                    
                  app.get('/account', function (req, res) {
                    res.render('pages/account',{
                    })
                    });
                    app.get('/serviceDetails',function (req, res) {
                      res.render('pages/serviceDetails',{
                      })
                      });
                    
                  
      

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));

