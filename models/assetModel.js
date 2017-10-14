'use strict';

var Datastore = require('nedb');

var assetsDb = new Datastore({
  filename: __dirname + '/../db/assets.db', // provide a path to the database file
  autoload: true, // automatically load the database
  timestampData: true // automatically add and manage the fields createdAt and updatedAt
});

module.exports = assetsDb;
