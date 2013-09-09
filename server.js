var express  = require('express');
var http     = require('http');
var path     = require('path');

var api      = require('./api');
var routes   = require('./routes');
var examples = require('./routes/samples.js');

var app      = express();

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
app.all('/demo/sudoku',        examples.sudoku);
app.all('/demo/recognition',   examples.recognition);
app.all('/demo/analysis',      examples.analysis);

app.all('/api',                api.index);

module.exports = app;