'use strict';

var Datastore = require('nedb');

var locationDb = new Datastore({
  filename: __dirname + '/../db/locations.db', // provide a path to the database file
  autoload: true, // automatically load the database
  timestampData: true, // automatically add and manage the fields createdAt and updatedAt
  corruptAlertThreshold: 1
});

module.exports = locationDb;
