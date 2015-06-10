var async = require('async');
var request = require('request');

var q = async.queue(function(task, callback){
	request('http://www.haveeru.com.mv', function (err, res, body) {
			if(err) return callback(err);
			console.log(res.statusCode);
			q.push('next task');
			callback(null);
	});
}, 20);

q.push(['next task');