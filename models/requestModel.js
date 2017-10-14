'use strict';

var Datastore = require('nedb');

var requestDb = new Datastore({
	filename: __dirname + '/../db/requests.db',
	autoload: true,
	timestampData: true
});

module.exports = requestDb;
