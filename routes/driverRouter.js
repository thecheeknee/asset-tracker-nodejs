'use strict';

var express = require('express'),
    userDb = require('../models/usersModel.js'),
    locationDb = require('../models/locationModel.js'),
    assetMapDb = require('../models/assetModel.js'),
    logDb = require('../models/logData.js'),
    router = express.Router();

module.exports = router;