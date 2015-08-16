var express = require('express');
var router = express.Router();
var Doc = require('../models/doc.js');

router.get('/', function(req, response, next) {

	Doc.find({}, {_id:1, url:1, r_title:1, hash:1}).sort({$natural:-1}).limit(10).exec(function(err, res){
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
			item.title = record.r_title;
			item.url = record.url;
			item.hash = record.hash;
			item.timestamp = Date.parse(record._id.getTimestamp());
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