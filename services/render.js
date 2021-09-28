const axios = require('axios');


exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:5000/api/freelancers')
        .then(function(response){
            res.render('index', { freelancers : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.add_freelancer = (req, res) =>{
    res.render('add_freelancer');
}

exports.update_freelancer = (req, res) =>{
    axios.get('http://localhost:5000/api/freelancers', { params : { id : req.query.id }})
        .then(function(freelancerdata){
            res.render("update_freelancer", { freelancer : freelancerdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}