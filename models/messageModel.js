'use strict';

var Datastore = require('nedb');

var messageDb = new Datastore({
	filename: __dirname + '/../db/messages.db',
	autoload: true,
	timestampData: true,
    corruptAlertThreshold: 1
})

module.exports = messageDb;
