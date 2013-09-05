/*
 * GET home page.
 */

exports.index = function(req, res)
{
  res.render('index', 
  	{ title: 'Express', 
  	  opencv_info: ""//cv.buildInformation()
  	});
};