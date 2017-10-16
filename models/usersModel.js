'use strict';

var Datastore = require('nedb'),

  usersDb = new Datastore({
    filename: __dirname + '/../db/users.db',
    autoload: true,
      corruptAlertThreshold: 1
  });

module.exports = usersDb;