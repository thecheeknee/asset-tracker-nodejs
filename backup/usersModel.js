'use strict';

var Datastore = require('nedb');

var users = new Datastore({
    filename: __dirname + '/../db/users.db',
    autoload: true,
    timestampData: true
});

module.exports = users;