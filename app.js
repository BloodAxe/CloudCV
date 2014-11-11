/**
 * Module dependencies.
 */

var express = require('express');
var app     = require("./server.js");

app.use(express.errorHandler());
var server  = require('http').createServer(app);

server.listen(8888, 'localhost');