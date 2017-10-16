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

router.route('/getMessages').get(function(req, res){
    //get list of all working assets
    var userid = req.query.userid;
    console.log(userid);
    messageDb.find({to:userid}, function(err, messages) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(messages);
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

      res.json({'status':'success','data':newRequest});
    });
});

router.route('/delRequest').post(function(req,res){
    var postData = req.body,
        validationError = {
            type: 'Validation Error',
            message:''
        };
    
    requestDb.findOne({ _id: postData.id },function(err,delReq){
        if(err){
            res.send(err);
            return
        }
        var resultJson = {
            status:'',
        }
        
        if(delReq==null || delReq.length==0){
            res.json({'status':'failed','message':'not found'});
        }else if(delReq.request_status=='approved'){
            res.json({'status':'failed','message':'approved request'});
        }else{
            requestDb.remove({ _id: delReq._id }, {}, function (err, numRemoved) {
                res.json({'status':'success','message':'deleted','id':delReq._id});
            });
        }
        
    })
});

router.route('/trackLocation').post(function(req,res){
    var postData = req.body,
        validationError = {
            type: 'Validation Error',
            message:''
        };
    
    locationDb.findOne({ request_id: postData.id },function(err,locationmap){
        if(err){
            res.send(err);
            return
        }
        res.json({'status':'success','data':locationmap});
    });
});


module.exports = router;