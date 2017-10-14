'use strict';

var Datastore = require('nedb');

var messageDb = new Datastore({
	filename: __dirname + '/../db/messages.db',
	autoload: true,
	timestampData: true
})

module.exports = messageDb;
