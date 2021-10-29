const { validationResult } = require('express-validator');
const cloudinary = require('../cloudinaryConfig');
const Application = require('../models/application');




exports.getAddApplication = (req, res, next) => {
    let application = { name: '', email: '', phoneNumber: '', language: '', skills: '', description: '' };
    res.render('freelancer/become-a-seller', {
      application: application,
      pageTitle: 'Add Application',
      path: '/freelancer/add-application',
      editing: false,
      errorMessage: null,
      validationErrors: [],
      oldInput: { name: '', email: '', phoneNumber: '', language: '', skills: '', description: '' }
    });
  };
  
  exports.postAddApplication  = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const language = req.body.language;
    const skills = req.body.skills;
    const description = req.body.skills;
  
   /* if (!image) {
      return res.status(422).render('freelancer/edit-application', {
        application: {
          title,
          price,
          description
        },
        pageTitle: 'Add Application',
        path: '/freelancer/add-application',
        editing: false,
        errorMessage: 'Attached file is not an image',
        validationErrors: [],
        oldInput: { title, price, description }
      });
    }
  */
    const application  = new Application ({
        name,
        email,
        phoneNumber,
        language,
        skills,
        description
    });
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('freelancer/become-a-seller', {
        application: application,
        pageTitle: 'Add Application',
        path: '/freelancer/add-application',
        editing: false,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        oldInput: { name: '', email: '', phoneNumber: '', language: '', skills: '', description: '' }
      });
    }
  
    application 
      .save()
      .then(result => {
        console.log('Created Application');
        res.redirect('/');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  };
  

// create and save new user
/*exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new user
    const application = new Application({
        name : req.body.name,
        email : req.body.email,
        phoneNumber: req.body.phoneNumber,
        language: req.body.language,
        skills: req.body.skills
    })

    // save user in the database
    application
        .save(application)
        .then(data => {
            //res.send(data)
            res.redirect('/become-a-seller');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}
*/