var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {pretty: true});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// Static pages
app.get('/',        routes.index);
app.get('/about',   function(req, res) { res.render('about'); });
app.get('/privacy', function(req, res) { res.render('privacy'); });

// Demo endpoints:
app.all('/demo/sudoku',        function(req, res) { res.render('demo-sudoku'); });
app.all('/demo/recognition',   function(req, res) { res.render('demo-recognition'); });
app.all('/demo/analysis',      function(req, res) { res.render('demo-analysis'); });

module.exports = app;