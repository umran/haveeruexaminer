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
	
	doc = new class
		
	if(doc.error){
		io.emit('test', doc.error);
		doc = null;
		return callback();
	}
	
	if(doc.response !== 200){
		io.emit('test', 'server returned !200 response');
		doc = null;
		return callback();
	}
	
	var $ = cheerio.load(doc.body);
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
		q.push({url:'http://www.haveeru.com.mv/news/60869'});
	});
	
	//document processing
	if($('.post-frame').length === 0){
		io.emit('test', 'not an article, so skipping: '+url);
		//release memory
		$ = null;
		doc = null;
		return callback();
	}
	var until;
	if($('.post-frame').find($('.related-articles')).length === 0){
		if($('.post-frame').find($('.service-holder')).length === 0){
			if($('.post-frame').find($('.comments')).length === 0){
				io.emit('test', 'could not determine if article for: '+url);
				//release memory
				$ = null;
				doc = null;
				return callback();
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
	var document = {};
	document.url = url;
	document.title = $('h1', '.post').text();
	document.byline = $('.subttl', '.post').text();
	document.date = $('.date', '.post').text();
	document.intro = $('.intro','.post-frame').html();
	document.main = $('.intro','.post-frame').nextUntil(until).html();
	//calculate document hash
	document.hash = crypto.createHash('sha256').update(doc.url.concat(doc.title,doc.byline,doc.date,doc.intro,doc.main)).digest('hex');
	io.emit('test', url+' was computed as '+doc.hash);
	
	//release memory
	document = null;
	$ = null;
	doc = null;
	
	callback();
}, 20);
var seed = 'http://www.haveeru.com.mv/news/60869';
q.push({url:seed});