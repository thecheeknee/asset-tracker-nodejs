'use strict';

var Datastore = require('nedb');

var waypointsDb = new Datastore({
  filename: __dirname + '/../db/waypoints.db', // provide a path to the database file
  autoload: true, // automatically load the database
  timestampData: true, // automatically add and manage the fields createdAt and updatedAt
  corruptAlertThreshold: 1
});

module.exports = waypointsDb;
