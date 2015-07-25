var conveyor = require('../modules/conveyor.js');
var belt = new conveyor('./testc.js', 2);
var scanner = require('../modules/scanner.js');
var scan = new scanner();

belt.process(['hello','amiga','fpls','noordhuis','kellerkind','alien'], function(err, res){
	if(err){
		console.log(err);
	}
});

belt.queue.drain = function(){
	scan.fetch(function(err, res){
		if(err){
		console.log(err);
		}
		belt.process(res, function(err, res){
			if(err){
				console.log(err);
			}
		});
	});
}