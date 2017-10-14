'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    usersRouter = require('./routes/usersRouter.js'),
    adminRouter = require('./routes/adminRouter.js'),
    clientRouter = require('./routes/clientRouter.js'),
    driverRouter = require('./routes/driverRouter.js'),

    app = express();

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

app.use('/', express.static('views'))

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/admin.html'));
});

app.get('/client', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/client.html'));
});

app.get('/driver', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/driver.html'));
});

app.use('/owner', adminRouter);
app.use('/user', clientRouter);
app.use('/transport', driverRouter);

module.exports = app;