/*
 * Back-end logic
 */

var fs = require('fs');
var cv = require('./cloudcv.node');

function getExampleImages()
{
    return [ 'lena', 'mandrill', 'sudoku' ];
}

function isInputImageValid(img)
{
    return getExampleImages().indexOf(img) >= 0;
}

exports.sudoku = function(req, res)
{
    console.log(req);
    res.render('demo-sudoku');
};

exports.recognition = function(req, res)
{
    console.log(req);
    res.render('demo-recognition');
};

exports.analysis = function(req, res)
{
    var img = req.body.image;

    console.log(process.cwd());

    if (isInputImageValid(img))
    {
        console.log(img);
        fs.readFile('/Users/bloodaxe/Develop/cvtalks/CloudCV/public/images/' + img + ".png", function(err, data) {
            if (err) throw err;

            console.log("File readed");
            cv.analyze(data, function(result) {

                console.log("Image analyzed");
                console.log(result);

                result.source = '/images/' + img + '.png';
                res.render('demo-analysis', 
                    {
                        "result":   result, 
                    });        
            });
        });        
    }
    else
    {
        res.render('demo-analysis');        
    }
};