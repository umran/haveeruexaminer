require('v8-profiler');
var read = require('request');
var cheerio = require('cheerio');
var async = require('async');
var client = require('socket.io-client');
var io = client.connect('http://localhost:3000');
var crypto = require('crypto');
var prefix = 'http://haveeru.com.mv';
var checkstring = new RegExp('(https?:\/\/haveeru\.com\.mv|https?:\/\/www\.haveeru\.com\.mv)');
var urls = [];

var q = async.queue(function(task,callback){
	var url = task.url;
	if(urls.indexOf(url) > -1){
		return callback();
	}
	read(url, function(error, response, body){
		if(error){
			callback(error);
			return;
		}
		var resObject = {};
		resObject.url = url;
		resObject.statusCode = response.statusCode;
		if(response.statusCode !== 200){ 
			callback(null, resObject);
			return;
		}
		var $ = cheerio.load(body);
		$($('a')).each(function(i, link){
			if(!$(link).attr('href')){
				return;
			}
			//filter and format link
			if ($(link).attr('href').charAt(0) !== '/' && checkstring.test($(link).attr('href')) === false){
				return;
			}
			link = $(link).attr('href');
			if (link.charAt(0) === '/'){
				link = prefix.concat(link);
			}
			if(urls.indexOf(link) > -1){
				io.emit('test', '	duplicate prevented from joining queue');
				return;
			}
			q.push({url:link}, function(err, res){
				if(err){
					return io.emit('test', err);
				}
				if(!res){
					return io.emit('test', 'caught duplicate duly dropped from queue');
				}
				if(res.statusCode !== 200){
					io.emit('test', 'server returned !200 for resource: '+res.url);
					return;
				}
				urls.push(res.url);
				if(res.exception === true){
					io.emit('test', 'could not determine if article for: '+res.url);
					return;
				}
				if(!res.hash){
					io.emit('test', 'not an article, so skipping: '+res.url);
					return;
				}
				io.emit('test', res.url+' was computed as '+res.hash);
			});
		});
		//document processing
		if($('.post-frame').length === 0){
			urls.push(url);
			callback(null, resObject);
			return;
		}
		var until;
		if($('.post-frame').find($('.related-articles')).length === 0){
			if($('.post-frame').find($('.service-holder')).length === 0){
				if($('.post-frame').find($('.comments')).length === 0){
					resObject.exception = true;
					callback(null, resObject);
					return;
				}
				else{
					until = '.comments';
				}
			}
			else{
				until = '.service-holder';
			}
		}
		else{
			until = '.related-articles';
		}
		resObject.title = $('h1', '.post').text();
		resObject.byline = $('.subttl', '.post').text();
		resObject.date = $('.date', '.post').text();
		resObject.intro = $('.intro','.post-frame').html();
		resObject.main = $('.intro','.post-frame').nextUntil(until).html();
		//calculate document hash
		resObject.hash = crypto.createHash('sha256').update(resObject.url.concat(resObject.title,resObject.byline,resObject.date,resObject.intro,resObject.main)).digest('hex');
		resObject.statusCode = response.statusCode;
		callback(null, resObject);
	});
}, 20);
var seed = 'http://www.haveeru.com.mv';
q.push({url:seed}, function(err, res){
	if(err){
		return io.emit('test', err);
	}
	if(!res){
		return io.emit('test', 'caught duplicate duly dropped from queue');
	}
	if(res.statusCode !== 200){
		io.emit('test', 'server returned !200 for resource: '+res.url);
		return;
	}
	urls.push(res.url);
	if(res.exception === true){
		io.emit('test', 'could not determine if article for: '+res.url);
		return;
	}
	if(!res.hash){
		io.emit('test', 'not an article, so skipping: '+res.url);
		return;
	}
	io.emit('test', res.url+' was computed as '+res.hash);
});