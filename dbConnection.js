 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
var mongo  = require('mongodb');
var config = require('./config.json').dbConnection;

var Server = mongo.Server,
	Db     = mongo.Db;

var server = new Server( config.host, config.port, {auto_reconnect: true} ),
	db     = new Db( config.name, server, {safe: true} );

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to MongoDB: " + config.host + " " + config.port + " " + config.name);
	}
});

exports.getDb = function() {
	return db;
}