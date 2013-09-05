/**
 * Module dependencies.
 */

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

// development only
if ('development' == app.get('env'))
{
	app.use(express.errorHandler());
}

// Static pages
app.get('/',      routes.index);
app.get('/about', function(req, res) { res.render('about'); });

// Demo endpoints:
app.get('/demo/sudoku',        function(req, res) { res.render('demo-sudoku'); });
app.get('/demo/recognition',   function(req, res) { res.render('demo-recognition'); });
app.get('/demo/analysis',      function(req, res) { res.render('demo-analysis'); });

/*
app.post('/demos/sudoku',      demos.sudoku);
app.post('/demos/recognition', demos.recognition);
app.post('/demos/analysis',    demos.analysis);
*/

app.listen(80);
