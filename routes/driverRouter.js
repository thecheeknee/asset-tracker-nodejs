'use strict';

var express = require('express'),
    userDb = require('../models/usersModel.js'),
    locationDb = require('../models/locationModel.js'),
    waypointDb = require('../models/waypointModel.js'),
    requestDb = require('../models/requestModel.js'),
    logDb = require('../models/logData.js'),
    router = express.Router();

router.route('/getRequest').get(function(req, res){
    //get list of all working assets
    var postData = req.query;
    //console.log(typeof postData.id + '  ' + postData);
    requestDb.find({driver_id:postData.id, request_status:'approved' }).limit(1).exec(function(err, request) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(request);
    });
});

router.route('/trackLocation').get(function(req,res){
    var postData = req.query,
        validationError = {
            type: 'Validation Error',
            message:''
        };
    
    locationDb.findOne({ request_id: postData.id },function(err,locationmap){
        if(err){
            res.send(err);
            return
        }
        var wp;
        
        waypointDb.find({source:locationmap.source,destination:locationmap.destination}).limit(1).exec(function(err,waypoints){
            if(err){
                res.send(err);
                return
            }
            res.json({'status':'success','data':locationmap,'waypoints':waypoints});
        })
        
    });
});

router.route('/updateWaypoint').get(function(req,res){
    var postData = req.query,
        validationError = {
            type: 'Validation Error',
            message:''
        };
    requestDb.update({_id:postData.req_id},{$set:{current_location:postData.waypoint}},{},function(err,numReplacement){
        if (err) {
            res.send(err);
            return;
        }
        if(numReplacement>0){
            var timer = new Date().toISOString().slice(0, 19).replace('T', ' '); //current time
            locationDb.update({request_id:postData.req_id},{$set:{waypoint:postData.waypoint,last_update:timer}},{},function(err,wpRow){
                res.json({status:'success',message:'waypoint updated'});
            });
        }
        
    })
})

module.exports = router;