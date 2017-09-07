// server.js

// DEPENDENCIES AND SETUP
// ===============================================

var express = require('express'),
  app = express(),
  port = Number(process.env.PORT || 3000),
  bodyParser = require('body-parser'); // Middleware to read POST data

// Set up body-parser.
// To parse JSON:
app.use(bodyParser.json());
// To parse form data:
app.use(bodyParser.urlencoded({
  extended: true
}));

// DATABASE
// ===============================================

// Setup the database.
var Datastore = require('nedb');
var db = new Datastore({
  filename: 'assetsdata.db', // provide a path to the database file 
  autoload: true, // automatically load the database
  timestampData: true // automatically add and manage the fields createdAt and updatedAt
});

var locations = new Datastore({
  filename: 'locations.db', // provide a path to the database file 
  autoload: true, // automatically load the database
  timestampData: true // automatically add and manage the fields createdAt and updatedAt
});

var users = new Datastore({
    filename: 'users.db',
    autoload: true,
    timestampData: true
});

var messages = new Datastore({
    filename: 'messages.db',
    autoload: true,
    timestampData: true
});


// ROUTES
// ===============================================
app.use('/', express.static('app'));

// Define the home page route.
/*app.get('/', function(req, res) {
   res.sendFile(__dirname + '/app/index.html');
});*/

// GET all data.
// (Accessed at GET http://localhost:3000/getData)
app.get('/getData', function(req, res) {
  db.find({}).sort({
    updatedAt: -1
  }).exec(function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});



// GET a data.
//(Accessed at GET http://localhost:3000/data/data_asset)
app.get('/getAssetData/:asset', function(req, res) {
  var data_asset = req.params.asset;
  db.find({
    asset_type: data_asset
  }, {}, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});

// GET a data.
//(Accessed at GET http://localhost:3000/data/data_asset)
app.get('/getData/:asset', function(req, res) {
  var data_asset = req.params.asset;
  db.findOne({
_id: data_asset
  }, {}, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});


// GET all data.
// (Accessed at GET http://localhost:3000/getData)
app.get('/getuserinformation', function(req, res) {
  users.find({}).sort({
    updatedAt: -1
  }).exec(function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});


app.get('/getuserinformation/:username/:password', function(req, res) {
  var username = req.params.username;
    var password = req.params.password;
  users.findOne({
username: username,
      password: password
  }, {}, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});

//GET a data: locations
app.get('/getWayPoints/:source/:destination', function(req, res) {
  var data_source = req.params.source;
    var data_destination = req.params.destination;
  locations.findOne({
location_source: data_source,
      location_destination: data_destination
  }, {}, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});


// GET all data.
// (Accessed at GET http://localhost:3000/getData)
app.get('/getMessageData', function(req, res) {
  messages.find({}).sort({
    updatedAt: -1
  }).exec(function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});


// POST a new data.
// (Accessed at POST http://localhost:3000/saveData)
app.post('/saveData', function(req, res) {
  var data = req.body;
  console.log(data);
  db.insert(data, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});

// POST a new data.
// (Accessed at POST http://localhost:3000/saveData)
app.post('/saveWayPoints', function(req, res) {
  var data = req.body;
  console.log(data);
  locations.insert(data, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});

// GET a data.
//(Accessed at GET http://localhost:3000/data/data_id)
app.get('/validateuser/:username/:password', function(req, res) {
  var username = req.params.username;
    var password = req.params.password;
  users.findOne({
    username: username,
      password: password
  }, {}, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});


// POST a new data.
// (Accessed at POST http://localhost:3000/saveData)
app.post('/saveUser', function(req, res) {
  var data = req.body;
  console.log(data);
  users.insert(data, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});

// POST a new data.
// (Accessed at POST http://localhost:3000/saveData)
app.post('/saveMessageData', function(req, res) {
  var data = req.body;
  console.log(data);
  messages.insert(data, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});


// START THE SERVER
// ===============================================

app.listen(port, function() {
  console.log('Listening on port ' + port);
});