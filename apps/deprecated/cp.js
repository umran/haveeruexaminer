var read = require('request');
var cheerio = require('cheerio');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var client = require('socket.io-client');
var io = client.connect('http://localhost:3080');
var crypto = require('crypto');
var mongoose = require('mongoose');
var document = require('../models/doc');
var record = require('../models/url');
var redis = require('redis');

var redis = require("redis");
var client = redis.createClient();

var prefix = 'http://haveeru.com.mv';
var checkstring = new RegExp('(https?:\/\/haveeru\.com\.mv|https?:\/\/www\.haveeru\.com\.mv)');

var jobUrl = process.argv[2];

//db query tracking variables
var operations = 0;
var processed = 0;

//connect to mongodb
mongoose.connect('mongodb://localhost/haveeruexaminer');

var newUrls = [];

read(jobUrl, function(error, response, body){
	if(error){
		io.emit('test', error);
		io.close();
		mongoose.disconnect();
		client.quit();
		return;
	}
	if(response.statusCode !== 200){
		io.emit('test', 'server returned !200 for resource '+jobUrl);
		io.close();
		mongoose.disconnect();
		client.quit();
		return;
	}
	
	var $ = cheerio.load(body, {normalizeWhitespace: true, xmlMode: true});
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
	
	io.emit('test', 'current: '+jobUrl);
	
	//beyond this point, url must be marked as seen by the crawler
	
	//just making sure we're keeping an eye on all the asynchronous db calls
	operations += newUrls.length + 2;
	
	newRec = new record({url:jobUrl});
	newRec.save(function (err) {
		eventEmitter.emit('go');
  	if (err){
  		if(err.code !== 11000){
  			io.emit('test', 'unexpected database error occurred');
  			processed+=1;
				if(processed >= operations){
					//io.emit('test', 'disconnect signal sent to db');
					mongoose.disconnect();
					client.disconnect();
					io.close();
				}
  			return;
  		}
  		if(jobUrl == 'http://www.haveeru.com.mv/' || jobUrl == 'http://www.haveeru.com.mv/dhivehi/'){
  			io.emit('test', 'seeding...');
  			processed+=1;
				if(processed >= operations){
					//io.emit('test', 'disconnect signal sent to db');
					mongoose.disconnect();
					client.disconnect();
					io.close();
				}
  			return;
  		}
  		client.set(jobUrl,'done',function(){
  			io.emit('test','state of current url, which is a duplicate set as done in redis');
  			processed+=1;
				if(processed >= operations){
					//io.emit('test', 'disconnect signal sent to db');
					mongoose.disconnect();
					client.disconnect();
					io.close();
				}
  		});
  		//io.emit('test', 'duplicate url was ignored by mongodb');
  		if(processed >= operations){
				//io.emit('test', 'disconnect signal sent to db');
				mongoose.disconnect();
				client.disconnect();
				io.close();
			}
  		return;
  	}
  	io.emit('test', 'state of current url, which is new set as done in redis');
  	client.set(jobUrl,'done',function(){
  		processed+=1;
			if(processed >= operations){
				//io.emit('test', 'disconnect signal sent to db');
				mongoose.disconnect();
				client.disconnect();
				io.close();
			}
  	});
  	if(processed >= operations){
  		//io.emit('test', 'disconnect signal sent to db');
			mongoose.disconnect();
			client.disconnect();
			io.close();
		}
	});
	
	eventEmitter.once('go',function(){
	
		//debugging
		//console.log('go event fired');
	
		var subProcessed = 0;
	
		//for each newUrl check if exists in url collection and send to redis accordingly
		
		if(newUrls.length === 0){
		
			//debugging
			//console.log('okay trace: fired from line 107');
		
			eventEmitter.emit('okay');
			return;
		}
		
		newUrls.forEach(function(url){
			record.count({url:url},function(err,count){
				//subProcessed +=1;
				
				if(err){
					io.emit('test', 'unexpected database error occurred');
					
					subProcessed +=1;
					processed += 1;
					if(processed >= operations){
						//io.emit('test', 'disconnect signal sent to db');
						mongoose.disconnect();
						client.quit();
						io.close();
					}
					
					//give go ahead to terminate db connection if necessary
					if(subProcessed >= newUrls.length){
					
						//debugging
						//console.log('okay trace: fired from line 132');
					
						eventEmitter.emit('okay');
					}
					
					return;
				}
				
				if(count > 0){
					//io.emit('test', url+' has been processed already, not queued');
					
					subProcessed +=1;
					processed += 1;
					if(processed >= operations){
						//io.emit('test', 'disconnect signal sent to db');
						mongoose.disconnect();
						client.quit();
						io.close();
					}
					
					//give goahead to terminate db connection if necessary
					if(subProcessed >= newUrls.length){
					
						//debugging
						//console.log('okay trace: fired from position 154');
					
						eventEmitter.emit('okay');
					}
					
					return;
				}
				
				//send new urls to redis
				
				client.exists(url,function(err,res){
					if(err){

						io.emit('test', 'unexpected redis error occurred');
					
						//
						subProcessed +=1;
						processed += 1;
						if(processed >= operations){
							//io.emit('test', 'disconnect signal sent to db');
							mongoose.disconnect();
							client.quit();
							io.close();
						}
				
						//give go ahead to terminate db connection if necessary
						if(subProcessed >= newUrls.length){
				
							//debugging
							//console.log('okay trace: fired from position 187');
				
							eventEmitter.emit('okay');
						}
						//
						return;

					}
					if(res === 1){
						//io.emit('test', 'redis overwrite avoided');
						
						//
						subProcessed +=1;
						processed += 1;
						if(processed >= operations){
							//io.emit('test', 'disconnect signal sent to db');
							mongoose.disconnect();
							client.quit();
							io.close();
						}
				
						//give go ahead to terminate db connection if necessary
						if(subProcessed >= newUrls.length){
				
							//debugging
							//console.log('okay trace: fired from position 187');
				
							eventEmitter.emit('okay');
						}
						//
						return;
						
					}
					client.set(url, 'inq',function(){
						//io.emit('test','new url was added to redis queue '+url);
						//
						subProcessed +=1;
						processed += 1;
						if(processed >= operations){
							//io.emit('test', 'disconnect signal sent to db');
							mongoose.disconnect();
							client.quit();
							io.close();
						}
				
						//give go ahead to terminate db connection if necessary
						if(subProcessed >= newUrls.length){
				
							//debugging
							//console.log('okay trace: fired from position 187');
				
							eventEmitter.emit('okay');
						}
						//
					});
				});
				
				//subProcessed +=1;
				//processed += 1;
				if(processed >= operations){
					//io.emit('test', 'disconnect signal sent to db');
					mongoose.disconnect();
					client.quit();
					io.close();
				}
				
				//give go ahead to terminate db connection if necessary
				if(subProcessed >= newUrls.length){
				
					//debugging
					//console.log('okay trace: fired from position 187');
				
					eventEmitter.emit('okay');
				}
			});
		});
	});
	
	//document processing
	if($('.post-frame').length === 0){
		//io.emit('test', 'not an article, so skipping');
		eventEmitter.once('okay',function(){
		
			//debugging
			//console.log('okay event fired');

			mongoose.disconnect();
			
			//debugging
			//io.emit('test','io close fired from line 305');
			
			io.close();
			client.quit();
		});
		return;
	}
	var until;
	if($('.post-frame').find($('.related-articles')).length === 0){
		if($('.post-frame').find($('.service-holder')).length === 0){
			if($('.post-frame').find($('.comments')).length === 0){
				//io.emit('test', 'could not determine if article, so skipping');
				eventEmitter.once('okay',function(){
					
					//debugging
					//console.log('okay event fired');
					
					mongoose.disconnect();
					
					//debugging
					//io.emit('test','io close fired from line 325');
					
					io.close();
					client.quit();
				});
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
	doc.intro = $('.intro','.post-frame').text();
	doc.main = $('.intro','.post-frame').nextUntil(until).html();
	//calculate document hash
	doc.hash = crypto.createHash('sha256').update(doc.url.concat(doc.title,doc.byline,doc.date,doc.intro,doc.main)).digest('hex');
	
	//add new entry in document collection
	newDoc = new document({url:doc.url, r_title:doc.title, r_byline:doc.byline, r_date:doc.date, r_intro:doc.intro, r_main:doc.main, hash:doc.hash});
	newDoc.save(function (err) {
  	processed += 1;
  	if(processed >= operations){
  		//io.emit('test', 'disconnect signal sent to db');
			mongoose.disconnect();
			client.quit();
			io.close();
		}
  	if (err){
  		if(err.code !== 11000){
  			io.emit('test', 'unexpected database error occurred');
  			return;
  		}
  		io.emit('test', 'a duplicate url was detected and ignored '+ doc.url);
  		return;
  	}
  	io.emit('test', doc.hash + ' saved in collection');
	});
});