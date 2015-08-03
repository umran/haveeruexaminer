var express = require('express');
var router = express.Router();
var Doc = require('../models/doc.js');
var Utilities = require('../dependencies/utilities.js');
var utilities = new Utilities();

router.get('/', function(req, response, next) {

	Doc.find({}, {url:1, hash:1, r_title:1, r_intro:1, r_main:1, _id:1}).sort({$natural:-1}).limit(5).exec(function(err, res){
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
			item.hash = record.hash;
			item.timestamp = Date.parse(record._id.getTimestamp());
			item.url = record.url;
			item.title = record.r_title;
			item.intro = record.r_intro;
			item.main = utilities.cutTrailing(utilities.strip_tags(utilities.decode(record.r_main), '<br>'));
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