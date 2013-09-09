/**
 * Module dependencies.
 */
var app = require("./server.js");
var express = require('express');

app.use(express.errorHandler());
app.listen(8000, 'localhost');
