var read = require('request');
var cheerio = require('cheerio');
var async = require('async');

//debugging code
//var count = 0;

var q = async.queue(function(task,callback){
	var url = task.url;
	read(url, function(error, response, body){
		if(error){
			return callback(error);
		}
		if(response.statusCode == 200){
			$ = cheerio.load(body);
			var links = $('a');
			$(links).each(function(i, link){
				if($(link).attr('href')){
					var string = $(link).attr('href');
					var prefix = 'http://haveeru.com.mv';
					var checkstring = new RegExp('(https?:\/\/haveeru\.com\.mv|https?:\/\/www\.haveeru\.com\.mv)');
					if(string.charAt(0) === '/' || checkstring.test(string) === true){
						if (string.charAt(0) === '/'){
							var string = prefix.concat(string);
						}
						q.push({url:string}, function(err, res){
							if(err){
								return console.log(err);
							}
							console.log(res);
							
							//debugging code
							//count++;
							//console.log(count);
							
						});
					}
				}
			});
		}
		callback(null, response.statusCode);
	});
}, 20);

var url = 'http://www.haveeru.com.mv';
q.push({url:url}, function(err, res){
	if(err){
		return console.log(err);
	}
	console.log(res);
});