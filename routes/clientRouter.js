'use strict';

var express = require('express'),
    userDb = require('../models/usersModel.js'),
    requestDb = require('../models/requestModel.js'),
    locationDb = require('../models/locationModel.js'),
    messageDb = require('../models/messageModel.js'),
    assetMapDb = require('../models/assetModel.js'),
    logDb = require('../models/logData.js'),
    router = express.Router();

//get all requests
router.route('/getRequests').get(function(req, res){
    //get list of all working assets
    requestDb.find({}, function(err, requests) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(requests);
    });
});

router.route('/getAssets').get(function(req, res){
    //get list of all working assets
    assetMapDb.find({}, function(err, assets) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(assets);
    });
});

router.route('/addRequest').post(function(req, res){
    var postData = req.body,
      validationError = {
        type: 'Validation Error',
        message: ''
      };

    if (!postData.assettype) {
      validationError.message = 'Asset type is required';
    }
    if (!postData.source) {
      validationError.message = 'From location is required';
    }
    if (!postData.destination) {
      validationError.message = 'To Location is required';
    }

    if (validationError.message) {
      res.json(validationError);

      return;
    }

    requestDb.insert(postData, function(err, newRequest) {
      if (err) {
        res.send(err);

        return;
      }

      res.json(newRequest);
    });
});

module.exports = router;