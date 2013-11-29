var util = require('util');
var cv   = require('cloudcv');

function dataURItoBuffer(dataURI)
{
    // convert base64 to raw binary data held in a string
    var comp = dataURI.split(',');
    var b64string = comp[1];

    var binData = new Buffer(b64string, 'base64').toString('binary');
    return new Buffer(binData, 'binary');
}

function SocketServer() {

}

SocketServer.prototype.bindTo = function(server) {
    this.io = require('socket.io').listen(server);
    this.io.set('log level', 1); // reduce logging

    this.ar_demo_channel = this.io
    .of('/socket/ar-demo')
    .on('connection', function (socket) {

        socket.on('frame', function(frame) {

            var image = dataURItoBuffer(frame);
            
            cv.analyze(image, function(result) {
                
                if (!result)
                {
                    console.error('cv.detectFaces return empty result');
                    return;
                }

                socket.emit('faces', result);
            });
            
        });
    });

    this.channels = {};
    this.channels.detectMarkers = this.io.of('/socket/detectMarkers')
    .on('connection', function (socket) {

        socket.on('frame', function(frame) {

            var image = dataURItoBuffer(frame);
            
            cv.detectMarkers(image, function(result) {
                
                if (!result)
                {
                    console.error('cv.detectMarkers return empty result');
                    return;
                }

                socket.emit('result', result);
            });
            
        });
    });
};

module.exports = new SocketServer();