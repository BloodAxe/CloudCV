
/**
 * Module dependencies.
 */

var cv = require('./node_modules/cv/cv');

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
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


app.get('/', routes.index);
app.listen(process.env.PORT, process.env.IP);
