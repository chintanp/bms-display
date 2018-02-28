/*
 * GET home page.
 */

//get correct directory path
var filePath = __dirname.replace('routes', 'views/')

exports.index = function(req, res) {
	res.sendFile(filePath + 'index.html');
};
