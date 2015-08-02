var express = require('express');
var router = express.Router();
var Doc = require('../models/doc.js');

router.get('/', function(req, response, next) {

	Doc.find({}, {hash:1, _id.getTimestamp():1}).sort({$natural:-1}).limit(5).exec(function(err, res){
		if(err){
			response.setHeader('Content-Type', 'application/json');
			response.send(JSON.stringify({
				code: 0,
				response: err
			}));
			return;
		}
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify({
			code: 1,
			response: res
		}));
	});
});

module.exports = router;