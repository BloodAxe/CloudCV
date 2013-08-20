
/*
 * GET home page.
 */

var cv = require('cv');

exports.index = function(req, res)
{
  res.render('index', 
  	{ title: 'Express', 
  	  opencv_info: cv.buildInformation() 
  	});
};