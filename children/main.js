require('v8-profiler');
var client = require('socket.io-client');
var io = client.connect('http://localhost:3000');
var exec = require('child_process').exec;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var queue = [];
var count = 0;
var lock = false;
var workers = 8;

var redis = require('redis');
var client = redis.createClient();


	count -= 1;
	
	if(queue.length === 0){
		console.log('empty queue detected');
		if(lock === true){
			return;
		}
		lock = true;
		eventEmitter.emit('empty');
		return;
	}
		
	if(count >= workers){
		return;
	}
	
	var next = queue.shift();
	count+=1;
	exec("node ./cp.js "+"'"+next+"'", cpCallback);
	//console.log(next);
}

function nextBatch(err,res){
	if(err){
		console.log('unexpected redis error occurred');
		return;
	}
	var cursor = res[0];
	var batch = res[1];
	
	if(batch.length > 0){
		batch.forEach(function(url){
			client.get(url,function(err,res){
				if(err){
					console.log('unexpected redis error occurred');
					return;
				}
				if(res === 'done'){
					//console.log('processed url ignored');
					client.del(url);
					return;
				}
				//console.log('new url added to queue');
				queue.push(url);
			});
		});
	}
	
	if(cursor == 0){
		setTimeout(function() {
			lock = false;
			console.log('new batch has been fetched');
			//do stuff and return
			if(queue.length === 0){
				return;
			}
			for(i=0; i < workers; i++){
				if(count >= workers){
					return;
				}
				var next = queue.shift();
				count += 1;
				exec("node ./cp.js "+"'"+next+"'", cpCallback);
				//console.log(next);
			}
		}, 10000);
		return;
	}
	client.scan(cursor,nextBatch);
}

eventEmitter.on('empty',function(){
	console.log('fetching new batch from redis')
	client.scan(0,nextBatch);
});

for(i=0; i < workers; i++){
	count += 1;

	//console.log(seed);
}