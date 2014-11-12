var express  = require('express');
var http     = require('http');
var path     = require('path');

var routes   = require('./routes');
var api      = require('./routes/api.js');
var examples = require('./routes/examples.js');

var app      = express();
var util     = require('util');

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
app.get('/api/docs', function(req, res) { res.render('api-docs'); });

// Demo endpoints:
app.all('/demo/analysis',        examples.analysis);


//var urlRegex = '(https?:\\/\\/)?([\\w\\.]+)\\.([a-z]{2,6}\\.?)(\\/[\\w\\.]*)*';
var urlRegex = '[\\w\\.]+\/[\/\\w\.\-\_]+';

app.get('/api/:filter/:url', function(req, res) {
    api.handleRequest(req.params.filter, decodeURIComponent(req.params.url), res);
});

module.exports = app;