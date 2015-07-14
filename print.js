var read = require('request');
var cheerio = require('cheerio');

read('http://haveeru.com.mv/news/39347',function(err,res,body){
	var $ = cheerio.load(body);
	var until;
	if($('.post-frame').find($('.related-articles')).length === 0){
		if($('.post-frame').find($('.service-holder')).length === 0){
			if($('.post-frame').find($('.comments')).length === 0){
				//io.emit('test', 'could not determine if article, so skipping');
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
	var main = $('.intro','.post-frame').nextUntil(until).html();
	console.log(main)
});