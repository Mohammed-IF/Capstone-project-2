const axios = require('axios');


exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:5000/api/postedServices')
        .then(function(response){
            res.render('', { postedServices : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.add_postedService = (req, res) =>{
    res.render('add_postedService');
}

exports.update_postedService = (req, res) =>{
    axios.get('http://localhost:5000/api/postedServices', { params : { id : req.query.id }})
        .then(function(postedServicedata){
            res.render("update_postedService", { postedServices : postedServicedata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}
exports.read_postedService = (req, res) =>{
 axios.get('http://localhost:5000/api/postedServices', { params : { id : req.query.id }})
                    .then(function(postedServicedata){
                        res.render("", { postedServices : postedServicedata.data})
                    })
                    .catch(err =>{
                        res.send(err);
                    })}