 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */

/////////////////////////////////////////////////////////
//MODULES
//core
var fs = require('fs');
//installed
var qrcode = require('qrcode');
//my modules
var mailer = require('./mailer');
var dbConnection = require('./dbConnection');
var config = require('./config.json').items;
var userProjection = require('./config.json').users.projection;
/////////////////////////////////////////////////////////

var db = dbConnection.getDb();
var collection = null;
db.collection('items', function(err,coll) {
	collection = coll;
});

exports.findAll = function(req, res) {
	if(req.query['rented'] != undefined){
		var userId = req.query['rented'];
		var query = {
			"owner" : {$ne : userId},
			"localization" : userId
		}
		collection.find(query, config.projection).toArray(function(err, items) {
			res.send(items);
		});
	}
	else {
		collection.find(req.query, config.projection).toArray(function(err, items) {
			res.send(items);
		});
	}
}

exports.findById = function(req, res) {
	var id = req.params.id;
	collection.findOne({'id' : id }, config.projection, function(err, item) {
		res.send(item);
	});
}

exports.addItem = function(req, res) {
	var item = req.body;
	collection.insert(item, function(err, result) {
		if(err) {
			res.send({"error" : err});
		}
		else {
			res.send(result[0]);
		}
	});
}

exports.updateItem = function(req, res) {
	var id = req.params.id;
	var item = req.body;
	collection.update({"id" : id}, {"$set" : item}, function(err, result){
		if(err) {
			res.send({"error" : err});
		}
		else {
			res.send(result[0]);
		}
	});
}

exports.deleteItem = function(req, res) {
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
	collection.find(req.query, {"id":1, "timestamp":1, "_id":0}).toArray(function(err, items) {
		res.send(items);
	});
}

exports.getQRCode = function(req, res) {
	var id = req.params.id;

	collection.findOne({'id' : id }, function(err, item) {
		db.collection('users', function(err, usersColl) {
			usersColl.findOne({'id' : item.owner}, userProjection, function(err, owner){
				var fileName = id + ".png";
				var dataForQR = prepareDataForQR(item, owner);
				qrcode.save(fileName, JSON.stringify(dataForQR), function(err, bytes){

					if(req.query.mail || req.query.mailto){
						var to = owner.email;
						if(req.query.mailto) {
							to = req.query.mailto;
						}
						mailer.sendMail({
							to : to,
							subject : "QR Code for item " + item.name,
							text : "Item: " + item.name,
							html : prepareHTMLForMail(item),
							fileName : fileName
						});
					}

					var img = fs.readFileSync(fileName);
			     	res.writeHead(200, {'Content-Type': 'image/png' });
			     	res.end(img, 'binary');
				});
			});
		});
	});
}

function prepareDataForQR(item,owner) {
	var ret = {};
	ret.id = item.id;
	ret.owner = owner;
	ret.name = item.name;
	ret.category = item.category;
	ret.timestamp = item.timestamp;
	return ret;
}

function prepareHTMLForMail(item) {
	var ret = "";
	ret += "<h1>" + item.name + "</h1><br/>";
	ret += "<b>Category: </b>" + item.category + "<br/>";
	ret += "<br/>Print this qrcode and place it on your item!";
	return ret;
}