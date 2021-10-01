const express = require('express');
const route = express.Router()
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
const services = require('../services/postedServiceRender');
const controller1 = require('../controller/postedServiceController');

/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', services.homeRoutes);

/**
 *  @description add users
 *  @method GET /add-user
 */
route.get('/add-postedService', services.add_postedService)



/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/update-postedService', services.update_postedService)

route.get('/read-postedService' , services.read_postedService)

// API
route.post('/api/postedServices', controller1.create);
route.get('/api/postedServices', controller1.find);
route.put('/api/postedServices/:id', controller1.update);
route.delete('/api/postedServices/:id', controller1.delete);


module.exports = route