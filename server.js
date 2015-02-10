var pmx = require('pmx'); pmx.init();

var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , inspect = require('util').inspect
  , logger = require('./lib/logger.js')
  ;

var app      = express();

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {pretty: true});
app.set('port', process.env.PORT || 8888);
app.set('title', 'cloudcv.io');

app.use(express.static(path.join(__dirname, 'public')));

// Static pages
app.get('/',         function(req, res) { res.render('index');    });
app.get('/about',    function(req, res) { res.render('about');    });
app.get('/privacy',  function(req, res) { res.render('privacy');  });
app.get('/api/docs', function(req, res) { res.render('api-docs'); });

// Demo endpoints:
app.all('/demo/analysis',        function(req, res) {

    res.render('demo-analysis',
    {
        "example":  { "availableImages": [
            "/images/lena.png",
            "/images/mandrill.png",
            "/images/sudoku.png",
            "/images/kid.jpg"
        ] } 
    });
});

http.createServer(app).listen(app.get('port'), function(){
  logger.log("cloudcv.io server listening on port " + app.get('port'));
});