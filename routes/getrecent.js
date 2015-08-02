var express = require('express');
var router = express.Router();
var Doc = require('../models/doc.js');

router.get('/', function(req, response, next) {

	Doc.find({}, {hash:1, _id:1}).sort({$natural:-1}).limit(5).exec(function(err, res){
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