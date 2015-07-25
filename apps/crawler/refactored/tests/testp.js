var conveyor = require('./conveyor.js');
var belt = new conveyor('./testc.js', 2);

belt.process(['hello','amiga','fuck off','noordhuis','kellerkind','alien'], function(err, res){
	if(err){
		console.log(err);
	}
	//console.log(res);
});

belt.queue.drain = function(){
	belt.process(['hello','amiga','fuck off','noordhuis','kellerkind','alien'], function(err, res){
		if(err){
			console.log(err);
		}
		//console.log(res);
	});
}