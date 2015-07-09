require('v8-profiler');
var client = require('socket.io-client');
var io = client.connect('http://localhost:3000');
var exec = require('child_process').exec;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var queue = [];
var count = 0;
var workers = 1;

var seed = 'http://haveeru.com.mv';

function cpCallback(err, stdout, stderr) {
	count -= 1;
	
	if(queue.length === 0){
		console.log('empty queue detected');
		eventEmitter.emit('empty');
		console.log(count+' workers currently working');
		return;
	}
		
	if(count >= workers){
		return;
	}
	
	exec('node ./cp.js '+ queue.shift(), cpCallback);
	count+=1;
	console.log(count+' workers currently working');
}

eventEmitter.on('empty',function(){
	//query redis for new urls
	
	//if no new urls, return
	
	//add new urls to queue
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	queue.push('http://haveeru.com.mv');
	
	//kickstart queue if workers underutilized
	
	if(count >= workers){
		return;
	}
	
	exec('node ./cp.js '+ queue.shift(), cpCallback);
	count+=1;
});

for(i=0; i < workers; i++){
	exec('node ./cp.js '+ seed, cpCallback);
	count += 1;
}
