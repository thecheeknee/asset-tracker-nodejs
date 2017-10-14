'use strict';

var express = require('express'),
    usersModel = require('../models/usersModel.js'),
    assetModel = require('../models/assetModel.js'),
    messageModel = require('../models/messageModel.js'),
    requestModel = require('../models/requestModel.js'),
    locationModel = require('../models/locationModel.js'),
    log = require('../models/logData.js'),
    router = express.Router();

//get all requests
router.route('/getRequests').get(function(req, res){
    //get list of all working assets
    requestModel.find({}, function(err, requests) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(requests);
    });
});

//get all user data
router.route('/getUsers').get(function(req, res){
    //get list of all working assets
    usersModel.find({}, function(err, users) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(users);
    });
});

//
router.route('/getAssets').get(function(req, res){
    //get list of all working assets
    assetModel.find({}, function(err, assets) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(assets);
    });
});

router.route('/addAsset').post(function(req, res){
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

    assetModel.insert(postData, function(err, newAsset) {
      if (err) {
        res.send(err);

        return;
      }

      res.json(newAsset);
    });
});

router.route('/updateRequest').post(function(req, res){
    var postData = req.body,
      validationError = {
        type: 'Validation Error',
        message: ''
      };
    
    if (!postData._id) {
      validationError.message = 'ID is required';
    }
    if (!postData.username) {
      validationError.message = 'username is required';
    }
    if (!postData.usercontact) {
      validationError.message = 'Contact No is required';
    }
    

    if (validationError.message) {
      res.json(validationError);

      return;
    }

    usersModel.update({ _id: postData._id }, {}, {}, function (err, numReplaced) {
      if (err) {
        res.send(err);

        return;
      }

      res.json(numReplaced);
    });
});

router.route('/addDriver').post(function(req, res){
    var postData = req.body,
      validationError = {
        type: 'Validation Error',
        message: ''
      };

    if (!postData.username) {
      validationError.message = 'Asset type is required';
    }
    if (!postData.usercontact) {
      validationError.message = 'From location is required';
    }
    if (!postData.userpassword) {
      validationError.message = 'To Location is required';
    }

    if (validationError.message) {
      res.json(validationError);

      return;
    }

    usersModel.insert(postData, function(err, newDriver) {
      if (err) {
        res.send(err);

        return;
      }

      res.json(newDriver);
    });
});

router.route('/updateDriver').post(function(req, res){
    var postData = req.body,
      validationError = {
        type: 'Validation Error',
        message: ''
      };
    
    if (!postData._id) {
      validationError.message = 'ID is required';
    }
    if (!postData.username) {
      validationError.message = 'username is required';
    }
    if (!postData.usercontact) {
      validationError.message = 'Contact No is required';
    }
    

    if (validationError.message) {
      res.json(validationError);

      return;
    }

    usersModel.update({ _id: postData._id }, postData, {}, function (err, numReplaced) {
      if (err) {
        res.send(err);

        return;
      }

      res.json(numReplaced);
    });
});

module.exports = router;