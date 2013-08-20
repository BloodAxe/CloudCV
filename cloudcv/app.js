
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
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
app.get('/users', user.list);

app.post('/api/photos', function(req, res)
{ 
    fs.readFile(req.files.userPhoto.path, 
    	function(err, data)
    	{
    		if (err)
    			throw err;

    		cv.imdecode(data, function(image)
			{

			});
    	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
