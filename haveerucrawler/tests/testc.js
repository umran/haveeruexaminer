var redis = require('redis');
var client = redis.createClient(); 

var output = process.argv[2];

client.set(output, 'done', function(err,res){
	if(err){
		process.stdout.write(err);
		return;
	}
	process.stdout.write(res);
});
client.quit();