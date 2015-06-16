var Crawler = require("crawler");
var prefix = 'http://haveeru.com.mv';
var checkstring = new RegExp('(https?:\/\/haveeru\.com\.mv|https?:\/\/www\.haveeru\.com\.mv)');

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page 
    callback : function (error, result, $) {
        // $ is Cheerio by default 
        //a lean implementation of core jQuery designed specifically for the server
        
        if(!$){
        	return;
        }
         
        $('a').each(function(index, a) {
        
        		if(!$(a).attr('href')){
							return;
						}
						//filter and format link
						if ($(a).attr('href').charAt(0) !== '/' && checkstring.test($(a).attr('href')) === false){
							return;
						}
				
						var toQueueUrl = $(a).attr('href');
						
						if (toQueueUrl.charAt(0) === '/'){
							toQueueUrl = prefix.concat(toQueueUrl);
						}
        
            c.queue(toQueueUrl);
            console.log(toQueueUrl);
        });
    }
});
 
// Queue just one URL, with default callback 
c.queue('http://www.haveeru.com.mv');