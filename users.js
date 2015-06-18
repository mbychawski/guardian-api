 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */

var dbConnection = require('./dbConnection');
var config = require('./config.json').users;

var db = dbConnection.getDb();

var collection = null;
db.collection('users', function(err,coll) {
    collection = coll;
});

exports.findAll = function(req, res) {
	collection.find(req.query, config.projection).toArray(function(err, users) {
        res.send(users);
    });
}

exports.findById = function(req, res) {
	var id = req.params.id;
    collection.findOne({'id' : id }, config.projection, function(err, user) {
        res.send(user);
    });
}

exports.addUser = function(req, res) {
	var user = req.body;
    collection.insert(user, function(err, result) {
        if(err) {
            res.send({"error" : err});
        }
        else {
            res.send(result[0]);
        }
    });
}

exports.updateUser = function(req, res) {
	var id = req.params.id;
    var user = req.body;
    collection.update({"id" : id}, {"$set" : user}, function(err, result){
        if(err) {
            res.send({"error" : err});
        }
        else {
            res.send(result[0]);
        }
    });
}

exports.deleteUser = function(req, res) {
	var id = req.params.id;
    collection.remove({"id" : id}, function(err, result){
        if(err) {
            res.send({"error" : err});
        }
        else {
            res.send(result[0]);
        }
    });
}

exports.getTimestamps = function(req, res) {
	collection.find(req.query, {"id":1, "timestamp":1, "_id":0}).toArray(function(err, users) {
        res.send(items);
    });
}