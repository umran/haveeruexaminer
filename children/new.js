require('v8-profiler');
var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async')
  , urls = []
  , prefix = 'http://haveeru.com.mv'
  , checkstring = new RegExp('(https?:\/\/haveeru\.com\.mv|https?:\/\/www\.haveeru\.com\.mv)');
 
var queue = async.queue(function(url, next) {
	if(if(urls.indexOf(string) > -1)){
		return next();
	}
	request(url, function(error, response, body){
    if (err){
    	return next(error);
    }
    if(response.statusCode !== 200){ 
    	return next(null);
 		}
    urls.push(url);
    
    var $ = cheerio.load(body);
    
    $($('a')).each(function(i, link){
    	if(!$(link).attr('href')) return;
    	
    	//filter and format link
    	if ($(link).attr('href').charAt(0) !== '/' && checkstring.test($(link).attr('href')) === false) return;
    	link = $(link).attr('href');
    	if (link.charAt(0) === '/') link = prefix.concat(link);
    	
    	if(urls.indexOf(string) > -1) return;
    	
    	queue.push(lnk, function(err){
    		if(err) return console.log(err);
    		console.log('success');
    	});
    	
    });
 		
  	next();
  });
}, 2);
 
queue.push('http://www.haveeru.com.mv');