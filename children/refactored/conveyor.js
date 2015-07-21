var async = require('async');
var exec = require('child_process').exec;

module.exports = function(cpPath, concurrency) {
	var cpPath = cpPath;
	if (typeof concurrency === 'undefined'){
		this.concurrency = 1;
	}
	var concurrency = concurrency;
	
	this.queue = async.queue(function (url, callback) {
    var params = "node " + cpPath + " '" + url + "'";
		exec(params, function(err, stdout, stderr){
			
			if(err){
				callback(err);
				return;
			}
			callback(null, stdout);
		});
	}, concurrency);
	
	this.process = function(url, callback){
		this.queue.push(url, function(err, res){
			if(err){
				callback(err);
				return;
			}
			callback(null, res);
		});
	}
}