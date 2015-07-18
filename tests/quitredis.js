var redis = require("redis"),
    client = redis.createClient();

client.del('masterg',function(err,res){
	if(err){
		console.log('an unexpected error occurred');
		return;
	}
	console.log(res);
});