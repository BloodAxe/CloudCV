/**
 * Module dependencies.
 */

var app = require("./server.js");

var https = require('https');
var http = require('http');
var fs = require('fs');



var http_server  = http.createServer(app);
var https_server = null;

var ca = '/etc/ssl/cloudcv/GandiStandardSSLCA.pem';
var key = '/etc/ssl/cloudcv/cloudcv-key.pem';
var cert = '/etc/ssl/cloudcv/cloudcv-cert.pem';

if (fs.existsSync(ca) && fs.existsSync(key) && fs.existsSync(cert)) {

    var options = 
    {
      ca: fs.readFileSync(ca),
      key: fs.readFileSync(key),
      cert: fs.readFileSync(cert)
    };

    https_server = https.createServer(options, app);
}

var sockets = require("./routes/socket.js");
sockets.bindTo(http_server);

http_server.listen(80);

if (https_server) {
    https_server.listen(443);    
}
