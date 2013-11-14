/**
 * Module dependencies.
 */

var app = require("./server.js");

var https = require('https');
var http = require('http');
var fs = require('fs');


// This line is from the Node.js HTTPS documentation.
var options = 
{
  ca: fs.readFileSync('/etc/ssl/cloudcv/GandiStandardSSLCA.pem'),
  key: fs.readFileSync('/etc/ssl/cloudcv/cloudcv-key.pem'),
  cert: fs.readFileSync('/etc/ssl/cloudcv/cloudcv-cert.pem')
};

var http_server  = http.createServer(app);
var https_server = https.createServer(options, app);

var sockets = require("./routes/socket.js");
sockets.bindTo(http);

http_server.listen(80);
https_server.listen(443);