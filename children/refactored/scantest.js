var scanner = require('./scanner.js');
var scan = new scanner();

scan.fetch(function(err, res){
	if(err){
	console.log(err);
	}
	console.log(res);
});

scan.fetch(function(err, res){
	if(err){
	console.log(err);
	}
	console.log(res);
});