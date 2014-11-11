var request = require('request');
var cv = require('cloudcv-backend');

var NodeCache = require("node-cache");
var myCache = new NodeCache();

function dataURItoBuffer(dataURI) {
    // convert base64 to raw binary data held in a string
    var comp = dataURI.split(',');
    var b64string = comp[1];
    
    var binData = new Buffer(b64string, 'base64').toString('binary');
    return new Buffer(binData, 'binary');
}

var filters = {};

filters.histogram = function (image, response, callback) {
    try {

        cv.analyzeImage(image, function(error, result) {
            
            if (error) {
                response.statusCode = 415; // Unsupported Media Type
                response.end();
                return;
            }

            response.setHeader("Content-Type", "application/json");
            response.write(result.histogram);
            response.end();
            
            callback(null, result);
        });
    }
    catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.end();
        callback(null);
    }
};

filters.dominantColors = function (image, response, callback) {
    
    try {
        cv.analyzeImage(image, function (result) {
            
            if (error) {
                response.statusCode = 415; // Unsupported Media Type
                response.end();
                return;
            }

            result.asPngStream(function(err, data) {
                response.setHeader("Content-Type", "image/png");
                response.write(buffer);
                response.end();

                callback(null, buffer);
            });                
        });
    }
    catch (e) {
        console.error(e);
        response.statusCode = 500;
        callback(e);
    }
};

var handleApiRequest = function (filter, url, res) {
    
    // Construct request data
    var requestSettings = {
        method: 'GET',
        url: url,
        encoding: null
    };
    
    var handler = filters[filter];
    console.log(typeof handler);
    
    if (typeof handler !== 'function') {
        res.end();
    }
    else {
        var key = filter + url;
        
        myCache.get(key, function (err, value) {
            console.log(value);
            if (!err && value[key]) {
                res.setHeader("Content-Type", "image/png");
                res.send(value[key]);
            }
            else {
                request(requestSettings, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        handler(body, res, function (error, buffer) { 
                            if (!error)
                                myCache.set(key, buffer); 
                        });
                    }
                    else {
                        console.log("Error loading " + url);
                        res.end();
                    }
                });
            }
        });

        
    }
};


exports.handleRequest = handleApiRequest;