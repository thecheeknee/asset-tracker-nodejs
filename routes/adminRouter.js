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
    assetModel.find({}).sort({asset_id:1}).exec(function(err, assets) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(assets);
    });
});

router.route('/getMessages').get(function(req, res){
    //get list of all working assets
    messageModel.find({sender:'client'}).exec(function(err, messages) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(messages);
    });
});

router.route('/addAsset').post(function(req, res){
    var postData = req.body,
      validationError = {
        type: 'Validation Error',
        message: ''
      };

    if (!postData.asset_type) {
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
    
    assetModel.find({}).sort({asset_id:-1}).limit(1).exec(function(err, docs){
        var last_id;
        if(docs==null || docs.length==0){
            last_id= 1;
        }else{
            last_id=docs[0].asset_id+1;
        }
        var assetData = {
            asset_id:last_id,
            assetInfo:postData,
            assignedStatus:false,
            requestId:'',
            driverId:''
        }

        assetModel.insert(assetData, function(err, newAsset) {
          if (err) {
            res.send(err);
            return;
          }

          res.json({type:'Insert Success',data:newAsset});
        });   
    })
    
    
});

router.route('/updateAsset').post(function(req,res){
    var postData = req.body,
      validationError = {
        type: 'Validation Error',
        message: ''
      };
    if(!postData.id) {
      validationError.message = 'Asset ID is required';
    }
    if(!postData.asset_type) {
      validationError.message = 'Asset Type is required';
    }
    
    if (validationError.message) {
      res.json(validationError);
      return;
    }
    //console.log(typeof parseInt(postData.id));
    //return;
    assetModel.update({ asset_id: parseInt(postData.id) }, { $set: {assetInfo:postData} }, {}, function (err, numReplaced) {
      if (err) {
        res.send(err);
        return;
      }
      res.json({type:'Update Success',rows:numReplaced});
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
    if (!postData.request_status) {
      validationError.message = 'Request Status is required';
    }
    if (!postData.driver_id && postData.request_status=='approved') {
      validationError.message = 'Driver ID is required';
    }
    if (!postData.asset_id && postData.request_status=='approved') {
      validationError.message = 'Asset ID is required';
    }
    
    if (validationError.message) {
      res.json(validationError);

      return;
    }
    //create new request array with all data. Replace existing request array with it.
    var requestData, messageData, locationData;
    
    //create a message for the user depending on the request
    if( postData.request_status=='approved' ){
        
        //create a location Map id first. Assign waypoint and start time
        var timer = new Date().toISOString().slice(0, 19).replace('T', ' ');
        locationData={
            request_id:postData._id,
            source:postData.source,
            destination:postData.destination,
            waypoint:postData.source,
            started_at:timer,
            last_update:timer,
            completed_at:''
        }
        locationModel.insert(locationData, function(err, newLocation) {
          if (err) {
            res.send(err);
            return;
          }
            console.log('Location Map added');
          locationData =newLocation;
        });
        
        var assetUpdate = {
            assignedStatus:true,
            requestId:postData._id,
            driverId:postData.driver_id
        }
        
        assetModel.update({ asset_id: parseInt(postData.asset_id) }, { $set: assetUpdate }, {}, function (err, numReplaced) {
          if (err) {
            res.send(err);
            return;
          }
            console.log('Asset Assigned');
        });
        
        usersModel.update({ user_id: parseInt(postData.driver_id) }, {$set:{'assigned_status':true}}, {}, function (err, numReplaced) {
          if (err) {
            res.send(err);
            return;
          }
            console.log('Driver Assigned');
        });
        
        //add driver & asset to the request. Add temporary location data. Will be updated by driver via Waypoint API
        requestData = {
            asset_type_img:postData.assettype,
            request_status:postData.request_status,
            driver_id:postData.driver_id,
            asset_id:postData.asset_id,
            source:postData.source,
            destination:postData.destination,
            client_id:postData.client_id,
            location_map_id:locationData._id,
            current_location:postData.source,
            message_id:''
        };
        //message data
        messageData = {
            sender:'admin',
            to:postData.client_id,
            request_id:postData._id,
            request_status:'approved',
            message:'This request has been approved, dispatch will begin post completing formalities. Please contact the dispatch team',
            message_to_admin:'You approved this request.'
        };
        
    }else{
        //add message id to the data
        requestData = {
            asset_type_img:postData.assettype,
            request_status:postData.request_status,
            source:postData.source,
            destination:postData.destination,
            client_id:postData.client_id,
            message_id:''
        };
        messageData = {
            sender:'admin',
            to:postData.client_id,
            request_id:postData._id,
            request_status:'denied',
            message:'We are unable to process this request due to current lack of resources. Please try again in 72 hours',
            message_to_admin:'You denied this request.'
        }
    }
    //update request DB
    messageModel.insert(messageData, function (err, message) {
      if (err) {
        res.send(err);
        return;
      }
        console.log('Client Updated');
        requestData.message_id = message._id;
    });
    //update request DB
    requestModel.update({ _id: postData._id }, requestData, {}, function (err, numReplaced) {
      if (err) {
        res.send(err);
        return;
      }
        console.log('Request Updated');
      res.json({type:'Request Updated', 'request_status':postData.request_status, message:messageData.message_to_admin});
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
    usersModel.find({}).sort({asset_id:-1}).limit(1).exec(function(err, docs){
        var last_id;
        if(docs==null || docs.length==0){
            last_id= 1;
        }else{
            last_id=docs[0].user_id+1;
        }
        var driver={
            user_id:last_id,
            usercontact:postData.usercontact,
            username:postData.username,
            userpassword:postData.userpassword,
            usertype:'driver',
            assigned_status:false
        }
        usersModel.insert(driver, function(err, newDriver) {
          if (err) {
            res.send(err);
            return;
          }
          res.json({type:'Insert Success',data:newDriver});
        });
    });
   
});

router.route('/updateDriver').post(function(req, res){
    var postData = req.body,
      validationError = {
        type: 'Validation Error',
        message: ''
      };
    
    if (!postData.id) {
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
    var update_driver={
        usercontact:postData.usercontact,
        username:postData.username,
        userpassword:postData.userpassword
    }

    usersModel.update({ user_id: parseInt(postData.id) }, {$set:update_driver}, {}, function (err, numReplaced) {
      if (err) {
        res.send(err);
        return;
      }
      res.json({type:'Update Success',rows:numReplaced});
    });
});

router.route('/deleteDriver').post(function(req, res){
    var postData = req.body,
      validationError = {
        type: 'Validation Error',
        message: ''
      };
    
    if (!postData.id) {
      validationError.message = 'ID is required';
    }

    if (validationError.message) {
      res.json(validationError);

      return;
    }
    var update_driver={
        usercontact:postData.usercontact,
        username:postData.username,
        userpassword:postData.userpassword,
        usertype:postData.userpassword
    }

    usersModel.remove({ user_id: parseInt(postData.id) }, {}, function (err, numReplaced) {
      if (err) {
        res.send(err);
        return;
      }
      res.json({type:'Delete Success',rows:numReplaced});
    });
});

module.exports = router;