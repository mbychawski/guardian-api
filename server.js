 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */

var express = require('express');

//My modules
var items = require("./items");
var users = require("./users");
var config = require("./config.json").server;

var app = express();

app.use(express.urlencoded())
app.use(express.json())

//ITEMS
app.get('/items', items.findAll);
app.get('/items/:id', items.findById);
app.get('/items/:id/qrcode', items.getQRCode);
app.get('/itemsTimestamps', items.getTimestamps);
app.post('/items', items.addItem);
app.put('/items/:id', items.updateItem);
app.delete('/items/:id', items.deleteItem);

//USERS
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.get('/usersTimestamps', users.getTimestamps);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);

app.listen( config.port );
console.log("Listening on port " + config.port + "...");