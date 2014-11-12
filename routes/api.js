var request = require('request');
var cv = require('cloudcv-backend');

var NodeCache = require("node-cache");
var myCache = new NodeCache();

var filters = {};

filters.histogram = function (image, response, callback) {
    try {

        cv.analyzeImage(image, function(error, result) {
            
            if (error) {
                response.statusCode = 415; // Unsupported Media Type
                response.end();
                return;
            }
            
            callback(null, result.histogram);
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
        console.log(image);
        cv.analyzeImage(image, function (error, result) {
            
            if (error) {
                response.statusCode = 415; // Unsupported Media Type
                response.end();
                return;
            }

            callback(null, result.dominantColors);
        });
    }
    catch (e) {
        console.error(e);
        response.statusCode = 500;
        callback(e);
    }
};

var handleApiRequest = function (filter, url, res) {
    
    console.log("API request", filter, url);

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
                res.setHeader("Content-Type", "application/json");
                res.send(value[key]);
            }
            else {
                request(requestSettings, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        handler(body, res, function (error, cachedResponse) { 
                            if (!error)
                                myCache.set(key, cachedResponse); 

                                res.setHeader("Content-Type", "application/json");
                                res.write(JSON.stringify(cachedResponse));
                                res.end();
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