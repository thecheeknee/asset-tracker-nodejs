'use strict';

var Datastore = require('nedb');

var logDb = new Datastore({
	filename: __dirname + '/../db/log.db',
	autoload: true,
	timestampData: true,
    corruptAlertThreshold: 1
});

module.exports = logDb;