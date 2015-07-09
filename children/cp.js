var read = require('request');
var cheerio = require('cheerio');
var client = require('socket.io-client');
var io = client.connect('http://localhost:3000');
var crypto = require('crypto');
var mongoose = require('mongoose');
var document = require('../models/doc');

var prefix = 'http://haveeru.com.mv';
var checkstring = new RegExp('(https?:\/\/haveeru\.com\.mv|https?:\/\/www\.haveeru\.com\.mv)'); 

var jobUrl = process.argv[2];
//var jobId = process.argv[3];

newUrls = [];

read(jobUrl, function(error, response, body){
	if(error){
		io.emit('test', error);
		io.close();
		return;
	}
	if(response.statusCode !== 200){
		io.emit('test', 'server returned !200 for resource: '+jobUrl);
		io.close();
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
		
		newUrls.push(link);
	});
	
	//document processing
	if($('.post-frame').length === 0){
		io.emit('test', 'not an article, so skipping: '+jobUrl);
		io.close();
		return;
	}
	var until;
	if($('.post-frame').find($('.related-articles')).length === 0){
		if($('.post-frame').find($('.service-holder')).length === 0){
			if($('.post-frame').find($('.comments')).length === 0){
				io.emit('test', 'could not determine if article for: '+jobUrl);
				io.close();
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
	var doc = {};
	doc.url = jobUrl;
	doc.title = $('h1', '.post').text();
	doc.byline = $('.subttl', '.post').text();
	doc.date = $('.date', '.post').text();
	doc.intro = $('.intro','.post-frame').html();
	doc.main = $('.intro','.post-frame').nextUntil(until).html();
	//calculate document hash
	doc.hash = crypto.createHash('sha256').update(doc.url.concat(doc.title,doc.byline,doc.date,doc.intro,doc.main)).digest('hex');
	
	io.emit('test', jobUrl+' was computed as '+doc.hash);
	io.close();
	
	//database operations tracking
	var operations = newUrls.length + 1;
	var processed = 0;
	
	//connect to mongodb
	mongoose.connect('mongodb://localhost/haveeruexaminer');
	
	//add new entry in mongodb
	newDoc = new document({url:doc.url, r_title:doc.title, r_byline:doc.byline, r_date:doc.date, r_intro:doc.intro, r_main:doc.main, hash:doc.hash});
	newDoc.save(function (err) {
  	processed += 1;
  	if (err){
  		console.log(err);
  		return;
  	}
  	console.log('document saved');
	});
		
	//for each newUrl check if exists in mongodb and send to redis accordingly
	newUrls.forEach(function(url){
		document.count({url:url},function(err,count){
			processed += 1;
			if(processed >= operations){
				mongoose.disconnect();
				//console.log('disconnect signal sent');
			}
			if(count > 0){
				console.log(url+' has been indexed already, so skipping');
				return;
			}
			console.log(url+' will be queued in redis');
			//send new urls to redis along with a unique identifier
			
		});
	});
	
});