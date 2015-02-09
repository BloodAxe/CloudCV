/*
 * Back-end logic
 */

var fs   = require('fs');
var util = require('util');
var cv   = require('cloudcv-backend');
var async= require('async');

function exampleImages()
{
    this.items = new Array();

    this.addImage("Lena",       "/images/lena-128.png",     "/images/lena.png");
    this.addImage("Mandrill",   "/images/mandrill-128.png", "/images/mandrill.png");
    this.addImage("Sudoku",     "/images/sudoku-128.png",   "/images/sudoku.png");
    this.addImage("Kid",        "/images/kid-128.jpg",      "/images/kid.jpg");
}

exampleImages.prototype.addImage = function(key, thumbnail, source)
{
    var item = 
    {
        key: key,
        thumbnailURL: thumbnail,
        sourceURL:    source,
        thumbnail:    __dirname + "/../public" + thumbnail,
        source:       __dirname + "/../public" + source,
    };

    this.items.push(item);
    this[key] = item;
}

exampleImages.prototype.isInputImageValid = function(img)
{
    return typeof (this[img]) != undefined;
}

exampleImages.prototype.getImagePath = function(img)
{
    return this[img].source;
}

var imgs = new exampleImages();

function processRequest(req, res, view, work) 
{
    
    var img  = req.body.image;

    var renderDefaultPage = function() {
        res.render(view,
            {
                "example":  { "availableImages": imgs.items } 
            });
    }

    var renderResultView = function(result) {
        res.render(view, 
        {
            "result":   result, 
            "example":  { "availableImages": imgs.items }
        });  
    }

    var imageToLoad;
    if (img && imgs.isInputImageValid(img)) {
        imageToLoad = imgs[img].source;
    }
    else if (req.files && req.files.image) {
        imageToLoad = req.files.image.path;
    }

    if (!imageToLoad) {
        return renderDefaultPage();
    }

    console.log(imageToLoad);
    async.waterfall([
        function(callback){
            fs.readFile(imageToLoad, callback);
        },
        function(imageData, callback) {
            cv.loadImage(imageToLoad, function(error, imview) { callback(error, imageData, imview); });
        },
        function(imageData, imview, callback) {
            imview.thumbnail(128, 128, function(error, thumbnail) { callback(error, imageData, imview, thumbnail); });
        },   
        function(imageData, imview, thumbnail, callback) {
            thumbnail.asJpegDataUri(function(error, thumbUri) { callback(error, imageData, imview, thumbUri); });
        },
        function(imageData, imview, thumbnail, callback) {
            work(imageData, function(error, workResult) { callback(error, { sourceImage:thumbnail, result:workResult }); });
        }     
        ], function (err, result) {
        if (err) {
            console.error(err);
            return renderDefaultPage();
        }
        else {
            console.log(result);
            return renderResultView(result);
        }
    });
}

exports.analysis = function(req, res)
{
    processRequest(req, res, 'demo-analysis', cv.analyzeImage);
};
