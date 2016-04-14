var express = require('express');
var router = express.Router();
var Doc = require('../models/doc.js');
var Utilities = require('../dependencies/utilities.js');
var utilities = new Utilities();
var maxLength = 150;

router.get('/', function(req, response, next) {

	Doc.find({}, {url:1, hash:1, r_title:1, r_intro:1, r_main:1, date:1, _id:1}).sort({date:-1}).limit(15).exec(function(err, res){
		if(err){
			response.setHeader('Content-Type', 'application/json');
			response.send(JSON.stringify({
				code: 0,
				response: err
			}));
			return;
		}
		
		//parse response
		var pretty = [];
		res.forEach(function(record){
			var item = {};
			item.id = record._id;
			item.date = Date.parse(record.date);
			item.hash = record.hash;
			item.timestamp = Date.parse(record._id.getTimestamp());
			item.url = record.url;
			item.title = record.r_title;
			item.intro = record.r_intro;
			
			//sanitize html entities
			var rString = utilities.cutTrailing(utilities.strip_tags(utilities.decode(record.r_main), '<br>'));
			
			//trim string
			var trimmedString = rString.substr(0, maxLength);
			
			//re-trim if we are in the middle of a word
			trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
			
			//set main as trimmed string
			item.main = trimmedString;
			
			//determine language
			item.lang = utilities.getLang(record.r_title);
			
			pretty.push(item);
		});
		
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify({
			code: 1,
			response: pretty
		}));
	});
});

module.exports = router;