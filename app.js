'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    adminRouter = require('./routes/adminRouter.js'),
    clientRouter = require('./routes/clientRouter.js'),
    driverRouter = require('./routes/driverRouter.js'),
    usersModel = require('./models/usersModel.js'),

    app = express();

var session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        url = req.url,
        method = req.method;
    next();
});

var auth = function(req, res, next) {
  if (req.session && req.session.user !==undefined && req.session.loggedin){
    return next();  
  }
  else{
    return res.sendStatus(401);  
  }
};

app.post('/uservalidate', function (req, res) {
    //console.log(req.body);
    if (!req.body.username || !req.body.password) {
        res.json({status:'failed',message:'incomplete data'});
    } else{
        usersModel.find({username:req.body.username,userpassword:req.body.password}, function(err, user) {
            if (err) {
                res.send(err);
                return;
            }
            if(user.length>0){
                //console.log(user);
                req.session.user = user[0].user_id;
                req.session.username = user[0].username;
                req.session.usertype = user[0].usertype;
                req.session.loggedin = true;
                res.json({status:'success',path:"/"+user[0].usertype});
            }else{
                res.json({status:'failed',message:'incorrect data'});
            }
            
        });
        
    }
});

app.post('/getuserDetails',function(req,res){
    var postData = req.body;
    console.log(postData);
    usersModel.find({user_id:parseInt(postData.userid)}).limit(1).exec(function(err, user) {
        if (err) {
            res.send(err);
            return;
        }
        res.json({status:'online',user:user});
    });
})

app.get('/session',function(req, res) {
    if(req.session.usertype == req.query.type && req.session.loggedin){
        res.json({status:'success',message:'authorized',userid:req.session.user,username:req.session.username});
    }else{
        res.json({status:'failed',message:'unauthorized'});
    }
});

app.post('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

app.use('/', express.static('views'));

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/sign_in.html'));
});

app.get('/admin', auth, function(req, res) {
    //console.log(req.session.user);
    res.sendFile(path.join(__dirname + '/views/admin.html'));
});

app.get('/client', auth, function(req, res) {
    //console.log(req.session.user);
    res.sendFile(path.join(__dirname + '/views/client.html'));
});

app.get('/driver', auth, function(req, res) {
    //console.log(req.session.user);
    res.sendFile(path.join(__dirname + '/views/driver.html'));
});



app.use('/owner', adminRouter);
app.use('/user', clientRouter);
app.use('/transport', driverRouter);

module.exports = app;