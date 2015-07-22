var async = require('async');
var exec = require('child_process').exec;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var queue = [];
var calls;
var count = 0;
var lock = false;
var workers = 8;

var redis = require('redis');
var client = redis.createClient();

var seeds = ['http://www.haveeru.com.mv/','http://www.haveeru.com.mv/dhivehi/'];

function cpCallback(err, stdout, stderr){
	count -= 1;
	
	if(queue.length === 0){
		console.log('empty queue detected');
		if(lock === true || count>0){
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
}

function nextBatch(err,res){
	if(err){
		console.log('unexpected redis error occurred');
		return;
	}
	var cursor = res[0];
	var batch = res[1];
	
	if(batch.length > 0){
		//put redis operations in a parallel queue
		batch.forEach(function(url){
			calls.push(function(callback){
				client.get(url, function(err,res){
					if(err){
						callback(null, 'unexpected redis error occurred');
						return;
					}
					if(res === 'done'){
						client.del(url, function(err,res){
							if(err){
								callback(null, 'unexpected redis error occurred');
								return;
							}
							callback(null, 'done url ignored');
							return;						
						});
						return;
					}
					queue.push(url);
					callback(null, 'new url added to queue');
				});
			});
		});
	}
	
	if(cursor == 0){
		//execute redis operations and do stuff when all operations have called back
		async.parallel(calls, function(err, result) {
    	if(err){
    		console.log('an unexpected error occurred in processing the new batch, quitting...');
    		client.quit();
    		return;
    	}
    	lock = false;
			console.log('new batch has been fetched');
			if(queue.length === 0){
				console.log('seems like there are no more jobs available, quitting with a delay of 5 minutes');
				setTimeout(function(){
					client.quit();
				}, 10000);
				return;
			}
			for(i=0; i < workers; i++){
				if(count >= workers){
					return;
				}
				var next = queue.shift();
				count += 1;
				exec("node ./cp.js "+"'"+next+"'", cpCallback);
			}
		});
		return;
	}
	client.scan(cursor,nextBatch);
}

eventEmitter.on('empty',function(){
	calls = [];
	console.log('fetching new batch from redis');
	client.scan(0,nextBatch);
});

for(i=0; i < workers; i++){
	var alternator = i%2;
	count += 1;
	exec("node ./cp.js "+"'"+seeds[alternator]+"'", cpCallback);
}