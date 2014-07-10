/*
 * Back-end logic
 */

var fs   = require('fs');
var util = require('util');
var cv   = require('cloudcv');

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

function processRequest(req, res, view, work) 
{
    var imgs = new exampleImages();
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

    if (img && imgs.isInputImageValid(img))
    {
        var exampleImage = imgs[img];
        
        fs.readFile(exampleImage.source, function(err, data) {

            if (err) 
            {
                renderDefaultPage();
                return;
            }

            work(data, function(result) {
                if (result && !error) {
                    result.source = exampleImage.sourceURL;
                    renderResultView(result);                          
                }
                else {
                    renderDefaultPage();
                }
            });

        });        
    }
    else if (req.files && req.files.image)
    {
        var uploadedImg = req.files.image;
        
        fs.readFile(uploadedImg.path, function(err, data) {
            
            if (err) 
            {
                renderDefaultPage();
                return;
            }

            work(data, function(error, result) {
                if (result) {
                    result.source = '';
                    renderResultView(result);      
                }
                else {
                    renderDefaultPage();                    
                }
            });
        });  
    }
    else
    {
        renderDefaultPage();      
    }
}

exports.calibration = function(req, res)
{
    res.render('demo-calibration');
};

exports.analysis = function(req, res)
{
    processRequest(req, res, 'demo-analysis', function(data, cb) {
        cv.analyze(data, function(result) {
            cb(result);
        });
    });
};
