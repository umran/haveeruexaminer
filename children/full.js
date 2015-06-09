var read = require('request');
var cheerio = require('cheerio');
var async = require('async');
var client = require('socket.io-client');
var io = client.connect('http://localhost:3000');
var crypto = require('crypto');

var q = async.queue(function(task,callback){
	var url = task.url;
	read(url, function(error, response, body){
		if(error){
			return callback(error);
		}
		var resObject = {};
		if(response.statusCode === 200){
			$ = cheerio.load(body);
			var links = $('a');
			$(links).each(function(i, link){
				if($(link).attr('href')){
					var string = $(link).attr('href');
					var prefix = 'http://haveeru.com.mv';
					var checkstring = new RegExp('(https?:\/\/haveeru\.com\.mv|https?:\/\/www\.haveeru\.com\.mv)');
					if(string.charAt(0) === '/' || checkstring.test(string) === true){
						if (string.charAt(0) === '/'){
							string = prefix.concat(string);
						}
						q.push({url:string}, function(err, res){
							if(err){
								return io.emit('test', err);
							}
							if(res.statusCode === 200){
								return io.emit('test', res.hash);
							}
							io.emit('test', res.statusCode);
						});
					}
				}
			});
			var article = $('.post-frame');
			if(article.length === 0){
				return callback('Skipping, not an article');
			}
			if(article.find($('.related-articles')).length === 0){
				if(article.find($('.service-holder')).length === 0){
					if(article.find($('.comments')).length === 0){
						return callback('Unhandled Exception: not sure where to truncate article');
					}
					else{
						var until = '.comments';
					}
				}
				else{
					var until = '.service-holder';
				}
			}
			else{
				var until = '.related-articles';
			}
		
			var title = $('h1', '.post').text();
			var byline = $('.subttl', '.post').text();
			var date = $('.date', '.post').text();
		
			var intro = $('.intro','.post-frame').html();
			var main = $('.intro','.post-frame').nextUntil(until).html();
		
			var head = title.concat(byline);
			head = head.concat(date);
		
			var payload = intro.concat(main);
		
			var document = head.concat(payload);
		
			//calculate document hash
		
			var hash = crypto.createHash('sha256').update(document).digest('hex');
			
			resObject.url = url;
			resObject.title = title;
			resObject.document = document;
			resObject.hash = hash;
		}
		resObject.statusCode = response.statusCode;
		callback(null, resObject);
	});
}, 20);

var url = 'http://www.haveeru.com.mv';
q.push({url:url}, function(err, res){
	if(err){
		return io.emit('test', err);
	}
	if(res.statusCode === 200){
		return io.emit('test', res.hash);
	}
	io.emit('test', res.statusCode);
});