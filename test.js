var redis = require('redis');
var client = redis.createClient();

var done = 0;
var inq = 0;
var total;
var progress;

function nextBatch(err,res){
	if(err){
		console.log('unexpected redis error occurred');
		return;
	}
	cursor = res[0];
	batch = res[1];
	
	if(batch.length > 0){
		batch.forEach(function(url){
			client.get(url,function(err,res){
				if(err){
					console.log('unexpected redis error occurred');
					return;
				}
				if(res === 'done'){
					done += 1;
					return;
				}
				//console.log('new url added to queue');
				inq += 1;
			});
		});
	}
	
	if(cursor == 0){
		console.log('database scan complete');
		total = done+inq;
		progress = (done/total)*100;
		
		console.log(done+' out of '+total+' urls were checked');
		console.log(progress+'% done');
		client.quit();
		return;
	}
	client.scan(cursor,nextBatch);
}
client.scan(0,nextBatch);