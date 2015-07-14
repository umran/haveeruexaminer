var redis = require('redis');
var client = redis.createClient();

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
				if(res === 'inq'){
					return;
				}
				client.del(url);
			});
		});
	}
	
	if(cursor == 0){
		console.log('database scan complete');
		setTimeout(function() {
			client.quit();
		}, 10000);
		return;
	}
	client.scan(cursor,nextBatch);
}
client.scan(0,nextBatch);