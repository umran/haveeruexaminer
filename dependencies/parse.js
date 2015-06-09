var read = require('request');
var cheerio = require('cheerio');
var async = require('async');
var client = require('socket.io-client');
var socket = client.connect('http://localhost:3000');
var crypto = require('crypto');

//debugging code
//var count = 0;

var url = 'http://www.haveeru.com.mv/news/60834'

read(url, function(error, response, body){
	if(error){
		console.log(error);
	}
	if(response.statusCode === 200){
		$ = cheerio.load(body, {decodeEntities: false});
		var article = $('.post-frame');
		if(article.length === 0){
			console.log('not an article');
			return;
		}
		if(article.find($('.related-articles')).length = 0){
			if(article.find($('.service-holder')).length = 0){
				if(article.find($('.comments')).length = 0){
					return;
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
		
		console.log(document);
		console.log(hash);
	}
});