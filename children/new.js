require('v8-profiler');
var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async')
  , seen = {}
  , prefix = 'http://haveeru.com.mv'
  , checkstring = new RegExp('(https?:\/\/haveeru\.com\.mv|https?:\/\/www\.haveeru\.com\.mv)');
 
var queue = async.queue(function(url, next) {
	if(seen[url]) return next(); 
  request(url, function(err, response, body){
    if (err){
    	return next(err);
    }
    if(response.statusCode !== 200){ 
    	return next(null);
 		}
    seen[url] = true;
    console.log(url);
    var $ = cheerio.load(body);
    
    $($('a')).each(function(i, link){
    	if(!$(link).attr('href')) return;
    	
    	//filter and format link
    	if ($(link).attr('href').charAt(0) !== '/' && checkstring.test($(link).attr('href')) === false) return;
    	var lnk = $(link).attr('href');
    	if (lnk.charAt(0) === '/') lnk = prefix.concat(lnk);
    	
    	if(seen[lnk]) return;
    
    	queue.push(lnk);
    	
    });
 
    next();
  });
}, 2);
 
queue.push('http://www.haveeru.com.mv');