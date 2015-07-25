var scanner = require('../modules/scanner.js');
var scan = new scanner();

scan.fetch(function(err, res){
	if(err){
	console.log(err);
	return;
	}
	if(res.length > 0){
		console.log(res);
		return;
	}
	console.log('no new jobs');
});