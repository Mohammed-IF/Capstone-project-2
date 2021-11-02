const dotenv = require('dotenv');
dotenv.config();

const path = require("path");
const expressLayouts = require('express-ejs-layouts');

const helmet = require('helmet');
const multer  = require('multer');
const passport = require('passport');
const express = require("express");
const flash = require('connect-flash');
let session = require('express-session');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
//let session = require('express-session');
const csrf = require('csurf')
//const flash = require('connect-flash');
const compression = require('compression');
const morgan = require('morgan')
const MongoDBStore = require('connect-mongodb-session')(session);

const cloudinary = require("./cloudinaryConfig");
const cloudinaryStorage = require("multer-storage-cloudinary");

const User = require('./models/user');
const errorController = require("./controllers/error");


const app = express();

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
//app.use(passport.initialize());
//app.use(passport.session());
const db = require('./config/keys').mongoURI;
app.use(morgan('tiny'));
/*mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  */
const { MONGO_DB_URI, PORT } = process.env;

app.use(expressLayouts);
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
//app.set("views", "views");

app.use(session({
  secret: 'randomstring',
  resave: false,
  saveUninitialized: false,
  store: new MongoDBStore({ uri: MONGO_DB_URI, collection: 'sessions' })
}));

const csrfProtection = csrf();

const storage = cloudinaryStorage({
	cloudinary
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/jpeg'){
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}
/*app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
*/
app.use('/users', require('./routes/users'));
const freelancerRoutes = require("./routes/freelancer");
const shopRoutes = require("./routes/shop");
const freelancerPagesRoutes = require("./routes/freelancerPages");
const authFreelancerRoutes = require("./routes/authFreelacner");
const authUserRoutes = require("./routes/authUser");
const authAdminRoutes = require("./routes/authAdmin");
const appRoutes = require("./routes/appRouter");

//app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(multer({ storage: storage, fileFilter }).single('image'));

app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));

require('./config/passport')(passport);
require('./config/auth');

//app.use(express.static(path.join(__dirname, "assets")));
//app.use('/vendor', express.static(path.resolve(__dirname, "assets/vendor")));
//app.use('/images', express.static(path.resolve(__dirname, "assets/images")));
//app.use('/js', express.static(path.resolve(__dirname, "assets/js")));
//app.use(express.static('assets'));
//app.use('/', require('./routes/router'));
const Freelancer = require('./models/freelancer.js');
//const freelancer = require('./models/freelancer.js');


app.use(session({
  secret: 'randomstring',
  resave: false,
  saveUninitialized: false,
  store: new MongoDBStore({ uri: MONGO_DB_URI, collection: 'sessions' })
}));


app.use(csrfProtection);
//app.use(flash());



// Connect flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next()
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});
app.use(authUserRoutes);
app.use(require("./routes/postCustom"));
app.use(require("./routes/customIndex"));
app.use(require("./routes/custom"));
app.use(require("./routes/comment"));
app.use((req, res, next) => {
  if (!req.session.freelancer) {
    return next();
  }
  Freelancer.findById(req.session.freelancer._id)
    .then(freelancer => {
      if(!freelancer){
        return next()
      }
      req.freelancer = freelancer;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
})

//app.use('/', require('./routes/index.js'));

app.use("/freelancer", freelancerRoutes);

app.use(shopRoutes);
app.use(freelancerPagesRoutes);
app.use(authFreelancerRoutes);
app.use(authAdminRoutes);
//app.use("/freelancer", appRoutes);



app.use(require("./routes/postApp"));



//app.use('/', require('./routes/appRouter'));
//app.use("/user",authUserRoutes);

app.get('/display', (req, res) => {
  postedService.find({}, function(err, posted) {
      res.render('display', {
         postedList: posted
      })
  })
})
/
/*app.get('/index', (req, res) => {
  freelancers.find({}, function(err, posted) {
      res.render('index', {
         freelancerList: posted
      })
  })
})
*/


app.get('/become-a-seller',function (req, res) {
  res.render('pages/become-a-seller',{
  })
  });
  app.get('/all_products',function (req, res) {
    res.render('all_products',{
    })
    });
  app.get('/cat_products',function (req, res) {
    res.render('cat_products',{
    })
    });
    app.get('/product',function (req, res) {
    res.render('product',{
    })
    });
    app.get('/emptycart',function (req, res) {
      res.render('emptycart',{
      })
      });
    /*app.get('/login',function (req, res) {
      res.render('login',{
      })
      });*/
      app.get('/login1',function (req, res) {
        res.render('/authFreelancer/login1',{
        })
        });
       /* app.get('/quote',function (req, res) {
          res.render('pages/quote',{
          })
          });*/
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
                      app.get('/postedService-detail',function (req, res) {
                        res.render('freelancerPages/postedService-detail',{
                        })
                        });
                    

/*app.use('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res
    .status(500)
    .render("500", {
      pageTitle: "Something went wrong",
      path: "/500",
      isAuthenticated: req.session.isLoggedIn
    });
})*/

mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(PORT || 3000);
}).catch(err => console.log(err));
