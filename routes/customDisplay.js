const path = require('path');
const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/is-auth');

const customController = require('../controllers/customController');
//const portfolio = require('../models/portfolio');

const router = express.Router();

router.get('/customServices', isAuth, customController.getCustomServices);

module.exports = router;
