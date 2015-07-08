var client = require('socket.io-client');
var io = client.connect('http://localhost:3000');
var exec = require('child_process').exec;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var queue = [];
var count = 0;
var max = 5;

var seed = 'http://www.haveeru.com.mv';

function cp_callback(err, stdout, stderr) {
	count -= 1;
	
	if(queue.length === 0){
		eventEmitter.emit('empty');
		return;
	}
		
	if(count >= max){
		return;
	}
	
	next = queue.shift();
	exec('node ./cp.js '+ next, cp_callback);
	count+=1;
}

eventEmitter.on('empty',function(){
	//query redis for new urls
	
	//if no new urls, return
	
	//add new urls to queue
	
	//kickstart processes
	next = queue.shift();
	exec('node ./cp.js '+ next, cp_callback);
	count+=1;
});

exec('node ./cp.js '+ seed, cp_callback);
count += 1;

