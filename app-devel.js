/**
 * Module dependencies.
 */

var express = require('express');
var app     = require("./server.js");

app.use(express.errorHandler());
var server  = require('http').createServer(app);

var sockets = require("./routes/socket.js");
sockets.bindTo(server);

server.listen(8000, 'localhost');
